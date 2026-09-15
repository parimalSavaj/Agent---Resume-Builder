import { IDatabaseService } from '../../../shared/services/database/database.service.interface';
import { IProjectsRepository } from './projects.repository.interface';
import { ProjectRow } from './projects.types';

export class ProjectsRepository implements IProjectsRepository {
  private readonly TABLE = 'projects';

  constructor(private readonly db: IDatabaseService) {}

  async create(data: {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    url: string | null;
    startDate: string | null;
    endDate: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void> {
    const sql = `
      INSERT INTO ${this.TABLE} (id, user_id, name, description, url, start_date, end_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await this.db.insert(sql, [
      data.id,
      data.userId,
      data.name,
      data.description,
      data.url,
      data.startDate,
      data.endDate,
      data.createdAt,
      data.updatedAt,
    ]);
  }

  async findById(id: string): Promise<ProjectRow | null> {
    const sql = `SELECT * FROM ${this.TABLE} WHERE id = $1 AND deleted_at IS NULL`;
    return this.db.selectOne<ProjectRow>(sql, [id]);
  }

  async findAllByUserId(userId: string): Promise<ProjectRow[]> {
    const sql = `
      SELECT * FROM ${this.TABLE}
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return this.db.selectMany<ProjectRow>(sql, [userId]);
  }

  async update(
    id: string,
    data: {
      name: string;
      description: string | null;
      url: string | null;
      startDate: string | null;
      endDate: string | null;
      updatedAt: Date;
    },
  ): Promise<void> {
    const sql = `
      UPDATE ${this.TABLE}
      SET name = $2, description = $3, url = $4, start_date = $5, end_date = $6, updated_at = $7
      WHERE id = $1 AND deleted_at IS NULL
    `;
    await this.db.update(sql, [
      id,
      data.name,
      data.description,
      data.url,
      data.startDate,
      data.endDate,
      data.updatedAt,
    ]);
  }

  async delete(id: string): Promise<void> {
    const sql = `UPDATE ${this.TABLE} SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`;
    await this.db.update(sql, [id]);
  }
}
