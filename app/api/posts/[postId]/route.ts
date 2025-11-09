import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts, postLikes, comments, user } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

type RouteContext = {
	params: Promise<{ postId: string }>
}

// GET /api/posts/[postId] - Get single post
export async function GET(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { postId } = await context.params

		const [post] = await db
			.select({
				id: posts.id,
				content: posts.content,
				createdAt: posts.createdAt,
				updatedAt: posts.updatedAt,
				userId: posts.userId,
				userName: user.name,
				userEmail: user.email,
				userImage: user.image,
				likeCount: sql<number>`cast(count(distinct ${postLikes.id}) as integer)`,
				commentCount: sql<number>`cast(count(distinct ${comments.id}) as integer)`,
				isLikedByCurrentUser: sql<boolean>`cast(sum(case when ${postLikes.userId} = ${session.user.id} then 1 else 0 end) as boolean)`,
			})
			.from(posts)
			.leftJoin(user, eq(posts.userId, user.id))
			.leftJoin(postLikes, eq(posts.id, postLikes.postId))
			.leftJoin(comments, eq(posts.id, comments.postId))
			.where(eq(posts.id, postId))
			.groupBy(posts.id)

		if (!post) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 })
		}

		return NextResponse.json({ post })
	} catch (error) {
		console.error("Error fetching post:", error)
		return NextResponse.json(
			{ error: "Failed to fetch post" },
			{ status: 500 },
		)
	}
}

// PATCH /api/posts/[postId] - Update post
export async function PATCH(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { postId } = await context.params
		const body = await request.json()
		const { content } = body

		if (!content || typeof content !== "string" || content.trim().length === 0) {
			return NextResponse.json(
				{ error: "Content is required" },
				{ status: 400 },
			)
		}

		// Check if post exists and belongs to user
		const [existingPost] = await db
			.select()
			.from(posts)
			.where(eq(posts.id, postId))

		if (!existingPost) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 })
		}

		if (existingPost.userId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		await db
			.update(posts)
			.set({
				content: content.trim(),
				updatedAt: new Date(),
			})
			.where(eq(posts.id, postId))

		const [updatedPost] = await db
			.select({
				id: posts.id,
				content: posts.content,
				createdAt: posts.createdAt,
				updatedAt: posts.updatedAt,
				userId: posts.userId,
				userName: user.name,
				userEmail: user.email,
				userImage: user.image,
			})
			.from(posts)
			.leftJoin(user, eq(posts.userId, user.id))
			.where(eq(posts.id, postId))

		return NextResponse.json({ post: updatedPost })
	} catch (error) {
		console.error("Error updating post:", error)
		return NextResponse.json(
			{ error: "Failed to update post" },
			{ status: 500 },
		)
	}
}

// DELETE /api/posts/[postId] - Delete post
export async function DELETE(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { postId } = await context.params

		// Check if post exists and belongs to user
		const [existingPost] = await db
			.select()
			.from(posts)
			.where(eq(posts.id, postId))

		if (!existingPost) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 })
		}

		if (existingPost.userId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		await db.delete(posts).where(eq(posts.id, postId))

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error deleting post:", error)
		return NextResponse.json(
			{ error: "Failed to delete post" },
			{ status: 500 },
		)
	}
}

