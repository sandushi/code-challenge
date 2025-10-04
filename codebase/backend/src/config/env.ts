export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 4000),
    RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
    RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX ?? 100)
  } as const;
  