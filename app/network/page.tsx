import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Navbar } from "@/components/navbar"
import { NetworkTabs } from "@/components/network-tabs"

export default async function NetworkPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		redirect("/")
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
				<h1 className="mb-6 text-2xl font-bold text-gray-900">My Network</h1>
				<NetworkTabs />
			</div>
		</div>
	)
}

