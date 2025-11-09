"use client"

import { useState } from "react"

interface ConnectionButtonProps {
	userId: string
	initialStatus?: "none" | "pending" | "connected"
	connectionId?: string
	onConnectionChange?: () => void
}

export function ConnectionButton({
	userId,
	initialStatus = "none",
	connectionId,
	onConnectionChange,
}: ConnectionButtonProps) {
	const [status, setStatus] = useState(initialStatus)
	const [isLoading, setIsLoading] = useState(false)

	const handleConnect = async () => {
		if (isLoading) return

		setIsLoading(true)

		try {
			const response = await fetch("/api/connections", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ addresseeId: userId }),
			})

			if (response.ok) {
				setStatus("pending")
				onConnectionChange?.()
			} else {
				console.error("Failed to send connection request")
			}
		} catch (error) {
			console.error("Error sending connection request:", error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleAccept = async () => {
		if (!connectionId || isLoading) return

		setIsLoading(true)

		try {
			const response = await fetch(`/api/connections/${connectionId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: "accepted" }),
			})

			if (response.ok) {
				setStatus("connected")
				onConnectionChange?.()
			} else {
				console.error("Failed to accept connection")
			}
		} catch (error) {
			console.error("Error accepting connection:", error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleRemove = async () => {
		if (!connectionId || isLoading) return

		setIsLoading(true)

		try {
			const response = await fetch(`/api/connections/${connectionId}`, {
				method: "DELETE",
			})

			if (response.ok) {
				setStatus("none")
				onConnectionChange?.()
			} else {
				console.error("Failed to remove connection")
			}
		} catch (error) {
			console.error("Error removing connection:", error)
		} finally {
			setIsLoading(false)
		}
	}

	if (status === "connected") {
		return (
			<button
				type="button"
				onClick={handleRemove}
				disabled={isLoading}
				className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isLoading ? "Loading..." : "Connected"}
			</button>
		)
	}

	if (status === "pending") {
		return (
			<button
				type="button"
				disabled
				className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-500 cursor-not-allowed"
			>
				Pending
			</button>
		)
	}

	return (
		<button
			type="button"
			onClick={handleConnect}
			disabled={isLoading}
			className="rounded-full bg-[#0A66C2] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#004182] disabled:cursor-not-allowed disabled:bg-gray-300"
		>
			{isLoading ? "Loading..." : "Connect"}
		</button>
	)
}

