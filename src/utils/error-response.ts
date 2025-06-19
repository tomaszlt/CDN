export class ErrorResponse {
  message: string;
  details: string;
  statusCode: number;

  constructor(message: string, details: string, statusCode: number = 500) {
    this.message = message;
    this.details = details;
    this.statusCode = statusCode;
  }
}