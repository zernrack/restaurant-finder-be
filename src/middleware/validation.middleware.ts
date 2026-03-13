import type { Request, Response, NextFunction } from "express";
import { HttpError } from "./error.middleware.js";

export function validateAuth(req: Request, res: Response, next: NextFunction) {
  const code = req.query.code as string | undefined;

  if (code !== "pioneerdevai") {
    return next(new HttpError(401, "Unauthorized"));
  }

  next();
}
