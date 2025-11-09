"use client"

import { useState } from "react"

interface MessageInputProps {
	conversationId: string
	onMessageSent?: () => void
}

export function MessageInput({
	conversationId,
	onMessageSent,
}: MessageInputProps) {
	const [content, setContent] = useState("")
	const [isSending, setIsSending] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!content.trim() || isSending) return

		setIsSending(true)

		try {
			const response = await fetch(
				`/api/messages/conversations/${conversationId}/messages`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ content: content.trim() }),
				},
			)

			if (response.ok) {
				setContent("")
				onMessageSent?.()
			} else {
				console.error("Failed to send message")
			}
		} catch (error) {
			console.error("Error sending message:", error)
		} finally {
			setIsSending(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex items-end gap-2">
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault()
						handleSubmit(e)
					}
				}}
				placeholder="Write a message..."
				className="flex-1 resize-none rounded-lg border border-gray-300 p-3 focus:border-[#0A66C2] focus:outline-none focus:ring-1 focus:ring-[#0A66C2]"
				rows={2}
			/>
			<button
				type="submit"
				disabled={!content.trim() || isSending}
				className="rounded-lg bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white hover:bg-[#004182] disabled:cursor-not-allowed disabled:bg-gray-300"
			>
				{isSending ? "Sending..." : "Send"}
			</button>
		</form>
	)
}

