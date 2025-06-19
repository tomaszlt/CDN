import { describe, it, expect } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import { 
  validateFileDeletion, 
  UserPermissions, 
  ValidationError 
} from '../src/utils/deletionValidation';

describe('File Deletion Validation', () => {
  const validFileId = uuidv4();

  const authorizedUser: UserPermissions = {
    canDelete: true,
    userId: 'user123'
  };

  const unauthorizedUser: UserPermissions = {
    canDelete: false,
    userId: 'user456'
  };

  it('should validate deletion for authorized user', () => {
    expect(() => validateFileDeletion(validFileId, authorizedUser))
      .not.toThrow();
  });

  it('should throw error for unauthorized user', () => {
    expect(() => validateFileDeletion(validFileId, unauthorizedUser))
      .toThrow('User does not have permission to delete files');
  });

  it('should throw error for invalid file ID', () => {
    const invalidFileId = 'not-a-valid-uuid';
    expect(() => validateFileDeletion(invalidFileId, authorizedUser))
      .toThrow('Invalid file identifier');
  });

  it('should handle edge cases', () => {
    expect(() => validateFileDeletion('', authorizedUser))
      .toThrow();
    expect(() => validateFileDeletion(null as any, authorizedUser))
      .toThrow();
  });
});