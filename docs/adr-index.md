# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) that document important architectural decisions made during the development of Wag Wise Mentor.

## What are ADRs?

Architecture Decision Records are documents that capture important architectural decisions along with their context and consequences. They help maintain a record of why certain decisions were made and provide context for future development.

## ADR Index

### Testing Framework Decisions

- **[ADR-001: Backend Testing Framework Selection](./adr-001-backend-testing-framework.md)**
  - **Decision**: Use Mocha + Chai instead of Jest for backend testing
  - **Reason**: Performance issues, import problems, and configuration complexity with Jest
  - **Status**: Accepted

- **[ADR-002: Frontend Testing Framework Selection](./adr-002-frontend-testing-framework.md)**
  - **Decision**: Use Vitest + React Testing Library instead of Jest for frontend testing
  - **Reason**: Performance issues, Vite integration problems, and modern React compatibility
  - **Status**: Accepted

- **[ADR-003: End-to-End Testing Strategy](./adr-003-e2e-testing-strategy.md)**
  - **Decision**: Implement Playwright with Browser MCP integration and Page Object Models
  - **Reason**: Complete system validation, user journey coverage, and maintainable test code
  - **Status**: Accepted

### Architecture Decisions

- **[ADR-004: Frontend and Backend Separation Architecture](./adr-004-frontend-backend-separation.md)**
  - **Decision**: Implement separated frontend and backend architecture with clear boundaries
  - **Reason**: Separation of concerns, technology optimization, team efficiency, and scalability
  - **Status**: Accepted

## ADR Template

When creating new ADRs, use the following template:

```markdown
# ADR-XXX: [Title]

## Status
[Proposed | Accepted | Rejected | Superseded]

## Context
[Describe the context and problem statement]

## Decision
[State the architectural decision]

## Rationale
[Explain the reasoning behind the decision]

## Implementation
[Describe how the decision will be implemented]

## Consequences
[Describe the positive and negative consequences]

## Alternatives Considered
[List alternative solutions that were considered]

## References
[Links to relevant documentation and resources]
```

## Contributing to ADRs

1. **Create New ADRs**: Use the template above for new architectural decisions
2. **Update Status**: Keep ADR status current (Proposed → Accepted/Rejected)
3. **Link References**: Include links to relevant documentation and resources
4. **Review Process**: ADRs should be reviewed by the team before acceptance

## ADR Lifecycle

1. **Proposed**: Initial ADR created for discussion
2. **Accepted**: Decision approved and will be implemented
3. **Rejected**: Decision not approved, alternative chosen
4. **Superseded**: ADR replaced by a newer decision

---

*This ADR index is maintained alongside the project and should be updated as new architectural decisions are made.*
