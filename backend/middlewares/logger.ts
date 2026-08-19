import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

export const logger = (
  req: Request, //request sent to the server
  res: Response, //object used to send response back to the client
  next: NextFunction  //function to pass control to the next middleware or route handler
) => {
  const timestamp = new Date().toISOString();

  const body =
    req.body && Object.keys(req.body).length > 0
      ? JSON.stringify(req.body)
      : '';

  const logMessage = `[${timestamp}] ${req.method} ${req.originalUrl} ${body}\n`;

  const logPath = path.join(__dirname, '..', 'log.txt');

  fs.appendFile(logPath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });

  // Call the next middleware or route handler
  next();
};