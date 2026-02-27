import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

/**
 * PostgreSQL database connection using Drizzle ORM + postgres.js
 *
 * Required environment variable:
 * - DATABASE_URL: PostgreSQL connection string
 */

const DATABASE_URL = Deno.env.get("DATABASE_URL");

if (!DATABASE_URL) {
	console.warn(
		"DATABASE_URL not set. Database queries will fail until configured.",
	);
}

/**
 * PostgreSQL connection pool (postgres.js)
 */
const client = DATABASE_URL
	? postgres(DATABASE_URL, {
		max: 10,
		idle_timeout: 20,
		connect_timeout: 10,
	})
	: (null as never);

/**
 * Drizzle ORM database instance with schema
 */
export const db = DATABASE_URL ? drizzle(client, { schema }) : (null as never);

/**
 * Raw postgres.js client for advanced queries
 */
export const sql = client;

/**
 * Check if database is configured
 */
export function isDatabaseConfigured(): boolean {
	return !!DATABASE_URL;
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
	if (!isDatabaseConfigured()) {
		throw new Error("Database not configured: DATABASE_URL is not set");
	}
	await sql`SELECT 1`;
	return true;
}

/**
 * Close database connection (for graceful shutdown)
 */
export async function closeConnection(): Promise<void> {
	if (client) {
		await client.end();
	}
}
