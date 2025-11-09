"use client"

import { useState, useEffect, useRef } from "react"
import { NotificationItem } from "./notification-item"
import { NotificationBadge } from "./notification-badge"

export function NotificationDropdown() {
	const [isOpen, setIsOpen] = useState(false)
	const [notifications, setNotifications] = useState<Array<any>>([])
	const [unreadCount, setUnreadCount] = useState(0)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await fetch("/api/notifications")
				const data = await response.json()
				setNotifications(data.notifications || [])
				setUnreadCount(
					data.notifications?.filter((n: any) => !n.isRead).length || 0,
				)
			} catch (error) {
				console.error("Error fetching notifications:", error)
			}
		}

		fetchNotifications()
		const interval = setInterval(fetchNotifications, 30000)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside)
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isOpen])

	const handleMarkAllAsRead = async () => {
		try {
			await fetch("/api/notifications", { method: "POST" })
			setNotifications(
				notifications.map((n) => ({ ...n, isRead: true })),
			)
			setUnreadCount(0)
		} catch (error) {
			console.error("Error marking notifications as read:", error)
		}
	}

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="relative flex flex-col items-center text-gray-600 hover:text-gray-900"
			>
				<svg
					className="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					/>
				</svg>
				<span className="text-xs">Notifications</span>
				<NotificationBadge count={unreadCount} />
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-96 rounded-lg border border-gray-200 bg-white shadow-lg">
					<div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
						<h3 className="font-semibold text-gray-900">Notifications</h3>
						{unreadCount > 0 && (
							<button
								type="button"
								onClick={handleMarkAllAsRead}
								className="text-sm text-[#0A66C2] hover:underline"
							>
								Mark all as read
							</button>
						)}
					</div>
					<div className="max-h-96 overflow-y-auto">
						{notifications.length > 0 ? (
							notifications.map((notification) => (
								<NotificationItem
									key={notification.id}
									notification={notification}
									onRead={() => {
										setNotifications(
											notifications.map((n) =>
												n.id === notification.id ? { ...n, isRead: true } : n
											),
										)
										setUnreadCount(Math.max(0, unreadCount - 1))
									}}
								/>
							))
						) : (
							<div className="px-4 py-8 text-center text-sm text-gray-500">
								No notifications yet
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

