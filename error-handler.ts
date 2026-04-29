import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wrapper qui attrape automatiquement les exceptions des handlers async
 * et les passe au middleware d'erreur global. Évite les promesses non gérées.
 */
export function asyncHandler<
  Req extends Request = Request,
  Res extends Response = Response,
>(
  fn: (req: Req, res: Res, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req as Req, res as Res, next)).catch(next);
  };
}

/**
 * Middleware d'erreur global. Journalise et renvoie une réponse propre
 * sans fuite de stack trace.
 */
export function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const message = err instanceof Error ? err.message : "Erreur inconnue";
  req.log?.error({ err, url: req.url, method: req.method }, "Unhandled error");

  if (res.headersSent) {
    res.end();
    return;
  }

  res.status(500).json({
    error: "Une erreur est survenue côté serveur.",
    message: process.env.NODE_ENV === "development" ? message : undefined,
  });
}
