import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../errors/AppError.js';

export function rbacMiddleware(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError('Forbidden', 403);
    }
    next();
  };
}
