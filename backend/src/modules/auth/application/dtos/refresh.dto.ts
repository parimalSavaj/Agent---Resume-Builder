import { Request } from 'express';

export class RefreshRequestDto {
  readonly refreshToken: string;

  private constructor(props: { refreshToken: string }) {
    this.refreshToken = props.refreshToken;
  }

  static fromRequest(req: Request): RefreshRequestDto {
    return new RefreshRequestDto({
      refreshToken: req.body.refreshToken,
    });
  }
}

export class RefreshResponseDto {
  readonly user: { id: string; username: string };
  readonly accessToken: string;
  readonly refreshToken: string;

  private constructor(props: {
    user: { id: string; username: string };
    accessToken: string;
    refreshToken: string;
  }) {
    this.user = props.user;
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
  }

  static toResponse(data: {
    userId: string;
    username: string;
    accessToken: string;
    refreshToken: string;
  }): RefreshResponseDto {
    return new RefreshResponseDto({
      user: { id: data.userId, username: data.username },
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }
}
