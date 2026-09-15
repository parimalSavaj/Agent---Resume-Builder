import { RefreshTokenRow } from './refresh-tokens.types';

export interface IRefreshTokensRepository {
  create(data: { id: string; userId: string; tokenHash: string; expiresAt: Date }): Promise<void>;
  findValid(userId: string, tokenHash: string): Promise<RefreshTokenRow | null>;
  revoke(userId: string, tokenHash: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}
