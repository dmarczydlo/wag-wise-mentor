# ADR-001: Backend Testing Framework Selection

## Status
Accepted

## Context
We need to select a testing framework for the backend NestJS application. The primary considerations are:

- Performance and speed of test execution
- Compatibility with NestJS and TypeScript
- Ease of setup and configuration
- Import resolution and module loading
- Integration with our monorepo structure

## Decision
We will use **Mocha + Chai** instead of Jest for backend testing.

## Rationale

### Why Not Jest?

1. **Performance Issues**:
   - Jest is significantly slower than Mocha for test execution
   - Jest's overhead becomes problematic in a monorepo with multiple packages
   - Slower feedback loop during development

2. **Import and Module Loading Problems**:
   - Jest has known issues with ES modules and TypeScript imports
   - Complex configuration required for proper module resolution
   - Problems with dynamic imports and circular dependencies
   - Inconsistent behavior with NestJS dependency injection

3. **Configuration Complexity**:
   - Jest requires extensive configuration for TypeScript and NestJS
   - Difficult to configure properly in a monorepo environment
   - Multiple configuration files needed for different environments

### Why Mocha + Chai?

1. **Performance**:
   - Mocha is significantly faster than Jest
   - Minimal overhead and faster test execution
   - Better suited for continuous integration pipelines

2. **Simplicity**:
   - Straightforward setup and configuration
   - Works well with TypeScript out of the box
   - Minimal configuration required for NestJS integration

3. **Reliability**:
   - Stable and mature testing framework
   - Better compatibility with Node.js and TypeScript
   - Fewer breaking changes and more predictable behavior

4. **Monorepo Compatibility**:
   - Works seamlessly with Bun workspaces
   - No complex configuration for multiple packages
   - Better integration with our build system

## Implementation

### Testing Stack
- **Test Runner**: Mocha
- **Assertion Library**: Chai
- **Coverage**: NYC (Istanbul)
- **Test Database**: In-memory implementations
- **Pattern**: AAA (Arrange-Act-Assert)

### Configuration
```json
{
  "scripts": {
    "test": "mocha --require ts-node/register --require tsconfig-paths/register --require ./test/setup.ts 'src/**/*.spec.ts' 'test/**/*.spec.ts'",
    "test:coverage": "nyc mocha --require ts-node/register --require tsconfig-paths/register --require ./test/setup.ts 'src/**/*.spec.ts' 'test/**/*.spec.ts'"
  }
}
```

### Test Structure
```typescript
describe("UseCase - AAA Pattern", () => {
  let useCase: UseCase;
  let repository: InMemoryRepository;

  beforeEach(async () => {
    // Arrange - Setup test dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UseCase,
        {
          provide: REPOSITORY_TOKEN,
          useClass: InMemoryRepository,
        },
      ],
    }).compile();

    useCase = module.get<UseCase>(UseCase);
    repository = module.get<Repository>(REPOSITORY_TOKEN);
  });

  it("should execute successfully", async () => {
    // Arrange
    const command = { /* test data */ };

    // Act
    const result = await useCase.execute(command);

    // Assert
    expect(result.success).to.be.true;
  });
});
```

## Consequences

### Positive
- **Faster test execution** and better developer experience
- **Simpler configuration** and easier maintenance
- **Better compatibility** with NestJS and TypeScript
- **Reliable import resolution** without complex workarounds
- **Better CI/CD performance** with faster test runs

### Negative
- **Different syntax** from Jest (but more standard)
- **Separate assertion library** (Chai) instead of built-in assertions
- **Additional setup** for coverage reporting (NYC)

### Mitigation
- Team training on Mocha + Chai syntax
- Clear documentation and examples
- Consistent test patterns across the codebase

## Alternatives Considered

1. **Jest**: Rejected due to performance and import issues
2. **Vitest**: Considered but Mocha is more mature and stable
3. **Ava**: Considered but less ecosystem support
4. **Node.js built-in test runner**: Too new and limited features

## References
- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [NYC Coverage Tool](https://github.com/istanbuljs/nyc)

---

*This ADR was created on 2024-01-02 and documents the decision to use Mocha + Chai for backend testing.*
