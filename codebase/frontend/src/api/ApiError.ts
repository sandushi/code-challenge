// src/api/ApiError.ts
export class ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;

  constructor(message: string, opts?: { status?: number; code?: string; details?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.statusCode = opts?.status;
    this.code = opts?.code;
    this.details = opts?.details;
  }
}
