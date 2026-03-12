import { Router } from "express";
import { validateAuth } from "../middleware/validation.middleware.js";
import { executeController } from "../controllers/execute.controller.js";

const executeRoutes = Router();

executeRoutes.get("/execute", validateAuth, executeController);

export default executeRoutes;
