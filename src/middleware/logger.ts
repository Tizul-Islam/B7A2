import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Define logs directory and file path
const logsDir = path.join(process.cwd(), 'logs');
const logFilePath = path.join(logsDir, 'logger.txt');

// Helper function to ensure logs directory exists
const ensureLogsDirExists = () => {
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating logs directory:', error);
  }
};

// Create the log directory initially
ensureLogsDirExists();

/**
 * Express.js Middleware to log incoming requests into logs/logger.txt
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // 1. Double check / ensure log directory exists (handles accidental directory deletion)
    ensureLogsDirExists();

    // 2. Extract request details
    const method = req.method;
    const time = Date.now(); // Current timestamp in milliseconds
    const url = req.originalUrl || req.url;

    // 3. Format the log line as: Method -> GET - Time -> 1779020621335 - URL -> /api/users
    // Followed by an extra newline to leave a blank line between logs
    const logMessage = `Method -> ${method} - Time -> ${time} - URL -> ${url}\n\n`;

    // 4. Asynchronously append log to logger.txt with error handling
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error(`[Logger Error] Failed to write log to ${logFilePath}:`, err);
      }
    });

  } catch (error) {
    // Catch block to ensure logging logic never crashes the main app thread
    console.error('[Logger Middleware Error]:', error);
  }

  // 5. Pass control to the next middleware/route handler
  next();
};
