import { pgTable, text, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { photographersTable } from "./photographers";
import { packagesTable } from "./packages";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  clientEmail: text("client_email").notNull(),
  eventType: text("event_type").notNull(),
  eventDate: text("event_date").notNull(),
  endDate: text("end_date"),
  location: text("location").notNull(),
  status: text("status").notNull().default("new"),
  assignedPhotographerId: integer("assigned_photographer_id").references(() => photographersTable.id),
  packageId: integer("package_id").references(() => packagesTable.id),
  addons: text("addons").array().notNull().default([]),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const bookingDaysTable = pgTable("booking_days", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookingsTable.id),
  dayNumber: integer("day_number").notNull(),
  date: text("date").notNull(),
  details: text("details").notNull(),
  photographerId: integer("photographer_id").references(() => photographersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;

export const insertBookingDaySchema = createInsertSchema(bookingDaysTable).omit({ id: true, createdAt: true });
export type InsertBookingDay = z.infer<typeof insertBookingDaySchema>;
export type BookingDay = typeof bookingDaysTable.$inferSelect;
