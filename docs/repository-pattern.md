# Repository Pattern Architecture

## Overview

The Wag Wise Mentor backend follows a **dual repository pattern** where:
- **In-Memory Repositories**: Used exclusively for testing (fast, isolated, no external dependencies)
- **Supabase Repositories**: Used for production (persistent, real database operations)

## Current Implementation Status

### ✅ Completed
- Abstract repository classes in Domain Layer
- In-memory repository implementations (for testing)
- SupabaseService infrastructure for database operations
- Test coverage using in-memory repositories

### ❌ Missing (Subtask 6.4)
- Supabase repository implementations (for production)
- Environment-based repository selection in modules
- Entity-to-table mappers
- Integration tests with real Supabase database

## Architecture Pattern

### 1. Domain Layer (Abstract Repositories)

```typescript
// apps/backend/src/domain/puppy/puppy.repository.ts
export abstract class PuppyRepository {
  abstract save(puppy: Puppy): Promise<Puppy>;
  abstract findById(id: string): Promise<Puppy | null>;
  abstract findByOwnerId(ownerId: string): Promise<Puppy[]>;
  abstract update(puppy: Puppy): Promise<Puppy>;
  abstract delete(id: string): Promise<void>;
}
```

**Key Points:**
- Located in `src/domain/{module}/`
- Defines interface (abstract methods) for data operations
- No implementation details
- Framework-agnostic

### 2. Infrastructure Layer (Concrete Implementations)

#### A. In-Memory Repository (Testing Only)

```typescript
// apps/backend/src/infrastructure/puppy/in-memory-puppy.repository.ts
@Injectable()
export class InMemoryPuppyRepository extends PuppyRepository {
  private puppies: Map<string, Puppy> = new Map();

  async save(puppy: Puppy): Promise<Puppy> {
    this.puppies.set(puppy.id, puppy);
    return puppy;
  }

  async findById(id: string): Promise<Puppy | null> {
    return this.puppies.get(id) || null;
  }

  async findByOwnerId(ownerId: string): Promise<Puppy[]> {
    return Array.from(this.puppies.values())
      .filter(puppy => puppy.ownerId === ownerId);
  }
}
```

**Usage:**
- Unit tests
- Integration tests that don't need database
- Fast execution
- No external dependencies

#### B. Supabase Repository (Production) - **TO BE IMPLEMENTED**

```typescript
// apps/backend/src/infrastructure/puppy/supabase-puppy.repository.ts
@Injectable()
export class SupabasePuppyRepository extends PuppyRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async save(puppy: Puppy): Promise<Puppy> {
    const row = this.mapEntityToRow(puppy);
    const savedRow = await this.supabaseService.executeCommand<PuppyRow>(
      (db) => db.from('puppies').insert(row).select().single()
    );
    return this.mapRowToEntity(savedRow);
  }

  async findById(id: string): Promise<Puppy | null> {
    const rows = await this.supabaseService.executeQuery<PuppyRow>(
      (db) => db.from('puppies').select('*').eq('id', id).limit(1)
    );
    return rows.length > 0 ? this.mapRowToEntity(rows[0]) : null;
  }

  async findByOwnerId(ownerId: string): Promise<Puppy[]> {
    const rows = await this.supabaseService.executeQuery<PuppyRow>(
      (db) => db.from('puppies').select('*').eq('owner_id', ownerId)
    );
    return rows.map(row => this.mapRowToEntity(row));
  }

  private mapEntityToRow(puppy: Puppy): Partial<PuppyRow> {
    return {
      id: puppy.id,
      name: puppy.name,
      breed: puppy.breed,
      birth_date: puppy.birthDate.toISOString(),
      owner_id: puppy.ownerId,
      weight_kg: puppy.weight.value,
      weight_unit: puppy.weight.unit,
      created_at: puppy.createdAt.toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  private mapRowToEntity(row: PuppyRow): Puppy {
    return Puppy.create({
      id: row.id,
      name: row.name,
      breed: row.breed,
      birthDate: new Date(row.birth_date),
      ownerId: row.owner_id,
      weight: new Weight(row.weight_kg, row.weight_unit as WeightUnit),
      createdAt: new Date(row.created_at),
    });
  }
}
```

**Usage:**
- Production environment
- Integration tests with real database
- Persistent data storage
- Full database features (transactions, constraints, etc.)

### 3. Module Configuration (Environment-Based Selection)

```typescript
// apps/backend/src/infrastructure/puppy/puppy.module.ts
import { Module } from '@nestjs/common';
import { PuppyRepository } from '../../domain/puppy/puppy.repository';
import { InMemoryPuppyRepository } from './in-memory-puppy.repository';
import { SupabasePuppyRepository } from './supabase-puppy.repository';
import { PuppyUseCases } from '../../application/puppy/puppy.use-cases';
import { PuppyController } from './puppy.controller';

const isTestEnvironment = process.env.NODE_ENV === 'test';

@Module({
  controllers: [PuppyController],
  providers: [
    {
      provide: PuppyRepository,
      useClass: isTestEnvironment ? InMemoryPuppyRepository : SupabasePuppyRepository,
    },
    PuppyUseCases,
  ],
  exports: [PuppyRepository],
})
export class PuppyModule {}
```

**Key Points:**
- Single source of truth: `process.env.NODE_ENV`
- Tests automatically use in-memory repositories
- Production automatically uses Supabase repositories
- No code changes needed when switching environments

## Implementation Checklist (Subtask 6.4)

### Repository Implementations Needed

- [ ] **Auth Module**: `SupabaseUserRepository`
  - File: `apps/backend/src/infrastructure/auth/supabase-user.repository.ts`
  - Tables: `users` (via Supabase Auth)
  - Special: Integrate with Supabase Auth API

- [ ] **Puppy Module**: `SupabasePuppyRepository`
  - File: `apps/backend/src/infrastructure/puppy/supabase-puppy.repository.ts`
  - Tables: `puppies`, `weight_records`
  - Entities: `Puppy`, `Weight` value object

- [ ] **Calendar Module**: `SupabaseEventRepository`
  - File: `apps/backend/src/infrastructure/calendar/supabase-event.repository.ts`
  - Tables: `events`, `recurring_events`
  - Entities: `Event`, `RecurringEvent`

- [ ] **Training Module**: `SupabaseTrainingRepository`
  - File: `apps/backend/src/infrastructure/training/supabase-training.repository.ts`
  - Tables: `training_sessions`, `training_exercises`
  - Entities: `TrainingSession`, `TrainingExercise`

- [ ] **AI Module**: `SupabaseAIRepository`
  - File: `apps/backend/src/infrastructure/ai/supabase-ai.repository.ts`
  - Tables: `ai_recommendations`
  - Entities: `AIRecommendation`

- [ ] **Analytics Module**: `SupabaseAnalyticsRepository`
  - File: `apps/backend/src/infrastructure/analytics/supabase-analytics.repository.ts`
  - Tables: `analytics_events`
  - Entities: `AnalyticsEvent`

### Module Updates Needed

Update each module's provider configuration:
- [ ] `auth.module.ts`
- [ ] `puppy.module.ts`
- [ ] `calendar.module.ts`
- [ ] `training.module.ts`
- [ ] `ai.module.ts`
- [ ] `analytics.module.ts`

### Testing Strategy

1. **Unit Tests**: Continue using in-memory repositories (fast, isolated)
2. **Integration Tests**: Add new tests using Supabase repositories with test database
3. **Test Database**: Set up separate Supabase project for testing or use transactions for cleanup

### Entity-to-Table Mapping Guidelines

1. **Naming Conventions**:
   - Domain entities: PascalCase (e.g., `Puppy`, `TrainingSession`)
   - Database tables: snake_case (e.g., `puppies`, `training_sessions`)
   - Entity properties: camelCase (e.g., `birthDate`, `ownerId`)
   - Table columns: snake_case (e.g., `birth_date`, `owner_id`)

2. **Value Objects**:
   - Flatten into table columns (e.g., `Weight` becomes `weight_kg` + `weight_unit`)
   - Consider JSON columns for complex nested objects

3. **Timestamps**:
   - Always map `created_at` and `updated_at`
   - Convert between Date objects and ISO strings

4. **IDs**:
   - Use UUIDs for all entities
   - Ensure consistency between domain and database

## Benefits of Dual Repository Pattern

### For Development
✅ Fast test execution (no database overhead)
✅ Isolated tests (no test interdependencies)
✅ Easy mocking and test data setup
✅ No database migrations needed for testing

### For Production
✅ Real data persistence
✅ Database constraints and validation
✅ Transaction support
✅ Full query capabilities
✅ Data integrity

### For Architecture
✅ Clean dependency injection (no string tokens)
✅ DDD compliance (infrastructure depends on domain, not vice versa)
✅ Easy to swap implementations
✅ Testable without external dependencies

## References

- **Domain-Driven Design**: [docs/project-plan.md](./project-plan.md)
- **Testing Strategy**: [docs/testing-strategy.md](./testing-strategy.md)
- **Environment Configuration**: [docs/environment-variables.md](./environment-variables.md)
- **Security Guidelines**: [docs/security.md](./security.md)

## Next Steps

1. **Read Supabase Schema**: Understand all table structures
2. **Implement Repositories**: Start with Puppy module (already has tests)
3. **Create Mappers**: Build entity-to-row and row-to-entity methods
4. **Update Modules**: Add environment-based provider selection
5. **Integration Tests**: Write tests for Supabase repositories
6. **Documentation**: Update with production deployment considerations

