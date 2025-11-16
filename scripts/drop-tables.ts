import { createClient } from "@libsql/client"

const client = createClient({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN!,
})

function promptConfirmation(): Promise<string> {
	return new Promise((resolve) => {
		process.stdin.setEncoding("utf8")
		process.stdin.resume()

		process.stdout.write(
			"\n⚠️  WARNING: This script will PERMANENTLY DELETE ALL TABLES in your database!\n",
		)
		process.stdout.write("⚠️  This action CANNOT be undone!\n")
		process.stdout.write("\n")
		process.stdout.write("Type YES (in all caps) to confirm: ")

		process.stdin.once("data", (data: string) => {
			process.stdin.pause()
			resolve(data.toString().trim())
		})
	})
}

async function dropAllTables() {
	console.log("🗑️  Starting to drop all tables...")

	try {
		// Disable foreign key checks temporarily to allow dropping tables in any order
		await client.execute("PRAGMA foreign_keys = OFF")

		// Get all table names from sqlite_master
		const tablesResult = await client.execute(
			"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
		)

		const tables = tablesResult.rows as unknown as Array<{ name: string }>

		if (tables.length === 0) {
			console.log("ℹ️  No tables found in the database")
			return
		}

		console.log(`📋 Found ${tables.length} table(s) to drop:`)
		tables.forEach((table) => {
			console.log(`   - ${table.name}`)
		})

		// Drop each table
		for (const table of tables) {
			console.log(`   Dropping table: ${table.name}...`)
			await client.execute(`DROP TABLE IF EXISTS ${table.name}`)
			console.log(`   ✅ Dropped ${table.name}`)
		}

		// Re-enable foreign key checks
		await client.execute("PRAGMA foreign_keys = ON")

		console.log("\n✅ Successfully dropped all tables!")
	} catch (error) {
		console.error("❌ Error dropping tables:", error)
		throw error
	}
}

async function main() {
	try {
		const confirmation = await promptConfirmation()

		if (confirmation !== "YES") {
			console.log(
				"\n❌ Confirmation failed. Expected 'YES' but got:",
				confirmation,
			)
			console.log("❌ Aborting. No tables were dropped.")
			process.exit(0)
		}

		console.log(
			"\n✅ Confirmation received. Proceeding with dropping tables...\n",
		)
		await dropAllTables()
	} catch (error) {
		console.error("❌ Fatal error:", error)
		process.exit(1)
	} finally {
		await client.close()
		console.log("\n✨ Drop tables script finished")
		process.exit(0)
	}
}

main()
