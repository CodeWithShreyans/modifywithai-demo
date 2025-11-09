import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
	// baseURL is optional - Better Auth will auto-detect if on the same domain
	// Uncomment and set NEXT_PUBLIC_BETTER_AUTH_URL if needed:
	// baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
})
