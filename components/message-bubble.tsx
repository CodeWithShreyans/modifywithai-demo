"use client"

import Image from "next/image"

interface MessageBubbleProps {
	message: {
		id: string
		content: string
		createdAt: Date
		senderId: string
		senderName: string | null
		senderImage: string | null
	}
	isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
	const formatTime = (date: Date) => {
		return new Date(date).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		})
	}

	return (
		<div className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
			{!isOwn && (
				<div className="flex-shrink-0">
					{message.senderImage ? (
						<Image
							src={message.senderImage}
							alt={message.senderName || "User"}
							width={32}
							height={32}
							className="h-8 w-8 rounded-full"
							unoptimized
						/>
					) : (
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-gray-700">
							{message.senderName?.charAt(0).toUpperCase()}
						</div>
					)}
				</div>
			)}
			<div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
				<div
					className={`max-w-md rounded-lg px-4 py-2 ${
						isOwn ? "bg-[#0A66C2] text-white" : "bg-gray-100 text-gray-900"
					}`}
				>
					<p className="whitespace-pre-wrap break-words">{message.content}</p>
				</div>
				<span className="mt-1 text-xs text-gray-500">
					{formatTime(message.createdAt)}
				</span>
			</div>
		</div>
	)
}
