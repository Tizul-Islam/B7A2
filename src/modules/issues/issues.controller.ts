import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccessResponse } from '../../utils/response';
import { validateCreateIssue, validateUpdateIssue } from './issues.validation';

type AuthenticatedRequest<P = Record<string, string>> = Request<P> & {
  user: {
    id: number;
    role: string;
  };
};
import {
  createIssueService,
  getIssuesService,
  getIssueByIdService,
  updateIssueService,
  deleteIssueService
} from './issues.service';

export const createIssue = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // 1. Validate request
  validateCreateIssue(req.body);

  // 2. Call service
  const issue = await createIssueService(req.body, req.user.id);

  // 3. Send response
  sendSuccessResponse(res, StatusCodes.CREATED, 'Issue created successfully', issue);
});

export const getIssues = asyncHandler(async (req: Request, res: Response) => {
  const issues = await getIssuesService(req.query);
  sendSuccessResponse(res, StatusCodes.OK, 'Issues retrieved successfully', issues);
});

export const getIssueById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const issue = await getIssueByIdService(req.params.id);
  sendSuccessResponse(res, StatusCodes.OK, 'Issue retrieved successfully', issue);
});

export const updateIssue = asyncHandler(async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  // 1. Validate request
  validateUpdateIssue(req.body);

  // 2. Call service
  const updatedIssue = await updateIssueService(
    req.params.id,
    req.body,
    req.user.id,
    req.user.role
  );

  // 3. Send response
  sendSuccessResponse(res, StatusCodes.OK, 'Issue updated successfully', updatedIssue);
});

export const deleteIssue = asyncHandler(async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  await deleteIssueService(req.params.id);
  sendSuccessResponse(res, StatusCodes.OK, 'Issue deleted successfully');
});
