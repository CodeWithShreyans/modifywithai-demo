"use client"

interface ProfileInfoProps {
	profile: {
		bio: string | null
		website: string | null
	} | null
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
	if (!profile?.bio && !profile?.website) {
		return null
	}

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6">
			<h2 className="mb-4 text-xl font-semibold text-gray-900">About</h2>
			{profile.bio && (
				<p className="whitespace-pre-wrap text-gray-700">{profile.bio}</p>
			)}
			{profile.website && (
				<div className="mt-4">
					<a
						href={profile.website}
						target="_blank"
						rel="noopener noreferrer"
						className="text-[#0A66C2] hover:underline"
					>
						{profile.website}
					</a>
				</div>
			)}
		</div>
	)
}

