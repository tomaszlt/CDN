import path from 'path';
import fs from 'fs/promises';

/**
 * Validates file path to prevent directory traversal attacks
 * @param {string} cdnDirectory - Base directory for serving files
 * @returns {Function} Express middleware function
 */
export function createFilePathValidator(cdnDirectory: string) {
  return async (req, res, next) => {
    try {
      // Get the requested file path from the request
      const requestedPath = req.path.substring(1); // Remove leading slash

      // Resolve the full path, normalizing and removing any '..' or '.'
      const normalizedRequestedPath = path.normalize(requestedPath);
      const fullPath = path.resolve(cdnDirectory, normalizedRequestedPath);

      // Check if the resolved path is within the CDN directory
      const isWithinCdnDirectory = fullPath.startsWith(path.resolve(cdnDirectory));
      
      if (!isWithinCdnDirectory) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'Requested file is outside the allowed directory'
        });
      }

      // Verify the file exists and is readable
      try {
        await fs.access(fullPath, fs.constants.R_OK);
      } catch (accessError) {
        return res.status(404).json({ 
          error: 'File not found',
          message: 'The requested file could not be accessed'
        });
      }

      // Attach the validated full path to the request for further processing
      req.validatedFilePath = fullPath;
      next();
    } catch (error) {
      // Catch any unexpected errors during validation
      console.error('File path validation error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'An error occurred while validating the file path'
      });
    }
  };
}