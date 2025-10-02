# Wag Wise Mentor - Monorepo Implementation PRD

## Project Structure

This PRD defines tasks for implementing Wag Wise Mentor as a Bun-based monorepo with separated frontend and backend applications using Domain-Driven Design (DDD) principles and comprehensive testing strategies.

## Development Principles

The following principles must be followed throughout the entire development process:

### Core Development Principles
- **KISS (Keep It Simple, Stupid)**: Prioritize simplicity and clarity over complexity
- **DRY (Don't Repeat Yourself)**: Eliminate code duplication through proper abstraction
- **Domain-Driven Design (DDD)**: Structure code around business domains and use cases
- **Avoid Nested IF Statements**: Use early returns, guard clauses, and proper error handling instead of deeply nested conditionals

### Testing Philosophy
- **AAA Pattern (Arrange-Act-Assert)**: Structure all tests with clear setup, execution, and verification phases
- **Behavior Testing Over Mocking**: Focus on testing actual behavior rather than implementation details
- **Comprehensive Coverage**: Test all business logic, edge cases, and error conditions
- **In-Memory Providers**: Use in-memory implementations for testing to avoid external dependencies

### Monorepo Architecture

```
wag-wise-mentor/
├── apps/
│   ├── frontend/           # React + Vite + TypeScript
│   └── backend/            # NestJS + TypeScript
├── packages/
│   ├── shared/            # Shared types and utilities
│   └── ui/                # Shared UI components
└── supabase/              # Database migrations and Edge Functions
```

## Phase 0: Monorepo Foundation

### Task Group: Monorepo Setup
**Priority: Critical - Must complete first**

1. **Create Monorepo Directory Structure**
   - Create apps/, packages/, and supabase/ directories
   - Set up Bun workspace configuration in root package.json
   - Move existing frontend code to apps/frontend/
   - Update all import paths and configurations
   - Configure TypeScript path mappings for workspace packages

2. **Initialize Shared Packages**
   - Create packages/shared/ for types and utilities
   - Set up TypeScript configuration for shared package
   - Create packages/ui/ for reusable React components
   - Configure build scripts for shared packages
   - Set up development watch mode for packages

3. **Initialize NestJS Backend Structure with DDD Architecture**
   - Create apps/backend/ with NestJS CLI
   - Implement Domain-Driven Design (DDD) architecture:
     - **Domain Layer**: Entities, Value Objects, Domain Services, Repository Interfaces
     - **Application Layer**: Use Cases, Application Services, Command/Query DTOs
     - **Infrastructure Layer**: Repository Implementations, Controllers, External Service Adapters
   - Configure NestJS modules structure (auth, puppies, calendar, training, ai)
   - Set up Supabase client integration in backend
   - Configure environment variables and config module
   - Set up backend development server
   - Implement dependency injection with proper abstraction layers

## Phase 0.5: Testing Infrastructure Setup

### Task Group: Comprehensive Testing Strategy
**Priority: High - Must complete before feature development**

4. **Setup Backend Testing with Mocha + Chai**
   - Configure Mocha and Chai for backend unit and integration testing
   - Install testing dependencies: mocha, chai, chai-http, sinon, nyc
   - Configure test scripts in package.json
   - Set up test database for integration tests
   - Create test utilities and helpers
   - Implement AAA (Arrange-Act-Assert) pattern in all tests
   - Use in-memory providers for repository testing

5. **Setup Frontend Testing with Vitest**
   - Configure Vitest for React component and utility testing
   - Install testing dependencies: vitest, @testing-library/react, @testing-library/jest-dom, jsdom
   - Configure vitest.config.ts with proper setup
   - Set up test utilities and custom render functions
   - Implement AAA pattern for component tests
   - Focus on behavior testing over implementation details

6. **Setup Playwright E2E Testing**
   - Configure Playwright for end-to-end testing
   - Set up browser MCP integration for automated testing
   - Create E2E test utilities and page objects
   - Implement comprehensive user journey tests
   - Configure CI/CD integration for E2E tests

7. **Implement Test Coverage Reporting**
   - Configure coverage tools: nyc for Mocha, @vitest/coverage for Vitest
   - Set up coverage thresholds and reporting
   - Integrate with CI/CD for coverage tracking
   - Ensure minimum 80% code coverage across all layers

## Phase 1: Backend Infrastructure

### Task Group: Database & Authentication Backend
**Dependencies: Phase 0 complete**

8. **Implement Supabase Database Schema**
   - Create database migration files for all tables
   - Set up Row Level Security (RLS) policies
   - Create database functions and triggers
   - Implement indexes for performance optimization
   - Set up database backup and recovery procedures

9. **Build Authentication Backend Module with DDD**
   - Create NestJS auth module with DDD architecture
   - Implement Domain Layer: User entity, Authentication value objects
   - Build Application Layer: LoginUseCase, RegisterUseCase, PasswordResetUseCase
   - Create Infrastructure Layer: Supabase auth adapter, JWT validation middleware
   - Implement role-based access control (RBAC) guards
   - Create comprehensive tests using AAA pattern

### Task Group: Core Backend APIs
**Dependencies: Database & Auth complete**

10. **Implement Puppies Backend Module with DDD**
    - Create Domain Layer: Puppy entity, Breed value object, Weight tracking domain service
    - Build Application Layer: CreatePuppyUseCase, UpdatePuppyUseCase, GetPuppiesByOwnerUseCase
    - Create Infrastructure Layer: Supabase repository implementation, photo upload adapter
    - Implement breed data management with proper domain modeling
    - Create weight records and medical history management with business logic
    - Write comprehensive tests using AAA pattern and in-memory providers

11. **Build Calendar & Events Backend Module with DDD**
    - Create Domain Layer: Event entity, RecurringEvent value object, Schedule domain service
    - Build Application Layer: CreateEventUseCase, UpdateEventUseCase, GenerateHealthTimelineUseCase
    - Create Infrastructure Layer: Calendar repository, Google Calendar integration adapter
    - Implement recurring event logic with proper domain rules
    - Build breed-specific health timeline generator with business logic
    - Create vaccination scheduling service with domain validation

12. **Implement Feeding Backend Module with DDD**
    - Create Domain Layer: FeedingSchedule entity, PortionCalculation domain service
    - Build Application Layer: CreateFeedingScheduleUseCase, LogFeedingUseCase, CalculatePortionUseCase
    - Create Infrastructure Layer: Feeding repository, food database adapter
    - Implement weight-based portion calculation algorithms with domain logic
    - Create food types and assignments management with business rules
    - Build feeding history aggregation with proper domain services

13. **Build Training Backend Module with DDD**
    - Create Domain Layer: TrainingExercise entity, ProgressTracking domain service
    - Build Application Layer: CreateTrainingSessionUseCase, TrackProgressUseCase, RecommendTrainingUseCase
    - Create Infrastructure Layer: Training repository, exercise database adapter
    - Implement training progress tracking with domain validation
    - Create behavioral milestones tracking with business logic
    - Implement training recommendation algorithms with domain services

### Task Group: Advanced Backend Features
**Dependencies: Core APIs complete**

14. **Implement Notification Backend System with DDD**
    - Create Domain Layer: Notification entity, NotificationSchedule domain service
    - Build Application Layer: SendNotificationUseCase, ScheduleNotificationUseCase, ManagePreferencesUseCase
    - Create Infrastructure Layer: Supabase Edge Functions adapter, web push adapter, email adapter
    - Implement notification scheduling with proper domain logic
    - Build notification preferences management with business rules
    - Create comprehensive tests using AAA pattern

15. **Build Family Sharing Backend Module with DDD**
    - Create Domain Layer: FamilyGroup entity, Invitation value object, Permission domain service
    - Build Application Layer: CreateFamilyGroupUseCase, InviteMemberUseCase, ManagePermissionsUseCase
    - Create Infrastructure Layer: Family repository, invitation email adapter, real-time adapter
    - Implement invitation system with proper domain validation
    - Build RBAC for family member permissions with business logic
    - Implement real-time updates with proper domain events

16. **Implement AI Service Integration Backend with DDD**
    - Create Domain Layer: CarePlan entity, AIRecommendation value object, AIService domain service
    - Build Application Layer: GenerateCarePlanUseCase, OptimizeFeedingUseCase, PredictHealthUseCase
    - Create Infrastructure Layer: AI service abstraction layer, OpenAI adapter, Anthropic adapter
    - Implement care plan generation with proper domain logic
    - Build feeding plan optimization algorithms with business rules
    - Create health milestone prediction service with domain validation

17. **Build Analytics Backend Module with DDD**
    - Create Domain Layer: AnalyticsData entity, TrendAnalysis domain service
    - Build Application Layer: GenerateAnalyticsUseCase, PredictGrowthUseCase, AnalyzeTrendsUseCase
    - Create Infrastructure Layer: Analytics repository, data aggregation adapter
    - Implement weight tracking analytics with proper domain logic
    - Build growth prediction algorithms with business rules
    - Create trend analysis and alerting system with domain services

## Phase 2: Shared Types & Utilities

### Task Group: Shared Package Development
**Dependencies: Backend APIs defined**

18. **Create Shared Type Definitions with DDD Principles**
    - Define all domain model types in packages/shared/
    - Create API request/response DTOs following DDD patterns
    - Build validation schemas with Zod for domain validation
    - Define enums and constants following domain language
    - Create utility type helpers for domain operations
    - Ensure types reflect business domain concepts

19. **Build Shared Utility Functions**
    - Create date/time utilities following KISS principles
    - Build formatting helpers with DRY approach
    - Implement validation utilities for domain rules
    - Create calculation helpers for business logic
    - Build error handling utilities with proper abstraction
    - Avoid nested conditionals in utility functions

## Phase 3: Frontend Application

### Task Group: Frontend Foundation
**Dependencies: Shared packages ready**

20. **Set Up Frontend Architecture with Testing**
    - Configure React Router for navigation
    - Set up React Query for API integration
    - Configure form handling with react-hook-form
    - Implement authentication context and hooks
    - Set up error boundary and error handling
    - Write comprehensive component tests using AAA pattern
    - Focus on behavior testing over implementation details

21. **Build Core UI Components Package with Testing**
    - Create design system in packages/ui/
    - Build Button, Input, Select components with proper validation
    - Create Card, Modal, Toast components with accessibility
    - Implement Form components with comprehensive validation
    - Build responsive layout components
    - Write tests for all components using AAA pattern
    - Ensure components follow KISS and DRY principles

### Task Group: Feature Implementation - Frontend
**Dependencies: Frontend foundation + Backend APIs**

22. **Implement Puppy Profile Frontend with Testing**
    - Create puppy registration wizard components
    - Build breed selection dropdown with validation
    - Implement photo upload component with error handling
    - Create puppy profile view/edit forms following DDD patterns
    - Build weight tracking UI components
    - Implement medical history forms with proper validation
    - Write comprehensive tests using AAA pattern
    - Avoid nested conditionals in component logic

23. **Build Calendar & Events Frontend with Testing**
    - Create calendar component with react-day-picker
    - Build event creation/editing forms with validation
    - Implement recurring event UI following DDD patterns
    - Create vaccination schedule interface
    - Build appointment management UI
    - Implement calendar sync settings
    - Write tests for all calendar functionality
    - Focus on user behavior testing

24. **Implement Feeding Schedule Frontend with Testing**
    - Create feeding schedule creation forms
    - Build meal logging interface with validation
    - Implement portion tracking charts
    - Create feeding history visualization
    - Build feeding reminders UI
    - Write comprehensive tests using AAA pattern
    - Ensure forms follow KISS principles

25. **Build Training Library Frontend with Testing**
    - Create training exercise library UI
    - Implement video player components
    - Build progress tracking interface
    - Create training session scheduler
    - Implement milestone tracking UI
    - Write tests for training functionality
    - Focus on user interaction testing

26. **Implement Dashboard & Routines Frontend with Testing**
    - Build main dashboard layout
    - Create daily agenda view
    - Implement routine management UI
    - Build quick action cards
    - Create progress widgets
    - Implement daily checklist component
    - Write comprehensive dashboard tests
    - Ensure components are DRY and maintainable

27. **Build Notification Frontend with Testing**
    - Implement notification permission UI
    - Create notification preferences interface
    - Build in-app notification center
    - Implement notification toasts
    - Create notification history view
    - Write tests for notification functionality
    - Focus on user experience testing

28. **Implement Family Sharing Frontend with Testing**
    - Build family invitation UI
    - Create family member management interface
    - Implement role-based UI controls
    - Build activity feed component
    - Create family communication interface
    - Write comprehensive family sharing tests
    - Ensure proper error handling

29. **Build AI Care Plans Frontend with Testing**
    - Create care plan display components
    - Implement AI recommendation UI
    - Build care plan customization interface
    - Create feedback collection forms
    - Write tests for AI integration
    - Focus on user interaction patterns

30. **Implement Analytics & Reports Frontend with Testing**
    - Build weight tracking charts with recharts
    - Create growth comparison visualizations
    - Implement trend analysis displays
    - Build export and sharing features
    - Write comprehensive analytics tests
    - Ensure data visualization accuracy

## Phase 4: Mobile & PWA

### Task Group: Mobile Optimization
**Dependencies: Core features complete**

31. **Implement PWA Features with Testing**
    - Configure Vite PWA plugin
    - Set up service worker for offline caching
    - Create app manifest and icons
    - Implement offline data synchronization
    - Build app install prompts
    - Write tests for PWA functionality
    - Ensure offline behavior works correctly

32. **Build Mobile-First UI with Testing**
    - Create mobile navigation components
    - Implement touch gestures
    - Build mobile-optimized forms
    - Create responsive layouts for all features
    - Implement mobile-specific UI patterns
    - Write comprehensive mobile tests
    - Focus on touch interaction testing

## Phase 5: Integration & Testing

### Task Group: System Integration
**Dependencies: Frontend and Backend complete**

33. **API Integration & Testing**
    - Connect all frontend components to backend APIs
    - Implement error handling and retry logic following KISS principles
    - Build loading states and skeletons
    - Create comprehensive integration tests using AAA pattern
    - Implement E2E testing with Playwright
    - Ensure all API interactions are properly tested

34. **Performance Optimization**
    - Implement code splitting and lazy loading
    - Optimize bundle sizes
    - Set up image optimization
    - Implement caching strategies
    - Build performance monitoring
    - Write performance tests
    - Ensure optimization doesn't break functionality

35. **Deployment & DevOps**
    - Configure CI/CD pipeline with automated testing
    - Set up frontend deployment (Vercel)
    - Configure backend deployment (Railway/Render)
    - Set up monitoring and logging
    - Implement automated testing in CI
    - Ensure all tests pass in CI environment

## Success Criteria

Each phase must meet these criteria before moving to the next:

### Phase 0 Success:
- ✅ Monorepo structure created
- ✅ All workspaces install and build successfully
- ✅ Development mode works for all packages
- ✅ DDD architecture implemented in backend

### Phase 0.5 Success:
- ✅ All testing frameworks configured (Mocha, Vitest, Playwright)
- ✅ AAA pattern implemented in all tests
- ✅ In-memory providers working for backend testing
- ✅ Test coverage reporting configured
- ✅ CI/CD testing pipeline working

### Phase 1 Success:
- ✅ All backend APIs documented and tested with AAA pattern
- ✅ Database schema fully implemented
- ✅ Authentication working with DDD architecture
- ✅ API documentation generated
- ✅ All business logic tested with in-memory providers
- ✅ Domain models properly implemented

### Phase 2 Success:
- ✅ Shared types compile without errors
- ✅ Types imported correctly in frontend and backend
- ✅ All utilities tested with AAA pattern
- ✅ DDD principles followed in type definitions

### Phase 3 Success:
- ✅ All frontend features functional
- ✅ UI components responsive and tested
- ✅ Forms validated correctly with proper error handling
- ✅ API integration working
- ✅ All components tested with AAA pattern
- ✅ No nested conditionals in component logic

### Phase 4 Success:
- ✅ PWA installable and tested
- ✅ Offline mode functional
- ✅ Mobile UI fully responsive
- ✅ Touch interactions working
- ✅ All mobile features tested

### Phase 5 Success:
- ✅ All tests passing (unit, integration, E2E)
- ✅ Performance metrics met
- ✅ Successfully deployed
- ✅ Monitoring active
- ✅ CI/CD pipeline working with automated testing

## Technical Stack Summary

### Frontend (apps/frontend/)
- React 18 + TypeScript
- Vite build tool
- React Router for navigation
- React Query for state management
- React Hook Form + Zod validation
- Tailwind CSS + Radix UI
- Recharts for visualizations

### Backend (apps/backend/)
- NestJS + TypeScript with DDD Architecture
- Domain Layer: Entities, Value Objects, Domain Services
- Application Layer: Use Cases, Application Services
- Infrastructure Layer: Repositories, Controllers, Adapters
- Supabase client integration
- REST API architecture
- WebSocket for real-time
- JWT authentication
- Mocha + Chai for testing with AAA pattern
- In-memory providers for testing

### Shared (packages/)
- TypeScript with DDD principles
- Zod for domain validation schemas
- Shared types and utilities following KISS/DRY

### Testing Stack
- **Backend**: Mocha + Chai + Sinon + NYC (coverage)
- **Frontend**: Vitest + React Testing Library + JSDOM
- **E2E**: Playwright with Browser MCP integration
- **Pattern**: AAA (Arrange-Act-Assert) for all tests
- **Strategy**: Behavior testing over mocking
- **Providers**: In-memory implementations for backend testing

### Infrastructure
- Bun for monorepo management
- Supabase for database and auth
- Vercel for frontend hosting
- Railway/Render for backend hosting
- GitHub Actions for CI/CD with automated testing
