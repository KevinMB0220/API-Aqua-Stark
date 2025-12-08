# Models

This document describes the model system and how to define domain entities in the Aqua Stark Backend API.

## Overview

Models represent the domain entities of the game (Player, Fish, Tank, etc.). They define the structure of data and DTOs (Data Transfer Objects) used throughout the application.

## Model Structure

Models are defined in the `/src/models/` directory using TypeScript interfaces or types.

### Entity Models

Entity models represent the complete structure of domain entities as they exist in the database.

```typescript
/**
 * @fileoverview Player Model
 * 
 * Represents a player in the Aqua Stark game.
 */
export interface Player {
  id: string;
  address: string; // Starknet wallet address
  username?: string;
  createdAt: Date;
  updatedAt: Date;
  xp: number;
  level: number;
}
```

### DTOs (Data Transfer Objects)

DTOs define the structure of data for specific operations (create, update, etc.).

#### Create DTOs

```typescript
/**
 * DTO for creating a new player.
 */
export interface CreatePlayerDto {
  address: string;
  username?: string;
}
```

#### Update DTOs

```typescript
/**
 * DTO for updating an existing player.
 */
export interface UpdatePlayerDto {
  username?: string;
}
```

## Best Practices

### 1. Use Interfaces for Models

Prefer interfaces over types for models as they are more extensible:

```typescript
// Good
export interface Fish {
  id: string;
  species: string;
}

// Also acceptable, but interfaces preferred
export type Fish = {
  id: string;
  species: string;
}
```

### 2. Separate Entity Models from DTOs

Keep entity models (database structure) separate from DTOs (API input/output):

```typescript
// Entity model (database structure)
export interface Fish {
  id: string;
  species: string;
  dna: string;
  createdAt: Date;
  updatedAt: Date;
}

// DTO for creating (what the API accepts)
export interface CreateFishDto {
  species: string;
  dna: string;
}

// DTO for response (what the API returns)
export interface FishResponse {
  id: string;
  species: string;
  dna: string;
  createdAt: string; // ISO string for JSON
}
```

### 3. Use Optional Properties Appropriately

Mark properties as optional only when they truly can be undefined:

```typescript
export interface Player {
  id: string; // Required
  address: string; // Required
  username?: string; // Optional - player might not have set a username
  avatarUrl?: string; // Optional - player might not have an avatar
}
```

### 4. Document Complex Types

Add JSDoc comments for complex or non-obvious properties:

```typescript
export interface Fish {
  id: string;
  species: string;
  /**
   * DNA string representing genetic traits.
   * Format: hexadecimal string of 64 characters.
   */
  dna: string;
  /**
   * Experience points earned by this fish.
   * Used for leveling and evolution calculations.
   */
  xp: number;
}
```

### 5. Use Enums for Fixed Values

Use TypeScript enums for properties with fixed possible values:

```typescript
export enum FishRarity {
  Common = 'common',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}

export interface Fish {
  id: string;
  species: string;
  rarity: FishRarity;
}
```

## Model Examples

### Player Model

```typescript
export interface Player {
  id: string;
  address: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
  xp: number;
  level: number;
}

export interface CreatePlayerDto {
  address: string;
  username?: string;
}

export interface UpdatePlayerDto {
  username?: string;
}
```

### Fish Model

```typescript
export interface Fish {
  id: string;
  playerId: string;
  species: string;
  dna: string;
  xp: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFishDto {
  playerId: string;
  species: string;
  dna: string;
}

export interface FeedFishDto {
  foodType: string;
  amount: number;
}
```

### Tank Model

```typescript
export interface Tank {
  id: string;
  playerId: string;
  name: string;
  capacity: number;
  currentCount: number;
  fishIds: string[];
  decorationIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTankDto {
  playerId: string;
  name: string;
  capacity?: number; // Defaults to MAX_TANK_CAPACITY
}
```

## Model Organization

Organize models by domain entity:

```
/src/models/
├── player.model.ts
├── fish.model.ts
├── tank.model.ts
└── decoration.model.ts
```

Each model file should export:
- The entity interface
- Create DTOs
- Update DTOs
- Response DTOs (if different from entity)
- Any related enums or types

## Type Safety

Models provide type safety throughout the application:

```typescript
// In services
async function createPlayer(dto: CreatePlayerDto): Promise<Player> {
  // TypeScript ensures dto matches CreatePlayerDto
  // Return type ensures we return a Player
}

// In controllers
async function createPlayer(
  request: FastifyRequest<{ Body: CreatePlayerDto }>
): Promise<ControllerResponse<Player>> {
  const dto = request.body; // Typed as CreatePlayerDto
  const player = await playerService.create(dto); // Typed as Player
  return createSuccessResponse(player);
}
```

## Database Mapping

Models represent the structure in Supabase. When querying Supabase, map the results to your models:

```typescript
// In service
const { data, error } = await supabase
  .from('players')
  .select('*')
  .eq('address', address)
  .single();

if (error || !data) {
  throw new NotFoundError('Player not found');
}

// Map to model (Supabase returns dates as strings)
const player: Player = {
  ...data,
  createdAt: new Date(data.createdAt),
  updatedAt: new Date(data.updatedAt),
};
```

