import { env } from "./config/env";
import { buildApp } from "./app";

const app = buildApp();
const server = app.listen(env.PORT, () => {
    console.log(`✅ Backend running at http://localhost:${env.PORT}`);
  });

process.on("SIGINT", () => server.close(() => process.exit(0)));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
