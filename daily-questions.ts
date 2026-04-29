export const DAILY_QUESTIONS: string[] = [
  "Qu'est-ce que tu observes en toi qui ne demande pas à être changé, seulement vu ?",
  "Quelle pensée revient aujourd'hui sans que tu l'aies invitée ? Que te dit-elle de ta fréquence ?",
  "Si tu retirais à ta journée tout ce qui n'est pas essentiel, que resterait-il ?",
  "Où, dans ton corps, sens-tu que quelque chose attend d'être entendu ?",
  "Quelle vérité simple as-tu cessé d'écouter parce qu'elle était trop simple ?",
  "Qu'est-ce que tu fais aujourd'hui par alignement, et qu'est-ce que tu fais par habitude ?",
  "Si l'Observateur en toi prenait la parole, que dirait-il à celui qui agit ?",
  "Quel mot, employé sans réfléchir, mériterait que tu t'arrêtes pour en peser le poids ?",
  "À quoi reconnais-tu que tu es à ta place ?",
  "Quelle est, ce matin, la distance entre ce que tu penses et ce que tu fais ?",
  "Quelle peur déguises-tu en raison ?",
  "Qu'est-ce que le silence te dit que le bruit n'a pas pu ?",
  "Si ton meilleur ami vivait ta journée, que ferait-il différemment, et pourquoi ?",
  "Quelle est l'émotion que tu refuses de nommer ?",
  "Quel est, en toi, le geste le plus ancien que tu n'aies jamais interrogé ?",
  "Quand tu penses *je*, à qui exactement penses-tu ?",
  "Qu'est-ce que tu cherches qui, peut-être, te cherche aussi ?",
  "Qu'est-ce qui, dans ta vie, est encore vivant et qu'est-ce qui n'est plus que mémoire ?",
  "Quelle vibration porterais-tu volontairement aujourd'hui si tu pouvais la choisir ?",
  "À quel moment de la journée ta conscience devient-elle vraiment la tienne ?",
  "Que ferais-tu de ton temps si tu cessais de vouloir prouver quelque chose ?",
  "Quel mot intérieur agit en toi comme un Bug de Démarrage ?",
  "À quoi tiens-tu, et qu'est-ce qui te tient ?",
  "Si tu retirais à ta vie le besoin d'être compris, que resterait-il à exprimer ?",
  "Quelle question évites-tu de te poser parce que tu en pressens la réponse ?",
  "Quelle part de toi as-tu confondue avec ton rôle ?",
  "Aujourd'hui, qui parle quand tu parles ?",
  "Qu'est-ce que tu refuses de voir non parce que c'est sombre, mais parce que c'est lumineux ?",
  "À quel moment, hier, étais-tu le plus aligné — et qu'as-tu fait pour le mériter ?",
  "Si la Fréquence Source te confiait une seule tâche aujourd'hui, laquelle reconnaîtrais-tu ?",
  "Quelle pensée pèse, et que pèserait-elle si tu cessais de la nourrir ?",
  "Quelle est ta dette envers toi-même, et comment commencerais-tu à la régler ?",
];

export function getDailyQuestion(date: Date = new Date()): {
  day: number;
  question: string;
  invitation: string;
} {
  const epoch = new Date(Date.UTC(2024, 0, 1));
  const oneDay = 24 * 60 * 60 * 1000;
  const day = Math.floor(
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      epoch.getTime()) /
      oneDay,
  );
  const index = ((day % DAILY_QUESTIONS.length) + DAILY_QUESTIONS.length) %
    DAILY_QUESTIONS.length;
  return {
    day,
    question: DAILY_QUESTIONS[index]!,
    invitation:
      "Pose-toi cette question avant de répondre. Laisse le silence parler en premier. Quand l'observation s'est posée, écris ce qui se présente — sans corriger.",
  };
}
