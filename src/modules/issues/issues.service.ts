import pool from '../../db';
import { AppError } from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { Issue, IssueWithReporter } from './issues.interface';

export const createIssueService = async (data: any, reporterId: number): Promise<Issue> => {
  const { title, description, type } = data;

  const queryText = `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  
  const result = await pool.query(queryText, [title, description, type, reporterId]);
  return result.rows[0];
};

export const getIssuesService = async (queryFilters: any): Promise<IssueWithReporter[]> => {
  const { sort = 'newest', type, status } = queryFilters;

  let queryText = 'SELECT * FROM issues WHERE 1=1';
  const queryParams: any[] = [];
  let paramCount = 1;

  if (type) {
    queryText += ` AND type = $${paramCount}`;
    queryParams.push(type);
    paramCount++;
  }

  if (status) {
    queryText += ` AND status = $${paramCount}`;
    queryParams.push(status);
    paramCount++;
  }

  if (sort === 'oldest') {
    queryText += ' ORDER BY created_at ASC';
  } else {
    queryText += ' ORDER BY created_at DESC';
  }

  const issuesResult = await pool.query(queryText, queryParams);
  const issues = issuesResult.rows;

  if (issues.length === 0) {
    return [];
  }

  const reporterIds = [...new Set(issues.map(issue => issue.reporter_id))];
  const reportersQuery = `SELECT id, name, role FROM users WHERE id = ANY($1)`;
  const reportersResult = await pool.query(reportersQuery, [reporterIds]);
  
  const reporterMap = reportersResult.rows.reduce((acc, reporter) => {
    acc[reporter.id] = reporter;
    return acc;
  }, {} as Record<number, any>);

  return issues.map(issue => {
    const { reporter_id, ...issueData } = issue;
    return {
      ...issueData,
      reporter: reporterMap[reporter_id] || null
    };
  });
};

export const getIssueByIdService = async (id: string): Promise<IssueWithReporter> => {
  const issueResult = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);
  const issue = issueResult.rows[0];

  if (!issue) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');
  }

  const reporterResult = await pool.query('SELECT id, name, role FROM users WHERE id = $1', [issue.reporter_id]);
  const reporter = reporterResult.rows[0];

  const { reporter_id, ...issueData } = issue;
  return {
    ...issueData,
    reporter: reporter || null
  };
};

export const updateIssueService = async (id: string, updateData: any, userId: number, userRole: string): Promise<Issue> => {
  const { title, description, type, status } = updateData;

  const issueResult = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);
  const issue = issueResult.rows[0];

  if (!issue) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');
  }

  // Authorization check
  if (userRole === 'contributor') {
    if (issue.reporter_id !== userId) {
      throw new AppError(StatusCodes.FORBIDDEN, 'You can only update your own issues');
    }
    if (issue.status !== 'open') {
      throw new AppError(StatusCodes.CONFLICT, 'You can only update open issues');
    }
    if (status && status !== issue.status) {
       throw new AppError(StatusCodes.FORBIDDEN, 'Contributors cannot change issue status');
    }
  }

  const updates: string[] = [];
  const queryParams: any[] = [];
  let paramCount = 1;

  if (title !== undefined) {
    updates.push(`title = $${paramCount}`);
    queryParams.push(title);
    paramCount++;
  }
  if (description !== undefined) {
    updates.push(`description = $${paramCount}`);
    queryParams.push(description);
    paramCount++;
  }
  if (type !== undefined) {
    updates.push(`type = $${paramCount}`);
    queryParams.push(type);
    paramCount++;
  }
  if (status !== undefined && userRole === 'maintainer') {
    updates.push(`status = $${paramCount}`);
    queryParams.push(status);
    paramCount++;
  }

  if (updates.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'No valid fields provided for update');
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  queryParams.push(id);
  
  const updateQuery = `
    UPDATE issues 
    SET ${updates.join(', ')} 
    WHERE id = $${paramCount} 
    RETURNING *
  `;

  const updatedResult = await pool.query(updateQuery, queryParams);
  return updatedResult.rows[0];
};

export const deleteIssueService = async (id: string): Promise<void> => {
  const issueResult = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);
  
  if (issueResult.rows.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');
  }

  await pool.query('DELETE FROM issues WHERE id = $1', [id]);
};
