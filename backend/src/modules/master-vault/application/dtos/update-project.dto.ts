import { Request } from 'express';

export class UpdateProjectRequestDto {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly description: string | null;
  readonly url: string | null;
  readonly startDate: string | null;
  readonly endDate: string | null;

  private constructor(props: {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    url: string | null;
    startDate: string | null;
    endDate: string | null;
  }) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.description = props.description;
    this.url = props.url;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }

  static fromRequest(req: Request): UpdateProjectRequestDto {
    return new UpdateProjectRequestDto({
      id: req.params.id as string,
      userId: req.user!.sub,
      name: req.body.name,
      description: req.body.description ?? null,
      url: req.body.url ?? null,
      startDate: req.body.startDate ?? null,
      endDate: req.body.endDate ?? null,
    });
  }
}

export class UpdateProjectResponseDto {
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
  }): UpdateProjectResponseDto {
    return new UpdateProjectResponseDto({
      id: row.id,
      name: row.name,
      description: row.description,
      url: row.url,
      startDate: row.start_date,
      endDate: row.end_date,
    });
  }
}
