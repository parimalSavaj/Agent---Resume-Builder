import { Request } from 'express';

export class UpdateSkillRequestDto {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly category: string | null;

  private constructor(props: { id: string; userId: string; name: string; category: string | null }) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.category = props.category;
  }

  static fromRequest(req: Request): UpdateSkillRequestDto {
    return new UpdateSkillRequestDto({
      id: req.params.id as string,
      userId: req.user!.sub,
      name: req.body.name,
      category: req.body.category ?? null,
    });
  }
}

export class UpdateSkillResponseDto {
  readonly id: string;
  readonly name: string;
  readonly category: string | null;

  private constructor(props: { id: string; name: string; category: string | null }) {
    this.id = props.id;
    this.name = props.name;
    this.category = props.category;
  }

  static toResponse(row: { id: string; name: string; category: string | null }): UpdateSkillResponseDto {
    return new UpdateSkillResponseDto({ id: row.id, name: row.name, category: row.category });
  }
}
