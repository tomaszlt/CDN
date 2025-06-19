import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { FileService } from './file-service';

describe('FileService', () => {
  const testStorageDir = './test-uploads';
  let fileService: FileService;

  beforeEach(async () => {
    fileService = new FileService(testStorageDir);
    await fs.mkdir(testStorageDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(testStorageDir, { recursive: true, force: true });
    } catch {}
  });

  it('should delete an existing file', async () => {
    const testFilename = 'test-file.txt';
    const testFilePath = path.join(testStorageDir, testFilename);
    
    await fs.writeFile(testFilePath, 'test content');
    
    await expect(fileService.deleteFile(testFilename)).resolves.toBeUndefined();
    await expect(fs.access(testFilePath)).rejects.toThrow();
  });

  it('should throw error if file does not exist', async () => {
    await expect(fileService.deleteFile('non-existent.txt'))
      .rejects.toThrow('File not found');
  });

  it('should prevent directory traversal', async () => {
    await expect(fileService.deleteFile('../sensitive-file.txt'))
      .rejects.toThrow('Invalid filename');
    await expect(fileService.deleteFile('/etc/passwd'))
      .rejects.toThrow('Invalid filename');
  });
});