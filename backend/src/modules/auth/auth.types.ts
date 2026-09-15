export interface User {
  id: string;
  username: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: string;
  username: string;
}

export interface AccessTokenPayload {
  sub: string; // user id
  username: string;
}

export interface RefreshTokenPayload extends AccessTokenPayload {
  jti: string; // unique token id, guarantees uniqueness even if issued in the same second
}
