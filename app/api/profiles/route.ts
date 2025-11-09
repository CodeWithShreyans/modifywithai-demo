import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { profiles, user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// GET /api/profiles - Get current user profile
export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const [userProfile] = await db
			.select({
				id: profiles.id,
				userId: profiles.userId,
				headline: profiles.headline,
				bio: profiles.bio,
				location: profiles.location,
				website: profiles.website,
				createdAt: profiles.createdAt,
				updatedAt: profiles.updatedAt,
				userName: user.name,
				userEmail: user.email,
				userImage: user.image,
			})
			.from(user)
			.leftJoin(profiles, eq(user.id, profiles.userId))
			.where(eq(user.id, session.user.id))

		return NextResponse.json({ profile: userProfile })
	} catch (error) {
		console.error("Error fetching profile:", error)
		return NextResponse.json(
			{ error: "Failed to fetch profile" },
			{ status: 500 },
		)
	}
}

