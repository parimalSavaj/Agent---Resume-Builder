import { Request, Response, NextFunction } from "express";
import { signupSchema, loginSchema, refreshSchema } from "./auth.schema";
import * as authService from "./auth.service";
import { AuthenticatedRequest } from "../../middleware/auth";

export async function signupHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = signupSchema.parse(req.body);
    const result = await authService.signup(username, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const result = await authService.login(username, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const result = await authService.refresh(refreshToken);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function logoutHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const refreshToken = typeof req.body?.refreshToken === "string" ? req.body.refreshToken : undefined;
    await authService.logout(req.user!.sub, refreshToken);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function meHandler(req: AuthenticatedRequest, res: Response) {
  res.status(200).json({ id: req.user!.sub, username: req.user!.username });
}
