import express from "express";
import cors from "cors";
import executeRoutes from "./routes/execute.routes.js";
import { getPort } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

const app = express();
const PORT = getPort();

app.use(cors());
app.use(express.json());

app.use("/api", executeRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
});
