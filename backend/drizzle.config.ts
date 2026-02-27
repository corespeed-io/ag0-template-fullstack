import { defineConfig } from "drizzle-orm/drizzle-kit";

const DATABASE_URL = Deno.env.get("DATABASE_URL");
if (!DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is required");
}

export default defineConfig({
	schema: "./src/lib/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: DATABASE_URL,
	},
});
