import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { GitHubAuthButton } from "@/components/github-auth-button"

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (session?.user) {
		redirect("/feed")
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white">
			<main className="w-full max-w-md px-6 py-12">
				<div className="text-center">
					<div className="mb-8 flex justify-center">
						<div className="flex h-16 w-16 items-center justify-center rounded bg-[#0A66C2] text-3xl font-bold text-white">
							in
						</div>
					</div>
					<h1 className="mb-4 text-4xl font-bold text-gray-900">
						Welcome to LinkedIn
					</h1>
					<p className="mb-8 text-lg text-gray-600">
						Connect with professionals, share your journey, and grow your network
					</p>
					<div className="flex justify-center">
						<GitHubAuthButton />
					</div>
				</div>
			</main>
		</div>
	)
}
