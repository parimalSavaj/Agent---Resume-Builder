import { IDatabaseService } from '../../../shared/services/database/database.service.interface';
import { IBulletPointsRepository } from './bullet-points.repository.interface';
import { BulletPointRow } from './bullet-points.types';

export class BulletPointsRepository implements IBulletPointsRepository {
  private readonly TABLE = 'bullet_points';

  constructor(private readonly db: IDatabaseService) {}

  async create(data: {
    id: string;
    userId: string;
    parentType: string;
    parentId: string;
    text: string;
    tags: string[];
    metric: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void> {
    const sql = `
      INSERT INTO ${this.TABLE} (id, user_id, parent_type, parent_id, text, tags, metric, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await this.db.insert(sql, [
      data.id,
      data.userId,
      data.parentType,
      data.parentId,
      data.text,
      data.tags,
      data.metric,
      data.createdAt,
      data.updatedAt,
    ]);
  }

  async findById(id: string): Promise<BulletPointRow | null> {
    const sql = `SELECT * FROM ${this.TABLE} WHERE id = $1 AND deleted_at IS NULL`;
    return this.db.selectOne<BulletPointRow>(sql, [id]);
  }

  async findAllByUserId(
    userId: string,
    filters: {
      tag: string | null;
      parentType: string | null;
      parentId: string | null;
      dateFrom: string | null;
      dateTo: string | null;
    },
  ): Promise<BulletPointRow[]> {
    // Bullets have no dates of their own - "date range" filtering (per the spec)
    // means the date range of the parent job/project they belong to. Since the
    // parent can be either a work experience or a project, their start/end
    // dates are combined here via a UNION so both parent types can be
    // filtered the same way without the repository knowing business rules.
    const sql = `
      SELECT bp.* FROM ${this.TABLE} bp
      LEFT JOIN (
        SELECT id, start_date, end_date FROM work_experiences
        UNION ALL
        SELECT id, start_date, end_date FROM projects
      ) parent ON parent.id = bp.parent_id
      WHERE bp.user_id = $1
        AND bp.deleted_at IS NULL
        AND ($2::text IS NULL OR $2 = ANY(bp.tags))
        AND ($3::text IS NULL OR bp.parent_type = $3)
        AND ($4::uuid IS NULL OR bp.parent_id = $4)
        AND ($5::date IS NULL OR (parent.end_date IS NULL OR parent.end_date >= $5))
        AND ($6::date IS NULL OR parent.start_date <= $6)
      ORDER BY bp.created_at DESC
    `;
    return this.db.selectMany<BulletPointRow>(sql, [
      userId,
      filters.tag,
      filters.parentType,
      filters.parentId,
      filters.dateFrom,
      filters.dateTo,
    ]);
  }

  async findByParent(parentType: string, parentId: string): Promise<BulletPointRow[]> {
    const sql = `
      SELECT * FROM ${this.TABLE}
      WHERE parent_type = $1 AND parent_id = $2 AND deleted_at IS NULL
      ORDER BY created_at ASC
    `;
    return this.db.selectMany<BulletPointRow>(sql, [parentType, parentId]);
  }

  async update(
    id: string,
    data: { text: string; tags: string[]; metric: string | null; updatedAt: Date },
  ): Promise<void> {
    const sql = `
      UPDATE ${this.TABLE}
      SET text = $2, tags = $3, metric = $4, updated_at = $5
      WHERE id = $1 AND deleted_at IS NULL
    `;
    await this.db.update(sql, [id, data.text, data.tags, data.metric, data.updatedAt]);
  }

  async delete(id: string): Promise<void> {
    const sql = `UPDATE ${this.TABLE} SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`;
    await this.db.update(sql, [id]);
  }
}
