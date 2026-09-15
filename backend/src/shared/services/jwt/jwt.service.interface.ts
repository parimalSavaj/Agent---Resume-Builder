import { AccessTokenPayload, RefreshTokenPayload } from './jwt.types';

export interface IJwtService {
  signAccessToken(payload: AccessTokenPayload): string;
  signRefreshToken(payload: AccessTokenPayload): string;
  verifyAccessToken(token: string): AccessTokenPayload;
  verifyRefreshToken(token: string): RefreshTokenPayload;
  expiryDateFromNow(duration: string): Date;
}
