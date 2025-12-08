/**
 * @fileoverview Base Error Class
 * 
 * Base class for all custom errors in the application.
 * All error classes should extend this to ensure consistent structure.
 */

export abstract class BaseError extends Error {
  public readonly code: number;
  public readonly type: string;

  constructor(message: string, code: number, type: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.type = type;
    Error.captureStackTrace(this, this.constructor);
  }
}

