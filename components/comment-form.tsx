"use client"

import { useState } from "react"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"

interface CommentFormProps {
	postId: string
	onCommentAdded?: () => void
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
	const { data: session } = authClient.useSession()
	const [content, setContent] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!content.trim() || isSubmitting) return

		setIsSubmitting(true)

		try {
			const response = await fetch(`/api/posts/${postId}/comments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: content.trim() }),
			})

			if (response.ok) {
				setContent("")
				onCommentAdded?.()
			} else {
				console.error("Failed to create comment")
			}
		} catch (error) {
			console.error("Error creating comment:", error)
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!session?.user) return null

	return (
		<form onSubmit={handleSubmit} className="border-b border-gray-200 p-4">
			<div className="flex gap-3">
				{session.user.image ? (
					<Image
						src={session.user.image}
						alt={session.user.name || "User"}
						width={32}
						height={32}
						className="h-8 w-8 rounded-full"
						unoptimized
					/>
				) : (
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-gray-700">
						{session.user.name?.charAt(0).toUpperCase()}
					</div>
				)}
				<div className="flex-1">
					<input
						type="text"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Add a comment..."
						className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-[#0A66C2] focus:outline-none focus:ring-1 focus:ring-[#0A66C2]"
					/>
					{content.trim() && (
						<div className="mt-2 flex justify-end">
							<button
								type="submit"
								disabled={isSubmitting}
								className="rounded-full bg-[#0A66C2] px-4 py-1 text-sm font-semibold text-white hover:bg-[#004182] disabled:bg-gray-300 disabled:cursor-not-allowed"
							>
								{isSubmitting ? "Posting..." : "Post"}
							</button>
						</div>
					)}
				</div>
			</div>
		</form>
	)
}
