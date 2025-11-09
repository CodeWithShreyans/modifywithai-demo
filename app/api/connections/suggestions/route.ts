import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { connections, user } from "@/lib/db/schema"
import { eq, or, and, notInArray, ne, sql } from "drizzle-orm"

// GET /api/connections/suggestions - Get suggested connections
export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

	// Get IDs of users already connected or with pending requests
	const existingConnections = await db
		.select({ 
			userId: connections.requesterId, 
			addresseeId: connections.addresseeId,
			status: connections.status,
			id: connections.id
		})
		.from(connections)
		.where(
			or(
				eq(connections.requesterId, session.user.id),
				eq(connections.addresseeId, session.user.id),
			),
		)

	const excludedUserIds = new Set<string>([session.user.id])
	const connectionMap = new Map<string, { status: string, id: string }>()
	
	for (const conn of existingConnections) {
		const otherUserId = conn.userId === session.user.id ? conn.addresseeId : conn.userId
		excludedUserIds.add(conn.userId)
		excludedUserIds.add(conn.addresseeId)
		connectionMap.set(otherUserId, { status: conn.status, id: conn.id })
	}

		// Get users not in the excluded list
		let suggestions
		if (excludedUserIds.size > 1) {
			suggestions = await db
				.select({
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
				})
				.from(user)
				.where(
					and(
						ne(user.id, session.user.id),
						notInArray(user.id, Array.from(excludedUserIds)),
					),
				)
				.limit(10)
		} else {
			suggestions = await db
				.select({
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
				})
				.from(user)
				.where(ne(user.id, session.user.id))
				.limit(10)
		}

		// Add connection status to suggestions (as a safety measure)
	const suggestionsWithStatus = suggestions.map(user => {
		const connectionInfo = connectionMap.get(user.id)
		return {
			...user,
			connectionStatus: connectionInfo 
				? (connectionInfo.status === "accepted" ? "connected" : "pending")
				: "none",
			connectionId: connectionInfo?.id
		}
	})

	return NextResponse.json({ suggestions: suggestionsWithStatus })
	} catch (error) {
		console.error("Error fetching connection suggestions:", error)
		return NextResponse.json(
			{ error: "Failed to fetch suggestions" },
			{ status: 500 },
		)
	}
}

