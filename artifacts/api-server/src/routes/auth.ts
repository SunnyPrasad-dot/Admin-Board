import { Router } from "express";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { LoginBody } from "@workspace/api-zod";

const router = Router();

// Simple mock password check for demo — in production use bcrypt
function checkPassword(plain: string, hash: string): boolean {
  return plain === hash;
}

router.post("/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { email, password } = parsed.data;

  const admins = await db.select().from(adminsTable).where(eq(adminsTable.email, email));
  const admin = admins[0];

  if (!admin || !checkPassword(password, admin.passwordHash)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const { passwordHash, ...adminData } = admin;
  res.json({ token: `mock-token-${admin.id}`, admin: adminData });
});

router.get("/me", async (req, res) => {
  // Return the first admin for demo
  const admins = await db.select().from(adminsTable);
  if (!admins[0]) {
    res.status(404).json({ error: "Admin not found" });
    return;
  }
  const { passwordHash, ...adminData } = admins[0];
  res.json(adminData);
});

router.put("/me", async (req, res) => {
  const admins = await db.select().from(adminsTable);
  if (!admins[0]) {
    res.status(404).json({ error: "Admin not found" });
    return;
  }
  const { name, email, phone, avatarUrl } = req.body;
  const updated = await db
    .update(adminsTable)
    .set({ name, email, phone, avatarUrl })
    .where(eq(adminsTable.id, admins[0].id))
    .returning();
  const { passwordHash, ...adminData } = updated[0];
  res.json(adminData);
});

export default router;
