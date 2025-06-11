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

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console transport
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
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Logger for file retrieval operations
export const fileRetrievalLogger = {
  logFileAccess: (filePath: string, clientIp: string) => {
    logger.info(`File Retrieved: Path=${filePath}, ClientIP=${clientIp}`);
  },
  
  logFileAccessError: (filePath: string, errorMessage: string, clientIp: string) => {
    logger.error(`File Access Error: Path=${filePath}, Error=${errorMessage}, ClientIP=${clientIp}`);
  }
};

export default logger;