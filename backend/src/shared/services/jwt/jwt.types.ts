export type AccessTokenPayload = {
  sub: string;
  username: string;
};

export type RefreshTokenPayload = AccessTokenPayload & {
  jti: string;
};
