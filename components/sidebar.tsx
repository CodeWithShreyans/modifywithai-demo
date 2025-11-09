"use client"

import Link from "next/link"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"

export function Sidebar() {
	const { data: session } = authClient.useSession()

	if (!session?.user) {
		return null
	}

	return (
		<aside className="sticky top-20 space-y-4">
			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
				<div className="h-16 bg-gradient-to-r from-blue-400 to-blue-600" />
				<div className="px-4 pb-4">
					<div className="-mt-8 mb-3">
						{session.user.image ? (
							<Image
								src={session.user.image}
								alt={session.user.name || "User"}
								width={64}
								height={64}
								className="h-16 w-16 rounded-full border-4 border-white"
								unoptimized
							/>
						) : (
							<div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gray-300 text-2xl font-semibold text-gray-700">
								{session.user.name?.charAt(0).toUpperCase()}
							</div>
						)}
					</div>
					<Link href="/profile" className="group">
						<h3 className="font-semibold text-gray-900 group-hover:underline">
							{session.user.name}
						</h3>
						<p className="text-sm text-gray-600">{session.user.email}</p>
					</Link>
				</div>
				<div className="border-t border-gray-200 px-4 py-3">
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-600">Profile viewers</span>
						<span className="font-semibold text-[#0A66C2]">0</span>
					</div>
					<div className="mt-2 flex items-center justify-between text-sm">
						<span className="text-gray-600">Post impressions</span>
						<span className="font-semibold text-[#0A66C2]">0</span>
					</div>
				</div>
				<div className="border-t border-gray-200 px-4 py-3">
					<Link
						href="/network"
						className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
					>
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
								d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
							/>
						</svg>
						My items
					</Link>
				</div>
			</div>

			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
				<h4 className="mb-3 font-semibold text-gray-900">Recent</h4>
				<div className="space-y-2">
					<Link
						href="/feed"
						className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
					>
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
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
						Groups
					</Link>
					<Link
						href="/feed"
						className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
					>
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
								d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
							/>
						</svg>
						Hashtags
					</Link>
				</div>
			</div>
		</aside>
	)
}
