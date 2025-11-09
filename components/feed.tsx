"use client"

import { useEffect, useState } from "react"
import { PostCard } from "./post-card"
import { PostComposer } from "./post-composer"

export function Feed() {
	const [posts, setPosts] = useState<Array<any>>([])
	const [loading, setLoading] = useState(true)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)

	const fetchPosts = async (pageNum: number = 1) => {
		try {
			setLoading(true)
			const response = await fetch(`/api/posts?page=${pageNum}&limit=10`)
			const data = await response.json()

			if (pageNum === 1) {
				setPosts(data.posts || [])
			} else {
				setPosts((prev) => [...prev, ...(data.posts || [])])
			}

			if (!data.posts || data.posts.length < 10) {
				setHasMore(false)
			}
		} catch (error) {
			console.error("Error fetching posts:", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchPosts(1)
	}, [])

	const handleLoadMore = () => {
		const nextPage = page + 1
		setPage(nextPage)
		fetchPosts(nextPage)
	}

	return (
		<div className="space-y-4">
			<PostComposer onPostCreated={() => fetchPosts(1)} />

			{loading && page === 1 ? (
				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="animate-pulse rounded-lg border border-gray-200 bg-white p-4"
						>
							<div className="flex items-start gap-3">
								<div className="h-12 w-12 rounded-full bg-gray-200" />
								<div className="flex-1">
									<div className="mb-2 h-4 w-32 rounded bg-gray-200" />
									<div className="h-3 w-48 rounded bg-gray-200" />
								</div>
							</div>
							<div className="mt-4 space-y-2">
								<div className="h-3 w-full rounded bg-gray-200" />
								<div className="h-3 w-full rounded bg-gray-200" />
								<div className="h-3 w-3/4 rounded bg-gray-200" />
							</div>
						</div>
					))}
				</div>
			) : posts.length > 0 ? (
				<>
					{posts.map((post) => (
						<PostCard
							key={post.id}
							post={post}
							onUpdate={() => fetchPosts(1)}
						/>
					))}

					{hasMore && (
						<button
							type="button"
							onClick={handleLoadMore}
							disabled={loading}
							className="w-full rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{loading ? "Loading..." : "Load more posts"}
						</button>
					)}
				</>
			) : (
				<div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
					<p className="text-gray-500">
						No posts yet. Be the first to share something!
					</p>
				</div>
			)}
		</div>
	)
}

