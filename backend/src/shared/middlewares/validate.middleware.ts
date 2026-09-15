import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../core/api-error';

export class ValidationMiddleware {
  static validateBody(schema: ZodSchema) {
    return (req: Request, _res: Response, next: NextFunction): void => {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        next(
          new ValidationError(
            result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
          ),
        );
        return;
      }
      req.body = result.data;
      next();
    };
  }

  static validateParams(schema: ZodSchema) {
    return (req: Request, _res: Response, next: NextFunction): void => {
      const result = schema.safeParse(req.params);
      if (!result.success) {
        next(
          new ValidationError(
            result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
          ),
        );
        return;
      }
      req.params = result.data;
      next();
    };
  }

  static validateQuery(schema: ZodSchema) {
    return (req: Request, _res: Response, next: NextFunction): void => {
      const result = schema.safeParse(req.query);
      if (!result.success) {
        next(
          new ValidationError(
            result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
          ),
        );
        return;
      }
      req.query = result.data;
      next();
    };
  }
}
