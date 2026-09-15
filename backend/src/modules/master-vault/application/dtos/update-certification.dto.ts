import { Request } from 'express';

export class UpdateCertificationRequestDto {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly issuer: string | null;
  readonly issueDate: string | null;
  readonly expirationDate: string | null;
  readonly credentialId: string | null;

  private constructor(props: {
    id: string;
    userId: string;
    name: string;
    issuer: string | null;
    issueDate: string | null;
    expirationDate: string | null;
    credentialId: string | null;
  }) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.issuer = props.issuer;
    this.issueDate = props.issueDate;
    this.expirationDate = props.expirationDate;
    this.credentialId = props.credentialId;
  }

  static fromRequest(req: Request): UpdateCertificationRequestDto {
    return new UpdateCertificationRequestDto({
      id: req.params.id as string,
      userId: req.user!.sub,
      name: req.body.name,
      issuer: req.body.issuer ?? null,
      issueDate: req.body.issueDate ?? null,
      expirationDate: req.body.expirationDate ?? null,
      credentialId: req.body.credentialId ?? null,
    });
  }
}

export class UpdateCertificationResponseDto {
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
  }): UpdateCertificationResponseDto {
    return new UpdateCertificationResponseDto({
      id: row.id,
      name: row.name,
      issuer: row.issuer,
      issueDate: row.issue_date,
      expirationDate: row.expiration_date,
      credentialId: row.credential_id,
    });
  }
}
