import { BulletPointRow } from './bullet-points.types';

export interface IBulletPointsRepository {
  create(data: {
    id: string;
    userId: string;
    parentType: string;
    parentId: string;
    text: string;
    tags: string[];
    metric: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void>;
  findById(id: string): Promise<BulletPointRow | null>;
  findAllByUserId(
    userId: string,
    filters: {
      tag: string | null;
      parentType: string | null;
      parentId: string | null;
      dateFrom: string | null;
      dateTo: string | null;
    },
  ): Promise<BulletPointRow[]>;
  findByParent(parentType: string, parentId: string): Promise<BulletPointRow[]>;
  update(
    id: string,
    data: { text: string; tags: string[]; metric: string | null; updatedAt: Date },
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
