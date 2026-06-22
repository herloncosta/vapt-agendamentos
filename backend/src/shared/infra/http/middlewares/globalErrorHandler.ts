import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../errors/AppError.js';
import { ZodError } from 'zod';

export function globalErrorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'validation_error',
      errors: err.errors.map((z) => ({
        field: z.path.join('.'),
        message: z.message,
      })),
    });
  }

  console.error('[CRITICAL INTERNAL ERROR]:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error. Contact the administration.',
  });
}
