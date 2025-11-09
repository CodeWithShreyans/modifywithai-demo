import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import {
	conversations,
	conversationParticipants,
	messages,
	user,
} from "@/lib/db/schema"
import { generateId } from "@/lib/utils"
import { eq, and, desc, sql } from "drizzle-orm"

// GET /api/messages/conversations - Get user conversations
export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Get conversations where user is a participant
		const userConversations = await db
			.select({
				conversationId: conversations.id,
				createdAt: conversations.createdAt,
				updatedAt: conversations.updatedAt,
				lastMessage: messages.content,
				lastMessageAt: messages.createdAt,
				unreadCount: sql<number>`cast(sum(case when ${messages.isRead} = 0 and ${messages.senderId} != ${session.user.id} then 1 else 0 end) as integer)`,
			})
			.from(conversationParticipants)
			.innerJoin(
				conversations,
				eq(conversationParticipants.conversationId, conversations.id),
			)
			.leftJoin(
				messages,
				eq(conversations.id, messages.conversationId),
			)
			.where(eq(conversationParticipants.userId, session.user.id))
			.groupBy(conversations.id)
			.orderBy(desc(conversations.updatedAt))

		// Get other participants for each conversation
		const conversationsWithParticipants = await Promise.all(
			userConversations.map(async (conv) => {
				const participants = await db
					.select({
						userId: user.id,
						userName: user.name,
						userEmail: user.email,
						userImage: user.image,
					})
					.from(conversationParticipants)
					.innerJoin(user, eq(conversationParticipants.userId, user.id))
					.where(
						and(
							eq(conversationParticipants.conversationId, conv.conversationId),
							sql`${conversationParticipants.userId} != ${session.user.id}`,
						),
					)

				return {
					...conv,
					participants,
				}
			}),
		)

		return NextResponse.json({ conversations: conversationsWithParticipants })
	} catch (error) {
		console.error("Error fetching conversations:", error)
		return NextResponse.json(
			{ error: "Failed to fetch conversations" },
			{ status: 500 },
		)
	}
}

// POST /api/messages/conversations - Create new conversation
export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await request.json()
		const { participantId } = body

		if (!participantId || typeof participantId !== "string") {
			return NextResponse.json(
				{ error: "Participant ID is required" },
				{ status: 400 },
			)
		}

		// Prevent conversation with self
		if (participantId === session.user.id) {
			return NextResponse.json(
				{ error: "Cannot create conversation with yourself" },
				{ status: 400 },
			)
		}

		// Check if participant exists
		const [participant] = await db
			.select()
			.from(user)
			.where(eq(user.id, participantId))

		if (!participant) {
			return NextResponse.json(
				{ error: "Participant not found" },
				{ status: 404 },
			)
		}

		// Check if conversation already exists between these users
		const existingConversations = await db
			.select({ conversationId: conversationParticipants.conversationId })
			.from(conversationParticipants)
			.where(eq(conversationParticipants.userId, session.user.id))

		for (const conv of existingConversations) {
			const participants = await db
				.select({ userId: conversationParticipants.userId })
				.from(conversationParticipants)
				.where(eq(conversationParticipants.conversationId, conv.conversationId))

			const participantIds = participants.map((p) => p.userId)
			if (
				participantIds.length === 2 &&
				participantIds.includes(session.user.id) &&
				participantIds.includes(participantId)
			) {
				return NextResponse.json({
					conversationId: conv.conversationId,
					alreadyExists: true,
				})
			}
		}

		const conversationId = generateId()
		const now = new Date()

		// Create conversation
		await db.insert(conversations).values({
			id: conversationId,
			createdAt: now,
			updatedAt: now,
		})

		// Add participants
		await db.insert(conversationParticipants).values([
			{
				id: generateId(),
				conversationId,
				userId: session.user.id,
				joinedAt: now,
			},
			{
				id: generateId(),
				conversationId,
				userId: participantId,
				joinedAt: now,
			},
		])

		return NextResponse.json({ conversationId }, { status: 201 })
	} catch (error) {
		console.error("Error creating conversation:", error)
		return NextResponse.json(
			{ error: "Failed to create conversation" },
			{ status: 500 },
		)
	}
}

