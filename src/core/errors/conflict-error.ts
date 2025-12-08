/**
 * @fileoverview Conflict Error
 * 
 * Error thrown when a request conflicts with the current state.
 * Use this for duplicate resources, state conflicts, etc.
 */

import { BaseError } from './base-error';

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, 409, 'ConflictError');
  }
}

