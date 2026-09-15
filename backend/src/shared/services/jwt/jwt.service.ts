import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtService } from './jwt.service.interface';
import { AccessTokenPayload, RefreshTokenPayload } from './jwt.types';
import { config } from '../../config';

export class JwtService implements IJwtService {
  private static instance: JwtService;

  private constructor() {}

  static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }
    return JwtService.instance;
  }

  signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: config.jwtAccessExpiresIn,
    } as SignOptions);
  }

  signRefreshToken(payload: AccessTokenPayload): string {
    const withJti: RefreshTokenPayload = { ...payload, jti: crypto.randomUUID() };
    return jwt.sign(withJti, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiresIn,
    } as SignOptions);
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, config.jwtAccessSecret) as AccessTokenPayload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, config.jwtRefreshSecret) as RefreshTokenPayload;
  }

  expiryDateFromNow(duration: string): Date {
    const match = /^(\d+)([smhd])$/.exec(duration);
    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    const amount = Number(match[1]);
    const unit = match[2] as 's' | 'm' | 'h' | 'd';
    const unitMs: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return new Date(Date.now() + amount * unitMs[unit]);
  }
}
