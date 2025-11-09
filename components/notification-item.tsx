"use client"

import Image from "next/image"
import Link from "next/link"

interface NotificationItemProps {
	notification: {
		id: string
		type: string
		entityId: string | null
		entityType: string | null
		isRead: boolean
		createdAt: Date
		actorName: string | null
		actorEmail: string | null
		actorImage: string | null
	}
	onRead: () => void
}

export function NotificationItem({
	notification,
	onRead,
}: NotificationItemProps) {
	const handleClick = async () => {
		if (!notification.isRead) {
			try {
				await fetch(`/api/notifications/${notification.id}/read`, {
					method: "POST",
				})
				onRead()
			} catch (error) {
				console.error("Error marking notification as read:", error)
			}
		}
	}

	const getNotificationMessage = () => {
		switch (notification.type) {
			case "connection_request":
				return "sent you a connection request"
			case "connection_accepted":
				return "accepted your connection request"
			case "post_like":
				return "liked your post"
			case "post_comment":
				return "commented on your post"
			case "comment_like":
				return "liked your comment"
			default:
				return "interacted with you"
		}
	}

	const getNotificationLink = () => {
		switch (notification.type) {
			case "connection_request":
			case "connection_accepted":
				return "/network"
			case "post_like":
			case "post_comment":
				return `/feed?post=${notification.entityId}`
			default:
				return "/feed"
		}
	}

	const formatTime = (date: Date) => {
		const now = new Date()
		const diffInSeconds = Math.floor(
			(now.getTime() - new Date(date).getTime()) / 1000,
		)

		if (diffInSeconds < 60) return "Just now"
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
		if (diffInSeconds < 604800)
			return `${Math.floor(diffInSeconds / 86400)}d ago`
		return `${Math.floor(diffInSeconds / 604800)}w ago`
	}

	return (
		<Link
			href={getNotificationLink()}
			onClick={handleClick}
			className={`flex items-start gap-3 border-b border-gray-100 px-4 py-3 hover:bg-gray-50 ${
				!notification.isRead ? "bg-blue-50" : ""
			}`}
		>
			{notification.actorImage ? (
				<Image
					src={notification.actorImage}
					alt={notification.actorName || "User"}
					width={40}
					height={40}
					className="h-10 w-10 rounded-full"
					unoptimized
				/>
			) : (
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-700">
					{notification.actorName?.charAt(0).toUpperCase()}
				</div>
			)}
			<div className="flex-1">
				<p className="text-sm text-gray-900">
					<span className="font-semibold">{notification.actorName}</span>{" "}
					{getNotificationMessage()}
				</p>
				<p className="text-xs text-gray-500">
					{formatTime(notification.createdAt)}
				</p>
			</div>
			{!notification.isRead && (
				<div className="h-2 w-2 rounded-full bg-[#0A66C2]" />
			)}
		</Link>
	)
}
