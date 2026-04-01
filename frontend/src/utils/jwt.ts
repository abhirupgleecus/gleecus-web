import type { JwtPayload } from "../types/auth";

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

export function decodeJwtPayload(token: string): JwtPayload {
  const segments = token.split(".");

  if (segments.length < 2) {
    throw new Error("Invalid JWT format");
  }

  const rawPayload = decodeBase64Url(segments[1]);
  const payload = JSON.parse(rawPayload) as JwtPayload;
  return payload;
}