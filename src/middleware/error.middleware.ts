import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { InputValidationError } from "../services/interpreter.service.js";

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, "Route not found"));
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error instanceof InputValidationError || error instanceof ZodError) {
    return res.status(400).json({ error: error.message });
  }

  console.error("Unhandled server error:", error);

  return res.status(500).json({
    error: "Failed to execute restaurant search",
  });
}
