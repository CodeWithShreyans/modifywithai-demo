import { sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { user } from "./auth"

export const connections = sqliteTable("connections", {
	id: text("id").primaryKey(),
	requesterId: text("requester_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	addresseeId: text("addressee_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	status: text("status", { enum: ["pending", "accepted", "rejected"] })
		.notNull()
		.default("pending"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull(),
})

