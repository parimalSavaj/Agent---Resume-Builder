import { Request } from 'express';

export class CreateWorkExperienceRequestDto {
  readonly userId: string;
  readonly company: string;
  readonly title: string;
  readonly location: string | null;
  readonly description: string | null;
  readonly startDate: string;
  readonly endDate: string | null;

  private constructor(props: {
    userId: string;
    company: string;
    title: string;
    location: string | null;
    description: string | null;
    startDate: string;
    endDate: string | null;
  }) {
    this.userId = props.userId;
    this.company = props.company;
    this.title = props.title;
    this.location = props.location;
    this.description = props.description;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }

  static fromRequest(req: Request): CreateWorkExperienceRequestDto {
    return new CreateWorkExperienceRequestDto({
      userId: req.user!.sub,
      company: req.body.company,
      title: req.body.title,
      location: req.body.location ?? null,
      description: req.body.description ?? null,
      startDate: req.body.startDate,
      endDate: req.body.endDate ?? null,
    });
  }
}

export class WorkExperienceResponseDto {
  readonly id: string;
  readonly company: string;
  readonly title: string;
  readonly location: string | null;
  readonly description: string | null;
  readonly startDate: string;
  readonly endDate: string | null;

  private constructor(props: {
    id: string;
    company: string;
    title: string;
    location: string | null;
    description: string | null;
    startDate: string;
    endDate: string | null;
  }) {
    this.id = props.id;
    this.company = props.company;
    this.title = props.title;
    this.location = props.location;
    this.description = props.description;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }

  static toResponse(row: {
    id: string;
    company: string;
    title: string;
    location: string | null;
    description: string | null;
    start_date: string;
    end_date: string | null;
  }): WorkExperienceResponseDto {
    return new WorkExperienceResponseDto({
      id: row.id,
      company: row.company,
      title: row.title,
      location: row.location,
      description: row.description,
      startDate: row.start_date,
      endDate: row.end_date,
    });
  }
}
