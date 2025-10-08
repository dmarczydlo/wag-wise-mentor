# ADR-004: Frontend and Backend Separation Architecture

## Status
Accepted

## Context
We need to decide on the overall architecture for the Wag Wise Mentor application. The primary considerations are:

- Separation of concerns between frontend and backend
- Scalability and maintainability
- Development team efficiency
- Deployment and hosting strategies
- Technology stack optimization for each layer

## Decision
We will implement a **separated frontend and backend architecture** with clear boundaries and independent deployment.

## Rationale

### Why Separate Frontend and Backend?

1. **Separation of Concerns**:
   - Frontend focuses on user experience and presentation
   - Backend focuses on business logic and data management
   - Clear boundaries and responsibilities
   - Easier to maintain and scale independently

2. **Technology Optimization**:
   - Frontend can use React/Vue/Angular optimized for UI
   - Backend can use Node.js/Python/Java optimized for APIs
   - Each layer can use the best tools for its purpose
   - No technology constraints between layers

3. **Team Efficiency**:
   - Frontend and backend teams can work independently
   - Different skill sets can be optimized
   - Parallel development and deployment
   - Clear ownership and accountability

4. **Scalability**:
   - Independent scaling of frontend and backend
   - Different hosting strategies for each layer
   - Better resource utilization
   - Easier to optimize performance

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Separated Architecture                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database       │
│   Applications  │    │   Services      │    │   & External     │
│                 │    │                 │    │   Services       │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  Marketing  │ │    │ │   NestJS    │ │    │ │  Supabase   │ │
│ │  Website    │ │    │ │   API       │ │    │ │  Database   │ │
│ │  (Next.js)  │ │    │ │   Services  │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  Dashboard  │ │    │ │   Domain    │ │    │ │  Auth       │ │
│ │  App        │ │    │ │   Logic     │ │    │ │  Service    │ │
│ │  (React)    │ │    │ │   (DDD)    │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway    │
                    │   & Load         │
                    │   Balancer       │
                    └─────────────────┘
```

### Frontend Architecture

#### Marketing Website (Next.js)
- **Purpose**: SEO-optimized marketing and landing pages
- **Technology**: Next.js 14 with App Router
- **Features**: SSR, SSG, SEO optimization
- **Hosting**: Vercel
- **Domain**: `wagwisementor.com`

#### Dashboard Application (React)
- **Purpose**: Authenticated user dashboard and management
- **Technology**: React 18 with Vite
- **Features**: SPA, real-time updates, offline support
- **Hosting**: Vercel
- **Domain**: `app.wagwisementor.com`

### Backend Architecture

#### API Services (NestJS)
- **Purpose**: Business logic and data management
- **Technology**: NestJS with TypeScript
- **Architecture**: Domain-Driven Design (DDD)
- **Features**: RESTful APIs, real-time WebSocket, authentication
- **Hosting**: Railway/Render
- **Domain**: `api.wagwisementor.com`

#### Database (Supabase)
- **Purpose**: Data persistence and authentication
- **Technology**: PostgreSQL with Supabase
- **Features**: Real-time subscriptions, Row Level Security, Auth
- **Hosting**: Supabase Cloud
- **Domain**: Managed by Supabase

## Implementation

### Frontend Implementation

#### Marketing Website Structure
```
apps/marketing/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Home page
│   │   ├── pricing/
│   │   ├── about/
│   │   └── contact/
│   ├── components/          # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── marketing/       # Marketing-specific components
│   │   └── layout/          # Layout components
│   ├── lib/                 # Utilities and configurations
│   └── styles/              # Global styles
├── public/                  # Static assets
├── next.config.js           # Next.js configuration
└── package.json
```

#### Dashboard Application Structure
```
apps/frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── features/        # Feature-specific components
│   │   └── layout/          # Layout components
│   ├── pages/               # Route components
│   │   ├── dashboard/
│   │   ├── puppies/
│   │   └── settings/
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and configurations
│   └── integrations/        # External service integrations
├── public/                  # Static assets
├── vite.config.ts           # Vite configuration
└── package.json
```

### Backend Implementation

#### API Services Structure
```
apps/backend/
├── src/
│   ├── domain/              # Domain Layer (DDD)
│   │   ├── puppy/
│   │   ├── auth/
│   │   ├── calendar/
│   │   └── shared/
│   ├── application/         # Application Layer (DDD)
│   │   ├── puppy/
│   │   ├── auth/
│   │   ├── calendar/
│   │   └── shared/
│   ├── infrastructure/      # Infrastructure Layer (DDD)
│   │   ├── puppy/
│   │   ├── auth/
│   │   ├── calendar/
│   │   └── shared/
│   └── main.ts              # Application entry point
├── test/                    # Test files
├── package.json
└── tsconfig.json
```

### Communication Patterns

#### API Communication
```typescript
// Frontend API Client
class ApiClient {
  private baseURL = 'https://api.wagwisementor.com'
  
  async getPuppies(): Promise<Puppy[]> {
    const response = await fetch(`${this.baseURL}/puppies`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }
}

// Backend API Controller
@Controller('puppies')
export class PuppyController {
  constructor(
    @Inject(PUPPY_REPOSITORY) private readonly puppyRepository: PuppyRepository
  ) {}

  @Get()
  async getPuppies(@Req() req: Request): Promise<Puppy[]> {
    const userId = req.user.id
    return this.puppyRepository.findByOwnerId(userId)
  }
}
```

#### Real-time Communication
```typescript
// Frontend WebSocket Client
class WebSocketClient {
  private ws: WebSocket
  
  connect() {
    this.ws = new WebSocket('wss://api.wagwisementor.com/ws')
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }
  }
}

// Backend WebSocket Gateway
@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { userId: string }) {
    client.join(`user:${payload.userId}`)
  }
}
```

## Consequences

### Positive
- **Clear separation of concerns** and responsibilities
- **Independent scaling** and optimization
- **Technology flexibility** for each layer
- **Team efficiency** with parallel development
- **Better maintainability** and code organization
- **Deployment flexibility** and hosting options

### Negative
- **Increased complexity** in communication
- **More deployment pipelines** to manage
- **Cross-origin issues** and CORS configuration
- **Network latency** between frontend and backend
- **More infrastructure** to maintain

### Mitigation
- **API Gateway** for centralized communication
- **CDN and caching** to reduce latency
- **Proper CORS configuration** and security
- **Monitoring and logging** across all layers
- **Automated deployment** pipelines

## Alternatives Considered

1. **Monolithic Architecture**: Rejected due to scalability and maintainability concerns
2. **Server-Side Rendering Only**: Rejected due to user experience limitations
3. **Microservices**: Considered but too complex for current scale
4. **JAMstack**: Considered but limited for real-time features

## References
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)

---

*This ADR was created on 2024-01-02 and documents the decision to implement separated frontend and backend architecture.*
