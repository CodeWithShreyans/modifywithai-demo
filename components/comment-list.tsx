"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface CommentListProps {
	postId: string
}

export function CommentList({ postId }: CommentListProps) {
	const [comments, setComments] = useState<Array<any>>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const response = await fetch(`/api/posts/${postId}/comments`)
				const data = await response.json()
				setComments(data.comments || [])
			} catch (error) {
				console.error("Error fetching comments:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchComments()
	}, [postId])

	const formatTime = (date: Date) => {
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
			<div className="space-y-4 p-4">
				{[...Array(2)].map((_, i) => (
					<div key={i} className="animate-pulse">
						<div className="flex gap-3">
							<div className="h-8 w-8 rounded-full bg-gray-200" />
							<div className="flex-1">
								<div className="mb-2 h-3 w-24 rounded bg-gray-200" />
								<div className="h-3 w-full rounded bg-gray-200" />
							</div>
						</div>
					</div>
				))}
			</div>
		)
	}

	if (comments.length === 0) {
		return (
			<div className="p-4 text-center text-sm text-gray-500">
				No comments yet. Be the first to comment!
			</div>
		)
	}

	return (
		<div className="space-y-4 p-4">
			{comments.map((comment) => (
				<div key={comment.id} className="flex gap-3">
					<Link href={`/profile/${comment.userId}`}>
						{comment.userImage ? (
							<Image
								src={comment.userImage}
								alt={comment.userName || "User"}
								width={32}
								height={32}
								className="h-8 w-8 rounded-full"
								unoptimized
							/>
						) : (
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-gray-700">
								{comment.userName?.charAt(0).toUpperCase()}
							</div>
						)}
					</Link>
					<div className="flex-1">
						<div className="rounded-lg bg-gray-100 px-3 py-2">
							<Link
								href={`/profile/${comment.userId}`}
								className="text-sm font-semibold text-gray-900 hover:underline"
							>
								{comment.userName}
							</Link>
							<p className="mt-1 text-sm text-gray-900">{comment.content}</p>
						</div>
						<div className="mt-1 flex items-center gap-4 px-3 text-xs text-gray-500">
							<span>{formatTime(comment.createdAt)}</span>
							<button type="button" className="hover:underline">
								Like
							</button>
							<button type="button" className="hover:underline">
								Reply
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
