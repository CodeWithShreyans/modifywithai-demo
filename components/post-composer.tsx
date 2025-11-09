"use client"

import { useState } from "react"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"

interface PostComposerProps {
	onPostCreated?: () => void
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
	const { data: session } = authClient.useSession()
	const [content, setContent] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!content.trim() || isSubmitting) return

		setIsSubmitting(true)

		try {
			const response = await fetch("/api/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: content.trim() }),
			})

			if (response.ok) {
				setContent("")
				onPostCreated?.()
			} else {
				console.error("Failed to create post")
			}
		} catch (error) {
			console.error("Error creating post:", error)
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!session?.user) return null

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4">
			<form onSubmit={handleSubmit}>
				<div className="flex gap-3">
					{session.user.image ? (
						<Image
							src={session.user.image}
							alt={session.user.name || "User"}
							width={48}
							height={48}
							className="h-12 w-12 rounded-full"
							unoptimized
						/>
					) : (
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-lg font-semibold text-gray-700">
							{session.user.name?.charAt(0).toUpperCase()}
						</div>
					)}
					<div className="flex-1">
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="What do you want to talk about?"
							className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-[#0A66C2] focus:outline-none focus:ring-1 focus:ring-[#0A66C2]"
							rows={3}
						/>
					</div>
				</div>
				<div className="mt-3 flex items-center justify-between">
					<div className="flex gap-2">
						<button
							type="button"
							className="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
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
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							Photo
						</button>
						<button
							type="button"
							className="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
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
									d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
								/>
							</svg>
							Video
						</button>
					</div>
					<button
						type="submit"
						disabled={!content.trim() || isSubmitting}
						className="rounded-full bg-[#0A66C2] px-6 py-2 text-sm font-semibold text-white hover:bg-[#004182] disabled:bg-gray-300 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "Posting..." : "Post"}
					</button>
				</div>
			</form>
		</div>
	)
}
