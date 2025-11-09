import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { conversationParticipants, messages } from "@/lib/db/schema"
import { eq, and, ne } from "drizzle-orm"

type RouteContext = {
	params: Promise<{ conversationId: string }>
}

// POST /api/messages/conversations/[conversationId]/read - Mark messages as read
export async function POST(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { conversationId } = await context.params

		// Check if user is a participant
		const [participant] = await db
			.select()
			.from(conversationParticipants)
			.where(
				and(
					eq(conversationParticipants.conversationId, conversationId),
					eq(conversationParticipants.userId, session.user.id),
				),
			)

		if (!participant) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		// Mark all messages not sent by current user as read
		await db
			.update(messages)
			.set({ isRead: true })
			.where(
				and(
					eq(messages.conversationId, conversationId),
					ne(messages.senderId, session.user.id),
					eq(messages.isRead, false),
				),
			)

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error marking messages as read:", error)
		return NextResponse.json(
			{ error: "Failed to mark messages as read" },
			{ status: 500 },
		)
	}
}

