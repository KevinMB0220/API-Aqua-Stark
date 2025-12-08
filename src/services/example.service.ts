/**
 * @fileoverview Example Service
 * 
 * Example service showing how to implement business logic.
 * Services contain validation, orchestration, and calls to external systems.
 * 
 * Services should throw custom error classes that will be caught
 * by the error middleware and transformed to standard responses.
 */

import { ValidationError, NotFoundError } from '../core/errors';
import type { ExampleEntity, CreateExampleDto } from '../models/example.model';

/**
 * Example service demonstrating business logic patterns.
 * 
 * Services should:
 * - Validate inputs
 * - Orchestrate operations
 * - Call Supabase for data
 * - Execute on-chain operations via Dojo/Starknet
 * - Throw appropriate custom errors
 */
export class ExampleService {
  /**
   * Example method showing validation and error throwing.
   */
  async createExample(dto: CreateExampleDto): Promise<ExampleEntity> {
    // Validate input
    if (!dto.name || dto.name.trim().length === 0) {
      throw new ValidationError('Name is required');
    }

    // Simulate database operation
    // In real implementation, this would call Supabase
    const example: ExampleEntity = {
      id: 'example-id',
      name: dto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return example;
  }

  /**
   * Example method showing NotFoundError usage.
   */
  async getExampleById(id: string): Promise<ExampleEntity> {
    // Simulate database lookup
    // In real implementation, this would query Supabase
    if (id !== 'example-id') {
      throw new NotFoundError(`Example with id ${id} not found`);
    }

    return {
      id,
      name: 'Example',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

