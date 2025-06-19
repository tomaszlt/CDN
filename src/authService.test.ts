import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './authService';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('API Key Generation', () => {
    it('should generate a unique API key', () => {
      const apiKey1 = authService.generateApiKey();
      const apiKey2 = authService.generateApiKey();

      expect(apiKey1).toBeTruthy();
      expect(apiKey2).toBeTruthy();
      expect(apiKey1).not.toEqual(apiKey2);
    });

    it('should generate an API key with specified permissions', () => {
      const permissions = ['read', 'write'];
      const apiKey = authService.generateApiKey(permissions);
      
      expect(authService.getApiKeyPermissions(apiKey)).toEqual(permissions);
    });
  });

  describe('API Key Validation', () => {
    it('should validate a generated API key', () => {
      const apiKey = authService.generateApiKey();
      
      expect(authService.validateApiKey(apiKey)).toBe(true);
    });

    it('should return false for an invalid API key', () => {
      expect(authService.validateApiKey('invalid-key')).toBe(false);
    });
  });

  describe('Permissions', () => {
    it('should check specific permissions', () => {
      const permissions = ['read', 'upload'];
      const apiKey = authService.generateApiKey(permissions);

      expect(authService.hasPermission(apiKey, 'read')).toBe(true);
      expect(authService.hasPermission(apiKey, 'write')).toBe(false);
    });

    it('should allow wildcard permission', () => {
      const apiKey = authService.generateApiKey(['*']);

      expect(authService.hasPermission(apiKey, 'read')).toBe(true);
      expect(authService.hasPermission(apiKey, 'write')).toBe(true);
      expect(authService.hasPermission(apiKey, 'delete')).toBe(true);
    });
  });

  describe('API Key Revocation', () => {
    it('should revoke an existing API key', () => {
      const apiKey = authService.generateApiKey();
      
      expect(authService.revokeApiKey(apiKey)).toBe(true);
      expect(authService.validateApiKey(apiKey)).toBe(false);
    });

    it('should return false when revoking a non-existent key', () => {
      expect(authService.revokeApiKey('non-existent-key')).toBe(false);
    });
  });
});