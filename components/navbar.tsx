"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { NotificationDropdown } from "./notification-dropdown"

export function Navbar() {
	const { data: session } = authClient.useSession()
	const [unreadMessages, setUnreadMessages] = useState(0)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [aiInput, setAiInput] = useState("")

	useEffect(() => {
		if (session?.user) {
			// Poll for unread messages every 30 seconds
			const fetchUnreadCount = async () => {
				try {
					const response = await fetch("/api/messages/conversations")
					const data = await response.json()
					const count = data.conversations?.reduce(
						(acc: number, conv: any) => acc + (conv.unreadCount || 0),
						0,
					)
					setUnreadMessages(count || 0)
				} catch (error) {
					console.error("Error fetching unread messages:", error)
				}
			}

			fetchUnreadCount()
			const interval = setInterval(fetchUnreadCount, 30000)

			return () => clearInterval(interval)
		}
	}, [session])

	if (!session?.user) {
		return null
	}

	return (
		<nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-8">
						<Link href="/feed" className="flex items-center gap-2">
							<div className="flex h-9 w-9 items-center justify-center rounded bg-[#0A66C2] text-white font-bold">
								in
							</div>
						</Link>

						<div className="hidden md:block">
							<div className="relative">
								<input
									type="search"
									placeholder="Search"
									className="w-64 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#0A66C2] focus:outline-none focus:ring-1 focus:ring-[#0A66C2]"
								/>
								<svg
									className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</div>
					</div>

					<div className="flex-1 flex justify-center">
						<button
							onClick={() => setIsModalOpen(true)}
							className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
						>
							<svg
								className="h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
							Modify With AI
						</button>
					</div>

					<div className="flex items-center gap-6">
						<Link
							href="/feed"
							className="flex flex-col items-center text-gray-700 hover:text-gray-900"
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
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							<span className="text-xs">Home</span>
						</Link>

						<Link
							href="/network"
							className="flex flex-col items-center text-gray-700 hover:text-gray-900"
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
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
							<span className="text-xs">Network</span>
						</Link>

						<Link
							href="/messaging"
							className="relative flex flex-col items-center text-gray-700 hover:text-gray-900"
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
									d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
								/>
							</svg>
							<span className="text-xs">Messages</span>
							{unreadMessages > 0 && (
								<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
									{unreadMessages > 9 ? "9+" : unreadMessages}
								</span>
							)}
						</Link>

						<NotificationDropdown />

						<Link
							href="/profile"
							className="flex flex-col items-center text-gray-700 hover:text-gray-900"
						>
							{session.user.image ? (
								<Image
									src={session.user.image}
									alt={session.user.name || "User"}
									width={24}
									height={24}
									className="h-6 w-6 rounded-full"
									unoptimized
								/>
							) : (
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-gray-700">
									{session.user.name?.charAt(0).toUpperCase()}
								</div>
							)}
							<span className="text-xs">Me</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div 
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
					onClick={() => setIsModalOpen(false)}
				>
					<div 
						className="relative w-full max-w-2xl rounded-lg bg-white shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
							<h2 className="text-xl font-semibold text-gray-900">
								Modify With AI
							</h2>
							<button
								onClick={() => setIsModalOpen(false)}
								className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="p-6">
							<label
								htmlFor="ai-input"
								className="mb-2 block text-sm font-medium text-gray-800"
							>
								Describe what you'd like to modify
							</label>
							<textarea
								id="ai-input"
								value={aiInput}
								onChange={(e) => setAiInput(e.target.value)}
								placeholder="E.g., 'Make the UI more modern' or 'Add a dark mode toggle'..."
								className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
								rows={6}
							/>
						</div>

						<div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
							<button
								onClick={() => {
									setIsModalOpen(false)
									setAiInput("")
								}}
								className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								onClick={async () => {
									try {
										const response = await fetch("/api/modify", {
											method: "POST",
											headers: {
												"Content-Type": "application/json",
											},
											body: JSON.stringify({
												prompt: aiInput,
											}),
										})

										if (response.ok) {
											const data = await response.json()
											console.log("AI Response:", data)
											// Handle success
										} else {
											console.error("API Error:", response.statusText)
										}
									} catch (error) {
										console.error("Failed to submit:", error)
									} finally {
										setIsModalOpen(false)
										setAiInput("")
									}
								}}
								disabled={!aiInput.trim()}
								className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}
		</nav>
	)
}
