import { AppError } from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

export const validateCreateIssue = (data: any) => {
  const { title, description, type } = data;

  if (!title || !description || !type) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Please provide title, description and type');
  }

  if (title.length > 150) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Title must be maximum 150 characters');
  }

  if (description.length < 20) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Description must be at least 20 characters');
  }

  if (type !== 'bug' && type !== 'feature_request') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Type must be bug or feature_request');
  }
};

export const validateUpdateIssue = (data: any) => {
  const { title, description, type, status } = data;

  if (title !== undefined && title.length > 150) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Title must be maximum 150 characters');
  }
  if (description !== undefined && description.length < 20) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Description must be at least 20 characters');
  }
  if (type !== undefined && type !== 'bug' && type !== 'feature_request') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Type must be bug or feature_request');
  }
  if (status !== undefined && status !== 'open' && status !== 'in_progress' && status !== 'resolved') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid status');
  }
};
