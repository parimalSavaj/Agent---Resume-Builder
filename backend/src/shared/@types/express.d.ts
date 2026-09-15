import { AccessTokenPayload } from '../services/jwt/jwt.types';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
