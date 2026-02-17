import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error server-side
  console.error(err);

  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";

  const payload: { message: string; stack?: string } = { message };

  if (process.env.NODE_ENV !== "production" && err?.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}
