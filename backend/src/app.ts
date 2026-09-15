import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { IDatabaseService } from './shared/services/database/database.service.interface';
import { ILoggerService } from './shared/services/logger/logger.service.interface';
import { IJwtService } from './shared/services/jwt/jwt.service.interface';
import { config } from './shared/config';
import { AuthRoutes } from './modules/auth/presentation/auth.routes';
import { ErrorHandler } from './shared/core/error-handler';

export class App {
  static create(db: IDatabaseService, logger: ILoggerService, jwt: IJwtService): Express {
    const app = express();

    // Trust the API Gateway / ALB proxy so that req.ip and rate-limit headers
    // reflect the real client IP rather than the internal AWS forwarder address.
    app.set('trust proxy', 1);

    // Security and parsing middleware
    app.use(helmet());
    app.use(
      cors({
        origin: config.clientOrigin,
        credentials: true,
      }),
    );
    app.use(express.json());
    // Morgan is only useful in local dev; in production logs go to CloudWatch
    // via console output so morgan would just add noise.
    if (!config.isProduction) {
      app.use(morgan('dev'));
    }

    // System routes
    app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    // Feature routes
    const authRoutes = new AuthRoutes(db, logger, jwt);
    app.use('/api/auth', authRoutes.getRouter());

    // Error handling
    app.use(ErrorHandler.handleNotFound);
    app.use(ErrorHandler.handleError(logger));

    return app;
  }
}
