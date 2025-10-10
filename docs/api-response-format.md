# API Response Format

## Overview

All API responses from the Wag Wise Mentor backend follow a **standardized format** for both success (2XX) and error (4XX/5XX) responses. This ensures consistency across all endpoints and makes error handling predictable for frontend applications.

## Standard Response Structure

### Success Responses (2XX)

All successful API responses follow this structure:

```typescript
{
  success: true,
  data: T,                    // The actual response data (type varies by endpoint)
  message?: string,           // Optional success message
  timestamp: string,          // ISO 8601 timestamp
  path: string                // Request path
}
```

#### Examples

**GET /users/me** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": {
        "value": "user-123"
      },
      "email": {
        "value": "john@example.com"
      },
      "role": {
        "value": "user"
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/users/me"
}
```

**POST /puppies** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": {
      "value": "puppy-456"
    },
    "name": "Buddy",
    "breed": "Golden Retriever",
    "birthDate": "2024-01-15T00:00:00.000Z",
    "currentWeight": {
      "value": 5.2,
      "unit": "kg"
    },
    "ownerId": "user-123",
    "createdAt": "2024-10-10T12:00:00.000Z",
    "updatedAt": "2024-10-10T12:00:00.000Z"
  },
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/puppies"
}
```

**GET /puppies/owner/user-123** (200 OK - List):
```json
{
  "success": true,
  "data": [
    {
      "id": { "value": "puppy-456" },
      "name": "Buddy",
      "breed": "Golden Retriever"
    },
    {
      "id": { "value": "puppy-789" },
      "name": "Max",
      "breed": "Labrador"
    }
  ],
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/puppies/owner/user-123"
}
```

### Error Responses (4XX/5XX)

All error responses follow this structure:

```typescript
{
  success: false,
  error: {
    code: string,             // Machine-readable error code
    message: string,          // Human-readable error message
    details?: any             // Additional error details (optional)
  },
  statusCode: number,         // HTTP status code
  timestamp: string,          // ISO 8601 timestamp
  path: string                // Request path
}
```

## Error Types

### 1. Validation Errors (400 Bad Request)

Validation errors occur when request data doesn't match the expected schema (Zod validation).

**Error Code**: `VALIDATION_ERROR`

**Example**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "code": "too_small",
        "minimum": 1,
        "type": "string",
        "inclusive": true,
        "message": "Name is required",
        "path": ["name"]
      },
      {
        "code": "invalid_type",
        "expected": "number",
        "received": "string",
        "message": "Expected number, received string",
        "path": ["currentWeight"]
      }
    ]
  },
  "statusCode": 400,
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/puppies"
}
```

**Details Array Structure**:
- `code`: Zod error code (e.g., `too_small`, `invalid_type`, `invalid_enum_value`)
- `message`: Human-readable error message
- `path`: Array showing which field failed validation
- Additional fields depending on validation type (minimum, maximum, expected, received, etc.)

### 2. Domain/Logic Errors (400 Bad Request)

Domain errors occur when business logic validation fails (e.g., puppy not found, invalid operation).

**Error Code**: `DOMAIN_ERROR`

**Example - Puppy Not Found**:
```json
{
  "success": false,
  "error": {
    "code": "DOMAIN_ERROR",
    "message": "Puppy not found"
  },
  "statusCode": 400,
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/puppies/non-existent-id"
}
```

**Example - User Already Exists**:
```json
{
  "success": false,
  "error": {
    "code": "DOMAIN_ERROR",
    "message": "User profile already exists"
  },
  "statusCode": 400,
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/users/profile"
}
```

### 3. Not Found Errors (404 Not Found)

**Error Code**: `NOT_FOUND`

**Example**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  },
  "statusCode": 404,
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/users/non-existent-id"
}
```

### 4. Unauthorized Errors (401 Unauthorized)

**Error Code**: `UNAUTHORIZED`

**Example - Missing Token**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "No authentication token provided"
  },
  "statusCode": 401,
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/users/me"
}
```

**Example - Invalid Token**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid authentication token"
  },
  "statusCode": 401,
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/users/me"
}
```

### 5. Forbidden Errors (403 Forbidden)

**Error Code**: `FORBIDDEN`

**Example**:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource"
  },
  "statusCode": 403,
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/admin/users"
}
```

### 6. Internal Server Errors (500 Internal Server Error)

**Error Code**: `INTERNAL_SERVER_ERROR`

**Production Example**:
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  },
  "statusCode": 500,
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/puppies"
}
```

**Development Example** (includes stack trace):
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Cannot read property 'value' of undefined"
  },
  "statusCode": 500,
  "timestamp": "2024-10-10T12:00:00.000Z",
  "path": "/puppies"
}
```

## Frontend Integration

### TypeScript Types

```typescript
// Success response
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

// Error response
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  statusCode: number;
  timestamp: string;
  path: string;
}

// Union type for all responses
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### Axios Example

```typescript
import axios, { AxiosError } from 'axios';

async function fetchUser(id: string) {
  try {
    const response = await axios.get<ApiSuccessResponse<User>>(`/users/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiErrorResponse;
      
      switch (apiError.error.code) {
        case 'VALIDATION_ERROR':
          console.error('Validation failed:', apiError.error.details);
          break;
        case 'NOT_FOUND':
          console.error('User not found');
          break;
        case 'UNAUTHORIZED':
          // Redirect to login
          break;
        default:
          console.error('Error:', apiError.error.message);
      }
    }
  }
}
```

### React Query Example

```typescript
import { useQuery } from '@tanstack/react-query';

function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`);
      const data: ApiResponse<User> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error.message);
      }
      
      return data.data;
    },
  });
}
```

## Error Handling Best Practices

### 1. Always Check `success` Field

```typescript
const response = await api.get('/users/me');

if (response.data.success) {
  // Handle success
  console.log(response.data.data);
} else {
  // Handle error
  console.error(response.data.error.message);
}
```

### 2. Handle Specific Error Codes

```typescript
if (!response.data.success) {
  switch (response.data.error.code) {
    case 'VALIDATION_ERROR':
      // Show field-specific errors
      showValidationErrors(response.data.error.details);
      break;
    case 'UNAUTHORIZED':
      // Redirect to login
      redirectToLogin();
      break;
    case 'NOT_FOUND':
      // Show 404 page
      show404();
      break;
    default:
      // Show generic error
      showErrorToast(response.data.error.message);
  }
}
```

### 3. Extract Validation Errors

```typescript
function extractValidationErrors(details: any[]) {
  const errors: Record<string, string> = {};
  
  details.forEach(detail => {
    const field = detail.path.join('.');
    errors[field] = detail.message;
  });
  
  return errors;
}

// Usage
if (response.data.error.code === 'VALIDATION_ERROR') {
  const fieldErrors = extractValidationErrors(response.data.error.details);
  
  // Display errors next to form fields
  Object.entries(fieldErrors).forEach(([field, message]) => {
    showFieldError(field, message);
  });
}
```

### 4. Global Error Handler

```typescript
// axios interceptor
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.data) {
      const apiError = error.response.data;
      
      // Log to monitoring service
      logError(apiError);
      
      // Handle specific errors globally
      if (apiError.error.code === 'UNAUTHORIZED') {
        redirectToLogin();
      }
    }
    
    return Promise.reject(error);
  }
);
```

## HTTP Status Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 200 | Success | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | VALIDATION_ERROR | Request validation failed (Zod) |
| 400 | DOMAIN_ERROR | Business logic error |
| 401 | UNAUTHORIZED | Missing or invalid authentication |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 500 | INTERNAL_SERVER_ERROR | Unexpected server error |

## Implementation Details

### Global Exception Filter

Location: `src/common/filters/http-exception.filter.ts`

The filter catches all exceptions and transforms them into the standard format:
- Zod validation errors → `VALIDATION_ERROR`
- Domain errors → `DOMAIN_ERROR`
- Not found → `NOT_FOUND`
- Unauthorized → `UNAUTHORIZED`
- Other errors → `INTERNAL_SERVER_ERROR`

### Response Interceptor

Location: `src/common/interceptors/transform-response.interceptor.ts`

The interceptor wraps all successful responses in the standard format with:
- `success: true`
- `data`: The response payload
- `timestamp`: Current timestamp
- `path`: Request path

### Registration

Both are registered globally in `src/main.ts`:

```typescript
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalInterceptors(new TransformResponseInterceptor());
```

## Testing Response Formats

### Success Response Test

```typescript
it('should return standardized success response', async () => {
  const response = await request(app.getHttpServer())
    .get('/users/me')
    .expect(200);

  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('data');
  expect(response.body).toHaveProperty('timestamp');
  expect(response.body).toHaveProperty('path', '/users/me');
});
```

### Validation Error Test

```typescript
it('should return standardized validation error', async () => {
  const response = await request(app.getHttpServer())
    .post('/puppies')
    .send({ name: '' }) // Invalid data
    .expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
  expect(response.body.error.message).toBe('Request validation failed');
  expect(response.body.error.details).toBeInstanceOf(Array);
  expect(response.body.statusCode).toBe(400);
});
```

### Domain Error Test

```typescript
it('should return standardized domain error', async () => {
  const response = await request(app.getHttpServer())
    .get('/puppies/non-existent-id')
    .expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe('DOMAIN_ERROR');
  expect(response.body.error.message).toContain('not found');
  expect(response.body.statusCode).toBe(400);
});
```

## Migration from Old Format

### Before (Inconsistent):

```typescript
// Old success response
return {
  success: true,
  user: userData
};

// Old error response
throw new HttpException('User not found', 404);
```

### After (Standardized):

```typescript
// Success response (handled by interceptor)
return userData;

// Error response (handled by filter)
throw new NotFoundException('User');
```

The interceptor and filter automatically wrap these in the standard format.

## Summary

- **All responses** have a consistent structure
- **Success responses** always have `success: true` and `data`
- **Error responses** always have `success: false`, `error` object with `code` and `message`
- **Validation errors** include detailed `details` array with field-level errors
- **HTTP status codes** are consistent and predictable
- **Frontend integration** is simplified with type-safe responses
- **Global handlers** ensure consistency without manual formatting

This standardization makes the API predictable, type-safe, and easy to consume from any frontend application.

