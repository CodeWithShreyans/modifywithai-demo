import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Navbar } from "@/components/navbar"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileInfo } from "@/components/profile-info"

export default async function ProfilePage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		redirect("/")
	}

	// Fetch profile data
	const profileResponse = await fetch(
		`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/api/profiles`,
		{
			headers: {
				Cookie: (await headers()).get("cookie") || "",
			},
		},
	)

	let profile = null
	if (profileResponse.ok) {
		const data = await profileResponse.json()
		profile = data.profile
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
				<div className="space-y-6">
					<ProfileHeader
						user={{
							name: session.user.name || "",
							email: session.user.email || "",
							image: session.user.image || "",
						}}
						profile={profile}
						isOwnProfile={true}
					/>
					<ProfileInfo profile={profile} />
				</div>
			</div>
		</div>
	)
}
