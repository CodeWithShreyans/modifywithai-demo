import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { connections, notifications } from "@/lib/db/schema"
import { generateId } from "@/lib/utils"
import { eq } from "drizzle-orm"

type RouteContext = {
	params: Promise<{ connectionId: string }>
}

// PATCH /api/connections/[connectionId] - Accept/reject connection request
export async function PATCH(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { connectionId } = await context.params
		const body = await request.json()
		const { status } = body

		if (!status || !["accepted", "rejected"].includes(status)) {
			return NextResponse.json(
				{ error: "Status must be 'accepted' or 'rejected'" },
				{ status: 400 },
			)
		}

		// Check if connection exists and user is the addressee
		const [connection] = await db
			.select()
			.from(connections)
			.where(eq(connections.id, connectionId))

		if (!connection) {
			return NextResponse.json(
				{ error: "Connection not found" },
				{ status: 404 },
			)
		}

		if (connection.addresseeId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		if (connection.status !== "pending") {
			return NextResponse.json(
				{ error: "Connection request already processed" },
				{ status: 400 },
			)
		}

		await db
			.update(connections)
			.set({
				status,
				updatedAt: new Date(),
			})
			.where(eq(connections.id, connectionId))

		// Create notification if accepted
		if (status === "accepted") {
			await db.insert(notifications).values({
				id: generateId(),
				userId: connection.requesterId,
				type: "connection_accepted",
				actorId: session.user.id,
				entityId: connectionId,
				entityType: "connection",
				isRead: false,
				createdAt: new Date(),
			})
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error updating connection:", error)
		return NextResponse.json(
			{ error: "Failed to update connection" },
			{ status: 500 },
		)
	}
}

// DELETE /api/connections/[connectionId] - Remove connection
export async function DELETE(request: NextRequest, context: RouteContext) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { connectionId } = await context.params

		// Check if connection exists and user is involved
		const [connection] = await db
			.select()
			.from(connections)
			.where(eq(connections.id, connectionId))

		if (!connection) {
			return NextResponse.json(
				{ error: "Connection not found" },
				{ status: 404 },
			)
		}

		if (
			connection.requesterId !== session.user.id &&
			connection.addresseeId !== session.user.id
		) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 })
		}

		await db.delete(connections).where(eq(connections.id, connectionId))

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error deleting connection:", error)
		return NextResponse.json(
			{ error: "Failed to delete connection" },
			{ status: 500 },
		)
	}
}

