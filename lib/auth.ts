import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/db"

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
	secret: process.env.BETTER_AUTH_SECRET!,
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_AUTH_CLIENT_ID!,
			clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET!,
		},
	},
	user: {
		additionalFields: {
			hasCustomDeployment: {
				type: "boolean",
				required: true,
				default: false,
			},
		},
	},
})
