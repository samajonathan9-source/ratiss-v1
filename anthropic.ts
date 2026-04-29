import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db/schema";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { desc, eq, asc } from "drizzle-orm";
import {
  CreateAnthropicConversationBody,
  SendAnthropicMessageBody,
  GetAnthropicConversationParams,
  ListAnthropicMessagesParams,
  SendAnthropicMessageParams,
  DeleteAnthropicConversationParams,
} from "@workspace/api-zod";
import { buildEnrichedSystemPrompt } from "../lib/system-prompt";
import { findRelevantContext } from "../lib/reddit-context";
import { asyncHandler } from "../lib/error-handler";
import { chatLimiter } from "../lib/rate-limit";

const router: IRouter = Router();

router.get(
  "/anthropic/conversations",
  asyncHandler(async (_req, res) => {
    const rows = await db
      .select()
      .from(conversations)
      .orderBy(desc(conversations.createdAt));
    res.json(rows);
  }),
);

router.post(
  "/anthropic/conversations",
  asyncHandler(async (req, res) => {
    const parsed = CreateAnthropicConversationBody.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: "Invalid body", details: parsed.error.flatten() });
      return;
    }
    const [created] = await db
      .insert(conversations)
      .values({ title: parsed.data.title })
      .returning();
    res.status(201).json(created);
  }),
);

router.get(
  "/anthropic/conversations/:id",
  asyncHandler(async (req, res) => {
    const params = GetAnthropicConversationParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, params.data.id));
    if (!conversation) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, params.data.id))
      .orderBy(asc(messages.createdAt));
    res.json({ ...conversation, messages: msgs });
  }),
);

router.delete(
  "/anthropic/conversations/:id",
  asyncHandler(async (req, res) => {
    const params = DeleteAnthropicConversationParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db
      .delete(conversations)
      .where(eq(conversations.id, params.data.id));
    res.status(204).send();
  }),
);

router.get(
  "/anthropic/conversations/:id/messages",
  asyncHandler(async (req, res) => {
    const params = ListAnthropicMessagesParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const rows = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, params.data.id))
      .orderBy(asc(messages.createdAt));
    res.json(rows);
  }),
);

router.post(
  "/anthropic/conversations/:id/messages",
  chatLimiter,
  asyncHandler(async (req, res) => {
    const params = SendAnthropicMessageParams.safeParse(req.params);
    const body = SendAnthropicMessageBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, params.data.id));
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    await db.insert(messages).values({
      conversationId: params.data.id,
      role: "user",
      content: body.data.content,
    });

    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, params.data.id))
      .orderBy(asc(messages.createdAt));

    // v1.0 — consultation de la base reddit_conversations pour enrichir le contexte
    const context = await findRelevantContext(body.data.content, 3);
    const systemPrompt = buildEnrichedSystemPrompt(context);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    const send = (data: unknown) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    let assistantText = "";
    try {
      const stream = await anthropic.messages.stream({
        model: "claude-sonnet-4-5",
        max_tokens: 2048,
        system: systemPrompt,
        messages: history.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      });

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          assistantText += event.delta.text;
          send({ content: event.delta.text });
        }
      }

      await db.insert(messages).values({
        conversationId: params.data.id,
        role: "assistant",
        content: assistantText,
      });

      send({ done: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      req.log?.error({ err }, "Chat stream failed");
      send({ error: message });
    } finally {
      res.end();
    }
  }),
);

export default router;
