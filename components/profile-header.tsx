"use client"

import Image from "next/image"

interface ProfileHeaderProps {
	user: {
		name: string | null
		email: string | null
		image: string | null
	}
	profile?: {
		headline: string | null
		location: string | null
	} | null
	isOwnProfile?: boolean
}

export function ProfileHeader({
	user,
	profile,
	isOwnProfile,
}: ProfileHeaderProps) {
	return (
		<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
			<div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600" />
			<div className="px-6 pb-6">
				<div className="flex items-end justify-between">
					<div className="-mt-16">
						{user.image ? (
							<Image
								src={user.image}
								alt={user.name || "User"}
								width={128}
								height={128}
								className="h-32 w-32 rounded-full border-4 border-white"
								unoptimized
							/>
						) : (
							<div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gray-300 text-4xl font-semibold text-gray-700">
								{user.name?.charAt(0).toUpperCase()}
							</div>
						)}
					</div>
					{isOwnProfile && (
						<button
							type="button"
							className="mt-4 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
						>
							Edit profile
						</button>
					)}
				</div>
				<div className="mt-4">
					<h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
					{profile?.headline && (
						<p className="mt-1 text-lg text-gray-700">{profile.headline}</p>
					)}
					<div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
						{profile?.location && (
							<span className="flex items-center gap-1">
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								{profile.location}
							</span>
						)}
						<span>{user.email}</span>
					</div>
				</div>
			</div>
		</div>
	)
}
