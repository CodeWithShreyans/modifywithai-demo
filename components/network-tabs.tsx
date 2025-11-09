"use client"

import { useState } from "react"
import { ConnectionList } from "./connection-list"
import { ConnectionSuggestions } from "./connection-suggestions"

export function NetworkTabs() {
	const [activeTab, setActiveTab] = useState<"connections" | "requests" | "suggestions">("connections")

	return (
		<div>
			<div className="mb-6 border-b border-gray-200">
				<nav className="-mb-px flex gap-8">
					<button
						type="button"
						onClick={() => setActiveTab("connections")}
						className={`border-b-2 pb-4 text-sm font-semibold ${
							activeTab === "connections"
								? "border-[#0A66C2] text-[#0A66C2]"
								: "border-transparent text-gray-600 hover:text-gray-900"
						}`}
					>
						Connections
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("requests")}
						className={`border-b-2 pb-4 text-sm font-semibold ${
							activeTab === "requests"
								? "border-[#0A66C2] text-[#0A66C2]"
								: "border-transparent text-gray-600 hover:text-gray-900"
						}`}
					>
						Requests
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("suggestions")}
						className={`border-b-2 pb-4 text-sm font-semibold ${
							activeTab === "suggestions"
								? "border-[#0A66C2] text-[#0A66C2]"
								: "border-transparent text-gray-600 hover:text-gray-900"
						}`}
					>
						Suggestions
					</button>
				</nav>
			</div>

			{activeTab === "connections" && <ConnectionList status="accepted" />}
			{activeTab === "requests" && <ConnectionList status="pending" />}
			{activeTab === "suggestions" && <ConnectionSuggestions />}
		</div>
	)
}

