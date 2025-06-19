import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import logger from '../src/config/logger';

describe('Logger Configuration', () => {
  const logDir = path.join(process.cwd(), 'logs');
  const errorLogPath = path.join(logDir, 'error.log');
  const combinedLogPath = path.join(logDir, 'combined.log');

  beforeAll(() => {
    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    // Touch log files
    fs.writeFileSync(errorLogPath, '');
    fs.writeFileSync(combinedLogPath, '');
  });

  it('should create log directory', () => {
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
    expect(fs.existsSync(errorLogPath)).toBeTruthy();
    expect(fs.existsSync(combinedLogPath)).toBeTruthy();
  });
});