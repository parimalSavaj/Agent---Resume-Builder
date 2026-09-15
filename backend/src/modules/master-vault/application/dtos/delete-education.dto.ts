import { Request } from 'express';

export class DeleteEducationRequestDto {
  readonly id: string;
  readonly userId: string;

  private constructor(props: { id: string; userId: string }) {
    this.id = props.id;
    this.userId = props.userId;
  }

  static fromRequest(req: Request): DeleteEducationRequestDto {
    return new DeleteEducationRequestDto({
      id: req.params.id as string,
      userId: req.user!.sub,
    });
  }
}

export class DeleteEducationResponseDto {
  private constructor() {}

  static toResponse(): DeleteEducationResponseDto {
    return new DeleteEducationResponseDto();
  }
}
