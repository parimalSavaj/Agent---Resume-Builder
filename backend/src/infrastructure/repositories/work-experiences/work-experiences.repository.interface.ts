import { WorkExperienceRow } from './work-experiences.types';

export interface IWorkExperiencesRepository {
  create(data: {
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
  }): Promise<void>;
  findById(id: string): Promise<WorkExperienceRow | null>;
  findAllByUserId(userId: string): Promise<WorkExperienceRow[]>;
  update(
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
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
