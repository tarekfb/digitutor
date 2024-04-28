import { pgTable, integer, text, uuid, timestamp } from "drizzle-orm/pg-core";
import  type { ExtractTablesWithRelations } from "drizzle-orm";
import * as schema from './schema.ts'

export const subjectsTable = pgTable("subjects", {
  id: integer("id").primaryKey(),
  name: text("title").notNull(),
});

export const rolesTable = pgTable("roles", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
});

export const profilesTable = pgTable("profiles", {
  userId: uuid("id").primaryKey(),
  role: integer("role").references(() => rolesTable.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  fullName: text("full_name"),
  companyName: text("company_name"),
  avatarUrl: text("avatar_url"),
  website: text("website"),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }),
});



export type RawTableNames = keyof ExtractTablesWithRelations<typeof schema>;

