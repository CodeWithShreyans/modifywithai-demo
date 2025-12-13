import { createNextjsHandler } from "modifywithai/nextjs/api"
import { auth } from "@/lib/auth"

export { generateStaticParams } from "modifywithai/nextjs/api"

export const dynamicParams = false

export const { GET, POST, PUT, PATCH, DELETE } = createNextjsHandler({
	baseUrl: process.env.MWAI_BASE_URL,
	getEndUserId: async (request) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		})
		return session?.user?.id ?? null
	},
	githubUsername: "CodeWithShreyans",
	githubRepo: "modifywithai-demo",
	githubInstallationId: "1234567890",
})
