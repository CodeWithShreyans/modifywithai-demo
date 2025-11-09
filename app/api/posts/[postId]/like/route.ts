import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts, postLikes, notifications } from "@/lib/db/schema"
import { generateId } from "@/lib/utils"
import { eq, and } from "drizzle-orm"

type RouteContext = {
	params: Promise<{ postId: string }>
}

// POST /api/posts/[postId]/like - Like a post
export async function POST(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { postId } = await context.params

		// Check if post exists
		const [post] = await db.select().from(posts).where(eq(posts.id, postId))

		if (!post) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 })
		}

		// Check if already liked
		const [existingLike] = await db
			.select()
			.from(postLikes)
			.where(
				and(eq(postLikes.postId, postId), eq(postLikes.userId, session.user.id)),
			)

		if (existingLike) {
			return NextResponse.json(
				{ error: "Post already liked" },
				{ status: 400 },
			)
		}

		const likeId = generateId()
		const now = new Date()

		await db.insert(postLikes).values({
			id: likeId,
			postId,
			userId: session.user.id,
			createdAt: now,
		})

		// Create notification if not own post
		if (post.userId !== session.user.id) {
			await db.insert(notifications).values({
				id: generateId(),
				userId: post.userId,
				type: "post_like",
				actorId: session.user.id,
				entityId: postId,
				entityType: "post",
				isRead: false,
				createdAt: now,
			})
		}

		return NextResponse.json({ success: true }, { status: 201 })
	} catch (error) {
		console.error("Error liking post:", error)
		return NextResponse.json(
			{ error: "Failed to like post" },
			{ status: 500 },
		)
	}
}

// DELETE /api/posts/[postId]/like - Unlike a post
export async function DELETE(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { postId } = await context.params

		await db
			.delete(postLikes)
			.where(
				and(eq(postLikes.postId, postId), eq(postLikes.userId, session.user.id)),
			)

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error unliking post:", error)
		return NextResponse.json(
			{ error: "Failed to unlike post" },
			{ status: 500 },
		)
	}
}

