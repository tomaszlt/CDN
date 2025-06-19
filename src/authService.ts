// Authentication Service
import crypto from 'crypto';

export interface ApiKey {
  key: string;
  permissions: string[];
}

export class AuthService {
  private apiKeys: Map<string, ApiKey>;

  constructor() {
    this.apiKeys = new Map();
  }

  generateApiKey(permissions: string[] = []): string {
    const key = crypto.randomBytes(32).toString('hex');
    this.apiKeys.set(key, { key, permissions });
    return key;
  }

  validateApiKey(apiKey: string): boolean {
    return this.apiKeys.has(apiKey);
  }

  getApiKeyPermissions(apiKey: string): string[] {
    const keyData = this.apiKeys.get(apiKey);
    return keyData ? keyData.permissions : [];
  }

  hasPermission(apiKey: string, requiredPermission: string): boolean {
    const permissions = this.getApiKeyPermissions(apiKey);
    return permissions.includes(requiredPermission) || 
           permissions.includes('*'); // wildcard permission
  }

  revokeApiKey(apiKey: string): boolean {
    return this.apiKeys.delete(apiKey);
  }
}