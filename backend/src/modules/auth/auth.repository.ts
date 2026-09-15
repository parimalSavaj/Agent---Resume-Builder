import crypto from "crypto";
import { query } from "../../db/pool";
import { User } from "./auth.types";

export async function findUserByUsername(username: string): Promise<User | null> {
  const result = await query<User>("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0] ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await query<User>("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] ?? null;
}

export async function createUser(username: string, passwordHash: string): Promise<User> {
  const result = await query<User>(
    `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *`,
    [username, passwordHash]
  );
  return result.rows[0];
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function storeRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, hashToken(token), expiresAt]
  );
}

export async function findValidRefreshToken(userId: string, token: string) {
  const result = await query(
    `SELECT * FROM refresh_tokens
     WHERE user_id = $1 AND token_hash = $2 AND revoked_at IS NULL AND expires_at > now()`,
    [userId, hashToken(token)]
  );
  return result.rows[0] ?? null;
}

export async function revokeRefreshToken(userId: string, token: string): Promise<void> {
  await query(
    `UPDATE refresh_tokens SET revoked_at = now()
     WHERE user_id = $1 AND token_hash = $2 AND revoked_at IS NULL`,
    [userId, hashToken(token)]
  );
}

export async function revokeAllRefreshTokensForUser(userId: string): Promise<void> {
  await query(
    `UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId]
  );
}
