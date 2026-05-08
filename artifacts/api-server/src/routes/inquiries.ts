import { Router } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { eq, ilike } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const { search } = req.query;
  const inquiries = search && typeof search === "string"
    ? await db.select().from(inquiriesTable).where(ilike(inquiriesTable.name, `%${search}%`))
    : await db.select().from(inquiriesTable);
  res.json(inquiries);
});

router.post("/", async (req, res) => {
  const { name, phone, email, message } = req.body;
  const inserted = await db.insert(inquiriesTable).values({ name, phone, email, message }).returning();
  res.status(201).json(inserted[0]);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const inquiries = await db.select().from(inquiriesTable).where(eq(inquiriesTable.id, id));
  if (!inquiries[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(inquiries[0]);
});

export default router;
