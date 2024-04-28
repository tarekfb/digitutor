// import { pgTable, integer, text, uuid, timestamp } from "drizzle-orm/pg-core";

// export const subjectTable = pgTable("subjects", {
//   id: integer("id").primaryKey(),
//   name: text("title").notNull(),
// });

// export const roleTable = pgTable("roles", {
//   id: integer("id").primaryKey(),
//   title: text("title").notNull(),
// });

// export const profileTable = pgTable("profiles", {
//   userId: text("id").primaryKey(),
//   role: integer("role").references(() => roleTable.id, {
//     onDelete: "cascade",
//     onUpdate: "cascade",
//   }),
//   fullName: text("full_name"),
//   companyName: text("company_name"),
//   avatarUrl: text("avatar_url"),
//   website: text("website"),
//   updatedAt: timestamp("updated_at", {
//     withTimezone: true,
//     mode: "date",
//   }),
// });

// export type Profile = typeof profileTable.$inferInsert;
// export type Role = typeof roleTable.$inferInsert;
// export type Subject = typeof subjectTable.$inferInsert;
