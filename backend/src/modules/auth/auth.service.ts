import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import {
  createUser,
  findUserByUsername,
  storeRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokensForUser,
  findUserById,
} from "./auth.repository";
import { signAccessToken, signRefreshToken, verifyRefreshToken, expiryDateFromNow } from "./jwt";
import { PublicUser } from "./auth.types";

const BCRYPT_ROUNDS = 12;

export class AuthError extends Error {
  constructor(message: string, public statusCode = 400) {
    super(message);
  }
}

function toPublicUser(user: { id: string; username: string }): PublicUser {
  return { id: user.id, username: user.username };
}

export async function signup(username: string, password: string) {
  const existing = await findUserByUsername(username);
  if (existing) {
    throw new AuthError("Username is already taken", 409);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await createUser(username, passwordHash);

  return issueTokenPair(user.id, user.username, toPublicUser(user));
}

export async function login(username: string, password: string) {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new AuthError("Invalid username or password", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new AuthError("Invalid username or password", 401);
  }

  return issueTokenPair(user.id, user.username, toPublicUser(user));
}

async function issueTokenPair(userId: string, username: string, publicUser: PublicUser) {
  const accessToken = signAccessToken({ sub: userId, username });
  const refreshToken = signRefreshToken({ sub: userId, username });

  const expiresAt = expiryDateFromNow(env.jwtRefreshExpiresIn);
  await storeRefreshToken(userId, refreshToken, expiresAt);

  return { user: publicUser, accessToken, refreshToken };
}

export async function refresh(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AuthError("Invalid or expired refresh token", 401);
  }

  const stored = await findValidRefreshToken(payload.sub, refreshToken);
  if (!stored) {
    throw new AuthError("Invalid or expired refresh token", 401);
  }

  const user = await findUserById(payload.sub);
  if (!user) {
    throw new AuthError("Invalid or expired refresh token", 401);
  }

  // Rotate: revoke the old refresh token and issue a new pair
  await revokeRefreshToken(payload.sub, refreshToken);
  return issueTokenPair(user.id, user.username, toPublicUser(user));
}

export async function logout(userId: string, refreshToken?: string) {
  if (refreshToken) {
    await revokeRefreshToken(userId, refreshToken);
  } else {
    await revokeAllRefreshTokensForUser(userId);
  }
}
