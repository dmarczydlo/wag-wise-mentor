# Zod Validation Strategy

## Overview

Wag Wise Mentor uses **Zod** for runtime validation of all controller DTOs. This ensures type-safe request validation with automatic error handling and clear validation messages.

## Why Zod?

1. **Type Safety**: Zod schemas automatically generate TypeScript types
2. **Runtime Validation**: Validates data at runtime, not just compile time
3. **Clear Error Messages**: Provides user-friendly validation errors
4. **Composable**: Easy to reuse and compose schemas
5. **No Decorators**: Clean, functional approach without class-validator decorators

## Architecture

### 1. DTO Files with Zod Schemas

Each controller module has a `.dto.ts` file containing:

- Zod schemas (for validation)
- TypeScript types (inferred from schemas)

**Example: `auth.dto.ts`**

```typescript
import { z } from "zod";
import { UserRoleType } from "../../domain/auth/user.entity";

export const CreateProfileDtoSchema = z.object({
  role: z.nativeEnum(UserRoleType).optional(),
});

export const UpdateProfileDtoSchema = z.object({
  role: z.nativeEnum(UserRoleType).optional(),
  isActive: z.boolean().optional(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileDtoSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileDtoSchema>;
```

### 2. Zod Validation Pipe

**Location**: `src/common/pipes/zod-validation.pipe.ts`

```typescript
import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException({
        message: "Validation failed",
        errors: error.errors || error.message,
      });
    }
  }
}
```

### 3. Controller Implementation

Controllers use `@UsePipes` decorator with the validation pipe:

```typescript
import { Controller, Post, Body, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { CreateProfileDto, CreateProfileDtoSchema } from "./auth.dto";

@Controller("users")
export class AuthController {
  @Post("profile")
  @UsePipes(new ZodValidationPipe(CreateProfileDtoSchema))
  async createUserProfile(@Body() body: CreateProfileDto) {
    // body is validated and typed
  }
}
```

## Validation Patterns

### String Validation

```typescript
// Required string with length constraints
name: z.string().min(1, "Name is required").max(100, "Name is too long"),

// Optional string
description: z.string().optional(),

// Email
email: z.string().email("Invalid email format"),
```

### Number Validation

```typescript
// Positive number
weight: z.number().positive("Weight must be positive"),

// Range validation
confidence: z.number().min(0).max(1),

// Integer
age: z.number().int("Age must be an integer"),
```

### Date Validation

```typescript
// Coerce string to Date
birthDate: z.coerce.date(),

// Date with custom validation
scheduledDate: z.coerce.date().refine(
  (date) => date > new Date(),
  "Date must be in the future"
),
```

### Enum Validation

```typescript
// Native TypeScript enum
role: z.nativeEnum(UserRoleType),

// Zod enum
status: z.enum(["pending", "approved", "rejected"]),
```

### Object/Record Validation

```typescript
// Record with string keys and any values
metadata: z.record(z.string(), z.any()).optional(),

// Nested object
address: z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string(),
}),
```

### Array Validation

```typescript
// Array of strings
tags: z.array(z.string()),

// Array with min/max length
items: z.array(z.string()).min(1).max(10),
```

## Module Validation Summary

| Module        | POST/PUT Endpoints                            | DTOs with Validation                                      |
| ------------- | --------------------------------------------- | --------------------------------------------------------- |
| **Auth**      | Profile management                            | CreateProfileDto, UpdateProfileDto                        |
| **Puppy**     | Create puppy, Update weight                   | CreatePuppyDto, UpdatePuppyWeightDto                      |
| **Calendar**  | Create event, Update event, Generate timeline | CreateEventDto, UpdateEventDto, GenerateHealthTimelineDto |
| **Training**  | Create session, Update notes                  | CreateTrainingSessionDto, UpdateTrainingNotesDto          |
| **AI**        | Generate recommendation, Update confidence    | GenerateRecommendationDto, UpdateConfidenceDto            |
| **Analytics** | Track event, Enrich event                     | TrackEventDto, EnrichEventDto                             |

## Error Handling

When validation fails, Zod returns a `BadRequestException` with:

**Response Format:**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "message": "Name is required",
      "path": ["name"]
    }
  ]
}
```

## Testing with Zod DTOs

Tests don't need to change - they pass objects that conform to the schemas:

```typescript
it("should create user profile successfully", async () => {
  // Arrange
  const dto = {
    role: UserRoleType.USER, // Valid enum value
  };

  // Act
  const result = await controller.createUserProfile(mockRequest, dto);

  // Assert
  expect(result.success).to.be.true;
});
```

## Best Practices

### 1. Always Define Error Messages

```typescript
// ✅ Good: Clear error message
name: z.string().min(1, "Name is required"),

// ❌ Bad: Generic error
name: z.string().min(1),
```

### 2. Use Appropriate Validators

```typescript
// ✅ Good: Specific validation
email: z.string().email("Invalid email"),

// ❌ Bad: Too generic
email: z.string(),
```

### 3. Keep DTOs Simple

```typescript
// ✅ Good: Flat, simple structure
export const CreatePuppyDtoSchema = z.object({
  name: z.string().min(1),
  breed: z.string().min(1),
  birthDate: z.coerce.date(),
});

// ❌ Bad: Complex nested validation in DTO
// (move complex validation to domain layer)
```

### 4. Reuse Common Schemas

```typescript
// Define common schemas
const IdSchema = z.string().uuid();
const TimestampSchema = z.coerce.date();

// Reuse them
export const CreateEventDtoSchema = z.object({
  puppyId: IdSchema,
  scheduledDate: TimestampSchema,
});
```

### 5. Use Descriptive Type Names

```typescript
// ✅ Good: Clear purpose
(CreatePuppyDto, UpdatePuppyWeightDto);

// ❌ Bad: Ambiguous
(PuppyDto, WeightDto);
```

## Migration from Class-Validator

### Before (class-validator):

```typescript
export class CreatePuppyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  currentWeight: number;
}
```

### After (Zod):

```typescript
export const CreatePuppyDtoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  currentWeight: z.number().positive("Weight must be positive"),
});

export type CreatePuppyDto = z.infer<typeof CreatePuppyDtoSchema>;
```

### Benefits:

- No decorators (cleaner)
- Type inference (no duplicate definitions)
- Better error messages
- More composable

## Updating Existing Controllers

To add Zod validation to an existing controller:

1. **Create `.dto.ts` file**:

```typescript
import { z } from "zod";

export const MyDtoSchema = z.object({
  field: z.string(),
});

export type MyDto = z.infer<typeof MyDtoSchema>;
```

2. **Import in controller**:

```typescript
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { MyDto, MyDtoSchema } from "./my.dto";
```

3. **Apply to endpoints**:

```typescript
@Post()
@UsePipes(new ZodValidationPipe(MyDtoSchema))
async create(@Body() dto: MyDto) {
  // Validated!
}
```

4. **Update tests** (usually no changes needed):

```typescript
it("should validate input", async () => {
  const dto = { field: "value" };
  const result = await controller.create(dto);
  expect(result).to.not.be.undefined;
});
```

## Troubleshooting

### Issue: "Expected 2-3 arguments, but got 1"

**Problem**: Zod record type needs explicit key and value types:

```typescript
// ❌ Error
metadata: z.record(z.any());

// ✅ Fixed
metadata: z.record(z.string(), z.any());
```

### Issue: Validation passes but TypeScript errors

**Problem**: DTO type doesn't match use case command interface

**Solution**: Ensure DTO field names match command interface:

```typescript
// Use case expects:
interface Command {
  eventDateTime: Date;
}

// DTO should match:
export const DtoSchema = z.object({
  eventDateTime: z.coerce.date(), // ✅ Matches
});
```

### Issue: Optional fields causing issues

**Problem**: Zod treats undefined differently than missing

**Solution**: Use `.optional()` consistently:

```typescript
description: z.string().optional(), // Allows undefined or missing
```

## Future Improvements

1. **Shared Schemas**: Create common validation schemas in `packages/shared/`
2. **Custom Validators**: Build domain-specific validators (e.g., `isValidBreed()`)
3. **Transform DTOs**: Use `.transform()` to normalize data
4. **Async Validation**: Validate against database (e.g., unique email)

## References

- [Zod Documentation](https://zod.dev/)
- [NestJS Pipes](https://docs.nestjs.com/pipes)
- [docs/testing-strategy.md](./testing-strategy.md)
- [docs/repository-pattern.md](./repository-pattern.md)
