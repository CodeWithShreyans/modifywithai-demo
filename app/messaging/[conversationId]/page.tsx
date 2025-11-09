import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { MessageThread } from "@/components/message-thread"

type PageProps = {
	params: Promise<{ conversationId: string }>
}

export default async function ConversationPage({ params }: PageProps) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		redirect("/")
	}

	const { conversationId } = await params

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
				<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
					<div className="flex items-center gap-4 border-b border-gray-200 px-6 py-4">
						<Link
							href="/messaging"
							className="text-gray-600 hover:text-gray-900"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</Link>
						<h1 className="text-xl font-semibold text-gray-900">Conversation</h1>
					</div>
					<div className="h-[600px]">
						<MessageThread conversationId={conversationId} />
					</div>
				</div>
			</div>
		</div>
	)
}

