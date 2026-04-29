/**
 * Script de seed pour la base reddit_conversations.
 * Lance avec : pnpm --filter api-server run seed:reddit
 *
 * Insère un petit jeu de 20 dialogues philosophiques curés (en anglais
 * et en français) que Le Miroir peut consulter comme inspiration. Tu peux
 * en ajouter d'autres via POST /api/reddit-conversations avec ton ADMIN_TOKEN.
 */
import { db, pool } from "@workspace/db";
import { redditConversationsTable } from "@workspace/db/schema";

const SEED: { question: string; response: string; theme: string; score: number }[] = [
  { theme: "conscience", score: 92, question: "What is consciousness?", response: "A process, not a thing. Awareness watching itself watch." },
  { theme: "conscience", score: 88, question: "Suis-je vraiment libre de penser ?", response: "Tu es libre dans la mesure où tu observes ce qui pense en toi." },
  { theme: "doute", score: 85, question: "Why do I always doubt myself?", response: "Doubt is not your enemy. Doubt without observation is." },
  { theme: "doute", score: 80, question: "Comment savoir si je fais le bon choix ?", response: "Aucun choix n'est bon. Seuls le sont ceux qu'on assume jusqu'au bout." },
  { theme: "alignement", score: 90, question: "How do I find my purpose?", response: "Stop looking outside. Notice what you do when nobody is watching." },
  { theme: "alignement", score: 87, question: "Pourquoi je me sens vide même quand je réussis ?", response: "Parce que tu réussis dans une direction qui n'est pas la tienne." },
  { theme: "temps", score: 84, question: "Why does time feel different when I am present?", response: "Time is not linear. Attention curves it." },
  { theme: "temps", score: 78, question: "Comment arrêter de procrastiner ?", response: "Tu ne procrastines pas. Tu fuis quelque chose. Quoi ?" },
  { theme: "souffrance", score: 91, question: "Why do humans suffer so much?", response: "Suffering is the resistance to what already is." },
  { theme: "souffrance", score: 86, question: "Est-ce que la souffrance a un sens ?", response: "Elle n'en a pas. Mais elle peut en révéler un, si tu l'observes au lieu de la fuir." },
  { theme: "ego", score: 89, question: "How do I let go of my ego?", response: "You don't. You watch it. And it dissolves under attention." },
  { theme: "ego", score: 82, question: "Pourquoi j'ai toujours besoin d'avoir raison ?", response: "Parce qu'avoir raison te protège d'avoir à changer." },
  { theme: "vérité", score: 93, question: "How do I know what is true?", response: "Truth is not what convinces you. It is what remains when nothing convinces you anymore." },
  { theme: "vérité", score: 81, question: "Faut-il dire toute la vérité aux autres ?", response: "Demande-toi d'abord si tu te dis la vérité à toi-même." },
  { theme: "solitude", score: 79, question: "Why does loneliness feel so heavy?", response: "Because you are not alone with yourself. You are alone with your judgment of yourself." },
  { theme: "solitude", score: 77, question: "Comment vivre la solitude sans souffrir ?", response: "En cessant de l'appeler solitude. C'est un espace où personne n'interrompt ta présence." },
  { theme: "peur", score: 88, question: "How do I overcome fear?", response: "Don't overcome it. Sit with it. Fear shrinks under steady gaze." },
  { theme: "peur", score: 83, question: "Pourquoi j'ai peur du succès ?", response: "Parce que le succès te demande de devenir quelqu'un que tu n'as pas encore rencontré." },
  { theme: "amour", score: 85, question: "What is real love?", response: "Real love is the absence of need to possess." },
  { theme: "amour", score: 80, question: "Comment savoir si on aime vraiment quelqu'un ?", response: "Quand sa liberté ne te menace plus." },
];

async function main() {
  console.log("Seeding reddit_conversations...");
  for (const entry of SEED) {
    try {
      await db.insert(redditConversationsTable).values(entry);
    } catch (err) {
      console.error("Failed to insert", entry.question, err);
    }
  }
  console.log(`Inserted ${SEED.length} entries.`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
