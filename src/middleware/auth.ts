import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt';
import { sendErrorResponse } from '../utils/response';

// Extend Express Request object to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('Authorization');

  if (!token) {
    return sendErrorResponse(res, StatusCodes.UNAUTHORIZED, 'Authentication token missing');
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendErrorResponse(res, StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendErrorResponse(res, StatusCodes.FORBIDDEN, 'Insufficient permissions');
    }
    next();
  };
};
