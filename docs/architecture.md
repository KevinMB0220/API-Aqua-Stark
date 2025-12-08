# Architecture

This document describes the architecture and design decisions of the Aqua Stark Backend API.

## Overview

The Aqua Stark Backend API is a lightweight orchestration layer that coordinates actions between:
- Unity (frontend)
- Cartridge (authentication)
- Supabase (off-chain data)
- Dojo + Cairo contracts (on-chain)

## System Architecture

```
┌─────────┐
│  Unity  │
│(Client) │
└────┬────┘
     │
     │ HTTP/JSON
     │
┌────▼─────────────────────┐
│   Aqua Stark Backend     │
│   (Fastify API)          │
└────┬─────────────────────┘
     │
     ├──────────┬──────────┬──────────┐
     │          │          │          │
┌────▼───┐ ┌───▼───┐ ┌────▼────┐ ┌───▼────┐
│Cartridge│ │Supabase│ │  Dojo   │ │Starknet│
│  Auth  │ │   DB   │ │   ECS   │ │  RPC   │
└────────┘ └────────┘ └─────────┘ └────────┘
```

## Layer Architecture

The application follows a layered architecture:

```
┌─────────────────────────────────────┐
│           API Layer                  │
│  (Routes, Request/Response)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Controller Layer              │
│  (Extract params, call services)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Service Layer                │
│  (Business logic, orchestration)    │
└──────────────┬──────────────────────┘
               │
     ┌─────────┴─────────┐
     │                   │
┌────▼────┐        ┌─────▼─────┐
│Supabase │        │  Dojo/     │
│   DB    │        │ Starknet   │
└─────────┘        └────────────┘
```

## Folder Structure

```
/src
├── api/                  # Route definitions grouped by resource
│   └── index.ts          # Route registration
├── controllers/          # Request handlers (no business logic)
│   └── *.controller.ts
├── services/             # Business logic and orchestration
│   └── *.service.ts
├── models/               # Domain entities and DTOs
│   └── *.model.ts
└── core/                 # Core system components
    ├── types/            # Shared types (LOCKED)
    ├── errors/           # Custom error classes
    ├── responses/        # Response helpers (LOCKED)
    ├── middleware/       # Global middleware
    ├── utils/            # Pure utility functions
    └── config/           # Configuration and constants
```

## Request Flow

### 1. Request Arrives
```
Client → Fastify → Route Handler
```

### 2. Controller Processing
```
Controller extracts:
- URL parameters
- Query parameters
- Request body
- Headers
```

### 3. Service Execution
```
Service performs:
- Input validation
- Business logic
- Database operations (Supabase)
- On-chain operations (Dojo/Starknet)
```

### 4. Response Generation
```
Service returns data
↓
Controller wraps in standard response
↓
Fastify sends JSON response
```

### 5. Error Handling
```
Error occurs
↓
Error middleware catches it
↓
Transforms to standard error format
↓
Returns with appropriate HTTP status
```

## Core Components

### Types System (`/core/types/`)

Defines the locked response types that ensure consistency:
- `SuccessResponse<T>` - Success response structure
- `ErrorResponse` - Error response structure
- `ControllerResponse<T>` - Mandatory controller return type

**Status**: LOCKED - Cannot be modified

### Response System (`/core/responses/`)

Helper functions for creating standardized responses:
- `createSuccessResponse()` - Creates success responses
- `createErrorResponse()` - Creates error responses

**Status**: LOCKED - Cannot be modified

### Error System (`/core/errors/`)

Custom error classes for different error scenarios:
- `ValidationError` (400)
- `NotFoundError` (404)
- `ConflictError` (409)
- `OnChainError` (500)

### Middleware (`/core/middleware/`)

Global middleware for error handling:
- `errorHandler` - Catches all errors and transforms to standard format

## Design Principles

### 1. Separation of Concerns

Each layer has a single, well-defined responsibility:
- **Controllers**: Request/response handling
- **Services**: Business logic
- **Models**: Data structures
- **Core**: System infrastructure

### 2. Type Safety

TypeScript strict mode ensures:
- All types are explicit
- No `any` types
- Compile-time error checking
- Response format enforcement

### 3. Standardization

- All responses follow the same format
- All errors use custom error classes
- Consistent naming conventions
- Uniform code structure

### 4. Scalability

- Modular architecture
- Easy to add new endpoints
- Clear separation allows parallel development
- Standardized patterns reduce learning curve

## Authentication Flow

```
1. Unity opens Cartridge login WebView
2. User authenticates with Cartridge
3. Cartridge redirects with wallet address
4. Unity sends address to backend
5. Backend:
   - Creates player if new (register_player on-chain)
   - Returns player data if exists
```

No wallet or signing happens directly in Unity.

## Data Synchronization

### Off-Chain (Supabase)
- Player profiles
- Fish data
- Tank configurations
- Game state

### On-Chain (Dojo/Starknet)
- Player registration
- Fish breeding
- Transactions
- Ownership records

### Sync Queue
1. Backend executes on-chain action
2. Saves `tx_hash` to sync queue
3. Background process confirms transaction
4. Updates Supabase if needed

## Technology Stack

| Component      | Technology | Version  | Purpose                    |
|----------------|------------|----------|----------------------------|
| Runtime        | Node.js    | 20.10.0  | JavaScript execution       |
| Language       | TypeScript | 5.3.x    | Type safety                |
| Framework      | Fastify    | 4.24.x   | HTTP server                |
| Database       | Supabase   | 2.38.3   | Off-chain data             |
| Blockchain     | Starknet.js| 5.14.x   | On-chain interactions      |
| Game Engine    | Dojo       | 0.4.x    | ECS on-chain               |

## Configuration

All configuration is centralized in `/core/config/`:
- Environment variables
- External endpoints
- Game constants
- Multipliers and limits

## Future Considerations

The architecture is designed to support:
- Horizontal scaling
- Microservices migration (if needed)
- Additional game features
- Multiple client types
- Real-time updates (WebSocket support)

