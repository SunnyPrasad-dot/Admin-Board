import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const photographersTable = pgTable("photographers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  specialization: text("specialization").notNull(),
  experience: integer("experience").notNull().default(0),
  status: text("status").notNull().default("available"),
  avatarUrl: text("avatar_url"),
  workingDays: text("working_days").array().notNull().default([]),
  city: text("city").notNull(),
  bio: text("bio"),
  skills: text("skills").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPhotographerSchema = createInsertSchema(photographersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPhotographer = z.infer<typeof insertPhotographerSchema>;
export type Photographer = typeof photographersTable.$inferSelect;
