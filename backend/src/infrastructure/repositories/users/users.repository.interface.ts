import { UserEntity } from '../../../domain/entities/user.entity';

export interface IUsersRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  create(entity: UserEntity): Promise<void>;
}
