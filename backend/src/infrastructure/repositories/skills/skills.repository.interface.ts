import { SkillRow } from './skills.types';

export interface ISkillsRepository {
  create(data: {
    id: string;
    userId: string;
    name: string;
    category: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void>;
  findById(id: string): Promise<SkillRow | null>;
  findAllByUserId(userId: string): Promise<SkillRow[]>;
  update(
    id: string,
    data: { name: string; category: string | null; updatedAt: Date },
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
