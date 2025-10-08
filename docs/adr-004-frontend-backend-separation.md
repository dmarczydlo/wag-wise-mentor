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
│                    Separated Architecture                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Applications  │    │   Services      │    │   & External    │
│                 │    │                 │    │   Services      │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  Marketing  │ │    │ │   NestJS    │ │    │ │  Supabase   │ │
│ │  Website    │ │    │ │   API       │ │    │ │  Database   │ │
│ │  (Next.js)  │ │    │ │   Services  │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  Dashboard  │ │    │ │   Domain    │ │    │ │  Auth       │ │
│ │  App        │ │    │ │   Logic     │ │    │ │  Service    │ │
│ │  (React)    │ │    │ │   (DDD)     │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway   │
                    │   & Load        │
                    │   Balancer      │
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

The implementation will follow the separated architecture with clear boundaries between frontend and backend components. Specific implementation details will be determined during development based on requirements and best practices.

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

_This ADR was created on 2024-01-02 and documents the decision to implement separated frontend and backend architecture._
