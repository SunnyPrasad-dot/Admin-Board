import { Router } from "express";
import { db, bookingsTable, inquiriesTable, photographersTable } from "@workspace/db";
import { eq, count, desc } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req, res) => {
  const [totalBookings] = await db.select({ count: count() }).from(bookingsTable);
  const [confirmedBookings] = await db
    .select({ count: count() })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "confirmed"));
  const [totalInquiries] = await db.select({ count: count() }).from(inquiriesTable);
  const [availablePhotographers] = await db
    .select({ count: count() })
    .from(photographersTable)
    .where(eq(photographersTable.status, "available"));

  const recentBookings = await db
    .select()
    .from(bookingsTable)
    .orderBy(desc(bookingsTable.createdAt))
    .limit(5);

  const allBookings = await db.select({ status: bookingsTable.status }).from(bookingsTable);
  const statusMap: Record<string, number> = {};
  for (const b of allBookings) {
    statusMap[b.status] = (statusMap[b.status] || 0) + 1;
  }
  const bookingsByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

  const eventTypeMap: Record<string, number> = {};
  const allEventTypes = await db.select({ eventType: bookingsTable.eventType }).from(bookingsTable);
  for (const b of allEventTypes) {
    eventTypeMap[b.eventType] = (eventTypeMap[b.eventType] || 0) + 1;
  }
  const bookingsByEventType = Object.entries(eventTypeMap).map(([eventType, count]) => ({ eventType, count }));

  res.json({
    totalRequests: totalBookings.count,
    confirmedBookings: confirmedBookings.count,
    inquiryRequests: totalInquiries.count,
    availablePhotographers: availablePhotographers.count,
    recentBookings: recentBookings.map(b => ({
      ...b,
      totalPrice: b.totalPrice ? Number(b.totalPrice) : null,
    })),
    bookingsByStatus,
    bookingsByEventType,
  });
});

export default router;
