import { IDatabaseService } from '../../../shared/services/database/database.service.interface';
import { ISkillsRepository } from './skills.repository.interface';
import { SkillRow } from './skills.types';

export class SkillsRepository implements ISkillsRepository {
  private readonly TABLE = 'skills';

  constructor(private readonly db: IDatabaseService) {}

  async create(data: {
    id: string;
    userId: string;
    name: string;
    category: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void> {
    const sql = `
      INSERT INTO ${this.TABLE} (id, user_id, name, category, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await this.db.insert(sql, [data.id, data.userId, data.name, data.category, data.createdAt, data.updatedAt]);
  }

  async findById(id: string): Promise<SkillRow | null> {
    const sql = `SELECT * FROM ${this.TABLE} WHERE id = $1 AND deleted_at IS NULL`;
    return this.db.selectOne<SkillRow>(sql, [id]);
  }

  async findAllByUserId(userId: string): Promise<SkillRow[]> {
    const sql = `
      SELECT * FROM ${this.TABLE}
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return this.db.selectMany<SkillRow>(sql, [userId]);
  }

  async update(id: string, data: { name: string; category: string | null; updatedAt: Date }): Promise<void> {
    const sql = `
      UPDATE ${this.TABLE}
      SET name = $2, category = $3, updated_at = $4
      WHERE id = $1 AND deleted_at IS NULL
    `;
    await this.db.update(sql, [id, data.name, data.category, data.updatedAt]);
  }

  async delete(id: string): Promise<void> {
    const sql = `UPDATE ${this.TABLE} SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`;
    await this.db.update(sql, [id]);
  }
}
