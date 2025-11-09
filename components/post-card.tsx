"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PostActions } from "./post-actions"
import { CommentList } from "./comment-list"
import { CommentForm } from "./comment-form"

interface PostCardProps {
	post: {
		id: string
		content: string
		createdAt: Date
		updatedAt: Date
		userId: string
		userName: string | null
		userEmail: string | null
		userImage: string | null
		likeCount: number
		commentCount: number
		isLikedByCurrentUser: boolean
	}
	onUpdate?: () => void
}

export function PostCard({ post, onUpdate }: PostCardProps) {
	const [showComments, setShowComments] = useState(false)

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

	return (
		<div className="rounded-lg border border-gray-200 bg-white">
			<div className="p-4">
				<div className="flex items-start gap-3">
					<Link href={`/profile/${post.userId}`}>
						{post.userImage ? (
							<Image
								src={post.userImage}
								alt={post.userName || "User"}
								width={48}
								height={48}
								className="h-12 w-12 rounded-full"
								unoptimized
							/>
						) : (
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-lg font-semibold text-gray-700">
								{post.userName?.charAt(0).toUpperCase()}
							</div>
						)}
					</Link>
					<div className="flex-1">
						<Link
							href={`/profile/${post.userId}`}
							className="font-semibold text-gray-900 hover:underline"
						>
							{post.userName}
						</Link>
						<p className="text-sm text-gray-600">{post.userEmail}</p>
						<p className="text-xs text-gray-500">
							{formatTime(post.createdAt)}
						</p>
					</div>
				</div>

				<div className="mt-3">
					<p className="whitespace-pre-wrap text-gray-900">{post.content}</p>
				</div>
			</div>

			<div className="border-t border-gray-200 px-4 py-2">
				<div className="flex items-center justify-between text-sm text-gray-600">
					<span>
						{post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
					</span>
					<button
						type="button"
						onClick={() => setShowComments(!showComments)}
						className="hover:underline"
					>
						{post.commentCount}{" "}
						{post.commentCount === 1 ? "comment" : "comments"}
					</button>
				</div>
			</div>

			<PostActions
				postId={post.id}
				isLiked={post.isLikedByCurrentUser}
				onUpdate={onUpdate}
				onCommentClick={() => setShowComments(!showComments)}
			/>

			{showComments && (
				<div className="border-t border-gray-200">
					<CommentForm postId={post.id} onCommentAdded={onUpdate} />
					<CommentList postId={post.id} />
				</div>
			)}
		</div>
	)
}
