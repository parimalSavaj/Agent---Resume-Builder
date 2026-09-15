import { Request } from 'express';

export class DeleteSkillRequestDto {
  readonly id: string;
  readonly userId: string;

  private constructor(props: { id: string; userId: string }) {
    this.id = props.id;
    this.userId = props.userId;
  }

  static fromRequest(req: Request): DeleteSkillRequestDto {
    return new DeleteSkillRequestDto({
      id: req.params.id as string,
      userId: req.user!.sub,
    });
  }
}

export class DeleteSkillResponseDto {
  private constructor() {}

  static toResponse(): DeleteSkillResponseDto {
    return new DeleteSkillResponseDto();
  }
}
