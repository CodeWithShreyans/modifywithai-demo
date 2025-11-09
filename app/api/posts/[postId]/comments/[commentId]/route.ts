import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { comments, user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

type RouteContext = {
	params: Promise<{ postId: string; commentId: string }>
}

// PATCH /api/posts/[postId]/comments/[commentId] - Update comment
export async function PATCH(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { commentId } = await context.params
		const body = await request.json()
		const { content } = body

		if (!content || typeof content !== "string" || content.trim().length === 0) {
			return NextResponse.json(
				{ error: "Content is required" },
				{ status: 400 },
			)
		}

		// Check if comment exists and belongs to user
		const [existingComment] = await db
			.select()
			.from(comments)
			.where(eq(comments.id, commentId))

		if (!existingComment) {
			return NextResponse.json({ error: "Comment not found" }, { status: 404 })
		}

		if (existingComment.userId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		await db
			.update(comments)
			.set({
				content: content.trim(),
				updatedAt: new Date(),
			})
			.where(eq(comments.id, commentId))

		const [updatedComment] = await db
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

		return NextResponse.json({ comment: updatedComment })
	} catch (error) {
		console.error("Error updating comment:", error)
		return NextResponse.json(
			{ error: "Failed to update comment" },
			{ status: 500 },
		)
	}
}

// DELETE /api/posts/[postId]/comments/[commentId] - Delete comment
export async function DELETE(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { commentId } = await context.params

		// Check if comment exists and belongs to user
		const [existingComment] = await db
			.select()
			.from(comments)
			.where(eq(comments.id, commentId))

		if (!existingComment) {
			return NextResponse.json({ error: "Comment not found" }, { status: 404 })
		}

		if (existingComment.userId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		await db.delete(comments).where(eq(comments.id, commentId))

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error deleting comment:", error)
		return NextResponse.json(
			{ error: "Failed to delete comment" },
			{ status: 500 },
		)
	}
}

