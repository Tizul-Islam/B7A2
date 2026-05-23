import { Response } from 'express';

export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  const responseBody: any = {
    success: true,
    statusCode,
    message,
  };
  if (data !== undefined) {
    responseBody.data = data;
  }
  return res.status(statusCode).json(responseBody);
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any
) => {
  const responseBody: any = {
    success: false,
    statusCode,
    message,
  };
  if (errors !== undefined && errors !== null) {
    responseBody.errors = errors;
  }
  return res.status(statusCode).json(responseBody);
};
