import { Request, Response, NextFunction } from 'express';

export interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

export function errorHandler(err: ErrorWithStatus, req: Request, res: Response, next: NextFunction): void {
  console.error('ERROR:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const status = err.status || err.statusCode || 500;
  const message = status === 500 ? '서버에서 오류가 발생했다요...' : err.message;

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack
    })
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `경로를 찾을 수 없다요: ${req.originalUrl}`
  });
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}