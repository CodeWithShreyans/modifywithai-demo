import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { connections, user, notifications } from "@/lib/db/schema"
import { generateId } from "@/lib/utils"
import { eq, or, and } from "drizzle-orm"

// GET /api/connections - Get user connections
export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const searchParams = request.nextUrl.searchParams
		const status = searchParams.get("status") || "accepted"

		// Get connections where user is either requester or addressee
		const userConnections = await db
			.select({
				id: connections.id,
				status: connections.status,
				createdAt: connections.createdAt,
				updatedAt: connections.updatedAt,
				userId: user.id,
				userName: user.name,
				userEmail: user.email,
				userImage: user.image,
				isRequester: connections.requesterId,
			})
			.from(connections)
			.leftJoin(
				user,
				or(
					and(
						eq(connections.requesterId, session.user.id),
						eq(user.id, connections.addresseeId),
					),
					and(
						eq(connections.addresseeId, session.user.id),
						eq(user.id, connections.requesterId),
					),
				),
			)
			.where(
				and(
					or(
						eq(connections.requesterId, session.user.id),
						eq(connections.addresseeId, session.user.id),
					),
					eq(connections.status, status),
				),
			)

		return NextResponse.json({ connections: userConnections })
	} catch (error) {
		console.error("Error fetching connections:", error)
		return NextResponse.json(
			{ error: "Failed to fetch connections" },
			{ status: 500 },
		)
	}
}

// POST /api/connections - Send connection request
export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await request.json()
		const { addresseeId } = body

		if (!addresseeId || typeof addresseeId !== "string") {
			return NextResponse.json(
				{ error: "Addressee ID is required" },
				{ status: 400 },
			)
		}

		// Prevent self-connection
		if (addresseeId === session.user.id) {
			return NextResponse.json(
				{ error: "Cannot connect with yourself" },
				{ status: 400 },
			)
		}

		// Check if addressee exists
		const [addressee] = await db
			.select()
			.from(user)
			.where(eq(user.id, addresseeId))

		if (!addressee) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		// Check if connection already exists
		const [existingConnection] = await db
			.select()
			.from(connections)
			.where(
				or(
					and(
						eq(connections.requesterId, session.user.id),
						eq(connections.addresseeId, addresseeId),
					),
					and(
						eq(connections.requesterId, addresseeId),
						eq(connections.addresseeId, session.user.id),
					),
				),
			)

		if (existingConnection) {
			return NextResponse.json(
				{ error: "Connection request already exists" },
				{ status: 400 },
			)
		}

		const connectionId = generateId()
		const now = new Date()

		await db.insert(connections).values({
			id: connectionId,
			requesterId: session.user.id,
			addresseeId,
			status: "pending",
			createdAt: now,
			updatedAt: now,
		})

		// Create notification
		await db.insert(notifications).values({
			id: generateId(),
			userId: addresseeId,
			type: "connection_request",
			actorId: session.user.id,
			entityId: connectionId,
			entityType: "connection",
			isRead: false,
			createdAt: now,
		})

		return NextResponse.json({ success: true }, { status: 201 })
	} catch (error) {
		console.error("Error creating connection:", error)
		return NextResponse.json(
			{ error: "Failed to create connection" },
			{ status: 500 },
		)
	}
}

