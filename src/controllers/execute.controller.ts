import type { Request, Response } from "express";
import { interpretMessage } from "../services/interpreter.service.js";
import { searchRestaurants } from "../services/foursquare.service.js";

export async function executeController(req: Request, res: Response) {
  try {
    const message = req.query.message as string | undefined;

    if (!message) {
      return res.status(400).json({
        error: "message query parameter required",
      });
    }

    const params = await interpretMessage(message);

    const restaurants = await searchRestaurants(params);

    return res.json({
      query: message,
      interpreted_params: params,
      results: restaurants,
    });
  } catch (error) {
    console.error("Execute controller error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
