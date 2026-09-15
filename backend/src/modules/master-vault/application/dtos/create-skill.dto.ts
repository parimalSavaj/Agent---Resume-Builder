import { Request } from 'express';

export class CreateSkillRequestDto {
  readonly userId: string;
  readonly name: string;
  readonly category: string | null;

  private constructor(props: { userId: string; name: string; category: string | null }) {
    this.userId = props.userId;
    this.name = props.name;
    this.category = props.category;
  }

  static fromRequest(req: Request): CreateSkillRequestDto {
    return new CreateSkillRequestDto({
      userId: req.user!.sub,
      name: req.body.name,
      category: req.body.category ?? null,
    });
  }
}

export class SkillResponseDto {
  readonly id: string;
  readonly name: string;
  readonly category: string | null;

  private constructor(props: { id: string; name: string; category: string | null }) {
    this.id = props.id;
    this.name = props.name;
    this.category = props.category;
  }

  static toResponse(row: { id: string; name: string; category: string | null }): SkillResponseDto {
    return new SkillResponseDto({ id: row.id, name: row.name, category: row.category });
  }
}
