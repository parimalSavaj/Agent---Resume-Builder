import { Request } from 'express';

export class DeleteBulletPointRequestDto {
  readonly id: string;
  readonly userId: string;

  private constructor(props: { id: string; userId: string }) {
    this.id = props.id;
    this.userId = props.userId;
  }

  static fromRequest(req: Request): DeleteBulletPointRequestDto {
    return new DeleteBulletPointRequestDto({
      id: req.params.id as string,
      userId: req.user!.sub,
    });
  }
}

export class DeleteBulletPointResponseDto {
  private constructor() {}

  static toResponse(): DeleteBulletPointResponseDto {
    return new DeleteBulletPointResponseDto();
  }
}
