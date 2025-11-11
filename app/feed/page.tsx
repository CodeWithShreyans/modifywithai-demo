import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Feed } from "@/components/feed"

export default async function FeedPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		redirect("/")
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
					<div className="lg:col-span-3">
						<Sidebar />
					</div>
					<div className="lg:col-span-9">
						<Feed />
					</div>
				</div>
			</div>
		</div>
	)
}

