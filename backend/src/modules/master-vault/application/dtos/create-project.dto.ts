import { Request } from 'express';

export class CreateProjectRequestDto {
  readonly userId: string;
  readonly name: string;
  readonly description: string | null;
  readonly url: string | null;
  readonly startDate: string | null;
  readonly endDate: string | null;

  private constructor(props: {
    userId: string;
    name: string;
    description: string | null;
    url: string | null;
    startDate: string | null;
    endDate: string | null;
  }) {
    this.userId = props.userId;
    this.name = props.name;
    this.description = props.description;
    this.url = props.url;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }

  static fromRequest(req: Request): CreateProjectRequestDto {
    return new CreateProjectRequestDto({
      userId: req.user!.sub,
      name: req.body.name,
      description: req.body.description ?? null,
      url: req.body.url ?? null,
      startDate: req.body.startDate ?? null,
      endDate: req.body.endDate ?? null,
    });
  }
}

export class ProjectResponseDto {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly url: string | null;
  readonly startDate: string | null;
  readonly endDate: string | null;

  private constructor(props: {
    id: string;
    name: string;
    description: string | null;
    url: string | null;
    startDate: string | null;
    endDate: string | null;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.url = props.url;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }

  static toResponse(row: {
    id: string;
    name: string;
    description: string | null;
    url: string | null;
    start_date: string | null;
    end_date: string | null;
  }): ProjectResponseDto {
    return new ProjectResponseDto({
      id: row.id,
      name: row.name,
      description: row.description,
      url: row.url,
      startDate: row.start_date,
      endDate: row.end_date,
    });
  }
}
