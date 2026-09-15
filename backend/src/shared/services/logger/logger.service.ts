import { ILoggerService } from './logger.service.interface';

export class LoggerService implements ILoggerService {
  private static instance: LoggerService;

  private constructor() {}

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  info(message: string, meta?: Record<string, unknown>): void {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }));
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        error: error?.message,
        stack: error?.stack,
        ...meta,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env['NODE_ENV'] !== 'production') {
      console.debug(JSON.stringify({ level: 'debug', message, ...meta, timestamp: new Date().toISOString() }));
    }
  }
}
