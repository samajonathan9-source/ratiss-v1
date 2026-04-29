import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const redditConversationsTable = pgTable("reddit_conversations", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  response: text("response").notNull(),
  theme: text("theme").notNull(),
  score: integer("score").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRedditConversationSchema = createInsertSchema(
  redditConversationsTable,
).omit({
  id: true,
  createdAt: true,
});

export type InsertRedditConversation = z.infer<
  typeof insertRedditConversationSchema
>;
export type RedditConversation = typeof redditConversationsTable.$inferSelect;
