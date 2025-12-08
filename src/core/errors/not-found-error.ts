/**
 * @fileoverview Not Found Error
 * 
 * Error thrown when a requested resource is not found.
 * Use this for missing players, fish, tanks, etc.
 */

import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 404, 'NotFoundError');
  }
}

