import { CertificationRow } from './certifications.types';

export interface ICertificationsRepository {
  create(data: {
    id: string;
    userId: string;
    name: string;
    issuer: string | null;
    issueDate: string | null;
    expirationDate: string | null;
    credentialId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void>;
  findById(id: string): Promise<CertificationRow | null>;
  findAllByUserId(userId: string): Promise<CertificationRow[]>;
  update(
    id: string,
    data: {
      name: string;
      issuer: string | null;
      issueDate: string | null;
      expirationDate: string | null;
      credentialId: string | null;
      updatedAt: Date;
    },
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
