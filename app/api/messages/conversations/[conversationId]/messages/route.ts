import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import {
	conversationParticipants,
	messages,
	conversations,
	user,
} from "@/lib/db/schema"
import { generateId } from "@/lib/utils"
import { eq, and } from "drizzle-orm"

type RouteContext = {
	params: Promise<{ conversationId: string }>
}

// POST /api/messages/conversations/[conversationId]/messages - Send message
export async function POST(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { conversationId } = await context.params
		const body = await request.json()
		const { content } = body

		if (!content || typeof content !== "string" || content.trim().length === 0) {
			return NextResponse.json(
				{ error: "Content is required" },
				{ status: 400 },
			)
		}

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

		const messageId = generateId()
		const now = new Date()

		await db.insert(messages).values({
			id: messageId,
			conversationId,
			senderId: session.user.id,
			content: content.trim(),
			createdAt: now,
			isRead: false,
		})

		// Update conversation updatedAt
		await db
			.update(conversations)
			.set({ updatedAt: now })
			.where(eq(conversations.id, conversationId))

		const [newMessage] = await db
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
			.where(eq(messages.id, messageId))

		return NextResponse.json({ message: newMessage }, { status: 201 })
	} catch (error) {
		console.error("Error sending message:", error)
		return NextResponse.json(
			{ error: "Failed to send message" },
			{ status: 500 },
		)
	}
}

