import { sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { user } from "./auth"

export const notifications = sqliteTable("notifications", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	type: text("type", {
		enum: [
			"connection_request",
			"connection_accepted",
			"post_like",
			"post_comment",
			"comment_like",
		],
	}).notNull(),
	actorId: text("actor_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	entityId: text("entity_id"),
	entityType: text("entity_type", { enum: ["post", "comment", "connection"] }),
	isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
})

