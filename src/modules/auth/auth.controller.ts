import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccessResponse } from '../../utils/response';
import { validateSignup, validateLogin } from './auth.validation';
import { signupService, loginService } from './auth.service';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  // 1. Validate request
  validateSignup(req.body);

  // 2. Call service
  const user = await signupService(req.body);

  // 3. Send response
  sendSuccessResponse(res, StatusCodes.CREATED, 'User registered successfully', user);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  // 1. Validate request
  validateLogin(req.body);

  // 2. Call service
  const result = await loginService(req.body);

  // 3. Send response
  sendSuccessResponse(res, StatusCodes.OK, 'Login successful', {
    token: result.token,
    user: result.user,
  });
});
