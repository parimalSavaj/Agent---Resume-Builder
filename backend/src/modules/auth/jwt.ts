import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { AccessTokenPayload, RefreshTokenPayload } from "./auth.types";

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  } as SignOptions);
}

export function signRefreshToken(payload: AccessTokenPayload): string {
  // jti makes every refresh token unique even if issued within the same
  // second for the same user, so rotation always produces a distinct token.
  const withJti: RefreshTokenPayload = { ...payload, jti: crypto.randomUUID() };
  return jwt.sign(withJti, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  } as SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as RefreshTokenPayload;
}

/** Computes a Date this far in the future based on a "7d" / "15m" style duration string. */
export function expiryDateFromNow(duration: string): Date {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) {
    // Fallback: default to 7 days if the format is unexpected
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  const amount = Number(match[1]);
  const unit = match[2];
  const unitMs: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() + amount * unitMs[unit]);
}
