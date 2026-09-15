import { IDatabaseService } from '../../../shared/services/database/database.service.interface';
import { IEducationRepository } from './education.repository.interface';
import { EducationRow } from './education.types';

export class EducationRepository implements IEducationRepository {
  private readonly TABLE = 'education';

  constructor(private readonly db: IDatabaseService) {}

  async create(data: {
    id: string;
    userId: string;
    institution: string;
    degree: string | null;
    fieldOfStudy: string | null;
    startDate: string | null;
    endDate: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void> {
    const sql = `
      INSERT INTO ${this.TABLE} (id, user_id, institution, degree, field_of_study, start_date, end_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await this.db.insert(sql, [
      data.id,
      data.userId,
      data.institution,
      data.degree,
      data.fieldOfStudy,
      data.startDate,
      data.endDate,
      data.createdAt,
      data.updatedAt,
    ]);
  }

  async findById(id: string): Promise<EducationRow | null> {
    const sql = `SELECT * FROM ${this.TABLE} WHERE id = $1 AND deleted_at IS NULL`;
    return this.db.selectOne<EducationRow>(sql, [id]);
  }

  async findAllByUserId(userId: string): Promise<EducationRow[]> {
    const sql = `
      SELECT * FROM ${this.TABLE}
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return this.db.selectMany<EducationRow>(sql, [userId]);
  }

  async update(
    id: string,
    data: {
      institution: string;
      degree: string | null;
      fieldOfStudy: string | null;
      startDate: string | null;
      endDate: string | null;
      updatedAt: Date;
    },
  ): Promise<void> {
    const sql = `
      UPDATE ${this.TABLE}
      SET institution = $2, degree = $3, field_of_study = $4, start_date = $5, end_date = $6, updated_at = $7
      WHERE id = $1 AND deleted_at IS NULL
    `;
    await this.db.update(sql, [
      id,
      data.institution,
      data.degree,
      data.fieldOfStudy,
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
