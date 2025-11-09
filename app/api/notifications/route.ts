import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notifications, user } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const userNotifications = await db
			.select({
				id: notifications.id,
				type: notifications.type,
				entityId: notifications.entityId,
				entityType: notifications.entityType,
				isRead: notifications.isRead,
				createdAt: notifications.createdAt,
				actorId: user.id,
				actorName: user.name,
				actorEmail: user.email,
				actorImage: user.image,
			})
			.from(notifications)
			.leftJoin(user, eq(notifications.actorId, user.id))
			.where(eq(notifications.userId, session.user.id))
			.orderBy(desc(notifications.createdAt))
			.limit(50)

		return NextResponse.json({ notifications: userNotifications })
	} catch (error) {
		console.error("Error fetching notifications:", error)
		return NextResponse.json(
			{ error: "Failed to fetch notifications" },
			{ status: 500 },
		)
	}
}

// POST /api/notifications - Mark all notifications as read
export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		await db
			.update(notifications)
			.set({ isRead: true })
			.where(
				eq(notifications.userId, session.user.id),
			)

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error marking notifications as read:", error)
		return NextResponse.json(
			{ error: "Failed to mark notifications as read" },
			{ status: 500 },
		)
	}
}

