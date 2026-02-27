import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Example users table schema
 *
 * Customize this schema for your application.
 * Run `deno task db:generate` after changes to create migrations.
 */
export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Type inference helpers
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
