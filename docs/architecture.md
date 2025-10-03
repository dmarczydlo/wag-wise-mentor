# Wag Wise Mentor - Architecture Documentation

## Overview

This document describes the comprehensive architecture of the Wag Wise Mentor monorepo, including system design, component relationships, and technical decisions.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Monorepo Structure](#monorepo-structure)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Database Architecture](#database-architecture)
6. [Deployment Architecture](#deployment-architecture)
7. [Development Workflow](#development-workflow)

## System Architecture

### High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Wag Wise Mentor                          │
│                         System Overview                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Marketing     │    │   Dashboard     │    │    Backend      │
│   Website       │    │   Application   │    │   Services      │
│   (Next.js)     │    │   (React SPA)   │    │   (NestJS)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Supabase     │
                    │   Database      │
                    │   & Auth        │
                    └─────────────────┘
```

### Component Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                    Component Relationships                      │
└─────────────────────────────────────────────────────────────────┘

Marketing Website ──┐
                   ├──► Shared Packages (@wag-wise-mentor/shared)
Dashboard App ──────┘                    @wag-wise-mentor/ui
                                              │
                                              ▼
                                    Backend Services
                                              │
                                              ▼
                                         Supabase DB
```

## Monorepo Structure

### Directory Layout

```
wag-wise-mentor/
├── apps/
│   ├── backend/          # NestJS Backend API
│   ├── frontend/         # React Dashboard App
│   └── marketing/         # Next.js Marketing Website
├── packages/
│   ├── shared/           # Shared utilities & types
│   └── ui/               # Shared UI components
├── docs/                 # Documentation
├── e2e/                  # End-to-end tests
├── supabase/             # Database migrations & config
└── scripts/              # Build & deployment scripts
```

### Package Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                    Package Dependencies                         │
└─────────────────────────────────────────────────────────────────┘

apps/backend ──┐
               ├──► packages/shared
apps/frontend ─┤
               ├──► packages/ui ──► packages/shared
apps/marketing ┘
```

## Backend Architecture

### Domain-Driven Design (DDD) Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    Backend DDD Architecture                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Domain       │    │   Application   │    │ Infrastructure  │
│    Layer        │    │     Layer       │    │     Layer       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
    ┌─────────┐            ┌─────────┐            ┌────────────┐
    │Entities │            │Use Cases│            │Controllers │
    │Value    │            │Commands │            │Repositories│
    │Objects  │            │Queries  │            │Services    │
    └─────────┘            └─────────┘            └────────────┘
```

### Module Structure

```
src/
├── domain/                 # Domain Layer
│   ├── puppy/
│   │   ├── puppy.entity.ts
│   │   └── puppy.repository.ts
│   ├── auth/
│   │   ├── user.entity.ts
│   │   └── user.repository.ts
│   └── calendar/
│       ├── event.entity.ts
│       └── event.repository.ts
├── application/            # Application Layer
│   ├── puppy/
│   │   └── puppy.use-cases.ts
│   ├── auth/
│   │   └── auth.use-cases.ts
│   └── calendar/
│       └── calendar.use-cases.ts
└── infrastructure/         # Infrastructure Layer
    ├── puppy/
    │   ├── puppy.controller.ts
    │   ├── puppy.module.ts
    │   └── in-memory-puppy.repository.ts
    ├── auth/
    │   ├── auth.controller.ts
    │   ├── auth.module.ts
    │   └── in-memory-user.repository.ts
    └── calendar/
        ├── calendar.controller.ts
        ├── calendar.module.ts
        └── in-memory-event.repository.ts
```

### Dependency Injection Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                Dependency Injection Pattern                     │
└─────────────────────────────────────────────────────────────────┘

Use Case ──► @Inject(SYMBOL_TOKEN) ──► Abstract Repository
                                              │
                                              ▼
                                    Concrete Implementation
                                              │
                                              ▼
                                        Module Provider
```

## Frontend Architecture

### Application Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Architecture                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐
│   Marketing     │    │   Dashboard     │
│   Website       │    │   Application   │
│                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   Next.js   │ │    │ │    React    │ │
│ │     SSR     │ │    │ │     SPA     │ │
│ │   SEO Ready │ │    │ │  Auth Req   │ │
│ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
            ┌─────────────────┐
            │  Shared Packages│
            │                 │
            │ @wag-wise-mentor│
            │ /shared & /ui   │
            └─────────────────┘
```

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Component Hierarchy                          │
└─────────────────────────────────────────────────────────────────┘

App
├── Layout Components
│   ├── Header
│   ├── Navigation
│   └── Footer
├── Page Components
│   ├── Dashboard
│   ├── PuppyProfile
│   └── Settings
└── Feature Components
    ├── PuppyCard
    ├── FeedingForm
    └── CalendarView
```

## Database Architecture

### Supabase Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    Database Architecture                        │
└─────────────────────────────────────────────────────────────────┘

Backend Services ──► Supabase Client ──► PostgreSQL Database
                           │
                           ▼
                    Authentication Service
                           │
                           ▼
                    Real-time Subscriptions
```

### Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                    Entity Relationships                         │
└─────────────────────────────────────────────────────────────────┘

Users ──┐
        ├──► Puppies (1:many)
        │
        ├──► Events (1:many)
        │
        └──► Feeding Schedules (1:many)

Puppies ──┐
          ├──► Events (1:many)
          │
          └──► Feeding Schedules (1:many)
```

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                    Deployment Architecture                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Vercel      │    │     Vercel      │    │   Railway/      │
│   Marketing     │    │   Dashboard     │    │   Render        │
│   Website       │    │   Application   │    │   Backend       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Supabase     │
                    │   Production    │
                    └─────────────────┘
```

### Development Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                  Development Environment                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   localhost:    │    │   localhost:    │    │   localhost:    │
│     3000        │    │     5173        │    │     3001        │
│   Marketing     │    │   Dashboard     │    │   Backend       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Supabase      │
                    │   Development   │
                    └─────────────────┘
```

## Development Workflow

### Git Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Git Workflow                               │
└─────────────────────────────────────────────────────────────────┘

Feature Branch ──► Development ──► Pull Request ──► Code Review
     │                                                      │
     └─────────────────── Merge to Main ───────────────────┘
```

### Build Process

```
┌─────────────────────────────────────────────────────────────────┐
│                      Build Process                              │
└─────────────────────────────────────────────────────────────────┘

Source Code ──► TypeScript Compilation ──► Bundle ──► Production
     │                    │                    │
     ├──► Linting         ├──► Testing         ├──► Optimization
     └──► Type Checking   └──► Coverage       └──► Minification
```

## Technology Stack

### Backend Stack

- **Framework**: NestJS with TypeScript
- **Architecture**: Domain-Driven Design (DDD)
- **Database**: Supabase (PostgreSQL)
- **Testing**: Mocha + Chai
- **Dependency Injection**: Abstract Classes + Symbol Tokens

### Frontend Stack

- **Marketing**: Next.js with SSR
- **Dashboard**: React with Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **State Management**: React Query

### Shared Packages

- **Types**: TypeScript definitions
- **Utilities**: Date/time, validation, formatting
- **UI Components**: Reusable React components
- **Validation**: Zod schemas

## Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                          │
└─────────────────────────────────────────────────────────────────┘

User ──► Login Form ──► Supabase Auth ──► JWT Token ──► Protected Routes
```

### Authorization Levels

```
┌─────────────────────────────────────────────────────────────────┐
│                    Authorization Levels                         │
└─────────────────────────────────────────────────────────────────┘

Public Routes ──► Marketing Website
Protected Routes ──► Dashboard Application
Admin Routes ──► System Administration
```

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**: Dynamic imports for route-based splitting
2. **Lazy Loading**: Components loaded on demand
3. **Caching**: React Query for API response caching
4. **Bundle Optimization**: Tree shaking and minification
5. **Database Indexing**: Optimized queries with proper indexes

### Monitoring

- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Web Vitals tracking
- **Database Monitoring**: Supabase analytics
- **API Monitoring**: Request/response logging

## Scalability Considerations

### Horizontal Scaling

- **Stateless Services**: Backend services are stateless
- **Database Scaling**: Supabase handles database scaling
- **CDN Integration**: Vercel provides global CDN
- **Microservices Ready**: DDD architecture supports service extraction

### Future Enhancements

- **Caching Layer**: Redis for session management
- **Message Queue**: Background job processing
- **API Gateway**: Centralized API management
- **Service Mesh**: Inter-service communication

---

_This architecture document is maintained alongside the project and should be updated as the system evolves._
