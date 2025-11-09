"use client"

import Image from "next/image"
import Link from "next/link"

interface ProfileCardProps {
	user: {
		id: string
		name: string | null
		email: string | null
		image: string | null
		headline?: string | null
	}
}

export function ProfileCard({ user }: ProfileCardProps) {
	return (
		<Link
			href={`/profile/${user.id}`}
			className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50"
		>
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
			<div className="flex-1 min-w-0">
				<p className="font-semibold text-gray-900 truncate">{user.name}</p>
				{user.headline && (
					<p className="text-sm text-gray-600 truncate">{user.headline}</p>
				)}
			</div>
		</Link>
	)
}
