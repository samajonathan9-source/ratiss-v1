import rateLimit from "express-rate-limit";

/**
 * Limite générale : 100 requêtes par minute par IP.
 * Protège contre les bots et les boucles côté client.
 */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Trop de requêtes. Veuillez patienter un instant." },
});

/**
 * Limite stricte pour le chat du Miroir : 10 messages par minute par IP.
 * Évite les abus et préserve le quota Anthropic.
 */
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error:
      "Le miroir demande une pause. Tu as posé beaucoup de questions très vite. Reviens dans une minute.",
  },
});

/**
 * Limite très stricte pour la newsletter : 3 inscriptions par heure par IP.
 * Anti-spam.
 */
export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Trop d'inscriptions depuis cette adresse." },
});
