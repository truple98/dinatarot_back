import { Request, Response, NextFunction } from 'express';

export interface LogLevel {
  INFO: string;
  WARN: string;
  ERROR: string;
  DEBUG: string;
}

export const LOG_LEVELS: LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

export class Logger {
  private static formatLog(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  static info(message: string, meta?: any): void {
    console.log(this.formatLog(LOG_LEVELS.INFO, message, meta));
  }

  static warn(message: string, meta?: any): void {
    console.warn(this.formatLog(LOG_LEVELS.WARN, message, meta));
  }

  static error(message: string, error?: any, meta?: any): void {
    console.error(this.formatLog(LOG_LEVELS.ERROR, message, { error: error?.message || error, ...meta }));
    if (error?.stack) {
      console.error(error.stack);
    }
  }

  static debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatLog(LOG_LEVELS.DEBUG, message, meta));
    }
  }
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const level = status >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;

    Logger.info(`${req.method} ${req.originalUrl}`, {
      status,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });

  next();
}