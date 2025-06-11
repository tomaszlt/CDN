import { describe, it, expect, vi } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { createFilePathValidator } from '../src/middlewares/filePathValidator';

describe('File Path Validator Middleware', () => {
  const cdnDirectory = path.resolve(process.cwd(), 'test-cdn');

  const mockRequest = (filePath: string) => ({
    path: `/${filePath}`,
  });

  const mockResponse = () => {
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    return res;
  };

  const mockNext = vi.fn();

  it('should allow access to files within CDN directory', async () => {
    const req = mockRequest('valid-file.txt');
    const res = mockResponse();
    
    // Mock fs.access to simulate file exists
    vi.spyOn(fs, 'access').mockResolvedValue(undefined);

    const middleware = createFilePathValidator(cdnDirectory);
    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.validatedFilePath).toBe(path.resolve(cdnDirectory, 'valid-file.txt'));
  });

  it('should block directory traversal attempts', async () => {
    const req = mockRequest('../sensitive-file.txt');
    const res = mockResponse();

    const middleware = createFilePathValidator(cdnDirectory);
    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Access denied',
      message: 'Requested file is outside the allowed directory'
    }));
  });

  it('should handle non-existent files', async () => {
    const req = mockRequest('non-existent.txt');
    const res = mockResponse();

    // Mock fs.access to simulate file does not exist
    vi.spyOn(fs, 'access').mockRejectedValue(new Error('File not found'));

    const middleware = createFilePathValidator(cdnDirectory);
    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'File not found',
      message: 'The requested file could not be accessed'
    }));
  });

  it('should handle absolute path attempts', async () => {
    const req = mockRequest('/etc/passwd');
    const res = mockResponse();

    const middleware = createFilePathValidator(cdnDirectory);
    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Access denied',
      message: 'Requested file is outside the allowed directory'
    }));
  });
});