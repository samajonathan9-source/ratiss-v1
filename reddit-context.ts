import { db } from "@workspace/db";
import { redditConversationsTable } from "@workspace/db/schema";
import { sql, desc } from "drizzle-orm";

/**
 * Récupère jusqu'à `limit` entrées de la base reddit_conversations
 * dont le thème ou la question contient un des mots significatifs
 * du message utilisateur. Utilisé comme contexte d'inspiration
 * pour enrichir la réponse du Miroir.
 */
export async function findRelevantContext(
  userMessage: string,
  limit = 3,
): Promise<{ question: string; response: string; theme: string }[]> {
  const stopwords = new Set([
    "le", "la", "les", "un", "une", "des", "de", "du", "et", "ou", "à",
    "en", "que", "qui", "quoi", "ce", "cette", "ces", "mon", "ma", "mes",
    "ton", "ta", "tes", "son", "sa", "ses", "je", "tu", "il", "elle", "on",
    "nous", "vous", "ils", "elles", "est", "sont", "suis", "es", "été",
    "pour", "par", "avec", "sans", "dans", "sur", "comme", "mais", "donc",
    "car", "ne", "pas", "plus", "moins", "très", "trop", "y", "se", "sa",
    "the", "a", "an", "of", "in", "to", "is", "are", "i", "you", "he",
    "she", "it", "we", "they", "and", "or", "but", "for", "on", "with",
  ]);

  const words = userMessage
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stopwords.has(w))
    .slice(0, 8);

  if (words.length === 0) {
    const random = await db
      .select({
        question: redditConversationsTable.question,
        response: redditConversationsTable.response,
        theme: redditConversationsTable.theme,
      })
      .from(redditConversationsTable)
      .orderBy(sql`random()`)
      .limit(limit);
    return random;
  }

  const conditions = words
    .map((w) => `(lower(theme) LIKE '%${w.replace(/'/g, "''")}%' OR lower(question) LIKE '%${w.replace(/'/g, "''")}%')`)
    .join(" OR ");

  try {
    const rows = await db
      .select({
        question: redditConversationsTable.question,
        response: redditConversationsTable.response,
        theme: redditConversationsTable.theme,
      })
      .from(redditConversationsTable)
      .where(sql.raw(conditions))
      .orderBy(desc(redditConversationsTable.score))
      .limit(limit);
    return rows;
  } catch {
    return [];
  }
}
