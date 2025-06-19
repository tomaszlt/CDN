import { Request, Response, NextFunction } from 'express';
import { FileService } from './file-service';

export class FileDeleteController {
  private fileService: FileService;

  constructor(fileService?: FileService) {
    this.fileService = fileService || new FileService();
  }

  /**
   * DELETE route handler for file deletion
   * @param req Express request object
   * @param res Express response object
   * @param next Express next middleware function
   */
  deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res.status(400).json({ 
          error: 'Filename is required' 
        });
      }

      await this.fileService.deleteFile(filename);

      res.status(200).json({ 
        message: 'File deleted successfully',
        filename 
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case 'File not found':
            return res.status(404).json({ error: error.message });
          case 'Invalid filename':
            return res.status(400).json({ error: error.message });
          default:
            return res.status(500).json({ error: 'Internal server error' });
        }
      }
      next(error);
    }
  }
}