# LinkedIn Clone

A full-featured LinkedIn clone built with Next.js 16, Better Auth, Drizzle ORM, and Tailwind CSS.

## Features

### Core Features
- **User Authentication**: GitHub OAuth integration via Better Auth
- **User Profiles**: Customizable profiles with headline, bio, location, and website
- **Posts & Feed**: Create, view, edit, and delete posts with infinite scroll
- **Reactions**: Like posts and comments
- **Comments**: Comment on posts with full CRUD operations
- **Connections**: Send, accept, and manage connection requests
- **Suggested Connections**: Discover new people to connect with
- **Messaging**: Real-time direct messaging with unread indicators
- **Notifications**: Get notified of likes, comments, and connection requests
- **Search**: Search for users and posts (coming soon)

### Technical Features
- Server-side rendering with Next.js 16 App Router
- Type-safe database queries with Drizzle ORM
- SQLite database (Turso/LibSQL)
- Beautiful UI with Tailwind CSS and LinkedIn-inspired design
- Real-time updates via polling (notifications, messages)
- Responsive design for mobile and desktop

## Tech Stack

- **Framework**: Next.js 16
- **Authentication**: Better Auth with GitHub OAuth
- **Database**: SQLite (Turso/LibSQL) with Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Runtime**: Bun (optional, works with Node.js too)

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- A GitHub OAuth application (for authentication)
- A Turso database (or any SQLite database)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd vibeware-demo
```

2. Install dependencies:

```bash
bun install
# or
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Better Auth
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_SECRET=your-secret-key-here

# GitHub OAuth
GITHUB_AUTH_CLIENT_ID=your-github-client-id
GITHUB_AUTH_CLIENT_SECRET=your-github-client-secret

# Database (Turso/LibSQL)
TURSO_DATABASE_URL=your-database-url
TURSO_AUTH_TOKEN=your-database-auth-token
```

4. Set up GitHub OAuth:

   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create a new OAuth app
   - Set Authorization callback URL to: `http://localhost:3001/api/auth/callback/github`
   - Copy the Client ID and Client Secret to your `.env` file

5. Set up the database:

```bash
# Push the schema to your database
bun run db:push
# or
npm run db:push

# (Optional) Seed the database with mock data
bun run db:seed
# or
npm run db:seed
```

6. Run the development server:

```bash
bun dev
# or
npm run dev
```

7. Open [http://localhost:3001](http://localhost:3001) with your browser

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication routes
│   │   ├── connections/      # Connection management
│   │   ├── messages/         # Messaging API
│   │   ├── notifications/    # Notifications API
│   │   ├── posts/            # Posts and comments API
│   │   ├── profiles/         # User profiles API
│   │   └── search/           # Search API
│   ├── feed/                 # Feed page
│   ├── messaging/            # Messaging pages
│   ├── network/              # Network/connections page
│   ├── profile/              # Profile pages
│   └── page.tsx              # Landing page
├── components/               # React components
│   ├── comment-*.tsx         # Comment components
│   ├── connection-*.tsx      # Connection components
│   ├── feed.tsx              # Feed component
│   ├── message-*.tsx         # Messaging components
│   ├── navbar.tsx            # Navigation bar
│   ├── notification-*.tsx    # Notification components
│   ├── post-*.tsx            # Post components
│   ├── profile-*.tsx         # Profile components
│   ├── sidebar.tsx           # Left sidebar
│   └── right-sidebar.tsx     # Right sidebar
├── lib/                      # Utilities and configurations
│   ├── db/                   # Database setup
│   │   └── schema/           # Database schemas
│   ├── auth.ts               # Better Auth configuration
│   ├── auth-client.ts        # Client-side auth
│   ├── db.ts                 # Database client
│   └── utils.ts              # Utility functions
└── middleware.ts             # Next.js middleware

```

## Database Schema

The application uses the following database tables:

- **user**: User accounts (from Better Auth)
- **session**: User sessions (from Better Auth)
- **account**: OAuth accounts (from Better Auth)
- **posts**: User posts
- **postLikes**: Post likes
- **comments**: Post comments
- **connections**: User connections (network)
- **conversations**: Message conversations
- **conversationParticipants**: Conversation participants
- **messages**: Direct messages
- **notifications**: User notifications
- **profiles**: Extended user profiles

## API Routes

### Posts
- `GET /api/posts` - Get feed posts (paginated)
- `POST /api/posts` - Create a new post
- `GET /api/posts/[postId]` - Get a single post
- `PATCH /api/posts/[postId]` - Update a post
- `DELETE /api/posts/[postId]` - Delete a post
- `POST /api/posts/[postId]/like` - Like a post
- `DELETE /api/posts/[postId]/like` - Unlike a post
- `GET /api/posts/[postId]/comments` - Get post comments
- `POST /api/posts/[postId]/comments` - Add a comment

### Connections
- `GET /api/connections` - Get user connections
- `POST /api/connections` - Send connection request
- `PATCH /api/connections/[connectionId]` - Accept/reject request
- `DELETE /api/connections/[connectionId]` - Remove connection
- `GET /api/connections/suggestions` - Get suggested connections

### Messages
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages/conversations` - Create conversation
- `GET /api/messages/conversations/[conversationId]` - Get messages
- `POST /api/messages/conversations/[conversationId]/messages` - Send message
- `POST /api/messages/conversations/[conversationId]/read` - Mark as read

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications` - Mark all as read
- `POST /api/notifications/[notificationId]/read` - Mark one as read

### Profiles
- `GET /api/profiles` - Get current user profile
- `GET /api/profiles/[userId]` - Get user profile
- `PATCH /api/profiles/[userId]` - Update profile

### Search
- `GET /api/search?q=query&type=all|users|posts` - Search

## Development

### Database commands

```bash
# Push schema to database
bun run db:push

# Seed database with mock data
bun run db:seed

# Open Drizzle Studio (database GUI)
bun run db:studio

# Generate migration
bunx drizzle-kit generate
```

The seed script creates:
- 8 mock users with profiles
- 15 posts with varied content
- Random connections between users
- Likes on posts (1-5 per post)
- Comments on posts (0-4 per post)
- Notifications for likes, comments, and connections

### Code formatting

```bash
# Format with Biome
bunx @biomejs/biome format --write .

# Lint with Biome
bunx @biomejs/biome lint .
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` to your production URL
5. Update GitHub OAuth callback URL to your production domain
6. Deploy!

## License

MIT
# vibeware-demo
