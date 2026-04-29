import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { newsletterSubscribersTable as newsletterSubscribers } from "@workspace/db/schema";
import { count, eq } from "drizzle-orm";
import { SubscribeNewsletterBody } from "@workspace/api-zod";
import { asyncHandler } from "../lib/error-handler";
import { newsletterLimiter } from "../lib/rate-limit";

const router: IRouter = Router();

const STRICT_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

router.post(
  "/newsletter",
  newsletterLimiter,
  asyncHandler(async (req, res) => {
    const parsed = SubscribeNewsletterBody.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: "Email invalide", details: parsed.error.flatten() });
      return;
    }
    const email = parsed.data.email.trim().toLowerCase();
    const name = parsed.data.name?.trim() || null;

    if (!STRICT_EMAIL.test(email) || email.length > 254) {
      res.status(400).json({ error: "Format d'email invalide." });
      return;
    }

    const [existing] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email));

    if (existing) {
      res.status(200).json({ alreadySubscribed: true, email });
      return;
    }

    await db.insert(newsletterSubscribers).values({ email, name });
    res.status(201).json({ alreadySubscribed: false, email });
  }),
);

router.get(
  "/newsletter/count",
  asyncHandler(async (_req, res) => {
    const [row] = await db
      .select({ value: count() })
      .from(newsletterSubscribers);
    res.json({ count: row?.value ?? 0 });
  }),
);

export default router;
