import { IDatabaseService } from '../../../shared/services/database/database.service.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserRow } from './users.types';

export class UsersRepository implements IUsersRepository {
  private readonly TABLE = 'users';

  constructor(private readonly db: IDatabaseService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const sql = `SELECT * FROM ${this.TABLE} WHERE id = $1`;
    const row = await this.db.selectOne<UserRow>(sql, [id]);
    return row ? this.toEntity(row) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const sql = `SELECT * FROM ${this.TABLE} WHERE username = $1`;
    const row = await this.db.selectOne<UserRow>(sql, [username]);
    return row ? this.toEntity(row) : null;
  }

  async create(entity: UserEntity): Promise<void> {
    const sql = `
      INSERT INTO ${this.TABLE} (id, username, password_hash, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await this.db.insert(sql, [
      entity.id,
      entity.username,
      entity.passwordHash,
      entity.createdAt,
      entity.updatedAt,
    ]);
  }

  private toEntity(row: UserRow): UserEntity {
    return UserEntity.fromRecord(row);
  }
}
