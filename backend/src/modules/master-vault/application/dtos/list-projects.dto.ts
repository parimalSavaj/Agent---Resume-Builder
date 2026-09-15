import { Request } from 'express';
import { ProjectResponseDto } from './create-project.dto';

export class ListProjectsRequestDto {
  readonly userId: string;

  private constructor(props: { userId: string }) {
    this.userId = props.userId;
  }

  static fromRequest(req: Request): ListProjectsRequestDto {
    return new ListProjectsRequestDto({ userId: req.user!.sub });
  }
}

export class ListProjectsResponseDto {
  readonly items: ProjectResponseDto[];

  private constructor(props: { items: ProjectResponseDto[] }) {
    this.items = props.items;
  }

  static toResponse(rows: {
    id: string;
    name: string;
    description: string | null;
    url: string | null;
    start_date: string | null;
    end_date: string | null;
  }[]): ListProjectsResponseDto {
    return new ListProjectsResponseDto({
      items: rows.map((row) => ProjectResponseDto.toResponse(row)),
    });
  }
}
