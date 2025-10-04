import { Request, Response, NextFunction } from "express";

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = Number(err.statusCode) || Number(err.status) || 500;
  const code   = err.code || (status === 400 ? "BAD_REQUEST" :
                              status === 401 ? "UNAUTHORIZED" :
                              status === 402 ? "PAYMENT_REQUIRED" :
                              status === 404 ? "NOT_FOUND" : "INTERNAL_ERROR");

  const message = status >= 500 ? "Something went wrong" : (err.message || "Request failed");

  res.status(status).json({ error: { status, code, message } });
}
