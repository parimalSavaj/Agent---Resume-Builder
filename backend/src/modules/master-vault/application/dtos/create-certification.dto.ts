import { Request } from 'express';

export class CreateCertificationRequestDto {
  readonly userId: string;
  readonly name: string;
  readonly issuer: string | null;
  readonly issueDate: string | null;
  readonly expirationDate: string | null;
  readonly credentialId: string | null;

  private constructor(props: {
    userId: string;
    name: string;
    issuer: string | null;
    issueDate: string | null;
    expirationDate: string | null;
    credentialId: string | null;
  }) {
    this.userId = props.userId;
    this.name = props.name;
    this.issuer = props.issuer;
    this.issueDate = props.issueDate;
    this.expirationDate = props.expirationDate;
    this.credentialId = props.credentialId;
  }

  static fromRequest(req: Request): CreateCertificationRequestDto {
    return new CreateCertificationRequestDto({
      userId: req.user!.sub,
      name: req.body.name,
      issuer: req.body.issuer ?? null,
      issueDate: req.body.issueDate ?? null,
      expirationDate: req.body.expirationDate ?? null,
      credentialId: req.body.credentialId ?? null,
    });
  }
}

export class CertificationResponseDto {
  readonly id: string;
  readonly name: string;
  readonly issuer: string | null;
  readonly issueDate: string | null;
  readonly expirationDate: string | null;
  readonly credentialId: string | null;

  private constructor(props: {
    id: string;
    name: string;
    issuer: string | null;
    issueDate: string | null;
    expirationDate: string | null;
    credentialId: string | null;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.issuer = props.issuer;
    this.issueDate = props.issueDate;
    this.expirationDate = props.expirationDate;
    this.credentialId = props.credentialId;
  }

  static toResponse(row: {
    id: string;
    name: string;
    issuer: string | null;
    issue_date: string | null;
    expiration_date: string | null;
    credential_id: string | null;
  }): CertificationResponseDto {
    return new CertificationResponseDto({
      id: row.id,
      name: row.name,
      issuer: row.issuer,
      issueDate: row.issue_date,
      expirationDate: row.expiration_date,
      credentialId: row.credential_id,
    });
  }
}
