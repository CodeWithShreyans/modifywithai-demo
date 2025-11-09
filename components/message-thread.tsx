"use client"

import { useEffect, useState, useRef } from "react"
import { MessageBubble } from "./message-bubble"
import { MessageInput } from "./message-input"
import { authClient } from "@/lib/auth-client"

interface MessageThreadProps {
	conversationId: string
}

export function MessageThread({ conversationId }: MessageThreadProps) {
	const { data: session } = authClient.useSession()
	const [messages, setMessages] = useState<Array<any>>([])
	const [loading, setLoading] = useState(true)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}

	const fetchMessages = async () => {
		try {
			const response = await fetch(
				`/api/messages/conversations/${conversationId}`,
			)
			const data = await response.json()
			setMessages(data.messages || [])

			// Mark messages as read
			await fetch(`/api/messages/conversations/${conversationId}/read`, {
				method: "POST",
			})
		} catch (error) {
			console.error("Error fetching messages:", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchMessages()
		const interval = setInterval(fetchMessages, 5000)

		return () => clearInterval(interval)
	}, [conversationId])

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleMessageSent = () => {
		fetchMessages()
	}

	if (loading) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-gray-500">Loading messages...</div>
			</div>
		)
	}

	return (
		<div className="flex h-full flex-col">
			<div className="flex-1 overflow-y-auto p-4">
				{messages.length === 0 ? (
					<div className="flex h-full items-center justify-center text-gray-500">
						<p>No messages yet. Start the conversation!</p>
					</div>
				) : (
					<div className="space-y-4">
						{[...messages].reverse().map((message) => (
							<MessageBubble
								key={message.id}
								message={message}
								isOwn={message.senderId === session?.user?.id}
							/>
						))}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>
			<div className="border-t border-gray-200 p-4">
				<MessageInput
					conversationId={conversationId}
					onMessageSent={handleMessageSent}
				/>
			</div>
		</div>
	)
}

