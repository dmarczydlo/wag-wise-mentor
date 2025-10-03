# Wag Wise Mentor - Comprehensive Project Plan

## Project Overview

**Wag Wise Mentor** is an AI-powered puppy care management platform built as a Bun-based monorepo with separated frontend and backend applications using Domain-Driven Design (DDD) principles and comprehensive testing strategies.

**Mission**: Never miss a puppy care milestone. Smart feeding schedules, vet appointments, training guides, and AI-powered care plans that grow with your puppy.

## Task Processing Requirements

**CRITICAL**: All task processing must reference and follow these mandatory documents:

- **📋 [Architecture Documentation](./architecture.md)** - System design, component relationships, and technical decisions
- **🧪 [Testing Strategy](./testing-strategy.md)** - Comprehensive testing approach and patterns
- **⚙️ [Environment Variables](./environment-variables.md)** - Configuration and environment setup
- **📋 [Project Plan](./project-plan.md)** - This document - complete roadmap and task management

These documents must be checked and referenced during all task processing to ensure consistency and adherence to project standards.

## Development Principles

The following principles must be followed throughout the entire development process:

### Core Development Principles

- **KISS (Keep It Simple, Stupid)**: Prioritize simplicity and clarity over complexity
- **DRY (Don't Repeat Yourself)**: Eliminate code duplication through proper abstraction
- **Domain-Driven Design (DDD)**: Structure code around business domains and use cases
- **Avoid Nested IF Statements**: Use early returns, guard clauses, and proper error handling instead of deeply nested conditionals
- **No Comments Policy**: Code should be self-documenting and readable without comments. Comments are considered an anti-pattern. Exception: AAA (Arrange-Act-Assert) comments in tests are allowed for test structure clarity.

### Testing Philosophy

- **AAA Pattern (Arrange-Act-Assert)**: Structure all tests with clear setup, execution, and verification phases
- **Behavior Testing Over Mocking**: Focus on testing actual behavior rather than implementation details
- **Comprehensive Coverage**: Test all business logic, edge cases, and error conditions
- **In-Memory Providers**: Use in-memory implementations for testing to avoid external dependencies

### Code Quality Standards

- **Self-Documenting Code**: Write code that explains itself through clear naming and structure
- **No Comments**: Avoid comments in production code - they indicate unclear code that needs refactoring
- **Exception - Test AAA Comments**: Only AAA (Arrange-Act-Assert) comments are allowed in tests for structure clarity
- **Meaningful Names**: Use descriptive variable, function, and class names that express intent
- **Small Functions**: Keep functions small and focused on a single responsibility
- **Clean Architecture**: Follow DDD principles with clear separation of concerns

## Architecture Reference

For detailed architecture information, including system design, component relationships, and technical decisions, please refer to:

**📋 [Architecture Documentation](./architecture.md)**

This document contains:

- System architecture overview with ASCII diagrams
- Monorepo structure and package dependencies
- Backend DDD architecture patterns
- Frontend application structure
- Database and deployment architecture
- Development workflow and technology stack

## Implementation Phases

### Phase 0: Monorepo Foundation ✅ COMPLETED

#### Task Group: Monorepo Setup

**Priority: Critical - Must complete first**

1. **Create Monorepo Directory Structure** ✅
   - Create apps/, packages/, and supabase/ directories
   - Set up Bun workspace configuration in root package.json
   - Move existing frontend code to apps/frontend/
   - Update all import paths and configurations
   - Configure TypeScript path mappings for workspace packages

2. **Initialize Shared Packages** ✅
   - Create packages/shared/ for types and utilities
   - Set up TypeScript configuration for shared package
   - Create packages/ui/ for reusable React components
   - Configure build scripts for shared packages
   - Set up development watch mode for packages

3. **Initialize NestJS Backend Structure with DDD Architecture** ✅
   - Create apps/backend/ with NestJS CLI
   - Implement Domain-Driven Design (DDD) architecture:
     - **Domain Layer**: Entities, Value Objects, Domain Services, Abstract Repository Classes
     - **Application Layer**: Use Cases, Application Services, Command/Query DTOs
     - **Infrastructure Layer**: Concrete Repository Implementations, Controllers, External Service Adapters
   - Configure NestJS modules structure (auth, puppies, calendar, training, ai)
   - Set up Supabase client integration in backend
   - Configure environment variables and config module
   - Set up backend development server
   - Implement dependency injection using abstract classes (no string tokens)

### Phase 0.5: Testing Infrastructure Setup ✅ COMPLETED

#### Task Group: Comprehensive Testing Strategy

**Priority: High - Must complete before feature development**

4. **Setup Backend Testing with Mocha + Chai** ✅
   - Configure Mocha and Chai for backend unit and integration testing
   - Install testing dependencies: mocha, chai, chai-http, sinon, nyc
   - Configure test scripts in package.json
   - Set up test database for integration tests
   - Create test utilities and helpers
   - Implement AAA (Arrange-Act-Assert) pattern in all tests
   - Use concrete implementations of abstract classes for repository testing

5. **Setup Frontend Testing with Vitest** ✅
   - Configure Vitest for React component and utility testing
   - Install testing dependencies: vitest, @testing-library/react, @testing-library/jest-dom, jsdom
   - Configure vitest.config.ts with proper setup
   - Set up test utilities and custom render functions
   - Implement AAA pattern for component tests
   - Focus on behavior testing over implementation details

6. **Setup Playwright E2E Testing** ✅
   - Configure Playwright for end-to-end testing
   - Set up browser MCP integration for automated testing
   - Create E2E test utilities and page objects
   - Implement comprehensive user journey tests
   - Configure CI/CD integration for E2E tests

7. **Implement Page Object Models for E2E Tests** 🔄 (Task #39)
   - Create comprehensive Page Object Model architecture following [Selenium best practices](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
   - Implement BasePage and BaseComponent classes for common functionality
   - Build Marketing Page Objects (LandingPage, PricingPage, ContactPage)
   - Create App Page Objects (LoginPage, DashboardPage, PuppyProfilePage)
   - Implement Component Objects for reusable UI elements
   - Set up Page Object inheritance hierarchy and service methods
   - Create test utilities and data factories for Page Objects
   - Ensure Page Objects follow service-oriented design principles
   - Implement fluent API patterns for better test readability
   - Configure Browser MCP integration with Page Objects

8. **Implement Test Coverage Reporting** ✅

- Configure coverage tools: nyc for Mocha, @vitest/coverage for Vitest
- Set up coverage thresholds and reporting
- Integrate with CI/CD for coverage tracking
- Ensure minimum 80% code coverage across all layers

### Phase 1: Backend Infrastructure 🔄 IN PROGRESS

#### Task Group: Database & Authentication Backend

**Dependencies: Phase 0 complete**

36. **Implement Supabase Database Schema** 🔄

- Create database migration files for all tables
- Set up Row Level Security (RLS) policies
- Create database functions and triggers
- Implement indexes for performance optimization
- Set up database backup and recovery procedures

36. **Build Authentication Backend Module with DDD** 🔄

- Create NestJS auth module with DDD architecture
- Implement Domain Layer: User entity, Authentication value objects
- Build Application Layer: LoginUseCase, RegisterUseCase, PasswordResetUseCase
- Create Infrastructure Layer: Supabase auth adapter, JWT validation middleware
- Implement role-based access control (RBAC) guards
- Create comprehensive tests using AAA pattern

#### Task Group: Core Backend APIs

**Dependencies: Database & Auth complete**

36. **Implement Puppies Backend Module with DDD** ✅ (Partial)
    - Create Domain Layer: Puppy entity, Breed value object, Weight tracking domain service
    - Build Application Layer: CreatePuppyUseCase, UpdatePuppyUseCase, GetPuppiesByOwnerUseCase
    - Create Infrastructure Layer: Supabase repository implementation, photo upload adapter
    - Implement breed data management with proper domain modeling
    - Create weight records and medical history management with business logic
    - Write comprehensive tests using AAA pattern and concrete implementations of abstract classes

37. **Build Calendar & Events Backend Module with DDD** 🔄
    - Create Domain Layer: Event entity, RecurringEvent value object, Schedule domain service
    - Build Application Layer: CreateEventUseCase, UpdateEventUseCase, GenerateHealthTimelineUseCase
    - Create Infrastructure Layer: Calendar repository, Google Calendar integration adapter
    - Implement recurring event logic with proper domain rules
    - Build breed-specific health timeline generator with business logic
    - Create vaccination scheduling service with domain validation

38. **Implement Feeding Backend Module with DDD** 🔄
    - Create Domain Layer: FeedingSchedule entity, PortionCalculation domain service
    - Build Application Layer: CreateFeedingScheduleUseCase, LogFeedingUseCase, CalculatePortionUseCase
    - Create Infrastructure Layer: Feeding repository, food database adapter
    - Implement weight-based portion calculation algorithms with domain logic
    - Create food types and assignments management with business rules
    - Build feeding history aggregation with proper domain services

39. **Build Training Backend Module with DDD** 🔄
    - Create Domain Layer: TrainingExercise entity, ProgressTracking domain service
    - Build Application Layer: CreateTrainingSessionUseCase, TrackProgressUseCase, RecommendTrainingUseCase
    - Create Infrastructure Layer: Training repository, exercise database adapter
    - Implement training progress tracking with domain validation
    - Create behavioral milestones tracking with business logic
    - Implement training recommendation algorithms with domain services

#### Task Group: Advanced Backend Features

**Dependencies: Core APIs complete**

36. **Implement Notification Backend System with DDD** 🔄
    - Create Domain Layer: Notification entity, NotificationSchedule domain service
    - Build Application Layer: SendNotificationUseCase, ScheduleNotificationUseCase, ManagePreferencesUseCase
    - Create Infrastructure Layer: Supabase Edge Functions adapter, web push adapter, email adapter
    - Implement notification scheduling with proper domain logic
    - Build notification preferences management with business rules
    - Create comprehensive tests using AAA pattern

37. **Build Family Sharing Backend Module with DDD** 🔄
    - Create Domain Layer: FamilyGroup entity, Invitation value object, Permission domain service
    - Build Application Layer: CreateFamilyGroupUseCase, InviteMemberUseCase, ManagePermissionsUseCase
    - Create Infrastructure Layer: Family repository, invitation email adapter, real-time adapter
    - Implement invitation system with proper domain validation
    - Build RBAC for family member permissions with business logic
    - Implement real-time updates with proper domain events

38. **Implement AI Service Integration Backend with DDD** 🔄
    - Create Domain Layer: CarePlan entity, AIRecommendation value object, AIService domain service
    - Build Application Layer: GenerateCarePlanUseCase, OptimizeFeedingUseCase, PredictHealthUseCase
    - Create Infrastructure Layer: AI service abstraction layer, OpenAI adapter, Anthropic adapter
    - Implement care plan generation with proper domain logic
    - Build feeding plan optimization algorithms with business rules
    - Create health milestone prediction service with domain validation

39. **Build Analytics Backend Module with DDD** 🔄
    - Create Domain Layer: AnalyticsData entity, TrendAnalysis domain service
    - Build Application Layer: GenerateAnalyticsUseCase, PredictGrowthUseCase, AnalyzeTrendsUseCase
    - Create Infrastructure Layer: Analytics repository, data aggregation adapter
    - Implement weight tracking analytics with proper domain logic
    - Build growth prediction algorithms with business rules
    - Create trend analysis and alerting system with domain services

### Phase 2: Shared Types & Utilities ✅ COMPLETED

#### Task Group: Shared Package Development

**Dependencies: Backend APIs defined**

36. **Create Shared Type Definitions with DDD Principles** ✅
    - Define all domain model types in packages/shared/
    - Create API request/response DTOs following DDD patterns
    - Build validation schemas with Zod for domain validation
    - Define enums and constants following domain language
    - Create utility type helpers for domain operations
    - Ensure types reflect business domain concepts

37. **Build Shared Utility Functions** ✅
    - Create date/time utilities following KISS principles
    - Build formatting helpers with DRY approach
    - Implement validation utilities for domain rules
    - Create calculation helpers for business logic
    - Build error handling utilities with proper abstraction
    - Avoid nested conditionals in utility functions

### Phase 3: Marketing Website Separation 🔄 IN PROGRESS (Task #38)

#### Architecture Decision

The project will implement a dual-application architecture to optimize for both SEO and user experience:

1. **Marketing Website** (`apps/marketing/`)
   - **Framework**: Next.js with App Router for SSR/SEO
   - **Purpose**: Public-facing marketing content, landing pages, pricing
   - **Features**: Static generation, SEO metadata, structured data
   - **Domain**: `wagwisementor.com` (marketing site)

2. **Authenticated Dashboard** (`apps/frontend/`)
   - **Framework**: React SPA with Vite for optimal UX
   - **Purpose**: Logged-in user dashboard and features
   - **Features**: Client-side routing, real-time updates, offline support
   - **Domain**: `app.wagwisementor.com` (authenticated app)

3. **Shared Backend** (`apps/backend/`)
   - **Framework**: NestJS with DDD architecture
   - **Purpose**: Serves both applications via REST API
   - **Features**: Authentication, business logic, data management

#### Implementation Steps

1. **Evaluate NX vs Bun Workspaces**: Analyze migration path to NX monorepo management
2. **Create Marketing Website** (`apps/marketing/`):
   - Initialize Next.js app with App Router for SSR/SEO
   - Move marketing content from current frontend
   - Implement static generation for landing pages
   - Configure SEO metadata and structured data
3. **Refactor Dashboard App** (`apps/frontend/`):
   - Extract authenticated routes to dashboard-focused SPA
   - Maintain React + Vite architecture
   - Keep existing Supabase auth integration
4. **Configure Shared Package Usage**:
   - Ensure both apps use `@wag-wise-mentor/shared` and `@wag-wise-mentor/ui`
   - Update build dependencies and watch modes
5. **Setup Vercel Deployment Strategy**:
   - Configure separate Vercel projects for marketing and app
   - Set up domain routing and redirects
   - Configure preview deployments

### Phase 4: Frontend Application 🔄 PLANNED

#### Task Group: Frontend Foundation

**Dependencies: Shared packages ready**

36. **Set Up Frontend Architecture with Testing** 🔄
    - Configure React Router for navigation
    - Set up React Query for API integration
    - Configure form handling with react-hook-form
    - Implement authentication context and hooks
    - Set up error boundary and error handling
    - Write comprehensive component tests using AAA pattern
    - Focus on behavior testing over implementation details

37. **Build Core UI Components Package with Testing** ✅
    - Create design system in packages/ui/
    - Build Button, Input, Select components with proper validation
    - Create Card, Modal, Toast components with accessibility
    - Implement Form components with comprehensive validation
    - Build responsive layout components
    - Write tests for all components using AAA pattern
    - Ensure components follow KISS and DRY principles

#### Task Group: Feature Implementation - Frontend

**Dependencies: Frontend foundation + Backend APIs**

36. **Implement Puppy Profile Frontend with Testing** 🔄
    - Create puppy registration wizard components
    - Build breed selection dropdown with validation
    - Implement photo upload component with error handling
    - Create puppy profile view/edit forms following DDD patterns
    - Build weight tracking UI components
    - Implement medical history forms with proper validation
    - Write comprehensive tests using AAA pattern
    - Avoid nested conditionals in component logic

37. **Build Calendar & Events Frontend with Testing** 🔄
    - Create calendar component with react-day-picker
    - Build event creation/editing forms with validation
    - Implement recurring event UI following DDD patterns
    - Create vaccination schedule interface
    - Build appointment management UI
    - Implement calendar sync settings
    - Write tests for all calendar functionality
    - Focus on user behavior testing

38. **Implement Feeding Schedule Frontend with Testing** 🔄
    - Create feeding schedule creation forms
    - Build meal logging interface with validation
    - Implement portion tracking charts
    - Create feeding history visualization
    - Build feeding reminders UI
    - Write comprehensive tests using AAA pattern
    - Ensure forms follow KISS principles

39. **Build Training Library Frontend with Testing** 🔄
    - Create training exercise library UI
    - Implement video player components
    - Build progress tracking interface
    - Create training session scheduler
    - Implement milestone tracking UI
    - Write tests for training functionality
    - Focus on user interaction testing

40. **Implement Dashboard & Routines Frontend with Testing** 🔄
    - Build main dashboard layout
    - Create daily agenda view
    - Implement routine management UI
    - Build quick action cards
    - Create progress widgets
    - Implement daily checklist component
    - Write comprehensive dashboard tests
    - Ensure components are DRY and maintainable

41. **Build Notification Frontend with Testing** 🔄
    - Implement notification permission UI
    - Create notification preferences interface
    - Build in-app notification center
    - Implement notification toasts
    - Create notification history view
    - Write tests for notification functionality
    - Focus on user experience testing

42. **Implement Family Sharing Frontend with Testing** 🔄
    - Build family invitation UI
    - Create family member management interface
    - Implement role-based UI controls
    - Build activity feed component
    - Create family communication interface
    - Write comprehensive family sharing tests
    - Ensure proper error handling

43. **Build AI Care Plans Frontend with Testing** 🔄
    - Create care plan display components
    - Implement AI recommendation UI
    - Build care plan customization interface
    - Create feedback collection forms
    - Write tests for AI integration
    - Focus on user interaction patterns

44. **Implement Analytics & Reports Frontend with Testing** 🔄
    - Build weight tracking charts with recharts
    - Create growth comparison visualizations
    - Implement trend analysis displays
    - Build export and sharing features
    - Write comprehensive analytics tests
    - Ensure data visualization accuracy

### Phase 5: Mobile & PWA 🔄 PLANNED

#### Task Group: Mobile Optimization

**Dependencies: Core features complete**

36. **Implement PWA Features with Testing** 🔄
    - Configure Vite PWA plugin
    - Set up service worker for offline caching
    - Create app manifest and icons
    - Implement offline data synchronization
    - Build app install prompts
    - Write tests for PWA functionality
    - Ensure offline behavior works correctly

37. **Build Mobile-First UI with Testing** 🔄
    - Create mobile navigation components
    - Implement touch gestures
    - Build mobile-optimized forms
    - Create responsive layouts for all features
    - Implement mobile-specific UI patterns
    - Write comprehensive mobile tests
    - Focus on touch interaction testing

### Phase 6: Integration & Testing 🔄 PLANNED

#### Task Group: System Integration

**Dependencies: Frontend and Backend complete**

36. **API Integration & Testing** 🔄
    - Connect all frontend components to backend APIs
    - Implement error handling and retry logic following KISS principles
    - Build loading states and skeletons
    - Create comprehensive integration tests using AAA pattern
    - Implement E2E testing with Playwright
    - Ensure all API interactions are properly tested

37. **Performance Optimization** 🔄
    - Implement code splitting and lazy loading
    - Optimize bundle sizes
    - Set up image optimization
    - Implement caching strategies
    - Build performance monitoring
    - Write performance tests
    - Ensure optimization doesn't break functionality

38. **Deployment & DevOps** 🔄
    - Configure CI/CD pipeline with automated testing
    - Set up frontend deployment (Vercel)
    - Configure backend deployment (Railway/Render)
    - Set up monitoring and logging
    - Implement automated testing in CI
    - Ensure all tests pass in CI environment

## Technical Stack

### Frontend Applications

- **Dashboard App**: React 18 + TypeScript + Vite
- **Marketing Website**: Next.js 14 + TypeScript + App Router
- **UI Framework**: Tailwind CSS + Radix UI (shadcn/ui)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization

### Backend

- **Framework**: NestJS + TypeScript with DDD Architecture
- **Architecture**: Domain-Driven Design with proper layer separation
  - **Domain Layer**: Entities, Value Objects, Domain Services
  - **Application Layer**: Use Cases, Application Services
  - **Infrastructure Layer**: Repositories, Controllers, Adapters
- **Database**: PostgreSQL via Supabase
- **Authentication**: JWT + Supabase Auth
- **API**: RESTful API architecture
- **Real-time**: WebSocket for live updates

### Shared Packages

- **@wag-wise-mentor/shared**: TypeScript with DDD principles, Zod validation schemas
- **@wag-wise-mentor/ui**: Reusable React components (shadcn/ui)

### Testing Stack

- **Backend**: Mocha + Chai + Sinon + NYC (coverage)
- **Frontend**: Vitest + React Testing Library + JSDOM
- **E2E**: Playwright with Browser MCP integration + Page Object Models
- **Pattern**: AAA (Arrange-Act-Assert) for all tests
- **Strategy**: Behavior testing over mocking
- **Providers**: Concrete implementations of abstract classes for backend testing
- **Page Objects**: Service-oriented design following [Selenium best practices](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

### Infrastructure

- **Monorepo**: Bun workspaces (considering NX migration)
- **Database**: Supabase cloud
- **Frontend Hosting**: Vercel (separate projects for marketing and app)
- **Backend Hosting**: Railway/Render
- **CI/CD**: GitHub Actions with automated testing

## Package Configuration

### Root Package.json (Current Implementation)

```json
{
  "name": "wag-wise-mentor",
  "version": "1.0.0",
  "description": "Wag Wise Mentor - AI-powered puppy care management platform",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "concurrently \"bun run dev:frontend\" \"bun run dev:backend\"",
    "dev:frontend": "cd apps/frontend && bun run dev",
    "dev:backend": "cd apps/backend && bun run start:dev",
    "build": "bun run build:shared && bun run build:ui && bun run build:frontend && bun run build:backend",
    "build:shared": "cd packages/shared && bun run build",
    "build:ui": "cd packages/ui && bun run build",
    "build:frontend": "cd apps/frontend && bun run build",
    "build:backend": "cd apps/backend && bun run build",
    "test": "bun run test:shared && bun run test:frontend && bun run test:backend && bun run test:e2e",
    "test:shared": "cd packages/shared && bun run test:run",
    "test:frontend": "cd apps/frontend && bun run test",
    "test:backend": "cd apps/backend && bun run test",
    "test:e2e": "playwright test",
    "test:coverage": "bun run test:coverage:shared && bun run test:coverage:ui && bun run test:coverage:frontend && bun run test:coverage:backend"
  },
  "devDependencies": {
    "@playwright/test": "^1.55.1",
    "concurrently": "^9.1.0"
  },
  "engines": {
    "bun": ">=1.0.0"
  },
  "packageManager": "bun@1.2.23"
}
```

## NX Monorepo Consideration

**Current**: Bun workspaces with simple dependency management
**Consideration**: NX for advanced monorepo features

**NX Benefits**:

- Advanced build caching and dependency graph
- Affected project detection
- Code generation and migration tools
- Better CI/CD integration
- Plugin ecosystem

**Migration Path**:

1. Evaluate current Bun workspace performance
2. Assess NX migration complexity
3. Consider hybrid approach (NX for build, Bun for runtime)
4. Plan gradual migration if beneficial

## Vercel Deployment Strategy

**Separate Projects**:

- `wag-wise-mentor-marketing` → `wagwisementor.com`
- `wag-wise-mentor-app` → `app.wagwisementor.com`

**Configuration**:

```json
// vercel.json for marketing
{
  "buildCommand": "cd apps/marketing && npm run build",
  "outputDirectory": "apps/marketing/.next",
  "framework": "nextjs"
}

// vercel.json for app
{
  "buildCommand": "cd apps/frontend && npm run build",
  "outputDirectory": "apps/frontend/dist",
  "framework": "vite"
}
```

## Development Workflow

### Git Workflow Requirements

**CRITICAL**: All development work must follow proper Git workflow:

1. **Always Create Feature Branches**: Never commit directly to `main` branch
2. **Branch Naming Convention**: Use descriptive branch names (e.g., `feature/auth-module`, `fix/dependency-injection`, `docs/update-testing-strategy`)
3. **Pull Request Process**: All changes must go through Pull Request review
4. **Branch Protection**: `main` branch should be protected and require PR approval

**Required Git Commands for Development**:

```bash
# 1. Create and checkout feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: descriptive commit message"

# 3. Push branch to remote
git push origin feature/your-feature-name

# 4. Create Pull Request via GitHub UI or CLI
# 5. After PR approval, merge to main
# 6. Delete feature branch after merge
```

**Branch Naming Conventions**:

- `feature/` - New features or major functionality
- `fix/` - Bug fixes
- `refactor/` - Code refactoring without changing functionality
- `docs/` - Documentation updates
- `test/` - Test-related changes
- `chore/` - Maintenance tasks, dependency updates

**Commit Message Format**:

- Use conventional commits: `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Examples:
  - `feat(auth): add user registration with email validation`
  - `fix(di): resolve abstract class injection issues`
  - `docs(testing): update Page Object Models documentation`

### Local Development

1. `bun install` - Install all dependencies
2. `bun run dev` - Start both frontend and backend in development mode
3. Frontend runs on http://localhost:5173
4. Backend runs on http://localhost:3001

### Building for Production

1. `bun run build` - Build all packages and apps
2. `bun run test` - Run all tests
3. `bun run test:coverage` - Generate coverage reports

## Success Criteria

Each phase must meet these criteria before moving to the next:

### Phase 0 Success: ✅ ACHIEVED

- ✅ Monorepo structure created
- ✅ All workspaces install and build successfully
- ✅ Development mode works for all packages
- ✅ DDD architecture implemented in backend

### Phase 0.5 Success: ✅ ACHIEVED

- ✅ All testing frameworks configured (Mocha, Vitest, Playwright)
- ✅ AAA pattern implemented in all tests
- ✅ In-memory providers working for backend testing
- ✅ Test coverage reporting configured
- ✅ CI/CD testing pipeline working

### Phase 1 Success: 🔄 IN PROGRESS

- 🔄 All backend APIs documented and tested with AAA pattern
- 🔄 Database schema fully implemented
- 🔄 Authentication working with DDD architecture
- 🔄 API documentation generated
- 🔄 All business logic tested with in-memory providers
- 🔄 Domain models properly implemented

### Phase 2 Success: ✅ ACHIEVED

- ✅ Shared types compile without errors
- ✅ Types imported correctly in frontend and backend
- ✅ All utilities tested with AAA pattern
- ✅ DDD principles followed in type definitions

### Phase 3 Success: 🔄 IN PROGRESS

- 🔄 Marketing website and dashboard app separated
- 🔄 Both apps functional and tested
- 🔄 SEO optimization implemented
- 🔄 Cross-app authentication working
- 🔄 Vercel deployment configured

### Phase 4 Success: 🔄 PLANNED

- 🔄 All frontend features functional
- 🔄 UI components responsive and tested
- 🔄 Forms validated correctly with proper error handling
- 🔄 API integration working
- 🔄 All components tested with AAA pattern
- 🔄 No nested conditionals in component logic

### Phase 5 Success: 🔄 PLANNED

- 🔄 PWA installable and tested
- 🔄 Offline mode functional
- 🔄 Mobile UI fully responsive
- 🔄 Touch interactions working
- 🔄 All mobile features tested

### Phase 6 Success: 🔄 PLANNED

- 🔄 All tests passing (unit, integration, E2E)
- 🔄 Performance metrics met
- 🔄 Successfully deployed
- 🔄 Monitoring active
- 🔄 CI/CD pipeline working with automated testing

## Benefits of This Architecture

1. **SEO Optimization**: Marketing site uses SSR for better search rankings
2. **User Experience**: Dashboard app optimized for logged-in users
3. **Code Sharing**: Types and utilities shared between all applications
4. **Independent Development**: Teams can work on different apps separately
5. **Consistent Tooling**: Bun used across all packages for consistency
6. **Scalable**: Easy to add new apps or packages as the project grows
7. **Type Safety**: Shared types ensure consistency across all applications
8. **Efficient Builds**: Only rebuild what's changed
9. **Deployment Flexibility**: Separate deployment strategies per app type
10. **Domain-Driven Design**: Business logic properly encapsulated and testable
11. **Comprehensive Testing**: Behavior-driven testing with high coverage
12. **Modern Stack**: Latest technologies for optimal performance and developer experience

---

**Last Updated**: January 2025
**Status**: Phase 1-2 Complete, Phase 3 In Progress
**Next Priority**: Complete marketing website separation (Task #38)
