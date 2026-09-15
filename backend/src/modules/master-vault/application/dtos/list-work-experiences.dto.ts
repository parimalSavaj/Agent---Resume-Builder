import { Request } from 'express';
import { WorkExperienceResponseDto } from './create-work-experience.dto';

export class ListWorkExperiencesRequestDto {
  readonly userId: string;

  private constructor(props: { userId: string }) {
    this.userId = props.userId;
  }

  static fromRequest(req: Request): ListWorkExperiencesRequestDto {
    return new ListWorkExperiencesRequestDto({ userId: req.user!.sub });
  }
}

export class ListWorkExperiencesResponseDto {
  readonly items: WorkExperienceResponseDto[];

  private constructor(props: { items: WorkExperienceResponseDto[] }) {
    this.items = props.items;
  }

  static toResponse(rows: {
    id: string;
    company: string;
    title: string;
    location: string | null;
    start_date: string;
    end_date: string | null;
  }[]): ListWorkExperiencesResponseDto {
    return new ListWorkExperiencesResponseDto({
      items: rows.map((row) => WorkExperienceResponseDto.toResponse(row)),
    });
  }
}
