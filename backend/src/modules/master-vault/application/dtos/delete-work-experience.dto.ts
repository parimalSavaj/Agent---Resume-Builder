import { Request } from 'express';

export class DeleteWorkExperienceRequestDto {
  readonly id: string;
  readonly userId: string;

  private constructor(props: { id: string; userId: string }) {
    this.id = props.id;
    this.userId = props.userId;
  }

  static fromRequest(req: Request): DeleteWorkExperienceRequestDto {
    return new DeleteWorkExperienceRequestDto({
      id: req.params.id as string,
      userId: req.user!.sub,
    });
  }
}

export class DeleteWorkExperienceResponseDto {
  private constructor() {}

  static toResponse(): DeleteWorkExperienceResponseDto {
    return new DeleteWorkExperienceResponseDto();
  }
}
