// src/utils/AppError.ts
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

// helpers
export const badRequest   = (code: string, msg: string, d?: unknown) => new AppError(code, 400, msg, d);
export const notFound     = (code: string, msg: string, d?: unknown) => new AppError(code, 404, msg, d);
export const paymentReq   = (code: string, msg: string, d?: unknown) => new AppError(code, 402, msg, d);
export const upstreamFail = (code: string, msg: string, d?: unknown) => new AppError(code, 502, msg, d);
