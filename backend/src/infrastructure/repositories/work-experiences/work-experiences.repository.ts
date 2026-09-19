import { IDatabaseService } from '../../../shared/services/database/database.service.interface';
import { IWorkExperiencesRepository } from './work-experiences.repository.interface';
import { WorkExperienceRow } from './work-experiences.types';

export class WorkExperiencesRepository implements IWorkExperiencesRepository {
  private readonly TABLE = 'work_experiences';

  constructor(private readonly db: IDatabaseService) {}

  async create(data: {
    id: string;
    userId: string;
    company: string;
    title: string;
    location: string | null;
    description: string | null;
    startDate: string;
    endDate: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void> {
    const sql = `
      INSERT INTO ${this.TABLE} (id, user_id, company, title, location, description, start_date, end_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    await this.db.insert(sql, [
      data.id,
      data.userId,
      data.company,
      data.title,
      data.location,
      data.description,
      data.startDate,
      data.endDate,
      data.createdAt,
      data.updatedAt,
    ]);
  }

  async findById(id: string): Promise<WorkExperienceRow | null> {
    const sql = `SELECT * FROM ${this.TABLE} WHERE id = $1 AND deleted_at IS NULL`;
    return this.db.selectOne<WorkExperienceRow>(sql, [id]);
  }

  async findAllByUserId(userId: string): Promise<WorkExperienceRow[]> {
    const sql = `
      SELECT * FROM ${this.TABLE}
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY start_date DESC
    `;
    return this.db.selectMany<WorkExperienceRow>(sql, [userId]);
  }

  async update(
    id: string,
    data: {
      company: string;
      title: string;
      location: string | null;
      description: string | null;
      startDate: string;
      endDate: string | null;
      updatedAt: Date;
    },
  ): Promise<void> {
    const sql = `
      UPDATE ${this.TABLE}
      SET company = $2, title = $3, location = $4, description = $5, start_date = $6, end_date = $7, updated_at = $8
      WHERE id = $1 AND deleted_at IS NULL
    `;
    await this.db.update(sql, [
      id,
      data.company,
      data.title,
      data.location,
      data.description,
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
