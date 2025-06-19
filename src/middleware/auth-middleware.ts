import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/error-response';

// Define an interface for the API key configuration
interface ApiKeyConfig {
  key: string;
  allowedRoutes: string[];
}

// Simplified API key management (in a real-world scenario, use a more secure method)
const API_KEYS: ApiKeyConfig[] = [
  {
    key: process.env.ADMIN_API_KEY || 'default_admin_key',
    allowedRoutes: ['*'] // Admin key has access to all routes
  },
  {
    key: process.env.READ_API_KEY || 'default_read_key',
    allowedRoutes: ['/files/retrieve'] // Read-only access
  }
];

/**
 * Authentication middleware to validate API keys
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Extract API key from headers or query parameter
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  // Check if API key is provided
  if (!apiKey) {
    return res.status(401).json(
      new ErrorResponse('Authentication failed', 'No API key provided', 401)
    );
  }

  // Find the matching API key configuration
  const apiKeyConfig = API_KEYS.find(config => config.key === apiKey);

  // Validate the API key
  if (!apiKeyConfig) {
    return res.status(403).json(
      new ErrorResponse('Authentication failed', 'Invalid API key', 403)
    );
  }

  // Check route permissions
  const currentRoute = req.path;
  const hasRouteAccess = apiKeyConfig.allowedRoutes.includes('*') || 
    apiKeyConfig.allowedRoutes.includes(currentRoute);

  if (!hasRouteAccess) {
    return res.status(403).json(
      new ErrorResponse('Authorization failed', 'Insufficient permissions', 403)
    );
  }

  // If all checks pass, explicitly call next()
  next();
};