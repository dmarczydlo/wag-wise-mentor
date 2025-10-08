# ADR-002: Frontend Testing Framework Selection

## Status
Accepted

## Context
We need to select a testing framework for the frontend React applications. The primary considerations are:

- Performance and speed of test execution
- Compatibility with React 18 and TypeScript
- Ease of setup and configuration
- Integration with Vite build system
- Support for modern React features (hooks, concurrent features)

## Decision
We will use **Vitest + React Testing Library** instead of Jest + React Testing Library for frontend testing.

## Rationale

### Why Not Jest + React Testing Library?

1. **Performance Issues**:
   - Jest is significantly slower than Vitest for test execution
   - Jest's overhead becomes problematic in a monorepo with multiple packages
   - Slower feedback loop during development
   - Poor performance with large test suites

2. **Vite Integration Problems**:
   - Jest requires complex configuration to work with Vite
   - Inconsistent behavior with Vite's module resolution
   - Problems with Vite's plugin system and Jest's transformer
   - Difficult to configure properly in a Vite-based project

3. **Modern React Compatibility**:
   - Jest has issues with React 18's concurrent features
   - Problems with React 18's automatic batching
   - Inconsistent behavior with React 18's new APIs

### Why Vitest + React Testing Library?

1. **Performance**:
   - Vitest is significantly faster than Jest
   - Built-in parallel test execution
   - Better memory management and faster startup
   - Optimized for modern JavaScript tooling

2. **Vite Integration**:
   - Native Vite integration - no configuration needed
   - Same configuration as Vite (vitest.config.ts)
   - Seamless module resolution and plugin support
   - Consistent behavior with development and build processes

3. **Modern React Support**:
   - Better compatibility with React 18
   - Support for concurrent features and automatic batching
   - Better handling of React 18's new APIs
   - Future-proof for React updates

4. **Developer Experience**:
   - Faster test execution and better feedback
   - Better error messages and debugging
   - Hot reload support for tests
   - Better integration with modern tooling

## Implementation

### Testing Stack
- **Test Runner**: Vitest
- **Component Testing**: React Testing Library
- **Coverage**: @vitest/coverage (v8)
- **Pattern**: AAA (Arrange-Act-Assert)
- **Mocking**: Vitest built-in mocking

### Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
  },
})
```

### Test Structure
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { PuppyCard } from './PuppyCard'

describe('PuppyCard - AAA Pattern', () => {
  test('should display puppy information correctly', () => {
    // Arrange
    const puppy = {
      id: '1',
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: 6,
    }

    // Act
    render(<PuppyCard puppy={puppy} />)

    // Assert
    expect(screen.getByText('Buddy')).toBeInTheDocument()
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument()
    expect(screen.getByText('6 months')).toBeInTheDocument()
  })

  test('should handle click events', () => {
    // Arrange
    const puppy = { id: '1', name: 'Buddy', breed: 'Golden Retriever', age: 6 }
    const onEdit = vi.fn()

    // Act
    render(<PuppyCard puppy={puppy} onEdit={onEdit} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    // Assert
    expect(onEdit).toHaveBeenCalledWith(puppy)
  })
})
```

## Consequences

### Positive
- **Faster test execution** and better developer experience
- **Native Vite integration** with no configuration overhead
- **Better React 18 compatibility** and future-proofing
- **Improved CI/CD performance** with faster test runs
- **Better debugging** and error messages
- **Hot reload support** for tests

### Negative
- **Different syntax** from Jest (but more standard)
- **Newer ecosystem** with fewer community resources
- **Learning curve** for team members familiar with Jest

### Mitigation
- Team training on Vitest syntax and features
- Clear documentation and examples
- Consistent test patterns across the codebase
- Gradual migration from Jest if needed

## Alternatives Considered

1. **Jest + React Testing Library**: Rejected due to performance and Vite integration issues
2. **Testing Library + Jest**: Same issues as above
3. **Cypress Component Testing**: Too heavy for unit tests
4. **Storybook Testing**: Not suitable for comprehensive testing

## References
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vite Testing Guide](https://vitejs.dev/guide/testing.html)
- [Vitest vs Jest Comparison](https://vitest.dev/guide/comparisons.html#jest)

---

*This ADR was created on 2024-01-02 and documents the decision to use Vitest + React Testing Library for frontend testing.*
