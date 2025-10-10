# Authentication Architecture

## Overview

The Wag Wise Mentor application uses **Supabase Auth** for all authentication operations. The backend does **NOT** handle registration, login, or password reset - these are handled directly by Supabase Auth on the frontend.

## Architecture Diagram

```
┌─────────────────┐
│    Frontend     │
│   (React SPA)   │
└────────┬────────┘
         │
         │ 1. Auth Operations
         │    - Register (signUp)
         │    - Login (signInWithPassword)
         │    - Password Reset (resetPasswordForEmail)
         │    - Sign Out (signOut)
         │
         ↓
┌─────────────────┐
│  Supabase Auth  │
│   (External)    │
└────────┬────────┘
         │
         │ 2. Returns JWT Token
         │    (in response or via session)
         │
         ↓
┌─────────────────┐        ┌──────────────────────────┐
│    Frontend     │────────│   NestJS Backend         │
│  (API Requests) │  JWT   │                          │
└─────────────────┘  Token └───────────┬──────────────┘
                                       │
                              3. Validate JWT
                              (SupabaseAuthGuard)
                                       │
                                       ↓
                            ┌──────────────────────┐
                            │  User Profile        │
                            │  Management          │
                            │  (Get/Update/Delete) │
                            └──────────────────────┘
```

## Authentication Flow

### 1. User Registration (Frontend → Supabase)

```typescript
// apps/frontend/src/pages/Auth.tsx
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/dashboard`,
  },
});
```

**What happens:**

1. Frontend calls Supabase Auth API directly
2. Supabase creates user account
3. Supabase sends verification email (if configured)
4. User is authenticated immediately or after email verification
5. Frontend receives session with JWT token

**Backend involvement:** NONE

### 2. User Login (Frontend → Supabase)

```typescript
// apps/frontend/src/pages/Auth.tsx
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

**What happens:**

1. Frontend calls Supabase Auth API directly
2. Supabase validates credentials
3. Returns JWT token in session
4. Frontend stores token in localStorage (automatic)

**Backend involvement:** NONE

### 3. Password Reset (Frontend → Supabase)

```typescript
// Frontend would call:
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});
```

**What happens:**

1. Frontend calls Supabase Auth API directly
2. Supabase sends password reset email
3. User clicks link and sets new password on Supabase-hosted page or custom page

**Backend involvement:** NONE

### 4. API Requests with JWT (Frontend → Backend)

```typescript
// Frontend automatically includes JWT in requests via Supabase client
const { data, error } = await supabase
  .from("puppies")
  .select("*")
  .eq("owner_id", user.id);

// Or manual API calls with Authorization header
const response = await fetch("/api/users/me", {
  headers: {
    Authorization: `Bearer ${session.access_token}`,
  },
});
```

**What happens:**

1. Frontend includes JWT token in Authorization header
2. Backend `SupabaseAuthGuard` intercepts request
3. Guard validates JWT token with Supabase
4. If valid, extracts user info and attaches to request
5. Controller/Use Case processes request

**Backend involvement:** JWT validation only

## Backend Architecture

### Components

#### 1. SupabaseAuthGuard

**Location:** `apps/backend/src/infrastructure/auth/supabase-auth.guard.ts`

**Purpose:** Validates JWT tokens from Supabase Auth

```typescript
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("No authentication token provided");
    }

    const token = authHeader.substring(7);

    try {
      const {
        data: { user },
        error,
      } = await this.supabaseService.getClient().auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException("Invalid authentication token");
      }

      request.user = user; // Attach Supabase user to request
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid authentication token");
    }
  }
}
```

**Key Points:**

- Validates JWT token with Supabase's `auth.getUser()`
- Does NOT generate tokens
- Does NOT handle passwords
- Attaches Supabase user object to request for use in controllers

#### 2. User Profile Management

**Location:** `apps/backend/src/application/auth/auth.use-cases.ts`

**Purpose:** Manage user profiles (metadata) after Supabase Auth handles authentication

**Use Cases:**

- `GetUserUseCase` - Retrieve user profile
- `CreateUserProfileUseCase` - Create profile after Supabase registration
- `UpdateUserProfileUseCase` - Update user role/status
- `DeleteUserProfileUseCase` - Delete user profile

**Example:**

```typescript
@Injectable()
export class CreateUserProfileUseCase {
  async execute(
    command: CreateUserProfileCommand
  ): Promise<CreateUserProfileResult> {
    const userId = new UserId(command.userId); // Supabase user ID
    const email = new Email(command.email); // From Supabase
    const role = new UserRole(command.role || UserRoleType.USER);

    const user = User.create(userId, email, role);
    return await this.userRepository.save(user);
  }
}
```

#### 3. Auth Controller

**Location:** `apps/backend/src/infrastructure/auth/auth.controller.ts`

**Endpoints:**

- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID
- `POST /users/profile` - Create user profile (after Supabase registration)
- `PUT /users/:id` - Update user profile (role, status)
- `DELETE /users/:id` - Delete user profile

**All endpoints protected by `@UseGuards(SupabaseAuthGuard)`**

## What Was Removed

### ❌ Removed from Backend

1. **Registration Endpoint** (`POST /auth/register`)
   - Not needed - Supabase handles this

2. **Login Endpoint** (`POST /auth/login`)
   - Not needed - Supabase handles this

3. **Password Reset Endpoint** (`POST /auth/password-reset`)
   - Not needed - Supabase handles this

4. **Password Hashing** (`bcrypt`)
   - Not needed - Supabase handles password storage

5. **JWT Generation**
   - Not needed - Supabase generates JWTs

6. **Custom Authentication Logic**
   - Not needed - Supabase provides this

### ✅ What Backend Still Does

1. **JWT Validation** - Verify tokens from Supabase
2. **User Profile Management** - Store additional user metadata
3. **Authorization** - Role-based access control (RBAC)
4. **Business Logic** - Domain-specific operations

## Security Considerations

### 1. JWT Validation

- All protected routes use `SupabaseAuthGuard`
- Tokens are validated with Supabase on every request
- Invalid/expired tokens result in 401 Unauthorized

### 2. User Context

- Authenticated user info available via `@Request() req`
- User ID from Supabase attached to request object
- Use `req.user.id` to get Supabase user ID

### 3. CORS Configuration

- CORS configured to allow frontend origin
- Credentials enabled for cross-origin auth
- See `docs/security.md` for details

### 4. Environment Variables

**Frontend (.env):**

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

**Backend (.env):**

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Critical:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend!

## Testing Strategy

### Frontend Auth Tests

Test Supabase Auth integration:

- Mock Supabase client responses
- Test auth state changes
- Test session management
- Test error handling

### Backend Guard Tests

Test JWT validation:

- Valid token returns user
- Invalid token throws 401
- Missing token throws 401
- Expired token throws 401

### Backend Profile Tests

Test user profile management:

- Create profile after registration
- Update user roles
- Get user by ID
- Delete user profile

## Best Practices

### DO ✅

1. **Use Supabase Auth for all authentication**
2. **Validate JWTs on protected backend routes**
3. **Store additional user metadata in your database**
4. **Use environment-based repository selection** (in-memory for tests)
5. **Handle auth errors gracefully on frontend**

### DON'T ❌

1. **Don't reimplement authentication on backend**
2. **Don't hash passwords on backend** (Supabase does this)
3. **Don't generate JWT tokens** (Supabase does this)
4. **Don't expose service role key to frontend**
5. **Don't bypass JWT validation** on protected routes

## Migration Path

If you have existing custom auth:

1. **Frontend:** Replace custom login/register with Supabase Auth
2. **Backend:** Remove auth endpoints (login, register, password-reset)
3. **Backend:** Add `SupabaseAuthGuard` to protected routes
4. **Backend:** Refactor user management to profile management
5. **Database:** Migrate user IDs to match Supabase Auth UUIDs
6. **Tests:** Update tests to use new architecture

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JWT Claims](https://supabase.com/docs/guides/auth/jwts)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [docs/security.md](./security.md)
- [docs/environment-variables.md](./environment-variables.md)
- [docs/repository-pattern.md](./repository-pattern.md)
