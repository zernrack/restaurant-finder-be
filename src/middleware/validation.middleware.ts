import type { Request, Response, NextFunction } from "express";

export function validateAuth(req: Request, res: Response, next: NextFunction) {
  const code = req.query.code as string | undefined;

  if (code !== "pioneerdevai") {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  next();
}
