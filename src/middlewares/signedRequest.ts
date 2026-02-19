import { Request, Response, NextFunction } from "express";
import config from "../core/config/configService";
import { verifySignature, makeSigningPayload } from "../core/utils/signer";

const DEFAULT_TOLERANCE_SEC = 300; // 5 minutes

export default function signedRequest(req: Request, res: Response, next: NextFunction) {
  // Skip health endpoint, docs, and public auth endpoints (register, login, anonymous)
  if (
    req.path === "/health" ||
    req.path.startsWith("/docs") ||
    req.path === "/docs"
  ) {
    return next();
  }

  const signature = req.header("x-signature") || req.header("x-hmac-signature");
  const tsHeader = req.header("x-signature-timestamp") || req.header("x-timestamp");

  if (!signature || !tsHeader) {
    return res.status(401).json({ message: "Missing signature headers" });
  }

  const ts = Number(tsHeader);
  if (Number.isNaN(ts)) return res.status(400).json({ message: "Invalid timestamp" });

  const tolerance = config.getNumber("SIGNATURE_TOLERANCE_SEC", DEFAULT_TOLERANCE_SEC) as number;
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - ts) > tolerance) {
    return res.status(401).json({ message: "Signature timestamp outside of allowed window" });
  }

  // rawBody is populated by express.json verify option in app.ts
  const rawBody = (req as any).rawBody;
  const raw = rawBody ? rawBody.toString("utf8") : JSON.stringify(req.body ?? {});

  const payload = makeSigningPayload(ts, raw);
  const secret = config.getSigningSecret();

  const ok = verifySignature(payload, signature, secret);
  if (!ok) return res.status(401).json({ message: "Invalid signature" });
  return next();
}
