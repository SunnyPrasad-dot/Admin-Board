import { Router } from "express";
import { db, addonsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const addons = await db.select().from(addonsTable);
  res.json(addons.map(a => ({ ...a, price: Number(a.price) })));
});

router.post("/", async (req, res) => {
  const { name, price, description } = req.body;
  const inserted = await db.insert(addonsTable).values({ name, price: String(price), description }).returning();
  res.status(201).json({ ...inserted[0], price: Number(inserted[0].price) });
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, price, description } = req.body;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (price !== undefined) updates.price = String(price);
  if (description !== undefined) updates.description = description;

  const updated = await db.update(addonsTable).set(updates).where(eq(addonsTable.id, id)).returning();
  if (!updated[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...updated[0], price: Number(updated[0].price) });
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(addonsTable).where(eq(addonsTable.id, id));
  res.status(204).send();
});

export default router;
