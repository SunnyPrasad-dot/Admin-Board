import { Router } from "express";
import { db, photographersTable, bookingsTable, bookingDaysTable } from "@workspace/db";
import { eq, ilike, and, SQL, count } from "drizzle-orm";

const router = Router();

router.get("/available", async (req, res) => {
  const { date } = req.query;
  if (!date || typeof date !== "string") {
    res.status(400).json({ error: "date query parameter required" });
    return;
  }

  const allPhotographers = await db.select().from(photographersTable);

  // Find photographers with bookings on this date
  const bookedOnDate = await db
    .select({ photographerId: bookingDaysTable.photographerId })
    .from(bookingDaysTable)
    .where(eq(bookingDaysTable.date, date));

  const bookedIds = new Set(bookedOnDate.map(b => b.photographerId).filter(Boolean));

  const bookings = await db.select().from(bookingsTable);

  const available = allPhotographers.filter(p => p.status === "available" && !bookedIds.has(p.id));
  const unavailable = allPhotographers.filter(p => p.status !== "available" || bookedIds.has(p.id));

  // Get reason for unavailable
  const unavailableWithReason = unavailable.map(p => {
    let reason = p.status === "busy" ? "Currently busy" : "Unavailable";
    if (bookedIds.has(p.id)) {
      const booking = bookings.find(b => b.assignedPhotographerId === p.id);
      if (booking) reason = `Booked on ${booking.eventDate} • ${booking.eventType}`;
    }
    return {
      id: p.id,
      name: p.name,
      specialization: p.specialization,
      avatarUrl: p.avatarUrl,
      reason,
    };
  });

  res.json({
    available: available.map(p => ({
      ...p,
      currentBookingCount: bookings.filter(b => b.assignedPhotographerId === p.id && b.status !== "confirmed").length,
    })),
    unavailable: unavailableWithReason,
  });
});

router.get("/", async (req, res) => {
  const { status, search } = req.query;
  const conditions: SQL[] = [];

  if (status && typeof status === "string") conditions.push(eq(photographersTable.status, status));
  if (search && typeof search === "string") conditions.push(ilike(photographersTable.name, `%${search}%`));

  const photographers = conditions.length
    ? await db.select().from(photographersTable).where(and(...conditions))
    : await db.select().from(photographersTable);

  const bookings = await db.select({ assignedId: bookingsTable.assignedPhotographerId }).from(bookingsTable);
  const bookingCounts: Record<number, number> = {};
  for (const b of bookings) {
    if (b.assignedId) bookingCounts[b.assignedId] = (bookingCounts[b.assignedId] || 0) + 1;
  }

  res.json(photographers.map(p => ({
    ...p,
    currentBookingCount: bookingCounts[p.id] ?? 0,
  })));
});

router.post("/", async (req, res) => {
  const { name, email, phone, specialization, experience, workingDays, city, bio, skills } = req.body;
  const inserted = await db.insert(photographersTable).values({
    name, email, phone, specialization, experience: experience ?? 0,
    workingDays: workingDays ?? [], city, bio, skills: skills ?? [], status: "available",
  }).returning();
  res.status(201).json({ ...inserted[0], currentBookingCount: 0 });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const photographers = await db.select().from(photographersTable).where(eq(photographersTable.id, id));
  if (!photographers[0]) { res.status(404).json({ error: "Not found" }); return; }

  const p = photographers[0];
  const allBookings = await db.select().from(bookingsTable).where(eq(bookingsTable.assignedPhotographerId, id));

  const completedShoots = allBookings.filter(b => b.status === "confirmed").map(b => ({
    id: b.id, eventType: b.eventType, date: b.eventDate, clientName: b.clientName, location: b.location,
  }));
  const upcomingBookings = allBookings.filter(b => b.status !== "confirmed").map(b => ({
    id: b.id, eventType: b.eventType, date: b.eventDate, clientName: b.clientName, location: b.location, status: b.status,
  }));

  res.json({
    ...p,
    currentBookingCount: allBookings.filter(b => b.status !== "confirmed").length,
    completedShoots,
    upcomingBookings,
  });
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, phone, specialization, experience, status, workingDays, city, bio, skills } = req.body;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (phone !== undefined) updates.phone = phone;
  if (specialization !== undefined) updates.specialization = specialization;
  if (experience !== undefined) updates.experience = experience;
  if (status !== undefined) updates.status = status;
  if (workingDays !== undefined) updates.workingDays = workingDays;
  if (city !== undefined) updates.city = city;
  if (bio !== undefined) updates.bio = bio;
  if (skills !== undefined) updates.skills = skills;

  const updated = await db.update(photographersTable).set(updates).where(eq(photographersTable.id, id)).returning();
  if (!updated[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...updated[0], currentBookingCount: 0 });
});

export default router;
