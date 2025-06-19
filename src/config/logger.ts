import winston from 'winston';
import path from 'path';

// Create logs directory if it doesn't exist
const logDir = path.join(process.cwd(), 'logs');

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create a Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      handleExceptions: true,
    }),
    
    // File transport for combined logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      handleExceptions: true,
    })
  ],
  exitOnError: false
});

// Create log directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export default logger;