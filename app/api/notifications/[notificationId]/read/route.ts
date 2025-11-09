import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notifications } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

type RouteContext = {
	params: Promise<{ notificationId: string }>
}

// POST /api/notifications/[notificationId]/read - Mark notification as read
export async function POST(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { notificationId } = await context.params

		// Check if notification exists and belongs to user
		const [notification] = await db
			.select()
			.from(notifications)
			.where(eq(notifications.id, notificationId))

		if (!notification) {
			return NextResponse.json(
				{ error: "Notification not found" },
				{ status: 404 },
			)
		}

		if (notification.userId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		await db
			.update(notifications)
			.set({ isRead: true })
			.where(eq(notifications.id, notificationId))

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error marking notification as read:", error)
		return NextResponse.json(
			{ error: "Failed to mark notification as read" },
			{ status: 500 },
		)
	}
}

