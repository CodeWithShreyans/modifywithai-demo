import { db } from "../lib/db"
import {
	user,
	posts,
	postLikes,
	comments,
	connections,
	profiles,
	notifications,
} from "../lib/db/schema"
import { generateId } from "../lib/utils"

// Mock users data
const mockUsers = [
	{
		name: "Sarah Chen",
		email: "sarah.chen@example.com",
		image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah`,
		headline: "Senior Software Engineer @ Tech Corp",
		bio: "Passionate about building scalable web applications. Love React, TypeScript, and all things frontend.",
		location: "San Francisco, CA",
		website: "https://sarahchen.dev",
	},
	{
		name: "Michael Rodriguez",
		email: "michael.r@example.com",
		image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Michael`,
		headline: "Product Manager | AI & Machine Learning",
		bio: "Helping teams build products that matter. Former engineer turned PM.",
		location: "New York, NY",
		website: "https://michaelr.com",
	},
	{
		name: "Emily Watson",
		email: "emily.watson@example.com",
		image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Emily`,
		headline: "UX Designer | Making digital experiences delightful",
		bio: "Design systems enthusiast. Advocate for accessible and inclusive design.",
		location: "London, UK",
		website: "https://emilywatson.design",
	},
	{
		name: "David Kim",
		email: "david.kim@example.com",
		image: `https://api.dicebear.com/7.x/avataaars/svg?seed=David`,
		headline: "Full Stack Developer | Open Source Contributor",
		bio: "Building with Next.js, Node.js, and PostgreSQL. Coffee addict ☕",
		location: "Seattle, WA",
		website: null,
	},
	{
		name: "Priya Patel",
		email: "priya.patel@example.com",
		image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Priya`,
		headline: "DevOps Engineer | Cloud Architecture",
		bio: "AWS certified. Love automating all the things. Kubernetes enthusiast.",
		location: "Austin, TX",
		website: "https://priyatech.io",
	},
	{
		name: "James Anderson",
		email: "james.anderson@example.com",
		image: `https://api.dicebear.com/7.x/avataaars/svg?seed=James`,
		headline: "Tech Lead | Building the future of fintech",
		bio: "10+ years in software development. Mentor and team builder.",
		location: "Toronto, Canada",
		website: null,
	},
	{
		name: "Aisha Mohammed",
		email: "aisha.m@example.com",
		image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha`,
		headline: "Data Scientist | ML Engineer",
		bio: "Turning data into insights. Python, TensorFlow, and PyTorch.",
		location: "Dubai, UAE",
		website: "https://aishamohammed.ai",
	},
	{
		name: "Robert Taylor",
		email: "robert.taylor@example.com",
		image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Robert`,
		headline: "CTO @ StartupCo | Building amazing teams",
		bio: "Entrepreneur and technologist. Love solving hard problems.",
		location: "Boston, MA",
		website: "https://roberttaylor.com",
	},
]

// Mock posts content
const mockPostsContent = [
	"Just finished building a new feature using Next.js 16! The App Router is amazing. Anyone else loving the new React Server Components? 🚀",
	"Excited to announce that I'll be speaking at DevConf 2024! Topic: 'Building Scalable Web Applications with TypeScript'. Who else is attending? 🎤",
	"Today marks 5 years in tech! From junior developer to senior engineer - what a journey it's been. Grateful for all the mentors and colleagues who helped me along the way. 💙",
	"Hot take: Code reviews are the most underrated practice in software development. They're not just about catching bugs - they're about knowledge sharing and team growth. 🔍",
	"Just published a new blog post on building type-safe APIs with tRPC and Prisma. Link in the comments! Would love to hear your thoughts. 📝",
	"Working on a side project to help developers learn system design. Looking for beta testers! DM me if you're interested. 🙋‍♂️",
	"Reminder: Your mental health is more important than any deadline. Take breaks, go for walks, and don't burn yourself out. You're not a machine. 🌱",
	"Can we talk about how amazing Tailwind CSS is? I was skeptical at first, but now I can't imagine building without utility classes. What's your take? 🎨",
	"Celebrating a small win today - our team successfully migrated 1M users to the new infrastructure with zero downtime! Proud of everyone involved. 🎉",
	"Best practices I learned this year:\n1. Write tests first\n2. Keep functions small\n3. Document your code\n4. Refactor regularly\n5. Ask for help\n\nWhat are yours?",
	"The future of web development is here: Edge computing, Server Components, and AI integration. Exciting times to be a developer! 🚀",
	"Looking for recommendations on good books about software architecture. Drop your favorites below! 📚",
	"Today I learned: PostgreSQL has a built-in full-text search. No need for Elasticsearch for simple use cases! Mind blown. 🤯",
	"Shoutout to the amazing developers maintaining open source projects. Your work powers the internet and we don't thank you enough. ❤️",
	"Pro tip: When debugging, take a break. Come back with fresh eyes. The solution is often simpler than you think. 🐛",
]

async function seed() {
	console.log("🌱 Starting database seed...")

	// Clear existing data
	console.log("🗑️  Clearing existing data...")
	await db.delete(notifications)
	await db.delete(comments)
	await db.delete(postLikes)
	await db.delete(posts)
	await db.delete(connections)
	await db.delete(profiles)
	// Note: We don't delete users as they might be from real auth

	// Create mock users
	console.log("👥 Creating mock users...")
	const createdUsers = []
	const now = new Date()

	for (const mockUser of mockUsers) {
		const userId = generateId()
		const profileId = generateId()

		await db.insert(user).values({
			id: userId,
			name: mockUser.name,
			email: mockUser.email,
			emailVerified: true,
			image: mockUser.image,
			createdAt: now,
			updatedAt: now,
			hasCustomDeployment: false,
		})

		await db.insert(profiles).values({
			id: profileId,
			userId,
			headline: mockUser.headline,
			bio: mockUser.bio,
			location: mockUser.location,
			website: mockUser.website,
			createdAt: now,
			updatedAt: now,
		})

		createdUsers.push({ id: userId, name: mockUser.name })
	}

	console.log(`✅ Created ${createdUsers.length} users`)

	// Create connections between users
	console.log("🤝 Creating connections...")
	let connectionsCount = 0

	// Create a network where users are connected to each other
	for (let i = 0; i < createdUsers.length; i++) {
		for (let j = i + 1; j < createdUsers.length; j++) {
			// Create some connections (not everyone connected to everyone)
			if (Math.random() > 0.5) {
				await db.insert(connections).values({
					id: generateId(),
					requesterId: createdUsers[i].id,
					addresseeId: createdUsers[j].id,
					status: "accepted",
					createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
					updatedAt: now,
				})
				connectionsCount++
			}
		}
	}

	console.log(`✅ Created ${connectionsCount} connections`)

	// Create posts
	console.log("📝 Creating posts...")
	const createdPosts = []

	for (let i = 0; i < mockPostsContent.length; i++) {
		const postId = generateId()
		const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)]
		const postDate = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000)) // 2 hours apart

		await db.insert(posts).values({
			id: postId,
			userId: randomUser.id,
			content: mockPostsContent[i],
			createdAt: postDate,
			updatedAt: postDate,
		})

		createdPosts.push({ id: postId, userId: randomUser.id })
	}

	console.log(`✅ Created ${createdPosts.length} posts`)

	// Create likes on posts
	console.log("👍 Creating post likes...")
	let likesCount = 0

	for (const post of createdPosts) {
		// Each post gets likes from 1-5 random users
		const numLikes = Math.floor(Math.random() * 5) + 1
		const likedByUsers = new Set<string>()

		for (let i = 0; i < numLikes; i++) {
			const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)]
			
			// Don't like own post, and don't like twice
			if (randomUser.id !== post.userId && !likedByUsers.has(randomUser.id)) {
				await db.insert(postLikes).values({
					id: generateId(),
					postId: post.id,
					userId: randomUser.id,
					createdAt: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000),
				})
				likedByUsers.add(randomUser.id)
				likesCount++
			}
		}
	}

	console.log(`✅ Created ${likesCount} likes`)

	// Create comments on posts
	console.log("💬 Creating comments...")
	const commentTexts = [
		"Great post! Thanks for sharing this.",
		"This is really helpful, thank you!",
		"I've been thinking about this too. Great insights!",
		"Couldn't agree more! 👏",
		"Thanks for sharing your experience.",
		"This is exactly what I needed to read today.",
		"Interesting perspective! I'd love to learn more.",
		"Very well said!",
		"This resonates with me. Thanks for posting!",
		"Bookmarking this for later. Great content!",
		"I had a similar experience. Thanks for sharing!",
		"This is gold! 🔥",
	]

	let commentsCount = 0

	for (const post of createdPosts) {
		// Each post gets 0-4 comments
		const numComments = Math.floor(Math.random() * 5)

		for (let i = 0; i < numComments; i++) {
			const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)]
			const randomComment = commentTexts[Math.floor(Math.random() * commentTexts.length)]
			const commentId = generateId()

			await db.insert(comments).values({
				id: commentId,
				postId: post.id,
				userId: randomUser.id,
				content: randomComment,
				createdAt: new Date(now.getTime() - Math.random() * 12 * 60 * 60 * 1000),
				updatedAt: now,
			})

			commentsCount++

			// Create notification for post owner (if not commenting on own post)
			if (randomUser.id !== post.userId) {
				await db.insert(notifications).values({
					id: generateId(),
					userId: post.userId,
					type: "post_comment",
					actorId: randomUser.id,
					entityId: commentId,
					entityType: "comment",
					isRead: Math.random() > 0.5, // 50% chance of being read
					createdAt: new Date(now.getTime() - Math.random() * 12 * 60 * 60 * 1000),
				})
			}
		}
	}

	console.log(`✅ Created ${commentsCount} comments`)

	// Create some connection request notifications
	console.log("🔔 Creating notifications...")
	let notificationsCount = commentsCount // Already created comment notifications

	for (let i = 0; i < 5; i++) {
		const randomUser1 = createdUsers[Math.floor(Math.random() * createdUsers.length)]
		const randomUser2 = createdUsers[Math.floor(Math.random() * createdUsers.length)]

		if (randomUser1.id !== randomUser2.id) {
			await db.insert(notifications).values({
				id: generateId(),
				userId: randomUser2.id,
				type: "connection_accepted",
				actorId: randomUser1.id,
				entityId: generateId(),
				entityType: "connection",
				isRead: Math.random() > 0.3,
				createdAt: new Date(now.getTime() - Math.random() * 48 * 60 * 60 * 1000),
			})
			notificationsCount++
		}
	}

	console.log(`✅ Created ${notificationsCount} notifications`)

	console.log("\n🎉 Database seeding completed successfully!")
	console.log("\n📊 Summary:")
	console.log(`   - ${createdUsers.length} users`)
	console.log(`   - ${connectionsCount} connections`)
	console.log(`   - ${createdPosts.length} posts`)
	console.log(`   - ${likesCount} likes`)
	console.log(`   - ${commentsCount} comments`)
	console.log(`   - ${notificationsCount} notifications`)
}

seed()
	.catch((error) => {
		console.error("❌ Error seeding database:", error)
		process.exit(1)
	})
	.finally(() => {
		console.log("\n✨ Seed script finished")
		process.exit(0)
	})

