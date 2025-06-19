import fs from 'fs/promises';
import path from 'path';

export class FileService {
  private storageDirectory: string;

  constructor(storageDirectory: string = './uploads') {
    this.storageDirectory = storageDirectory;
  }

  /**
   * Delete a file from the storage directory
   * @param filename - Name of the file to delete
   * @throws {Error} If file cannot be deleted
   */
  async deleteFile(filename: string): Promise<void> {
    // Validate filename to prevent directory traversal attacks
    if (!filename || filename.includes('..') || filename.startsWith('/')) {
      throw new Error('Invalid filename');
    }

    const filePath = path.join(this.storageDirectory, filename);

    try {
      // Check if file exists before attempting deletion
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error('File not found');
      }
      throw new Error('Failed to delete file');
    }
  }
}