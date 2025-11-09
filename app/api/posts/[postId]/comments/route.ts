import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts, comments, user, notifications } from "@/lib/db/schema"
import { generateId } from "@/lib/utils"
import { eq, desc } from "drizzle-orm"

type RouteContext = {
	params: Promise<{ postId: string }>
}

// GET /api/posts/[postId]/comments - Get post comments
export async function GET(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { postId } = await context.params

		const postComments = await db
			.select({
				id: comments.id,
				content: comments.content,
				createdAt: comments.createdAt,
				updatedAt: comments.updatedAt,
				userId: comments.userId,
				userName: user.name,
				userEmail: user.email,
				userImage: user.image,
			})
			.from(comments)
			.leftJoin(user, eq(comments.userId, user.id))
			.where(eq(comments.postId, postId))
			.orderBy(desc(comments.createdAt))

		return NextResponse.json({ comments: postComments })
	} catch (error) {
		console.error("Error fetching comments:", error)
		return NextResponse.json(
			{ error: "Failed to fetch comments" },
			{ status: 500 },
		)
	}
}

// POST /api/posts/[postId]/comments - Create comment
export async function POST(request: NextRequest, context: RouteContext) {
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

		// Check if post exists
		const [post] = await db.select().from(posts).where(eq(posts.id, postId))

		if (!post) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 })
		}

		const commentId = generateId()
		const now = new Date()

		await db.insert(comments).values({
			id: commentId,
			postId,
			userId: session.user.id,
			content: content.trim(),
			createdAt: now,
			updatedAt: now,
		})

		// Create notification if not own post
		if (post.userId !== session.user.id) {
			await db.insert(notifications).values({
				id: generateId(),
				userId: post.userId,
				type: "post_comment",
				actorId: session.user.id,
				entityId: commentId,
				entityType: "comment",
				isRead: false,
				createdAt: now,
			})
		}

		const [newComment] = await db
			.select({
				id: comments.id,
				content: comments.content,
				createdAt: comments.createdAt,
				updatedAt: comments.updatedAt,
				userId: comments.userId,
				userName: user.name,
				userEmail: user.email,
				userImage: user.image,
			})
			.from(comments)
			.leftJoin(user, eq(comments.userId, user.id))
			.where(eq(comments.id, commentId))

		return NextResponse.json({ comment: newComment }, { status: 201 })
	} catch (error) {
		console.error("Error creating comment:", error)
		return NextResponse.json(
			{ error: "Failed to create comment" },
			{ status: 500 },
		)
	}
}

