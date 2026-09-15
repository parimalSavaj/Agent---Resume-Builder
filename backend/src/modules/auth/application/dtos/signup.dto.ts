import { Request } from 'express';

export class SignupRequestDto {
  readonly username: string;
  readonly password: string;

  private constructor(props: { username: string; password: string }) {
    this.username = props.username;
    this.password = props.password;
  }

  static fromRequest(req: Request): SignupRequestDto {
    return new SignupRequestDto({
      username: req.body.username,
      password: req.body.password,
    });
  }
}

export class SignupResponseDto {
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
  }): SignupResponseDto {
    return new SignupResponseDto({
      user: { id: data.userId, username: data.username },
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }
}
