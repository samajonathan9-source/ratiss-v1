import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { redditConversationsTable } from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { asyncHandler } from "../lib/error-handler";

const router: IRouter = Router();

const adminTokenGuard = (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    res.status(503).json({
      error:
        "ADMIN_TOKEN n'est pas configuré côté serveur. Définis-le dans les variables d'environnement pour gérer la base reddit_conversations.",
    });
    return;
  }
  const provided = req.header("x-admin-token");
  if (provided !== expected) {
    res.status(401).json({ error: "Token admin invalide." });
    return;
  }
  next();
};

const RedditEntryBody = z.object({
  question: z.string().min(3),
  response: z.string().min(3),
  theme: z.string().min(2),
  score: z.number().int().min(0).optional(),
});

router.get(
  "/reddit-conversations",
  asyncHandler(async (_req, res) => {
    const rows = await db
      .select({
        id: redditConversationsTable.id,
        question: redditConversationsTable.question,
        response: redditConversationsTable.response,
        theme: redditConversationsTable.theme,
        score: redditConversationsTable.score,
        createdAt: redditConversationsTable.createdAt,
      })
      .from(redditConversationsTable)
      .orderBy(desc(redditConversationsTable.score))
      .limit(200);
    res.json(rows);
  }),
);

router.post(
  "/reddit-conversations",
  adminTokenGuard,
  asyncHandler(async (req, res) => {
    const parsed = RedditEntryBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Données invalides", details: parsed.error.flatten() });
      return;
    }
    const [created] = await db
      .insert(redditConversationsTable)
      .values({
        question: parsed.data.question,
        response: parsed.data.response,
        theme: parsed.data.theme.toLowerCase(),
        score: parsed.data.score ?? 0,
      })
      .returning();
    res.status(201).json(created);
  }),
);

router.delete(
  "/reddit-conversations/:id",
  adminTokenGuard,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "ID invalide." });
      return;
    }
    await db.delete(redditConversationsTable).where(eq(redditConversationsTable.id, id));
    res.status(204).send();
  }),
);

export default router;
