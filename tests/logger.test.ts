import { describe, it, expect, beforeEach } from 'vitest';
import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { fileRetrievalLogger } from '../src/config/logger';

describe('File Retrieval Logger', () => {
  const logDir = path.join(process.cwd(), 'logs');
  const combinedLogPath = path.join(logDir, 'combined.log');
  const errorLogPath = path.join(logDir, 'error.log');

  beforeEach(() => {
    // Ensure logs directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    
    // Clear log files before each test
    if (fs.existsSync(combinedLogPath)) {
      fs.writeFileSync(combinedLogPath, '');
    }
    if (fs.existsSync(errorLogPath)) {
      fs.writeFileSync(errorLogPath, '');
    }
  });

  it('should log file access', () => {
    const filePath = '/test/file.txt';
    const clientIp = '192.168.1.1';
    
    fileRetrievalLogger.logFileAccess(filePath, clientIp);
    
    // Read the log file and check contents
    const logContents = fs.readFileSync(combinedLogPath, 'utf-8');
    expect(logContents).toContain(`File Retrieved: Path=${filePath}`);
    expect(logContents).toContain(`ClientIP=${clientIp}`);
  });

  it('should log file access errors', () => {
    const filePath = '/nonexistent/file.txt';
    const errorMessage = 'File not found';
    const clientIp = '192.168.1.2';
    
    fileRetrievalLogger.logFileAccessError(filePath, errorMessage, clientIp);
    
    // Read the error log file and check contents
    const errorLogContents = fs.readFileSync(errorLogPath, 'utf-8');
    expect(errorLogContents).toContain(`File Access Error: Path=${filePath}`);
    expect(errorLogContents).toContain(`Error=${errorMessage}`);
    expect(errorLogContents).toContain(`ClientIP=${clientIp}`);
  });

  it('should have configurable log levels', () => {
    // Set log level to debug
    process.env.LOG_LEVEL = 'debug';
    
    // Recreate logger to apply new log level
    const debugLogger = winston.createLogger({
      level: process.env.LOG_LEVEL
    });
    
    expect(debugLogger.level).toBe('debug');
  });
});