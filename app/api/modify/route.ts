import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { prompt } = body

		if (!prompt) {
			return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
		}

		const response = await fetch("https://modifywithai.com/api/modify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": process.env.MODIFYWITHAI_API_KEY || "",
			},
			body: JSON.stringify({
				userId: "123",
				prompt,
				githubUsername: "codewithshreyans",
				githubRepo: "modifywithai-demo",
				githubInstallationId: "93751008",
			}),
		})

		if (!response.ok) {
			return NextResponse.json(
				{ error: "Failed to process request" },
				{ status: response.status },
			)
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error("Error in modify API route:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		)
	}
}
