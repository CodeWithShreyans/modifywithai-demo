"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export function MessageList() {
	const [conversations, setConversations] = useState<Array<any>>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const response = await fetch("/api/messages/conversations")
				const data = await response.json()
				setConversations(data.conversations || [])
			} catch (error) {
				console.error("Error fetching conversations:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchConversations()
		const interval = setInterval(fetchConversations, 30000)

		return () => clearInterval(interval)
	}, [])

	const formatTime = (date: Date | null) => {
		if (!date) return ""

		const now = new Date()
		const diffInSeconds = Math.floor(
			(now.getTime() - new Date(date).getTime()) / 1000,
		)

		if (diffInSeconds < 60) return "Just now"
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
		if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
		return `${Math.floor(diffInSeconds / 604800)}w`
	}

	if (loading) {
		return (
			<div className="space-y-2">
				{[...Array(5)].map((_, i) => (
					<div key={i} className="animate-pulse border-b border-gray-200 p-4">
						<div className="flex items-center gap-3">
							<div className="h-12 w-12 rounded-full bg-gray-200" />
							<div className="flex-1">
								<div className="mb-2 h-4 w-32 rounded bg-gray-200" />
								<div className="h-3 w-48 rounded bg-gray-200" />
							</div>
						</div>
					</div>
				))}
			</div>
		)
	}

	if (conversations.length === 0) {
		return (
			<div className="p-8 text-center text-gray-500">
				<p>No messages yet</p>
				<p className="text-sm">Start a conversation with your connections</p>
			</div>
		)
	}

	return (
		<div>
			{conversations.map((conversation) => {
				const otherParticipant = conversation.participants?.[0]

				return (
					<Link
						key={conversation.conversationId}
						href={`/messaging/${conversation.conversationId}`}
						className={`flex items-center gap-3 border-b border-gray-200 p-4 hover:bg-gray-50 ${
							conversation.unreadCount > 0 ? "bg-blue-50" : ""
						}`}
					>
						{otherParticipant?.userImage ? (
							<Image
								src={otherParticipant.userImage}
								alt={otherParticipant.userName || "User"}
								width={48}
								height={48}
								className="h-12 w-12 rounded-full"
								unoptimized
							/>
						) : (
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-lg font-semibold text-gray-700">
								{otherParticipant?.userName?.charAt(0).toUpperCase()}
							</div>
						)}
						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between">
								<p className="font-semibold text-gray-900">
									{otherParticipant?.userName}
								</p>
								<span className="text-xs text-gray-500">
									{formatTime(conversation.lastMessageAt)}
								</span>
							</div>
							<p className="truncate text-sm text-gray-600">
								{conversation.lastMessage || "No messages yet"}
							</p>
						</div>
						{conversation.unreadCount > 0 && (
							<div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0A66C2] text-xs text-white">
								{conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
							</div>
						)}
					</Link>
				)
			})}
		</div>
	)
}
