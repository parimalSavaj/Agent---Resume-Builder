import { Request } from 'express';

export class CreateEducationRequestDto {
  readonly userId: string;
  readonly institution: string;
  readonly degree: string | null;
  readonly fieldOfStudy: string | null;
  readonly startDate: string | null;
  readonly endDate: string | null;

  private constructor(props: {
    userId: string;
    institution: string;
    degree: string | null;
    fieldOfStudy: string | null;
    startDate: string | null;
    endDate: string | null;
  }) {
    this.userId = props.userId;
    this.institution = props.institution;
    this.degree = props.degree;
    this.fieldOfStudy = props.fieldOfStudy;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }

  static fromRequest(req: Request): CreateEducationRequestDto {
    return new CreateEducationRequestDto({
      userId: req.user!.sub,
      institution: req.body.institution,
      degree: req.body.degree ?? null,
      fieldOfStudy: req.body.fieldOfStudy ?? null,
      startDate: req.body.startDate ?? null,
      endDate: req.body.endDate ?? null,
    });
  }
}

export class EducationResponseDto {
  readonly id: string;
  readonly institution: string;
  readonly degree: string | null;
  readonly fieldOfStudy: string | null;
  readonly startDate: string | null;
  readonly endDate: string | null;

  private constructor(props: {
    id: string;
    institution: string;
    degree: string | null;
    fieldOfStudy: string | null;
    startDate: string | null;
    endDate: string | null;
  }) {
    this.id = props.id;
    this.institution = props.institution;
    this.degree = props.degree;
    this.fieldOfStudy = props.fieldOfStudy;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }

  static toResponse(row: {
    id: string;
    institution: string;
    degree: string | null;
    field_of_study: string | null;
    start_date: string | null;
    end_date: string | null;
  }): EducationResponseDto {
    return new EducationResponseDto({
      id: row.id,
      institution: row.institution,
      degree: row.degree,
      fieldOfStudy: row.field_of_study,
      startDate: row.start_date,
      endDate: row.end_date,
    });
  }
}
