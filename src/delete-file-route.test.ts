import { describe, it, expect, vi } from 'vitest';
import { FileDeleteController } from './delete-file-route';
import { FileService } from './file-service';

describe('FileDeleteController', () => {
  const mockFileService = {
    deleteFile: vi.fn()
  };

  const mockReq: any = {
    params: { filename: 'test-file.txt' }
  };

  const mockRes: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  };

  const mockNext = vi.fn();

  it('should delete file successfully', async () => {
    const controller = new FileDeleteController(mockFileService as any);

    await controller.deleteFile(mockReq, mockRes, mockNext);

    expect(mockFileService.deleteFile).toHaveBeenCalledWith('test-file.txt');
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'File deleted successfully',
      filename: 'test-file.txt'
    });
  });

  it('should handle file not found error', async () => {
    mockFileService.deleteFile.mockRejectedValue(new Error('File not found'));
    const controller = new FileDeleteController(mockFileService as any);

    await controller.deleteFile(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'File not found' });
  });

  it('should handle invalid filename', async () => {
    mockFileService.deleteFile.mockRejectedValue(new Error('Invalid filename'));
    const controller = new FileDeleteController(mockFileService as any);

    await controller.deleteFile(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid filename' });
  });

  it('should handle internal server error', async () => {
    mockFileService.deleteFile.mockRejectedValue(new Error('Unknown error'));
    const controller = new FileDeleteController(mockFileService as any);

    await controller.deleteFile(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});