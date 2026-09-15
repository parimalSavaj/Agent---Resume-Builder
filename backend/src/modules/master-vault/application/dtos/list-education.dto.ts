import { Request } from 'express';
import { EducationResponseDto } from './create-education.dto';

export class ListEducationRequestDto {
  readonly userId: string;

  private constructor(props: { userId: string }) {
    this.userId = props.userId;
  }

  static fromRequest(req: Request): ListEducationRequestDto {
    return new ListEducationRequestDto({ userId: req.user!.sub });
  }
}

export class ListEducationResponseDto {
  readonly items: EducationResponseDto[];

  private constructor(props: { items: EducationResponseDto[] }) {
    this.items = props.items;
  }

  static toResponse(rows: {
    id: string;
    institution: string;
    degree: string | null;
    field_of_study: string | null;
    start_date: string | null;
    end_date: string | null;
  }[]): ListEducationResponseDto {
    return new ListEducationResponseDto({
      items: rows.map((row) => EducationResponseDto.toResponse(row)),
    });
  }
}
