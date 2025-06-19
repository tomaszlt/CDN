import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import logger from '../src/config/logger';

describe('Logger Configuration', () => {
  it('should create log directory', () => {
    const logDir = path.join(process.cwd(), 'logs');
    expect(fs.existsSync(logDir)).toBeTruthy();
  });

  it('should have correct transports', () => {
    expect(logger.transports.length).toBe(3);
  });

  it('should log messages', () => {
    // Test logging without throwing errors
    expect(() => {
      logger.info('Test info log');
      logger.error('Test error log');
      logger.warn('Test warn log');
    }).not.toThrow();
  });

  it('should create log files', () => {
    const errorLogPath = path.join(process.cwd(), 'logs', 'error.log');
    const combinedLogPath = path.join(process.cwd(), 'logs', 'combined.log');
    
    expect(fs.existsSync(errorLogPath)).toBeTruthy();
    expect(fs.existsSync(combinedLogPath)).toBeTruthy();
  });
});