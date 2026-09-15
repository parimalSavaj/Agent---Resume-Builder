import { IDatabaseService } from '../../../shared/services/database/database.service.interface';
import { IRefreshTokensRepository } from './refresh-tokens.repository.interface';
import { RefreshTokenRow } from './refresh-tokens.types';

export class RefreshTokensRepository implements IRefreshTokensRepository {
  private readonly TABLE = 'refresh_tokens';

  constructor(private readonly db: IDatabaseService) {}

  async create(data: { id: string; userId: string; tokenHash: string; expiresAt: Date }): Promise<void> {
    const sql = `
      INSERT INTO ${this.TABLE} (id, user_id, token_hash, expires_at, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `;
    await this.db.insert(sql, [data.id, data.userId, data.tokenHash, data.expiresAt]);
  }

  async findValid(userId: string, tokenHash: string): Promise<RefreshTokenRow | null> {
    const sql = `
      SELECT * FROM ${this.TABLE}
      WHERE user_id = $1
        AND token_hash = $2
        AND revoked_at IS NULL
        AND expires_at > NOW()
    `;
    return this.db.selectOne<RefreshTokenRow>(sql, [userId, tokenHash]);
  }

  async revoke(userId: string, tokenHash: string): Promise<void> {
    const sql = `
      UPDATE ${this.TABLE}
      SET revoked_at = NOW()
      WHERE user_id = $1 AND token_hash = $2 AND revoked_at IS NULL
    `;
    await this.db.update(sql, [userId, tokenHash]);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    const sql = `
      UPDATE ${this.TABLE}
      SET revoked_at = NOW()
      WHERE user_id = $1 AND revoked_at IS NULL
    `;
    await this.db.update(sql, [userId]);
  }
}
