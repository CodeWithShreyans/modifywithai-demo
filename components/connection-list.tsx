"use client"

import { useEffect, useState } from "react"
import { ConnectionCard } from "./connection-card"

interface ConnectionListProps {
	status?: "pending" | "accepted" | "rejected"
}

export function ConnectionList({ status = "pending" }: ConnectionListProps) {
	const [connections, setConnections] = useState<
		Array<{
			id: string
			userId: string
			userName: string
			userEmail: string
			userImage: string
			isRequester: string
		}>
	>([])
	const [loading, setLoading] = useState(true)

	const fetchConnections = async () => {
		try {
			const response = await fetch(`/api/connections?status=${status}`)
			const data = await response.json()
			setConnections(data.connections || [])
		} catch (error) {
			console.error("Error fetching connections:", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchConnections()
	}, [status])

	if (loading) {
		return (
			<div className="space-y-4">
				{[...Array(5)].map((_, i) => (
					<div
						key={i}
						className="animate-pulse rounded-lg border border-gray-200 bg-white p-4"
					>
						<div className="flex items-start gap-3">
							<div className="h-12 w-12 rounded-full bg-gray-200" />
							<div className="flex-1">
								<div className="mb-2 h-4 w-32 rounded bg-gray-200" />
								<div className="h-3 w-48 rounded bg-gray-200" />
							</div>
						</div>
					</div>
				))}
			</div>
		)
	}

	if (connections.length === 0) {
		return (
			<div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
				<p className="text-gray-500">
					{status === "pending"
						? "No pending connection requests"
						: "No connections yet. Start connecting with people!"}
				</p>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{connections.map((connection) => (
				<div
					key={connection.id}
					className="rounded-lg border border-gray-200 bg-white p-4"
				>
					<ConnectionCard
						user={{
							id: connection.userId,
							name: connection.userName,
							email: connection.userEmail,
							image: connection.userImage,
						}}
						connectionStatus={status as "pending" | "none" | "connected"}
						connectionId={connection.id}
						onConnectionChange={fetchConnections}
					/>
				</div>
			))}
		</div>
	)
}
