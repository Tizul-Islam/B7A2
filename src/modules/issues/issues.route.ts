import { Router } from 'express';
import { createIssue, getIssues, getIssueById, updateIssue, deleteIssue } from './issues.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, createIssue);
router.get('/', getIssues);
router.get('/:id', getIssueById);
router.patch('/:id', authenticate, updateIssue);
router.delete('/:id', authenticate, authorize('maintainer'), deleteIssue);

export const issueRoutes = router;
