# Monorepo Structure Plan for Wag Wise Mentor

## Current Structure Analysis

The current project is a React frontend with Vite, TypeScript, and Supabase integration. We need to extend this into a monorepo supporting both frontend and backend development using Bun.

## Proposed Monorepo Structure

```
wag-wise-mentor/
├── apps/
│   ├── frontend/                 # React frontend (current codebase)
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   └── backend/                  # NestJS backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── puppies/
│       │   │   ├── calendar/
│       │   │   ├── training/
│       │   │   └── ai/
│       │   ├── common/
│       │   ├── config/
│       │   └── main.ts
│       ├── package.json
│       ├── nest-cli.json
│       └── tsconfig.json
├── packages/
│   ├── shared/                   # Shared types and utilities
│   │   ├── types/
│   │   ├── utils/
│   │   └── package.json
│   └── ui/                       # Shared UI components
│       ├── components/
│       ├── styles/
│       └── package.json
├── supabase/                     # Database migrations and config
├── scripts/                      # Build and deployment scripts
├── package.json                  # Root package.json with workspaces
├── bun.lockb                     # Bun lockfile
└── README.md
```

## Migration Strategy

### Phase 1: Restructure Current Frontend

1. Move current frontend code to `apps/frontend/`
2. Update import paths and configurations
3. Create shared packages for types and UI components
4. Set up workspace configuration

### Phase 2: Create Backend Structure

1. Initialize NestJS backend in `apps/backend/`
2. Set up shared types package
3. Configure Supabase integration
4. Create basic API structure

### Phase 3: Integration & Testing

1. Set up cross-package dependencies
2. Configure build scripts
3. Set up development environment
4. Create deployment configurations

## Package.json Configuration

### Root Package.json

```json
{
  "name": "wag-wise-mentor",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "bun run --parallel dev:frontend dev:backend",
    "dev:frontend": "bun --cwd apps/frontend dev",
    "dev:backend": "bun --cwd apps/backend start:dev",
    "build": "bun run build:packages && bun run build:apps",
    "build:packages": "bun --cwd packages/shared build && bun --cwd packages/ui build",
    "build:apps": "bun --cwd apps/frontend build && bun --cwd apps/backend build",
    "test": "bun run test:packages && bun run test:apps",
    "lint": "bun run lint:packages && bun run lint:apps",
    "type-check": "bun run type-check:packages && bun run type-check:apps"
  },
  "devDependencies": {
    "@types/node": "^22.16.5",
    "typescript": "^5.8.3"
  }
}
```

### Frontend Package.json (apps/frontend/package.json)

```json
{
  "name": "@wag-wise-mentor/frontend",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@wag-wise-mentor/shared": "workspace:*",
    "@wag-wise-mentor/ui": "workspace:*"
    // ... existing dependencies
  }
}
```

### Backend Package.json (apps/backend/package.json)

```json
{
  "name": "@wag-wise-mentor/backend",
  "private": true,
  "scripts": {
    "start": "node dist/main",
    "start:dev": "nest start --watch",
    "build": "nest build",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@wag-wise-mentor/shared": "workspace:*",
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@supabase/supabase-js": "^2.58.0"
    // ... other backend dependencies
  }
}
```

### Shared Package.json (packages/shared/package.json)

```json
{
  "name": "@wag-wise-mentor/shared",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "typescript": "^5.8.3"
  }
}
```

## Development Workflow

### Local Development

1. `bun install` - Install all dependencies
2. `bun run dev` - Start both frontend and backend in development mode
3. Frontend runs on http://localhost:5173
4. Backend runs on http://localhost:3000

### Building for Production

1. `bun run build` - Build all packages and apps
2. `bun run test` - Run all tests
3. `bun run lint` - Lint all code

### Deployment Strategy

- Frontend: Deploy to Vercel
- Backend: Deploy to Railway or Render
- Database: Supabase cloud
- Shared packages: Built and included in respective apps

## Benefits of This Structure

1. **Code Sharing**: Types and utilities shared between frontend and backend
2. **Independent Development**: Teams can work on frontend and backend separately
3. **Consistent Tooling**: Bun used across all packages for consistency
4. **Scalable**: Easy to add new apps or packages as the project grows
5. **Type Safety**: Shared types ensure consistency between frontend and backend
6. **Efficient Builds**: Only rebuild what's changed

## Next Steps

1. Create the new directory structure
2. Move existing frontend code to `apps/frontend/`
3. Initialize NestJS backend in `apps/backend/`
4. Set up shared packages
5. Update all configuration files
6. Test the development workflow
7. Set up CI/CD pipeline
