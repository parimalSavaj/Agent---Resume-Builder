import { ProjectRow } from './projects.types';

export interface IProjectsRepository {
  create(data: {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    url: string | null;
    startDate: string | null;
    endDate: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void>;
  findById(id: string): Promise<ProjectRow | null>;
  findAllByUserId(userId: string): Promise<ProjectRow[]>;
  update(
    id: string,
    data: {
      name: string;
      description: string | null;
      url: string | null;
      startDate: string | null;
      endDate: string | null;
      updatedAt: Date;
    },
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
