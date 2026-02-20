import crypto from "crypto";

/**
 * Sign a string payload using HMAC-SHA256 and return hex digest.
 * Caller should include a timestamp prefix when signing requests (see middleware).
 */
export function signString(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Verify a signature in constant time.
 */
export function verifySignature(payload: string, signatureHex: string, secret: string): boolean {
  try {
    const expected = signString(payload, secret);
    const sigBuf = Buffer.from(signatureHex, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch (e) {
    return false;
  }
}

/**
 * Helper to produce the canonical payload for signing: `${timestamp}.${rawBody}`
 */
export function makeSigningPayload(timestamp: number | string, rawBody: string) {
  return `${timestamp}.${rawBody}`;
}
