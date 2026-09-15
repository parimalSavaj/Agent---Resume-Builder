import { Request } from 'express';

export class DeleteProjectRequestDto {
  readonly id: string;
  readonly userId: string;

  private constructor(props: { id: string; userId: string }) {
    this.id = props.id;
    this.userId = props.userId;
  }

  static fromRequest(req: Request): DeleteProjectRequestDto {
    return new DeleteProjectRequestDto({
      id: req.params.id as string,
      userId: req.user!.sub,
    });
  }
}

export class DeleteProjectResponseDto {
  private constructor() {}

  static toResponse(): DeleteProjectResponseDto {
    return new DeleteProjectResponseDto();
  }
}
