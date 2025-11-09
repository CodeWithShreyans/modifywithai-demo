# Database Seeding

This directory contains scripts for seeding the database with mock data.

## Usage

### Seed the database

```bash
bun run db:seed
```

or with npm:

```bash
npm run db:seed
```

## What gets created

The seed script populates your database with:

### Users (8 mock users)
- Sarah Chen - Senior Software Engineer
- Michael Rodriguez - Product Manager
- Emily Watson - UX Designer
- David Kim - Full Stack Developer
- Priya Patel - DevOps Engineer
- James Anderson - Tech Lead
- Aisha Mohammed - Data Scientist
- Robert Taylor - CTO

Each user has:
- Profile with headline, bio, location, and website
- Avatar (generated using DiceBear API)
- Email and name

### Posts (15 posts)
- Various tech-related content
- Distributed across different users
- Posted at different times (spread over last few hours)

### Connections
- Random connections between users (50% probability)
- All connections are in "accepted" status
- Creates a realistic social network

### Likes
- Each post gets 1-5 random likes
- Users don't like their own posts
- No duplicate likes from same user

### Comments
- Each post gets 0-4 comments
- Random supportive/engaging comments
- Posted by various users

### Notifications
- Comment notifications for post owners
- Connection accepted notifications
- Mix of read/unread notifications

## Notes

- The script clears existing posts, comments, likes, connections, and profiles before seeding
- Users from real authentication (GitHub OAuth) are preserved
- Each run creates fresh data
- Uses realistic timestamps (recent activity)
- All IDs are randomly generated using the same `generateId()` function as the app

## Customization

To modify the seed data:

1. Edit `mockUsers` array to change user data
2. Edit `mockPostsContent` array to change post content
3. Adjust probabilities in the loops to control data density
4. Modify the timestamp calculations to change activity recency

## Troubleshooting

If you encounter errors:

1. Make sure your database is set up correctly:
   ```bash
   bun run db:push
   ```

2. Check your `.env` file has correct database credentials:
   ```env
   TURSO_DATABASE_URL=...
   TURSO_AUTH_TOKEN=...
   ```

3. Ensure you have network access (for generating avatars)

## After Seeding

Once seeded, you can:

1. Login with GitHub OAuth (your real account)
2. View the feed with mock posts
3. Connect with mock users
4. Comment and like on posts
5. Send messages to mock users
6. See notifications from mock interactions

Your real account will coexist with the mock data!

