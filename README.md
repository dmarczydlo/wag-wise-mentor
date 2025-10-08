# Wag Wise Mentor 🐕

**AI-Powered Puppy Care Management Platform**

Never miss a puppy care milestone. Smart feeding schedules, vet appointments, training guides, and AI-powered care plans that grow with your puppy.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **Bun** ([install Bun](https://bun.sh/docs/installation))
- **PostgreSQL** 14+ (for Supabase)
- **Git**

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd wag-wise-mentor

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env
# Edit .env with your actual values

# Start development servers
bun run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 🏗️ Project Structure

This is a **Bun monorepo** with the following structure:

```
wag-wise-mentor/
├── apps/
│   ├── frontend/          # React + Vite dashboard application
│   └── backend/           # NestJS backend with DDD architecture
├── packages/
│   ├── shared/            # Shared types and utilities
│   └── ui/                # Reusable UI components (shadcn/ui)
├── supabase/              # Database migrations and config
├── docs/                  # Documentation (Architecture, ADRs, Testing)
├── e2e/                   # End-to-end tests with Playwright
└── scripts/               # Build and utility scripts
```

> **Note**: Marketing website (Next.js) will be added as `apps/marketing/` in future phases

### Technology Stack

**Frontend (Dashboard App)**

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Supabase** for authentication and database

**Backend (API Services)**

- **NestJS** with TypeScript and DDD architecture
- **Domain-Driven Design** with proper layer separation
- **Abstract Classes** for dependency injection (no string tokens)
- **PostgreSQL** via Supabase
- **JWT** authentication
- **RESTful API** design

**Testing Stack**

- **Vitest** for frontend unit tests (performance over Jest)
- **Mocha + Chai** for backend tests (performance over Jest)
- **Playwright** for E2E testing with Page Object Models
- **Browser MCP** integration
- **AAA Pattern** (Arrange-Act-Assert) for all tests

**Development Tools**

- **Bun** for package management and running
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting

## 🧪 Testing Strategy

We follow a **behavior-driven testing approach** with comprehensive coverage:

### Test Types

- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and service interactions
- **E2E Tests**: Complete user workflows
- **Component Tests**: React component behavior

### Coverage Requirements

- **Backend**: 90% line coverage
- **Frontend**: 85% line coverage
- **E2E**: 100% critical user flows

### Running Tests

```bash
# All tests
bun run test

# Individual test suites
bun run test:shared      # Shared package tests
bun run test:ui          # UI package tests
bun run test:frontend    # Frontend tests
bun run test:backend     # Backend tests
bun run test:e2e         # E2E tests

# Coverage reports
bun run test:coverage    # Generate coverage for all packages
bun run coverage:report  # View coverage reports
```

## 🛠️ Development Commands

### Root Level Commands

```bash
# Development
bun run dev              # Start both frontend and backend
bun run dev:frontend     # Start frontend only
bun run dev:backend      # Start backend only

# Building
bun run build            # Build all packages and apps
bun run build:shared     # Build shared package
bun run build:ui         # Build UI package
bun run build:frontend   # Build frontend only
bun run build:backend    # Build backend only

# Testing
bun run test             # Run all tests
bun run test:shared      # Run shared package tests
bun run test:ui          # Run UI package tests
bun run test:frontend    # Run frontend tests
bun run test:backend     # Run backend tests
bun run test:e2e         # Run E2E tests

# Coverage
bun run test:coverage    # Generate coverage for all
bun run coverage:report  # View coverage reports
bun run coverage:check   # Check coverage thresholds

# Code Quality
bun run lint             # Lint all code
bun run type-check       # TypeScript type checking
bun run clean            # Clean all build artifacts
```

### Workspace Commands

```bash
# Frontend (Dashboard App)
cd apps/frontend
bun run dev              # Start Vite dev server
bun run build            # Build for production
bun run preview          # Preview production build
bun run test             # Run Vitest tests
bun run test:coverage    # Run tests with coverage
bun run lint             # Run ESLint

# Backend (API Services)
cd apps/backend
bun run start:dev        # Start NestJS in dev mode
bun run build            # Build NestJS app
bun run test             # Run Mocha tests
bun run test:coverage    # Run tests with coverage
bun run lint             # Run ESLint

# Shared Packages
cd packages/shared
bun run build            # Build shared package
bun run test:run         # Run Vitest tests
bun run test:coverage    # Run tests with coverage

cd packages/ui
bun run build            # Build UI package
bun run test:run         # Run Vitest tests
bun run test:coverage    # Run tests with coverage
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

### Required Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# AI Provider (for TaskMaster)
ANTHROPIC_API_KEY="your-anthropic-key"
```

### Optional Variables

```bash
# Additional AI Providers
OPENAI_API_KEY="your-openai-key"
GOOGLE_API_KEY="your-google-key"
PERPLEXITY_API_KEY="your-perplexity-key"

# Development
DEBUG="app:*"
LOG_LEVEL="debug"
```

## 📦 Package Management

This project uses **Bun workspaces** for monorepo management:

```bash
# Install dependencies for all workspaces
bun install

# Add dependency to specific workspace
bun add <package> --cwd apps/frontend
bun add <package> --cwd apps/backend

# Add dev dependency to root
bun add -D <package>

# List all workspace packages
bun pm ls
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd apps/frontend
bun run build
# Deploy dist/ folder
```

### Backend (Railway/Render)

```bash
cd apps/backend
bun run build
# Deploy with environment variables
```

### Database (Supabase)

- Database migrations are in `supabase/migrations/`
- Deploy via Supabase CLI or dashboard

## 🤝 Contributing

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

### Development Workflow

1. **Setup**: Complete Task 1 (monorepo) and Task 2 (testing)
2. **Develop**: Work on tasks with integrated testing
3. **Test**: All tests must pass before merging
4. **Deploy**: Automated deployment on main branch

## 📋 Project Management

This project uses **TaskMaster** for AI-powered project management:

```bash
# View all tasks
task-master list

# Get next task
task-master next

# Mark task complete
task-master set-status --id=<task-id> --status=done

# Generate new tasks
task-master add-task --prompt="Your task description"
```

## 🎯 Features

### Current Features

- ✅ **Monorepo Structure**: Bun workspaces with apps and packages
- ✅ **Frontend Dashboard**: React + Vite with Tailwind CSS and shadcn/ui
- ✅ **Backend API**: NestJS with DDD architecture and comprehensive testing
- ✅ **Shared Packages**: Types, utilities, and UI components with full test coverage
- ✅ **Authentication**: Supabase Auth integration
- ✅ **Testing Infrastructure**: Vitest, Mocha, Playwright with Page Object Models
- ✅ **Type Safety**: Comprehensive TypeScript configuration
- ✅ **Documentation**: Architecture docs, ADRs, and testing strategy
- ✅ **Dependency Injection**: Abstract classes with Symbol tokens (no string tokens)

### Planned Features

- 🔄 **Marketing Website**: Separate Next.js SSR site for SEO and marketing
- 🔄 **Puppy Profiles**: Complete puppy management system
- 🔄 **Feeding Schedules**: AI-powered feeding recommendations
- 🔄 **Vet Appointments**: Calendar integration and reminders
- 🔄 **Training Plans**: Breed-specific training modules
- 🔄 **Analytics**: Growth tracking and health insights
- 🔄 **Notifications**: Smart reminders and alerts
- 🔄 **AI Integration**: TaskMaster for project management

## 📚 Documentation

- [Architecture Documentation](docs/architecture.md) - System design and technical architecture
- [Architecture Decision Records (ADRs)](docs/adr-index.md) - Documented architectural decisions and rationale
- [Testing Strategy](docs/testing-strategy.md) - Comprehensive testing approach
- [Environment Variables](docs/environment-variables.md) - Configuration guide
- [Project Plan](docs/project-plan.md) - Complete project roadmap and task management
- [API Documentation](docs/api.md) - Backend API reference (coming soon)
- [Component Library](docs/components.md) - UI component documentation (coming soon)

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start**

```bash
# Check if port is available
lsof -i :8081

# Clear node_modules and reinstall
rm -rf node_modules apps/frontend/node_modules
bun install
```

**Environment variables not loading**

```bash
# Ensure .env file exists in apps/frontend/
ls apps/frontend/.env

# Check symlink to root .env
ls -la apps/frontend/.env
```

**Tests failing**

```bash
# Run tests with verbose output
bun run test --verbose

# Check test database connection
bun run test:db-check
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lovable** for the initial project setup
- **Supabase** for backend-as-a-service
- **shadcn/ui** for beautiful UI components
- **Bun** for fast JavaScript runtime
- **TaskMaster** for AI-powered project management

---

**Made with ❤️ for puppy parents everywhere**
