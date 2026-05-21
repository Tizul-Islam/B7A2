import { AppError } from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignup = (data: any) => {
  const { name, email, password, role } = data;

  if (!name) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Name is required');
  }

  if (!email || !emailRegex.test(email)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Valid email is required');
  }

  if (!password || password.length < 6) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Password must be at least 6 characters');
  }

  if (role && role !== 'contributor' && role !== 'maintainer') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Role must be either contributor or maintainer');
  }
};

export const validateLogin = (data: any) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email and password are required');
  }
};
