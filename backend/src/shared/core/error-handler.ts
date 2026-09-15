import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError, ValidationError } from './api-error';
import { ILoggerService } from '../services/logger/logger.service.interface';

export class ErrorHandler {
  static handleError(logger: ILoggerService) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
      if (err instanceof ZodError) {
        const validationError = new ValidationError('Validation failed');
        res.status(validationError.statusCode).json({
          ...validationError.toJSON(),
          details: err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      if (err instanceof ApiError) {
        res.status(err.statusCode).json(err.toJSON());
        return;
      }

      logger.error('Unhandled error', err instanceof Error ? err : new Error(String(err)));
      res.status(500).json({ statusCode: 500, error: 'Internal server error' });
    };
  }

  static handleNotFound(_req: Request, res: Response): void {
    res.status(404).json({ statusCode: 404, error: 'Not found' });
  }
}
