import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppError';
import { sendErrorResponse } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';

  if (err.code === '23505') {
    statusCode = StatusCodes.CONFLICT;
    message = 'Email already exists';
  }

  sendErrorResponse(res, statusCode, message, err.errors || null);
};
