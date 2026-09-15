import { Request } from 'express';
import { CertificationResponseDto } from './create-certification.dto';

export class ListCertificationsRequestDto {
  readonly userId: string;

  private constructor(props: { userId: string }) {
    this.userId = props.userId;
  }

  static fromRequest(req: Request): ListCertificationsRequestDto {
    return new ListCertificationsRequestDto({ userId: req.user!.sub });
  }
}

export class ListCertificationsResponseDto {
  readonly items: CertificationResponseDto[];

  private constructor(props: { items: CertificationResponseDto[] }) {
    this.items = props.items;
  }

  static toResponse(rows: {
    id: string;
    name: string;
    issuer: string | null;
    issue_date: string | null;
    expiration_date: string | null;
    credential_id: string | null;
  }[]): ListCertificationsResponseDto {
    return new ListCertificationsResponseDto({
      items: rows.map((row) => CertificationResponseDto.toResponse(row)),
    });
  }
}
