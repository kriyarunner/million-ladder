import { createHmac, timingSafeEqual } from "node:crypto";

// Hemmelighed til at signere afmeldingslinks. Genbruger BREVO_API_KEY (server-
// only, eksponeres aldrig) så vi ikke kræver endnu en env-variabel. Kan
// overstyres med UNSUBSCRIBE_SECRET hvis ønsket.
function secret(): string {
  return (
    process.env.UNSUBSCRIBE_SECRET || process.env.BREVO_API_KEY || "ml-fallback"
  );
}

/** Signér en e-mail til brug i et afmeldingslink (?t=...). */
export function signEmail(email: string): string {
  return createHmac("sha256", secret())
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 32);
}

/** Verificér at token matcher e-mailen (timing-safe). */
export function verifyEmailToken(email: string, token: string): boolean {
  if (!token) return false;
  const expected = signEmail(email);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
