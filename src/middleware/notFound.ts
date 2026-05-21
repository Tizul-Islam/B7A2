import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendErrorResponse } from '../utils/response';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  return sendErrorResponse(res, StatusCodes.NOT_FOUND, `Route not found - ${req.originalUrl}`);
};
