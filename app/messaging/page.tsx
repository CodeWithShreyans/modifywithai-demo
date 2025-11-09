import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Navbar } from "@/components/navbar"
import { MessageList } from "@/components/message-list"

export default async function MessagingPage() {
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
				<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
					<div className="border-b border-gray-200 px-6 py-4">
						<h1 className="text-xl font-semibold text-gray-900">Messages</h1>
					</div>
					<MessageList />
				</div>
			</div>
		</div>
	)
}

