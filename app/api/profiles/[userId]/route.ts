import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { profiles, user } from "@/lib/db/schema"
import { generateId } from "@/lib/utils"
import { eq } from "drizzle-orm"

type RouteContext = {
	params: Promise<{ userId: string }>
}

// GET /api/profiles/[userId] - Get user profile
export async function GET(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { userId } = await context.params

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
			.where(eq(user.id, userId))

		if (!userProfile) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		return NextResponse.json({ profile: userProfile })
	} catch (error) {
		console.error("Error fetching profile:", error)
		return NextResponse.json(
			{ error: "Failed to fetch profile" },
			{ status: 500 },
		)
	}
}

// PATCH /api/profiles/[userId] - Update user profile
export async function PATCH(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { userId } = await context.params

		// Can only update own profile
		if (userId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		const body = await request.json()
		const { headline, bio, location, website } = body

		// Check if profile exists
		const [existingProfile] = await db
			.select()
			.from(profiles)
			.where(eq(profiles.userId, userId))

		if (existingProfile) {
			// Update existing profile
			await db
				.update(profiles)
				.set({
					headline: headline || existingProfile.headline,
					bio: bio || existingProfile.bio,
					location: location || existingProfile.location,
					website: website || existingProfile.website,
					updatedAt: new Date(),
				})
				.where(eq(profiles.userId, userId))
		} else {
			// Create new profile
			const profileId = generateId()
			const now = new Date()

			await db.insert(profiles).values({
				id: profileId,
				userId,
				headline: headline || null,
				bio: bio || null,
				location: location || null,
				website: website || null,
				createdAt: now,
				updatedAt: now,
			})
		}

		const [updatedProfile] = await db
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
			.where(eq(user.id, userId))

		return NextResponse.json({ profile: updatedProfile })
	} catch (error) {
		console.error("Error updating profile:", error)
		return NextResponse.json(
			{ error: "Failed to update profile" },
			{ status: 500 },
		)
	}
}

