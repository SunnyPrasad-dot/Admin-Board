import { Router } from "express";
import { db, packagesTable, addonsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// Packages
router.get("/", async (req, res) => {
  const packages = await db.select().from(packagesTable);
  res.json(packages.map(p => ({ ...p, price: Number(p.price) })));
});

router.post("/", async (req, res) => {
  const { name, category, description, price, duration } = req.body;
  const inserted = await db.insert(packagesTable).values({
    name, category, description, price: String(price), duration,
  }).returning();
  res.status(201).json({ ...inserted[0], price: Number(inserted[0].price) });
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, category, description, price, duration } = req.body;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (category !== undefined) updates.category = category;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = String(price);
  if (duration !== undefined) updates.duration = duration;

  const updated = await db.update(packagesTable).set(updates).where(eq(packagesTable.id, id)).returning();
  if (!updated[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...updated[0], price: Number(updated[0].price) });
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(packagesTable).where(eq(packagesTable.id, id));
  res.status(204).send();
});

export default router;
