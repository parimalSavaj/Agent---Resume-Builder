import { Request } from 'express';

export class MeRequestDto {
  readonly userId: string;
  readonly username: string;

  private constructor(props: { userId: string; username: string }) {
    this.userId = props.userId;
    this.username = props.username;
  }

  static fromRequest(req: Request): MeRequestDto {
    return new MeRequestDto({
      userId: req.user!.sub,
      username: req.user!.username,
    });
  }
}

export class MeResponseDto {
  readonly id: string;
  readonly username: string;

  private constructor(props: { id: string; username: string }) {
    this.id = props.id;
    this.username = props.username;
  }

  static toResponse(data: { userId: string; username: string }): MeResponseDto {
    return new MeResponseDto({ id: data.userId, username: data.username });
  }
}
