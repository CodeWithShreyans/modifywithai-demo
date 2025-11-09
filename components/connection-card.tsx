"use client"

import Image from "next/image"
import Link from "next/link"
import { ConnectionButton } from "./connection-button"

interface ConnectionCardProps {
	user: {
		id: string
		name: string | null
		email: string | null
		image: string | null
		headline?: string | null
		location?: string | null
	}
	connectionStatus?: "none" | "pending" | "connected"
	connectionId?: string
	onConnectionChange?: () => void
}

export function ConnectionCard({
	user,
	connectionStatus = "none",
	connectionId,
	onConnectionChange,
}: ConnectionCardProps) {
	return (
		<div className="flex items-start gap-3">
			<Link href={`/profile/${user.id}`}>
				{user.image ? (
					<Image
						src={user.image}
						alt={user.name || "User"}
						width={48}
						height={48}
						className="h-12 w-12 rounded-full"
						unoptimized
					/>
				) : (
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-lg font-semibold text-gray-700">
						{user.name?.charAt(0).toUpperCase()}
					</div>
				)}
			</Link>
			<div className="flex-1">
				<Link
					href={`/profile/${user.id}`}
					className="font-semibold text-gray-900 hover:underline"
				>
					{user.name}
				</Link>
				{user.headline && (
					<p className="text-sm text-gray-600">{user.headline}</p>
				)}
				{user.location && (
					<p className="text-xs text-gray-500">{user.location}</p>
				)}
				<div className="mt-2">
					<ConnectionButton
						userId={user.id}
						initialStatus={connectionStatus}
						connectionId={connectionId}
						onConnectionChange={onConnectionChange}
					/>
				</div>
			</div>
		</div>
	)
}
