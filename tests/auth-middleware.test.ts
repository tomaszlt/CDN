import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware } from '../src/middleware/auth-middleware';
import { Request, Response, NextFunction } from 'express';

// Mock ErrorResponse
let mockErrorResponseArgs = { message: '', details: '', statusCode: 0 };

// Mock module to replace ErrorResponse
vi.mock('../src/utils/error-response', () => ({
  ErrorResponse: vi.fn((message: string, details: string, statusCode: number) => {
    mockErrorResponseArgs = { message, details, statusCode };
    return mockErrorResponseArgs;
  })
}));

describe('Authentication Middleware', () => {
  beforeEach(() => {
    process.env.ADMIN_API_KEY = 'admin_test_key';
    vi.clearAllMocks();
    mockErrorResponseArgs = { message: '', details: '', statusCode: 0 };
  });

  it('should reject requests without an API key', () => {
    const mockReq = {
      headers: {},
      query: {},
      path: '/files/upload'
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const mockNext = vi.fn();

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockErrorResponseArgs).toEqual({
      message: 'Authentication failed',
      details: 'No API key provided',
      statusCode: 401
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should allow admin API key for all routes', () => {
    const mockReq = {
      headers: { 'x-api-key': 'admin_test_key' },
      query: {},
      path: '/files/upload'
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const mockNext = vi.fn();

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should reject invalid API keys', () => {
    const mockReq = {
      headers: { 'x-api-key': 'invalid_key' },
      query: {},
      path: '/files/upload'
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const mockNext = vi.fn();

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockErrorResponseArgs).toEqual({
      message: 'Authentication failed',
      details: 'Invalid API key',
      statusCode: 403
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});