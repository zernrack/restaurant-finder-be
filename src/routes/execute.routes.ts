import { Router } from "express";
import { validateAuth } from "../middleware/validation.middleware.js";
import { executeController } from "../controllers/execute.controller.js";
import { asyncHandler } from "../middleware/async-handler.middleware.js";

const executeRoutes = Router();

executeRoutes.get("/execute", validateAuth, asyncHandler(executeController));

export default executeRoutes;
