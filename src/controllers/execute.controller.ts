import type { Request, Response } from "express";
import { interpretMessage } from "../services/interpreter.service.js";
import { searchRestaurants } from "../services/foursquare.service.js";

export async function executeController(req: Request, res: Response) {
  try {
    const message = req.query.message;

    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        error: "Query parameter 'message' is required",
      });
    }

    const interpretedParams = await interpretMessage(message);

    const restaurants = await searchRestaurants(interpretedParams);

    return res.status(200).json({
      query: message,
      interpreted_params: interpretedParams,
      results: restaurants,
    });
  } catch (error) {
    console.error("Execute controller error:", error);

    return res.status(500).json({
      error: "Failed to execute restaurant search",
    });
  }
}