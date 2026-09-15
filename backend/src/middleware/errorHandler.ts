import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AuthError } from "../modules/auth/auth.service";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    });
  }

  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}
