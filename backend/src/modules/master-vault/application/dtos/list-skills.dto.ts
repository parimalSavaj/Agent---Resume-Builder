import { Request } from 'express';
import { SkillResponseDto } from './create-skill.dto';

export class ListSkillsRequestDto {
  readonly userId: string;

  private constructor(props: { userId: string }) {
    this.userId = props.userId;
  }

  static fromRequest(req: Request): ListSkillsRequestDto {
    return new ListSkillsRequestDto({ userId: req.user!.sub });
  }
}

export class ListSkillsResponseDto {
  readonly items: SkillResponseDto[];

  private constructor(props: { items: SkillResponseDto[] }) {
    this.items = props.items;
  }

  static toResponse(rows: { id: string; name: string; category: string | null }[]): ListSkillsResponseDto {
    return new ListSkillsResponseDto({
      items: rows.map((row) => SkillResponseDto.toResponse(row)),
    });
  }
}
