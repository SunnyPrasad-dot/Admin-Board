import { Router } from "express";
import { db, bookingsTable, bookingDaysTable, photographersTable, packagesTable } from "@workspace/db";
import { eq, ilike, and, gte, lte, SQL } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const { status, eventType, dateFrom, dateTo, search } = req.query;
  const conditions: SQL[] = [];

  if (status && typeof status === "string") conditions.push(eq(bookingsTable.status, status));
  if (eventType && typeof eventType === "string") conditions.push(eq(bookingsTable.eventType, eventType));
  if (dateFrom && typeof dateFrom === "string") conditions.push(gte(bookingsTable.eventDate, dateFrom));
  if (dateTo && typeof dateTo === "string") conditions.push(lte(bookingsTable.eventDate, dateTo));
  if (search && typeof search === "string") conditions.push(ilike(bookingsTable.clientName, `%${search}%`));

  const bookings = conditions.length
    ? await db.select().from(bookingsTable).where(and(...conditions))
    : await db.select().from(bookingsTable);

  // Join photographer names
  const photographers = await db.select({ id: photographersTable.id, name: photographersTable.name }).from(photographersTable);
  const photoMap = Object.fromEntries(photographers.map(p => [p.id, p.name]));

  const packages = await db.select({ id: packagesTable.id, name: packagesTable.name }).from(packagesTable);
  const pkgMap = Object.fromEntries(packages.map(p => [p.id, p.name]));

  res.json(bookings.map(b => ({
    ...b,
    totalPrice: b.totalPrice ? Number(b.totalPrice) : null,
    assignedPhotographerName: b.assignedPhotographerId ? photoMap[b.assignedPhotographerId] ?? null : null,
    packageName: b.packageId ? pkgMap[b.packageId] ?? null : null,
  })));
});

router.post("/", async (req, res) => {
  const { clientName, clientPhone, clientEmail, eventType, eventDate, endDate, location, packageId, notes } = req.body;
  const inserted = await db.insert(bookingsTable).values({
    clientName, clientPhone, clientEmail, eventType, eventDate, endDate, location,
    packageId: packageId ?? null, notes, status: "new",
  }).returning();
  res.status(201).json({ ...inserted[0], totalPrice: null });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
  if (!bookings[0]) { res.status(404).json({ error: "Not found" }); return; }

  const days = await db.select().from(bookingDaysTable).where(eq(bookingDaysTable.bookingId, id));
  const photographers = await db.select({ id: photographersTable.id, name: photographersTable.name }).from(photographersTable);
  const photoMap = Object.fromEntries(photographers.map(p => [p.id, p.name]));

  const packages = await db.select({ id: packagesTable.id, name: packagesTable.name }).from(packagesTable);
  const pkgMap = Object.fromEntries(packages.map(p => [p.id, p.name]));

  const b = bookings[0];
  res.json({
    ...b,
    totalPrice: b.totalPrice ? Number(b.totalPrice) : null,
    assignedPhotographerName: b.assignedPhotographerId ? photoMap[b.assignedPhotographerId] ?? null : null,
    packageName: b.packageId ? pkgMap[b.packageId] ?? null : null,
    addons: b.addons ?? [],
    days: days.map(d => ({
      dayNumber: d.dayNumber,
      date: d.date,
      details: d.details,
      photographerId: d.photographerId,
      photographerName: d.photographerId ? photoMap[d.photographerId] ?? null : null,
    })),
  });
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { status, assignedPhotographerId, notes } = req.body;
  const updates: Record<string, unknown> = {};
  if (status !== undefined) updates.status = status;
  if (assignedPhotographerId !== undefined) updates.assignedPhotographerId = assignedPhotographerId;
  if (notes !== undefined) updates.notes = notes;

  const updated = await db.update(bookingsTable).set(updates).where(eq(bookingsTable.id, id)).returning();
  if (!updated[0]) { res.status(404).json({ error: "Not found" }); return; }

  const photographers = await db.select({ id: photographersTable.id, name: photographersTable.name }).from(photographersTable);
  const photoMap = Object.fromEntries(photographers.map(p => [p.id, p.name]));
  const b = updated[0];
  res.json({
    ...b,
    totalPrice: b.totalPrice ? Number(b.totalPrice) : null,
    assignedPhotographerName: b.assignedPhotographerId ? photoMap[b.assignedPhotographerId] ?? null : null,
  });
});

router.post("/:id/assign", async (req, res) => {
  const bookingId = Number(req.params.id);
  const { dayNumber, photographerId } = req.body;

  // Update or create the day assignment
  const existing = await db.select()
    .from(bookingDaysTable)
    .where(and(eq(bookingDaysTable.bookingId, bookingId), eq(bookingDaysTable.dayNumber, dayNumber)));

  if (existing[0]) {
    await db.update(bookingDaysTable)
      .set({ photographerId })
      .where(and(eq(bookingDaysTable.bookingId, bookingId), eq(bookingDaysTable.dayNumber, dayNumber)));
  }

  // Update booking status to assigned if not already confirmed
  const bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.id, bookingId));
  if (!bookings[0]) { res.status(404).json({ error: "Not found" }); return; }

  const b = bookings[0];
  if (b.status === "new" || b.status === "pending") {
    await db.update(bookingsTable).set({ status: "assigned", assignedPhotographerId: photographerId }).where(eq(bookingsTable.id, bookingId));
  }

  const updated = await db.select().from(bookingsTable).where(eq(bookingsTable.id, bookingId));
  res.json({ ...updated[0], totalPrice: updated[0].totalPrice ? Number(updated[0].totalPrice) : null });
});

export default router;
