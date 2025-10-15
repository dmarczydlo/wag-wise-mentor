# Error Handling Strategy - Result Pattern

## Overview

This document outlines the error handling strategy for the Wag Wise Mentor backend, implementing the Result pattern to avoid throwing exceptions in business logic and domain layers.

## Core Principles

### 1. No Exceptions in Business Logic

- **Domain Layer**: Never throw exceptions or errors
- **Application Layer**: Never throw exceptions or errors
- **Infrastructure Layer**: Only layer allowed to throw HTTP exceptions

### 2. Result Pattern Implementation

- Use `Result<T, E>` pattern for all operations that can fail
- Return success/failure information instead of throwing
- Eliminate try-catch blocks in business logic

### 3. Domain Error Types

- Use `DomainError` class for structured error information
- Categorize errors by type (validation, not found, unauthorized, etc.)
- Provide meaningful error messages and details

## Result Pattern Implementation

### Core Result Classes

```typescript
// apps/backend/src/common/result/result.ts

export abstract class Result<T, E = string> {
  abstract isSuccess(): boolean;
  abstract isFailure(): boolean;
  abstract getValue(): T;
  abstract getError(): E;

  static success<T, E = string>(value: T): Result<T, E> {
    return new Success(value);
  }

  static failure<T, E = string>(error: E): Result<T, E> {
    return new Failure(error);
  }

  // Functional programming methods
  map<U>(fn: (value: T) => U): Result<U, E>;
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
  onSuccess(fn: (value: T) => void): Result<T, E>;
  onFailure(fn: (error: E) => void): Result<T, E>;
  getOrElse(defaultValue: T): T;
  getOrThrow(): T;
}

export class DomainError {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly details?: any
  ) {}

  static validation(message: string, details?: any): DomainError;
  static notFound(resource: string, id?: string): DomainError;
  static unauthorized(message: string = "Unauthorized access"): DomainError;
  static forbidden(message: string = "Forbidden access"): DomainError;
  static conflict(message: string, details?: any): DomainError;
  static internal(message: string = "Internal server error"): DomainError;
}

export type DomainResult<T> = Result<T, DomainError>;
```

## Implementation Guidelines

### Domain Layer Changes

**Before (Throwing Errors):**

```typescript
export class EventId extends ValueObject {
  constructor(public readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error("EventId cannot be empty");
    }
  }
}
```

**After (Result Pattern):**

```typescript
export class EventId extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }

  static create(value: string): DomainResult<EventId> {
    if (!value || value.trim().length === 0) {
      return Result.failure(DomainError.validation("EventId cannot be empty"));
    }
    return Result.success(new EventId(value));
  }
}
```

### Application Layer Changes

**Before (Try-Catch with Exceptions):**

```typescript
async execute(command: CreateEventCommand): Promise<CreateEventResult> {
  try {
    const eventId = new EventId(this.generateId());
    const title = new EventTitle(command.title);
    // ... more code
    return { success: true, event: savedEvent };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
```

**After (Result Pattern):**

```typescript
async execute(command: CreateEventCommand): Promise<DomainResult<Event>> {
  const eventIdResult = EventId.create(this.generateId());
  if (eventIdResult.isFailure()) {
    return eventIdResult;
  }

  const titleResult = EventTitle.create(command.title);
  if (titleResult.isFailure()) {
    return titleResult;
  }

  const eventResult = Event.create(
    eventIdResult.getValue(),
    titleResult.getValue(),
    // ... other parameters
  );

  if (eventResult.isFailure()) {
    return eventResult;
  }

  const saveResult = await this.eventRepository.save(eventResult.getValue());
  return saveResult;
}
```

### Infrastructure Layer (Controllers)

**Controller Error Handling:**

```typescript
@Post()
async createEvent(@Body() command: CreateEventCommand): Promise<ApiSuccessResponse<Event> | ApiErrorResponse> {
  const result = await this.createEventUseCase.execute(command);

  if (result.isFailure()) {
    const error = result.getError();
    throw new HttpException(
      error.message,
      this.mapDomainErrorToHttpStatus(error.code)
    );
  }

  return new ApiSuccessResponse(result.getValue());
}

private mapDomainErrorToHttpStatus(code: string): HttpStatus {
  switch (code) {
    case 'VALIDATION_ERROR': return HttpStatus.BAD_REQUEST;
    case 'NOT_FOUND': return HttpStatus.NOT_FOUND;
    case 'UNAUTHORIZED': return HttpStatus.UNAUTHORIZED;
    case 'FORBIDDEN': return HttpStatus.FORBIDDEN;
    case 'CONFLICT': return HttpStatus.CONFLICT;
    default: return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
```

## Migration Strategy

### Phase 1: Create Result Infrastructure

1. ✅ Create `Result<T, E>` base classes
2. ✅ Create `DomainError` class
3. ✅ Add Result pattern utilities

### Phase 2: Update Domain Layer

1. Update Value Objects to use Result pattern
2. Update Entity creation methods
3. Update domain validation logic

### Phase 3: Update Application Layer

1. Update Use Cases to return Result objects
2. Remove try-catch blocks from business logic
3. Update command/query handlers

### Phase 4: Update Infrastructure Layer

1. Update controllers to handle Result objects
2. Map domain errors to HTTP status codes
3. Update repository implementations

### Phase 5: Testing Updates

1. Update unit tests to expect Result objects
2. Update integration tests
3. Update error handling tests

## Benefits

### 1. Explicit Error Handling

- All possible errors are explicit in method signatures
- No hidden exceptions that can crash the application
- Clear distinction between success and failure cases

### 2. Functional Programming Benefits

- Chainable operations with `map` and `flatMap`
- Composable error handling
- Immutable error states

### 3. Better Testing

- Easier to test error conditions
- No need to test exception throwing
- Clear success/failure assertions

### 4. Type Safety

- TypeScript can infer success/failure states
- Compile-time checking of error handling
- Better IDE support and autocomplete

## Example Usage Patterns

### Chaining Operations

```typescript
const result = await EventId.create(command.id)
  .flatMap(id => EventTitle.create(command.title)
    .flatMap(title => EventDescription.create(command.description)
      .flatMap(description => Event.create(id, title, description, ...))
    )
  );

if (result.isFailure()) {
  return result; // Return the first error encountered
}
```

### Error Handling in Use Cases

```typescript
async execute(command: UpdateEventCommand): Promise<DomainResult<Event>> {
  const eventResult = await this.eventRepository.findById(command.eventId);
  if (eventResult.isFailure()) {
    return eventResult;
  }

  const event = eventResult.getValue();
  if (!event) {
    return Result.failure(DomainError.notFound('Event', command.eventId));
  }

  const updateResult = event.updateTitle(command.title);
  if (updateResult.isFailure()) {
    return updateResult;
  }

  return await this.eventRepository.save(updateResult.getValue());
}
```

### Controller Integration

```typescript
@Put(':id')
async updateEvent(
  @Param('id') id: string,
  @Body() command: UpdateEventCommand
): Promise<ApiSuccessResponse<Event> | ApiErrorResponse> {
  const result = await this.updateEventUseCase.execute({ ...command, eventId: id });

  return result.isSuccess()
    ? new ApiSuccessResponse(result.getValue())
    : this.handleDomainError(result.getError());
}
```

## Testing with Result Pattern

### Unit Test Examples

```typescript
describe("CreateEventUseCase", () => {
  it("should return validation error for empty title", async () => {
    const command = {
      title: "",
      description: "test",
      eventDateTime: new Date(),
    };
    const result = await useCase.execute(command);

    expect(result.isFailure()).toBe(true);
    expect(result.getError().code).toBe("VALIDATION_ERROR");
    expect(result.getError().message).toContain("EventTitle cannot be empty");
  });

  it("should return success for valid command", async () => {
    const command = {
      title: "Test Event",
      description: "test",
      eventDateTime: new Date(),
    };
    const result = await useCase.execute(command);

    expect(result.isSuccess()).toBe(true);
    expect(result.getValue()).toBeInstanceOf(Event);
  });
});
```

This Result pattern implementation provides a robust, type-safe approach to error handling that eliminates exceptions from business logic while maintaining clear, testable code.
