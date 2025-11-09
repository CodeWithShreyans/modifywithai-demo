import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { conversationParticipants, messages, user } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"

type RouteContext = {
	params: Promise<{ conversationId: string }>
}

// GET /api/messages/conversations/[conversationId] - Get messages in conversation
export async function GET(request: NextRequest, context: RouteContext) {
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

		// Get messages
		const conversationMessages = await db
			.select({
				id: messages.id,
				content: messages.content,
				createdAt: messages.createdAt,
				isRead: messages.isRead,
				senderId: messages.senderId,
				senderName: user.name,
				senderEmail: user.email,
				senderImage: user.image,
			})
			.from(messages)
			.leftJoin(user, eq(messages.senderId, user.id))
			.where(eq(messages.conversationId, conversationId))
			.orderBy(desc(messages.createdAt))

		return NextResponse.json({ messages: conversationMessages })
	} catch (error) {
		console.error("Error fetching messages:", error)
		return NextResponse.json(
			{ error: "Failed to fetch messages" },
			{ status: 500 },
		)
	}
}

