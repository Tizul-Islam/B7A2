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


ensureLogsDirExists();



export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // 1. Double check /
    ensureLogsDirExists();

    // 2. Extract request details
    const method = req.method;
    const time = Date.now();
    const url = req.originalUrl || req.url;

    // 3. Format the log line as: Method -> GET - Time -> 1779020621335 - URL -> /api/users

    const logMessage = `Method -> ${method} - Time -> ${time} - URL -> ${url}\n\n`;


    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error(`[Logger Error] Failed to write log to ${logFilePath}:`, err);
      }
    });

  } catch (error) {
    console.error('[Logger Middleware Error]:', error);
  }

  next();
};
