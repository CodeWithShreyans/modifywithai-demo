import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: req.headers,
		})

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const response = await fetch("https://modifywithai.com/api/reset", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": process.env.MODIFYWITHAI_API_KEY || "",
			},
			body: JSON.stringify({
				userId: session.user.id,
				githubUsername: "codewithshreyans",
				githubRepo: "modifywithai-demo",
				githubInstallationId: "93751008",
				commitToMain: false,
			}),
		})

		if (!response.ok) {
			return NextResponse.json(
				{ error: "Failed to reset modifications" },
				{ status: response.status },
			)
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error in reset API route:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		)
	}
}

