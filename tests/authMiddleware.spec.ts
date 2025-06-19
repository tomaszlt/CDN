import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthMiddleware } from '../src/middleware/authMiddleware';
import { Request, Response, NextFunction } from 'express';

describe('AuthMiddleware', () => {
  const validApiKey = 'valid-test-key';
  const invalidApiKey = 'invalid-test-key';

  beforeEach(() => {
    // Reset configuration before each test
    AuthMiddleware.configure({ apiKeys: [validApiKey] });
  });

  it('should allow request with valid API key', () => {
    const mockReq = {
      headers: { 'x-api-key': validApiKey }
    } as Request;

    const mockRes = {
      status: () => mockRes,
      json: () => {}
    } as unknown as Response;

    const mockNext = vi.fn() as unknown as NextFunction;

    const statusSpy = vi.spyOn(mockRes, 'status');

    AuthMiddleware.authenticate(mockReq, mockRes, mockNext);

    expect(statusSpy).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should reject request without API key', () => {
    const mockReq = {
      headers: {}
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const mockNext = vi.fn() as unknown as NextFunction;

    AuthMiddleware.authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
      message: 'No API key provided'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject request with invalid API key', () => {
    const mockReq = {
      headers: { 'x-api-key': invalidApiKey }
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const mockNext = vi.fn() as unknown as NextFunction;

    AuthMiddleware.authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Forbidden',
      message: 'Invalid API key'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});