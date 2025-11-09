"use client"

import { useEffect, useState } from "react"
import { ConnectionCard } from "./connection-card"

export function ConnectionSuggestions() {
	const [suggestions, setSuggestions] = useState<Array<any>>([])
	const [loading, setLoading] = useState(true)

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

	useEffect(() => {
		fetchSuggestions()
	}, [])

	if (loading) {
		return (
			<div className="space-y-4">
				{[...Array(5)].map((_, i) => (
					<div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white p-4">
						<div className="flex items-start gap-3">
							<div className="h-12 w-12 rounded-full bg-gray-200" />
							<div className="flex-1">
								<div className="mb-2 h-4 w-32 rounded bg-gray-200" />
								<div className="h-3 w-48 rounded bg-gray-200" />
							</div>
						</div>
					</div>
				))}
			</div>
		)
	}

	if (suggestions.length === 0) {
		return (
			<div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
				<p className="text-gray-500">No suggestions available at the moment</p>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{suggestions.map((user) => (
				<div key={user.id} className="rounded-lg border border-gray-200 bg-white p-4">
					<ConnectionCard
						user={user}
						onConnectionChange={() => {
							setSuggestions(suggestions.filter((s) => s.id !== user.id))
						}}
					/>
				</div>
			))}
		</div>
	)
}

