import { Request, Response, NextFunction } from 'express';
import { IJwtService } from '../services/jwt/jwt.service.interface';

export class AuthMiddleware {
  static authenticate(jwtService: IJwtService) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const header = req.headers.authorization;
      if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ statusCode: 401, error: 'Missing or invalid Authorization header' });
        return;
      }

      const token = header.slice('Bearer '.length);
      try {
        req.user = jwtService.verifyAccessToken(token);
        next();
      } catch {
        res.status(401).json({ statusCode: 401, error: 'Invalid or expired access token' });
      }
    };
  }
}
