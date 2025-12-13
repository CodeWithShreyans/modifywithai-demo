import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { MWAIComponents, MWAIHead, MWAIProvider } from "modifywithai"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "ModifyWithAI Demo",
	description: "ModifyWithAI Demo",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="dark" id="root-html">
			<head>
				<MWAIHead />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-sidebar`}
				id="root-body"
			>
				<div id="root-children">{children}</div>
				<MWAIProvider id="user_E5z5yRzSq7sA6WjwkKC4wR">
					<MWAIComponents />
				</MWAIProvider>
			</body>
		</html>
	)
}
