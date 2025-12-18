# Testing Guide

Quick reference for running and creating unit tests.

## Commands

```bash
npm test              # Watch mode (development)
npm run test:ui       # Interactive UI
npm run test:run      # Run once (CI/CD)
npm run test:coverage # Coverage report
```

## Structure

Tests mirror `src/` structure in `tests/`:

```
tests/
├── core/utils/       # Utility tests
├── services/         # Service tests
└── controllers/      # Controller tests
```

**Rule**: `src/services/player.service.ts` → `tests/services/player.service.test.ts`

## Creating a New Test

### 1. Create test file

Place it in `tests/` following `src/` structure with `.test.ts` suffix.

### 2. Basic template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YourService } from '@/services/your.service';

// Mock dependencies at top
vi.mock('@/core/utils/supabase-client');
vi.mock('@/core/utils/dojo-client');
vi.mock('@/core/utils/logger', () => ({ logError: vi.fn() }));

describe('YourService', () => {
  beforeEach(() => {
    // Setup mocks
  });

  describe('methodName', () => {
    it('should [expected behavior]', () => {
      // Arrange, Act, Assert
    });
  });
});
```

## Mocking

### Supabase

```typescript
import { getSupabaseClient } from '@/core/utils/supabase-client';

vi.mock('@/core/utils/supabase-client');

const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  })),
};

vi.mocked(getSupabaseClient).mockReturnValue(mockSupabase);
```

### Dojo/Starknet

```typescript
import { registerPlayer } from '@/core/utils/dojo-client';

vi.mock('@/core/utils/dojo-client');
vi.mocked(registerPlayer).mockResolvedValue({ tx_hash: '0xabc' });
```

### Logger

```typescript
vi.mock('@/core/utils/logger', () => ({
  logError: vi.fn(),
}));
```

## Examples by Layer

### Utility Test

```typescript
import { describe, it, expect } from 'vitest';
import { calculateFishXp } from '@/core/utils/xp-calculator';

describe('calculateFishXp', () => {
  it('should calculate XP with multiplier', () => {
    expect(calculateFishXp(100, 10)).toBeCloseTo(110, 5);
  });
});
```

### Service Test

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlayerService } from '@/services/player.service';
import { ValidationError } from '@/core/errors';

vi.mock('@/core/utils/supabase-client');
vi.mock('@/core/utils/logger', () => ({ logError: vi.fn() }));

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(() => {
    service = new PlayerService();
  });

  it('should throw ValidationError for invalid input', async () => {
    await expect(service.getPlayerByAddress('')).rejects.toThrow(ValidationError);
  });
});
```

### Controller Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { getPlayerByAddress } from '@/controllers/player.controller';
import { PlayerService } from '@/services/player.service';

vi.mock('@/services/player.service');

describe('getPlayerByAddress', () => {
  it('should return success response', async () => {
    const mockRequest = { params: { address: '0x123' } };
    // Test implementation
  });
});
```

## Conventions

- **File naming**: `*.test.ts`
- **Test names**: `should [expected behavior]`
- **Structure**: `describe('Component', () => { describe('method', () => { it('should...') }) })`
- **Isolation**: Each test independent, reset mocks in `beforeEach`
- **Mock everything**: Never make real API/DB calls

## Best Practices

1. Test happy paths, errors, and edge cases
2. One assertion per test when possible
3. Use specific matchers: `toBe()`, `toEqual()`, `toThrow()`
4. Mock all external dependencies
5. Keep tests focused and readable
