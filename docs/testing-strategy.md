# Testing Strategy Documentation

## Overview

This document outlines the comprehensive testing strategy for the Wag Wise Mentor monorepo, emphasizing behavior testing over mocking and ensuring high-quality, maintainable code.

## Testing Philosophy

### Core Principles

1. **Behavior Testing Over Mocking**: Focus on testing actual behavior and interactions rather than implementation details
2. **Comprehensive Coverage**: Test all business logic, critical paths, and user interactions
3. **Real Environment Testing**: Use real databases, services, and integrations where possible
4. **Automated Testing**: All tests must run in CI/CD pipeline
5. **Fast Feedback**: Tests should provide quick feedback during development

## Testing Stack

### Backend Testing (NestJS)

- **Framework**: Mocha + Chai (NO Jest)
- **HTTP Testing**: chai-http
- **Database Testing**: Real test database with transactions
- **Mocking**: Sinon (minimal usage)
- **Coverage**: nyc

### Frontend Testing (React + Vite)

- **Framework**: Vitest
- **Component Testing**: @testing-library/react
- **DOM Testing**: @testing-library/jest-dom
- **Environment**: jsdom
- **Coverage**: @vitest/coverage

### End-to-End Testing

- **Framework**: Playwright
- **Browser MCP**: Integration with browser automation
- **Cross-browser**: Chrome, Firefox, Safari
- **Mobile**: Responsive testing

## Test Structure

### Backend Tests

```
apps/backend/
├── src/
│   ├── modules/
│   │   ├── puppies/
│   │   │   ├── puppies.service.ts
│   │   │   ├── puppies.controller.ts
│   │   │   └── __tests__/
│   │   │       ├── puppies.service.spec.ts
│   │   │       ├── puppies.controller.spec.ts
│   │   │       └── puppies.integration.spec.ts
│   │   └── feeding/
│   └── common/
│       └── __tests__/
│           └── utils.spec.ts
└── test/
    ├── setup.ts
    ├── fixtures/
    └── helpers/
```

### Frontend Tests (Updated Structure)

```
apps/frontend/                    # Dashboard App (React SPA)
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Dashboard.test.tsx
│   │   ├── puppy-profile/
│   │   │   ├── PuppyProfile.tsx
│   │   │   └── PuppyProfile.test.tsx
│   │   └── features/
│   ├── hooks/
│   │   ├── use-puppy.ts
│   │   └── use-puppy.test.ts
│   └── utils/
│       ├── validation.ts
│       └── validation.test.ts
└── test/
    ├── setup.ts
    ├── fixtures/
    └── helpers/

apps/marketing/                   # Marketing Website (Next.js SSR)
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   └── page.test.tsx
│   ├── components/
│   │   ├── Hero.tsx
│   │   └── Hero.test.tsx
│   └── lib/
└── test/
    ├── setup.ts
    ├── fixtures/
    └── helpers/
```

### E2E Tests (Updated for Dual Apps)

```
e2e/
├── tests/
│   ├── marketing/
│   │   ├── landing-page.spec.ts
│   │   ├── pricing.spec.ts
│   │   └── seo.spec.ts
│   ├── app/
│   │   ├── auth.spec.ts
│   │   ├── puppy-profile.spec.ts
│   │   ├── feeding-schedule.spec.ts
│   │   └── notifications.spec.ts
│   └── integration/
│       ├── marketing-to-app-flow.spec.ts
│       └── cross-domain-auth.spec.ts
├── fixtures/
├── page-objects/
│   ├── MarketingPage.ts
│   ├── DashboardPage.ts
│   └── BasePage.ts
└── playwright.config.ts
```

## Testing Guidelines

### Backend Testing

1. **Unit Tests**
   - Test individual service methods
   - Test business logic and validation
   - Use real database with transactions
   - Test error handling and edge cases

2. **Integration Tests**
   - Test API endpoints end-to-end
   - Test database operations
   - Test external service integrations
   - Use test database with cleanup

3. **Test Database Setup**

   ```typescript
   // Use real PostgreSQL with transactions
   beforeEach(async () => {
     await queryRunner.startTransaction();
   });

   afterEach(async () => {
     await queryRunner.rollbackTransaction();
   });
   ```

### Frontend Testing (Dual App Structure)

#### Dashboard App (React SPA)

1. **Component Tests**
   - Test dashboard components rendering
   - Test user interactions and state changes
   - Test authentication-dependent components
   - Test accessibility and responsive design

2. **Hook Tests**
   - Test custom hooks for data fetching
   - Test authentication hooks
   - Test state management hooks
   - Test error handling and loading states

3. **Integration Tests**
   - Test component interactions within dashboard
   - Test form submissions and API integration
   - Test client-side routing
   - Test real-time updates and notifications

#### Marketing Website (Next.js SSR)

1. **Component Tests**
   - Test marketing page components
   - Test static generation and SSR
   - Test SEO metadata rendering
   - Test responsive layouts

2. **Page Tests**
   - Test page-level components
   - Test static generation
   - Test dynamic routes
   - Test API routes

3. **SEO Tests**
   - Test meta tags and structured data
   - Test Open Graph tags
   - Test sitemap generation
   - Test performance metrics

### E2E Testing (Dual App Structure)

1. **Marketing Website Flows**
   - Landing page load and navigation
   - Pricing page interactions
   - Contact form submissions
   - SEO metadata validation
   - Performance and accessibility

2. **Dashboard App Flows**
   - User registration and authentication
   - Puppy profile creation and management
   - Feeding schedule setup and updates
   - Notification management
   - Dashboard interactions

3. **Cross-App Integration Flows**
   - Marketing to app signup flow
   - Cross-domain authentication
   - Shared session management
   - Domain redirects and routing

4. **Cross-browser Testing**
   - Chrome (primary)
   - Firefox
   - Safari
   - Mobile responsive (both apps)

5. **Browser MCP Integration**

   ```typescript
   // Use browser MCP for advanced automation
   import { browserMCP } from "@playwright/browser-mcp";

   test("puppy profile creation", async ({ page }) => {
     await browserMCP.navigate(page, "/dashboard");
     await browserMCP.interact(page, "create-puppy-button");
     // ... test implementation
   });
   ```

## Coverage Requirements

### Minimum Coverage Thresholds

- **Backend**: 90% line coverage
- **Frontend**: 85% line coverage
- **E2E**: 100% critical user flows

### Coverage Reports

- Generate HTML and JSON coverage reports
- Integrate with CI/CD for coverage tracking
- Fail builds if coverage drops below thresholds

## CI/CD Integration

### Test Pipeline

1. **Lint and Type Check**
2. **Unit Tests** (Backend + Frontend)
3. **Integration Tests** (Backend)
4. **E2E Tests** (Playwright)
5. **Coverage Report Generation**
6. **Coverage Threshold Validation**

### Environment Setup

- **Test Database**: Separate PostgreSQL instance
- **Test Environment**: Isolated from development
- **External Services**: Use test/staging endpoints
- **Browser Testing**: Headless mode in CI

## Best Practices

### Writing Tests

1. **Descriptive Test Names**: Clearly describe what is being tested
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Test Behavior**: Focus on what the code does, not how
4. **Minimal Mocking**: Only mock external dependencies
5. **Real Data**: Use realistic test data

### Test Maintenance

1. **Keep Tests Fast**: Optimize for speed
2. **Independent Tests**: Tests should not depend on each other
3. **Clean Setup**: Proper setup and teardown
4. **Regular Updates**: Keep tests in sync with code changes

### Debugging Tests

1. **Clear Error Messages**: Provide helpful test failure messages
2. **Debug Mode**: Enable detailed logging for test failures
3. **Test Isolation**: Ensure tests can run independently
4. **Documentation**: Document complex test scenarios

## Tools and Commands

### Running Tests (Updated Commands)

```bash
# All tests (from root)
bun run test              # Run all tests across monorepo
bun run test:coverage     # Generate coverage reports

# Backend tests
cd apps/backend
bun run test              # Unit tests
bun run test:integration  # Integration tests
bun run test:coverage     # Coverage report

# Dashboard app tests
cd apps/frontend
bun run test              # Unit tests
bun run test:coverage     # Coverage report

# Marketing website tests (when implemented)
cd apps/marketing
bun run test              # Unit tests
bun run test:coverage     # Coverage report

# Shared package tests
cd packages/shared
bun run test:run          # Unit tests
bun run test:coverage     # Coverage report

cd packages/ui
bun run test:run          # Unit tests
bun run test:coverage     # Coverage report

# E2E tests
bun run test:e2e          # Playwright tests
bun run test:e2e:ui       # Playwright UI mode
bun run test:e2e:headed   # Playwright headed mode
```

### Coverage Commands

```bash
# Generate coverage reports
npm run coverage:backend
npm run coverage:frontend
npm run coverage:combined

# Coverage thresholds
npm run coverage:check
```

## Browser MCP Integration

### Setup

1. Install Playwright with MCP support
2. Configure browser MCP server
3. Set up test environment variables
4. Create MCP test utilities

### Usage

```typescript
// Advanced browser automation with MCP
import { browserMCP } from "@playwright/browser-mcp";

test("complex user interaction", async ({ page }) => {
  await browserMCP.setup(page, {
    viewport: { width: 1920, height: 1080 },
    userAgent: "custom-user-agent",
  });

  await browserMCP.navigate(page, "/dashboard");
  await browserMCP.waitForElement(page, ".puppy-card");
  await browserMCP.interact(page, ".create-puppy-button");

  // Advanced assertions with MCP
  await browserMCP.assertElementVisible(page, ".puppy-form");
  await browserMCP.assertTextContent(page, "h1", "Create New Puppy");
});
```

This comprehensive testing strategy ensures high-quality, maintainable code with excellent test coverage and reliable automated testing.
