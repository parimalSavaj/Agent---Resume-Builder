import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../modules/auth/jwt";
import { AccessTokenPayload } from "../modules/auth/auth.types";

export interface AuthenticatedRequest extends Request {
  user?: AccessTokenPayload;
}

/**
 * Verifies the JWT access token on the Authorization header and attaches
 * the decoded user (sub, username) to the request. Every route that touches
 * personal data (vault, applications, company records, resumes) must use this
 * so data always stays scoped to "who is logged in".
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = header.slice("Bearer ".length);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
}
