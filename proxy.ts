import { type NextRequest, NextResponse } from "next/server"
import { auth } from "./lib/auth"

export async function proxy(request: NextRequest) {
	const authObject = await auth.api.getSession({
		headers: request.headers,
	})
	console.log(authObject)
	if (
		process.env.VERCEL_ENV === "production" &&
		!request.nextUrl.searchParams.has("donotrewrite") &&
		authObject?.user?.hasCustomDeployment
	) {
		const newUrl = request.nextUrl.clone()
		newUrl.hostname =
			"modifywithai-demo-git-modifywithai-do9h-5bb1ad-codewithshreyans.vercel.app"
		return NextResponse.rewrite(newUrl)
	}
	return NextResponse.next()
}
