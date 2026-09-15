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
      // Express 5 defines req.query as a getter-only accessor, so a plain
      // assignment (`req.query = result.data`) throws "Cannot set property
      // query of #<IncomingMessage> which has only a getter". Redefining the
      // property is required to swap in the parsed/coerced query data.
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        configurable: true,
      });
      next();
    };
  }
}
