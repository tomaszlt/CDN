import { Request, Response, NextFunction } from 'express';

export interface AuthConfig {
  apiKeys: string[];
}

export class AuthMiddleware {
  private static config: AuthConfig = { apiKeys: [] };

  /**
   * Configure the authentication middleware with API keys
   * @param config Authentication configuration object
   */
  public static configure(config: AuthConfig): void {
    this.config = config;
  }

  /**
   * Middleware to validate API key for protected routes
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  public static authenticate(req: Request, res: Response, next: NextFunction): void {
    // Extract API key from request
    const apiKey = req.headers['x-api-key'] as string;

    // Check if API key is provided
    if (!apiKey) {
      res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No API key provided' 
      });
      return;
    }

    // Validate API key
    const isValidKey = this.config.apiKeys.includes(apiKey);

    if (!isValidKey) {
      res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Invalid API key' 
      });
      return;
    }

    // API key is valid, proceed to next middleware
    next();
  }
}