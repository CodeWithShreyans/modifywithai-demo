"use client"

import { useEffect, useState } from "react"
import { ConnectionCard } from "./connection-card"

export function RightSidebar() {
	const [suggestions, setSuggestions] = useState<Array<any>>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchSuggestions = async () => {
			try {
				const response = await fetch("/api/connections/suggestions")
				const data = await response.json()
				setSuggestions(data.suggestions || [])
			} catch (error) {
				console.error("Error fetching suggestions:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchSuggestions()
	}, [])

	return (
		<aside className="sticky top-20 space-y-4">
			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
				<h3 className="mb-4 font-semibold text-gray-900">
					People you may know
				</h3>
				<div className="space-y-4">
					{loading ? (
						<div className="space-y-4">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="animate-pulse">
									<div className="flex items-center gap-3">
										<div className="h-12 w-12 rounded-full bg-gray-200" />
										<div className="flex-1">
											<div className="mb-2 h-4 w-24 rounded bg-gray-200" />
											<div className="h-3 w-32 rounded bg-gray-200" />
										</div>
									</div>
								</div>
							))}
						</div>
					) : suggestions.length > 0 ? (
						suggestions.slice(0, 5).map((user) => (
							<ConnectionCard
								key={user.id}
								user={user}
								connectionStatus={user.connectionStatus || "none"}
								connectionId={user.connectionId}
								onConnectionChange={() => {
									setSuggestions(suggestions.filter((s) => s.id !== user.id))
								}}
							/>
						))
					) : (
						<p className="text-sm text-gray-500">No suggestions available</p>
					)}
				</div>
			</div>

			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
				<h3 className="mb-4 font-semibold text-gray-900">LinkedIn News</h3>
				<div className="space-y-3">
					<div>
						<h4 className="text-sm font-semibold text-gray-900">
							Top stories
						</h4>
						<p className="text-xs text-gray-600">Stay informed</p>
					</div>
					<div className="space-y-2">
						<div className="text-sm text-gray-700">
							• Tech industry trends
							<p className="text-xs text-gray-500">2h ago • 1,234 readers</p>
						</div>
						<div className="text-sm text-gray-700">
							• Remote work insights
							<p className="text-xs text-gray-500">5h ago • 892 readers</p>
						</div>
						<div className="text-sm text-gray-700">
							• Career development tips
							<p className="text-xs text-gray-500">1d ago • 3,456 readers</p>
						</div>
					</div>
				</div>
			</div>
		</aside>
	)
}

