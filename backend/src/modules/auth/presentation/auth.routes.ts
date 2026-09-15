import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { IDatabaseService } from '../../../shared/services/database/database.service.interface';
import { ILoggerService } from '../../../shared/services/logger/logger.service.interface';
import { IJwtService } from '../../../shared/services/jwt/jwt.service.interface';
import { AuthMiddleware } from '../../../shared/middlewares/auth.middleware';
import { ValidationMiddleware } from '../../../shared/middlewares/validate.middleware';
import { AuthFactory } from '../auth.factory';
import { signupBodySchema, loginBodySchema, refreshBodySchema } from './auth.validation';

export class AuthRoutes {
  private readonly router: Router;
  private readonly controller;

  constructor(db: IDatabaseService, logger: ILoggerService, jwt: IJwtService) {
    this.router = Router();
    this.controller = AuthFactory.create(db, logger, jwt);
    this.setupRoutes(jwt);
  }

  private setupRoutes(jwt: IJwtService): void {
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 20,
      standardHeaders: true,
      legacyHeaders: false,
    });

    this.router.post('/signup', authLimiter, ValidationMiddleware.validateBody(signupBodySchema), this.controller.signup);
    this.router.post('/login', authLimiter, ValidationMiddleware.validateBody(loginBodySchema), this.controller.login);
    this.router.post('/refresh', authLimiter, ValidationMiddleware.validateBody(refreshBodySchema), this.controller.refresh);
    this.router.post('/logout', AuthMiddleware.authenticate(jwt), this.controller.logout);
    this.router.get('/me', AuthMiddleware.authenticate(jwt), this.controller.me);
  }

  getRouter(): Router {
    return this.router;
  }
}
