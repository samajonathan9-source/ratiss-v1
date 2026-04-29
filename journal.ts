import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { journalEntriesTable as journalEntries } from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  CreateJournalEntryBody,
  DeleteJournalEntryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/journal", async (_req, res) => {
  const rows = await db
    .select()
    .from(journalEntries)
    .orderBy(desc(journalEntries.createdAt));
  res.json(rows);
});

router.post("/journal", async (req, res) => {
  const parsed = CreateJournalEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
    return;
  }
  const [created] = await db
    .insert(journalEntries)
    .values(parsed.data)
    .returning();
  res.status(201).json(created);
});

router.delete("/journal/:id", async (req, res) => {
  const params = DeleteJournalEntryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(journalEntries).where(eq(journalEntries.id, params.data.id));
  res.status(204).send();
});

export default router;
