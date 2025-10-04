import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { api } from "./routes";
import { errorMiddleware } from "./infra/http/error.middleware";

export function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, max: env.RATE_LIMIT_MAX, standardHeaders: true }));

  app.use("/api/v1", api);
  app.use(errorMiddleware);

  return app;
}
