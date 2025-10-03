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
6. **Abstract Class Pattern**: Use abstract classes for repositories and services to enable clean dependency injection without string tokens

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

### E2E Tests (Updated for Dual Apps with Page Object Models)

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
│   ├── base/
│   │   ├── BasePage.ts
│   │   └── BaseComponent.ts
│   ├── marketing/
│   │   ├── LandingPage.ts
│   │   ├── PricingPage.ts
│   │   ├── ContactPage.ts
│   │   └── components/
│   │       ├── NavigationComponent.ts
│   │       ├── HeroComponent.ts
│   │       └── FooterComponent.ts
│   ├── app/
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   ├── PuppyProfilePage.ts
│   │   ├── FeedingSchedulePage.ts
│   │   └── components/
│   │       ├── PuppyCardComponent.ts
│   │       ├── FeedingFormComponent.ts
│   │       └── CalendarComponent.ts
│   └── shared/
│       ├── AuthComponent.ts
│       ├── NotificationComponent.ts
│       └── LoadingComponent.ts
├── helpers/
│   ├── TestUtils.ts
│   ├── BrowserMCP.ts
│   └── DataFactory.ts
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

4. **Abstract Class Repository Pattern**

   ```typescript
   // Domain Layer - Abstract Repository
   export abstract class PuppyRepository {
     abstract save(puppy: Puppy): Promise<Puppy>;
     abstract findById(id: PuppyId): Promise<Puppy | null>;
     abstract findByOwnerId(ownerId: string): Promise<Puppy[]>;
   }

   // Infrastructure Layer - Concrete Implementation
   @Injectable()
   export class InMemoryPuppyRepository extends PuppyRepository {
     async save(puppy: Puppy): Promise<Puppy> {
       // Implementation
     }

     async findById(id: PuppyId): Promise<Puppy | null> {
       // Implementation
     }

     async findByOwnerId(ownerId: string): Promise<Puppy[]> {
       // Implementation
     }
   }

   // Module Configuration - No string tokens needed
   @Module({
     providers: [
       {
         provide: PuppyRepository,
         useClass: InMemoryPuppyRepository,
       },
     ],
   })
   export class PuppyModule {}
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

### E2E Testing (Dual App Structure with Page Object Models)

#### Page Object Model Implementation

Following [Selenium Page Object Model best practices](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/), we implement a comprehensive Page Object Model architecture:

**Core Principles:**

1. **Clean Separation**: Test code separated from page-specific code (locators, layout)
2. **Single Repository**: All page services/operations centralized in one place
3. **UI Change Resilience**: UI changes only require updates in Page Objects, not tests
4. **Service-Oriented**: Page Objects represent services offered by pages, not implementation details

**Architecture Structure:**

```typescript
// Base Page Object - Common functionality
export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  // Common navigation methods
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  // Common assertion methods
  async assertPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async assertUrlContains(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }
}

// Marketing Page Object Example
export class LandingPage extends BasePage {
  // Locators - only defined once
  private readonly heroSection = this.page.locator(
    '[data-testid="hero-section"]'
  );
  private readonly ctaButton = this.page.locator('[data-testid="cta-button"]');
  private readonly pricingLink = this.page.locator(
    '[data-testid="pricing-link"]'
  );

  constructor(page: Page) {
    super(page, process.env.MARKETING_URL || "http://localhost:3000");
  }

  // Services offered by the landing page
  async navigateToLanding(): Promise<void> {
    await this.navigateTo("/");
    await this.waitForLoad();
  }

  async clickGetStarted(): Promise<PricingPage> {
    await this.ctaButton.click();
    return new PricingPage(this.page);
  }

  async navigateToPricing(): Promise<PricingPage> {
    await this.pricingLink.click();
    return new PricingPage(this.page);
  }

  async assertHeroVisible(): Promise<void> {
    await expect(this.heroSection).toBeVisible();
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertPageTitle("Wag Wise Mentor - AI-Powered Puppy Care");
    await this.assertHeroVisible();
  }
}

// Dashboard Page Object Example
export class DashboardPage extends BasePage {
  // Locators
  private readonly puppyCards = this.page.locator('[data-testid="puppy-card"]');
  private readonly addPuppyButton = this.page.locator(
    '[data-testid="add-puppy-button"]'
  );
  private readonly userMenu = this.page.locator('[data-testid="user-menu"]');

  constructor(page: Page) {
    super(page, process.env.APP_URL || "http://localhost:5173");
  }

  // Services offered by the dashboard
  async navigateToDashboard(): Promise<void> {
    await this.navigateTo("/dashboard");
    await this.waitForLoad();
  }

  async clickAddPuppy(): Promise<PuppyProfilePage> {
    await this.addPuppyButton.click();
    return new PuppyProfilePage(this.page);
  }

  async getPuppyCount(): Promise<number> {
    return await this.puppyCards.count();
  }

  async assertDashboardLoaded(): Promise<void> {
    await this.assertPageTitle("Dashboard - Wag Wise Mentor");
    await expect(this.addPuppyButton).toBeVisible();
  }
}

// Component Object Example
export class PuppyCardComponent {
  private readonly card: Locator;
  private readonly name: Locator;
  private readonly editButton: Locator;

  constructor(page: Page, puppyId: string) {
    this.card = page.locator(`[data-testid="puppy-card-${puppyId}"]`);
    this.name = this.card.locator('[data-testid="puppy-name"]');
    this.editButton = this.card.locator('[data-testid="edit-puppy-button"]');
  }

  async clickEdit(): Promise<PuppyProfilePage> {
    await this.editButton.click();
    return new PuppyProfilePage(this.card.page());
  }

  async getName(): Promise<string> {
    return (await this.name.textContent()) || "";
  }

  async assertPuppyName(expectedName: string): Promise<void> {
    await expect(this.name).toHaveText(expectedName);
  }
}
```

**Test Implementation with Page Objects:**

```typescript
// Test using Page Objects
test.describe("Puppy Management Flow", () => {
  test("should create and manage puppy profile", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const puppyProfilePage = new PuppyProfilePage(page);

    // Act - Login
    await loginPage.navigateToLogin();
    await loginPage.loginAs("test@example.com", "password123");

    // Act - Navigate to dashboard
    await dashboardPage.navigateToDashboard();
    await dashboardPage.assertDashboardLoaded();

    // Act - Add new puppy
    await dashboardPage.clickAddPuppy();
    await puppyProfilePage.fillPuppyDetails({
      name: "Buddy",
      breed: "Golden Retriever",
      birthDate: "2024-01-01",
    });
    await puppyProfilePage.savePuppy();

    // Assert - Verify puppy appears on dashboard
    await dashboardPage.navigateToDashboard();
    const puppyCount = await dashboardPage.getPuppyCount();
    expect(puppyCount).toBe(1);

    // Act - Edit puppy
    const puppyCard = new PuppyCardComponent(page, "buddy-123");
    await puppyCard.clickEdit();
    await puppyProfilePage.updatePuppyName("Buddy Jr.");
    await puppyProfilePage.savePuppy();

    // Assert - Verify updated name
    await dashboardPage.navigateToDashboard();
    await puppyCard.assertPuppyName("Buddy Jr.");
  });
});
```

**Page Object Model Benefits:**

1. **Maintainability**: UI changes only require Page Object updates
2. **Reusability**: Page Objects can be reused across multiple tests
3. **Readability**: Tests focus on user behavior, not implementation
4. **Reliability**: Centralized locator management reduces flaky tests
5. **Scalability**: Easy to add new pages and components

**Implementation Guidelines:**

1. **One Page Object per Page**: Each page/component has its own Page Object
2. **Service Methods**: Methods represent services offered by the page
3. **Return Other Page Objects**: Navigation methods return destination Page Objects
4. **No Assertions in Page Objects**: Page Objects don't make assertions (except page validation)
5. **Component Objects**: Reusable components get their own Page Objects
6. **Fluent API**: Chain methods for better readability

**Browser MCP Integration with Page Objects:**

```typescript
// Advanced Page Object with Browser MCP
export class AdvancedDashboardPage extends BasePage {
  constructor(page: Page) {
    super(page, process.env.APP_URL || "http://localhost:5173");
  }

  async setupAdvancedEnvironment(): Promise<void> {
    await browserMCP.setup(this.page, {
      viewport: { width: 1920, height: 1080 },
      userAgent: "custom-test-agent",
    });
  }

  async performComplexInteraction(): Promise<void> {
    await browserMCP.interact(this.page, '[data-testid="complex-widget"]');
    await browserMCP.waitForElement(this.page, '[data-testid="result-panel"]');
  }

  async assertAdvancedState(): Promise<void> {
    await browserMCP.assertElementVisible(
      this.page,
      '[data-testid="success-indicator"]'
    );
    await browserMCP.assertTextContent(this.page, "h1", "Operation Complete");
  }
}
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
