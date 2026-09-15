import { Request } from 'express';

export class DeleteCertificationRequestDto {
  readonly id: string;
  readonly userId: string;

  private constructor(props: { id: string; userId: string }) {
    this.id = props.id;
    this.userId = props.userId;
  }

  static fromRequest(req: Request): DeleteCertificationRequestDto {
    return new DeleteCertificationRequestDto({
      id: req.params.id as string,
      userId: req.user!.sub,
    });
  }
}

export class DeleteCertificationResponseDto {
  private constructor() {}

  static toResponse(): DeleteCertificationResponseDto {
    return new DeleteCertificationResponseDto();
  }
}
