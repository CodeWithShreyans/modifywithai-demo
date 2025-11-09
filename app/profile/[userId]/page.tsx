import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Navbar } from "@/components/navbar"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileInfo } from "@/components/profile-info"

type PageProps = {
	params: Promise<{ userId: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		redirect("/")
	}

	const { userId } = await params

	// Redirect to own profile page if viewing own profile
	if (userId === session.user.id) {
		redirect("/profile")
	}

	// Fetch user profile data
	const profileResponse = await fetch(
		`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/api/profiles/${userId}`,
		{
			headers: {
				Cookie: (await headers()).get("cookie") || "",
			},
		},
	)

	if (!profileResponse.ok) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
					<div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
						<p className="text-gray-500">User not found</p>
					</div>
				</div>
			</div>
		)
	}

	const data = await profileResponse.json()
	const profile = data.profile

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
				<div className="space-y-6">
					<ProfileHeader
						user={{
							name: profile.userName,
							email: profile.userEmail,
							image: profile.userImage,
						}}
						profile={profile}
						isOwnProfile={false}
					/>
					<ProfileInfo profile={profile} />
				</div>
			</div>
		</div>
	)
}

