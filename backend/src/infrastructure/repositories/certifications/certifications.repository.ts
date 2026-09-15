import { IDatabaseService } from '../../../shared/services/database/database.service.interface';
import { ICertificationsRepository } from './certifications.repository.interface';
import { CertificationRow } from './certifications.types';

export class CertificationsRepository implements ICertificationsRepository {
  private readonly TABLE = 'certifications';

  constructor(private readonly db: IDatabaseService) {}

  async create(data: {
    id: string;
    userId: string;
    name: string;
    issuer: string | null;
    issueDate: string | null;
    expirationDate: string | null;
    credentialId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void> {
    const sql = `
      INSERT INTO ${this.TABLE} (id, user_id, name, issuer, issue_date, expiration_date, credential_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await this.db.insert(sql, [
      data.id,
      data.userId,
      data.name,
      data.issuer,
      data.issueDate,
      data.expirationDate,
      data.credentialId,
      data.createdAt,
      data.updatedAt,
    ]);
  }

  async findById(id: string): Promise<CertificationRow | null> {
    const sql = `SELECT * FROM ${this.TABLE} WHERE id = $1 AND deleted_at IS NULL`;
    return this.db.selectOne<CertificationRow>(sql, [id]);
  }

  async findAllByUserId(userId: string): Promise<CertificationRow[]> {
    const sql = `
      SELECT * FROM ${this.TABLE}
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return this.db.selectMany<CertificationRow>(sql, [userId]);
  }

  async update(
    id: string,
    data: {
      name: string;
      issuer: string | null;
      issueDate: string | null;
      expirationDate: string | null;
      credentialId: string | null;
      updatedAt: Date;
    },
  ): Promise<void> {
    const sql = `
      UPDATE ${this.TABLE}
      SET name = $2, issuer = $3, issue_date = $4, expiration_date = $5, credential_id = $6, updated_at = $7
      WHERE id = $1 AND deleted_at IS NULL
    `;
    await this.db.update(sql, [
      id,
      data.name,
      data.issuer,
      data.issueDate,
      data.expirationDate,
      data.credentialId,
      data.updatedAt,
    ]);
  }

  async delete(id: string): Promise<void> {
    const sql = `UPDATE ${this.TABLE} SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`;
    await this.db.update(sql, [id]);
  }
}
