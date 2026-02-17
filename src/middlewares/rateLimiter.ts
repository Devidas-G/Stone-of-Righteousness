import { Request, Response, NextFunction } from "express";
import config from "../config/configService";

type RecordEntry = { count: number; resetTime: number };

const WINDOW_MS = config.getNumber("RATE_LIMIT_WINDOW_MS", 60_000) as number; // default 1 minute
const MAX_REQUESTS = config.getNumber("RATE_LIMIT_MAX", 100) as number; // default 100 requests per window

const store = new Map<string, RecordEntry>();

// periodic cleanup to avoid memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime <= now) store.delete(key);
  }
}, WINDOW_MS).unref?.();

export default function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  const record = store.get(ip);
  if (!record || record.resetTime <= now) {
    // start a new window
    store.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  record.count += 1;
  if (record.count > MAX_REQUESTS) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000) || 1;
    res.setHeader("Retry-After", String(retryAfterSec));
    res.status(429).json({ message: "Too many requests, please try again later." });
    return;
  }

  store.set(ip, record);
  return next();
}
