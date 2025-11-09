import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { user, posts, profiles } from "@/lib/db/schema"
import { like, or, desc } from "drizzle-orm"

// GET /api/search - Search users and posts
export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const searchParams = request.nextUrl.searchParams
		const query = searchParams.get("q") || ""
		const type = searchParams.get("type") || "all" // all, users, posts

		if (!query || query.trim().length === 0) {
			return NextResponse.json(
				{ error: "Search query is required" },
				{ status: 400 },
			)
		}

		const searchTerm = `%${query.trim()}%`
		const results: {
			users?: Array<any>
			posts?: Array<any>
		} = {}

		// Search users
		if (type === "all" || type === "users") {
			const users = await db
				.select({
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
					headline: profiles.headline,
					location: profiles.location,
				})
				.from(user)
				.leftJoin(profiles, or(user.id, profiles.userId))
				.where(
					or(
						like(user.name, searchTerm),
						like(user.email, searchTerm),
						like(profiles.headline, searchTerm),
					),
				)
				.limit(20)

			results.users = users
		}

		// Search posts
		if (type === "all" || type === "posts") {
			const searchPosts = await db
				.select({
					id: posts.id,
					content: posts.content,
					createdAt: posts.createdAt,
					userId: posts.userId,
					userName: user.name,
					userImage: user.image,
				})
				.from(posts)
				.leftJoin(user, or(posts.userId, user.id))
				.where(like(posts.content, searchTerm))
				.orderBy(desc(posts.createdAt))
				.limit(20)

			results.posts = searchPosts
		}

		return NextResponse.json({ results })
	} catch (error) {
		console.error("Error searching:", error)
		return NextResponse.json({ error: "Failed to search" }, { status: 500 })
	}
}

