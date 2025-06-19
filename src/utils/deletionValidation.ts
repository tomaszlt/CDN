import { z } from 'zod';

/**
 * Represents a user's permissions for file deletion
 */
export interface UserPermissions {
  canDelete: boolean;
  userId: string;
}

/**
 * Validates file deletion request
 * @param fileId File identifier to validate
 * @param userPermissions User's deletion permissions
 * @throws ValidationError if validation fails
 */
export function validateFileDeletion(
  fileId: string, 
  userPermissions: UserPermissions
): boolean {
  // Validate fileId format (UUID-like)
  const fileIdSchema = z.string().uuid('Invalid file identifier');
  
  try {
    // Validate file ID
    fileIdSchema.parse(fileId);

    // Check user deletion permissions 
    if (!userPermissions.canDelete) {
      throw new Error('User does not have permission to delete files');
    }

    // Additional validation could include:
    // - Check if file exists
    // - Verify ownership
    return true;
  } catch (error) {
    // Log the error for auditing purposes
    console.error('File deletion validation failed:', error);
    
    // Rethrow to be handled by caller
    throw error;
  }
}

/**
 * Creates a validation error for consistent error handling
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}