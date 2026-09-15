import { Request } from 'express';

export class LogoutRequestDto {
  readonly userId: string;
  readonly refreshToken: string | undefined;

  private constructor(props: { userId: string; refreshToken: string | undefined }) {
    this.userId = props.userId;
    this.refreshToken = props.refreshToken;
  }

  static fromRequest(req: Request): LogoutRequestDto {
    return new LogoutRequestDto({
      userId: req.user!.sub,
      refreshToken: typeof req.body?.refreshToken === 'string' ? req.body.refreshToken : undefined,
    });
  }
}

export class LogoutResponseDto {
  private constructor() {}

  static toResponse(): LogoutResponseDto {
    return new LogoutResponseDto();
  }
}
