/**
 * @fileoverview Decoration Service
 * 
 * Handles business logic for decoration operations including retrieval,
 * and synchronization between Supabase and on-chain data.
 */

// ============================================================================
// IMPORTS
// ============================================================================

import { ValidationError, NotFoundError, OnChainError } from '@/core/errors';
import { getSupabaseClient } from '@/core/utils/supabase-client';
import { logError } from '@/core/utils/logger';
import { getDecorationOnChain } from '@/core/utils/dojo-client';
import type { Decoration } from '@/models/decoration.model';

// ============================================================================
// DECORATION SERVICE
// ============================================================================

/**
 * Service for managing decoration data and operations.
 */
export class DecorationService {
  
  // ============================================================================
  // DECORATION RETRIEVAL
  // ============================================================================

  /**
   * Retrieves a decoration by its ID.
   * 
   * Combines data from:
   * 1. Off-chain (Supabase): owner, kind, is_active, image_url, created_at
   * 2. On-chain (Dojo): id, owner, kind, xp_multiplier
   * 
   * @param id - Decoration ID
   * @returns Complete Decoration data
   * @throws {ValidationError} If ID is invalid
   * @throws {NotFoundError} If decoration doesn't exist
   */
  async getDecorationById(id: number): Promise<Decoration> {
    // Validate ID
    if (!id || id <= 0 || !Number.isInteger(id)) {
      throw new ValidationError('Invalid decoration ID');
    }

    const supabase = getSupabaseClient();

    // 1. Get off-chain data from Supabase
    const { data: decorationOffChain, error } = await supabase
      .from('decorations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError(`Decoration with ID ${id} not found`);
      }
      throw new Error(`Database error: ${error.message}`);
    }

    if (!decorationOffChain) {
      throw new NotFoundError(`Decoration with ID ${id} not found`);
    }

    // 2. Get on-chain data from Dojo
    try {
      const decorationOnChain = await getDecorationOnChain(id);

      // 3. Combine data
      const decoration: Decoration = {
        // On-chain data
        id: decorationOnChain.id,
        owner: decorationOnChain.owner,
        kind: decorationOnChain.kind,
        xp_multiplier: decorationOnChain.xp_multiplier,
        
        // Off-chain data
        is_active: decorationOffChain.is_active,
        imageUrl: decorationOffChain.image_url, 
        createdAt: new Date(decorationOffChain.created_at), 
      };

      return decoration;
    } catch (error) {
      logError(`Failed to get on-chain data for decoration ${id}`, error);
      // If on-chain fetch fails, we throw OnChainError as the decoration is fundamentally an on-chain asset
      throw new OnChainError(
        `Failed to retrieve on-chain data for decoration ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

