import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts, postLikes, comments, user } from "@/lib/db/schema"
import { generateId } from "@/lib/utils"
import { desc, eq, sql } from "drizzle-orm"

// GET /api/posts - Get feed posts
export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const searchParams = request.nextUrl.searchParams
		const page = Number.parseInt(searchParams.get("page") || "1", 10)
		const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
		const offset = (page - 1) * limit

		// Get posts with user info, like count, and comment count
		const feedPosts = await db
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
			.groupBy(posts.id)
			.orderBy(desc(posts.createdAt))
			.limit(limit)
			.offset(offset)

		return NextResponse.json({ posts: feedPosts })
	} catch (error) {
		console.error("Error fetching posts:", error)
		return NextResponse.json(
			{ error: "Failed to fetch posts" },
			{ status: 500 },
		)
	}
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await request.json()
		const { content } = body

		if (!content || typeof content !== "string" || content.trim().length === 0) {
			return NextResponse.json(
				{ error: "Content is required" },
				{ status: 400 },
			)
		}

		const postId = generateId()
		const now = new Date()

		await db.insert(posts).values({
			id: postId,
			userId: session.user.id,
			content: content.trim(),
			createdAt: now,
			updatedAt: now,
		})

		const [newPost] = await db
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

		return NextResponse.json({ post: newPost }, { status: 201 })
	} catch (error) {
		console.error("Error creating post:", error)
		return NextResponse.json(
			{ error: "Failed to create post" },
			{ status: 500 },
		)
	}
}

