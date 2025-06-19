import { Request, Response, NextFunction } from 'express';

interface ApiKeyConfig {
  validApiKeys: string[];
}

export class AuthMiddleware {
  private config: ApiKeyConfig;

  constructor(config: ApiKeyConfig) {
    this.config = config;
  }

  /**
   * Middleware to authenticate requests using API key
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  authenticate = (req: Request, res: Response, next: NextFunction) => {
    // Extract API key from headers or query parameters
    const apiKey = req.headers['x-api-key'] as string || req.query.apiKey as string;

    // Check if API key is provided
    if (!apiKey) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'No API key provided'
      });
    }

    // Validate API key
    if (!this.config.validApiKeys.includes(apiKey)) {
      return res.status(403).json({
        error: 'Authentication failed',
        message: 'Invalid API key'
      });
    }

    // If API key is valid, proceed to the next middleware/route handler
    next();
  }
}

// Default export for easier mocking and testing
export const createAuthMiddleware = (config: ApiKeyConfig) => {
  const middleware = new AuthMiddleware(config);
  return middleware.authenticate;
};