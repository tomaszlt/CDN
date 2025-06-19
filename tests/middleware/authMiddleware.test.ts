import { describe, it, expect, vi } from 'vitest';
import { createAuthMiddleware } from '../../src/middleware/authMiddleware';

describe('AuthMiddleware', () => {
  const validApiKeys = ['valid-key-1', 'valid-key-2'];
  const authMiddleware = createAuthMiddleware({ validApiKeys });

  const mockRequest = (apiKey?: string, source: 'header' | 'query' = 'header') => {
    const req: any = {
      headers: source === 'header' ? { 'x-api-key': apiKey } : {},
      query: source === 'query' ? { apiKey } : {}
    };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();
    return { req, res, next };
  };

  it('should call next when a valid API key is provided via header', () => {
    const { req, res, next } = mockRequest('valid-key-1');
    
    authMiddleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should call next when a valid API key is provided via query', () => {
    const { req, res, next } = mockRequest('valid-key-2', 'query');
    
    authMiddleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 401 when no API key is provided', () => {
    const { req, res, next } = mockRequest();
    
    authMiddleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authentication failed',
      message: 'No API key provided'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 when an invalid API key is provided', () => {
    const { req, res, next } = mockRequest('invalid-key');
    
    authMiddleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authentication failed',
      message: 'Invalid API key'
    });
    expect(next).not.toHaveBeenCalled();
  });
});