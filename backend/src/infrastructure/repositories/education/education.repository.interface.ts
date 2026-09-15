import { EducationRow } from './education.types';

export interface IEducationRepository {
  create(data: {
    id: string;
    userId: string;
    institution: string;
    degree: string | null;
    fieldOfStudy: string | null;
    startDate: string | null;
    endDate: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void>;
  findById(id: string): Promise<EducationRow | null>;
  findAllByUserId(userId: string): Promise<EducationRow[]>;
  update(
    id: string,
    data: {
      institution: string;
      degree: string | null;
      fieldOfStudy: string | null;
      startDate: string | null;
      endDate: string | null;
      updatedAt: Date;
    },
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
