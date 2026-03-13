import type { Request, Response } from "express";
import { interpretMessage } from "../services/interpreter.service.js";
import { searchRestaurants } from "../services/foursquare.service.js";
import { HttpError } from "../middleware/error.middleware.js";

export async function executeController(req: Request, res: Response) {
  const message = req.query.message;

  if (typeof message !== "string" || message.trim().length === 0) {
    throw new HttpError(400, "Query parameter 'message' is required");
  }

  const interpretedParams = await interpretMessage(message);

  const restaurants = await searchRestaurants(interpretedParams);

  return res.status(200).json({
    query: message,
    interpreted_params: interpretedParams,
    results: restaurants,
  });
}