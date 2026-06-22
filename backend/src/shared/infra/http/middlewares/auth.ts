import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../../errors/AppError.js';

interface TokenPayload {
  sub: string;
  role: string;
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    throw new AppError('Token not provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}
