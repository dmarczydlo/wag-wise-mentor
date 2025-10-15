# Test Coverage and Quality Check

This workflow runs comprehensive tests across all packages with coverage reporting and identifies any issues.

## Tasks:

1. **Run all package tests with coverage reporting**
   - Execute tests for frontend, backend, shared, and UI packages
   - Generate coverage reports for analysis
   - Use non-interactive mode to avoid manual intervention

2. **Identify and fix any failing tests**
   - Analyze test results for failures
   - Fix any broken tests or test configurations
   - Ensure all tests pass before proceeding

3. **Ensure test coverage meets required thresholds**
   - Review coverage reports for each package
   - Identify areas with low coverage
   - Verify coverage meets project standards

4. **Generate coverage reports**
   - Create coverage reports for FE and BE
   - Do NOT save reports to the repository (coverage/ directories are gitignored)
   - Analyze coverage data for quality insights

5. **Update coverage configuration if needed**
   - Adjust coverage thresholds if necessary
   - Update test configurations for better coverage
   - Ensure consistent coverage reporting across packages

## Commands to run:

### Frontend Tests

```bash
cd /Users/danielmarczydlo/Workspace/wag-wise-mentor/apps/frontend
npm test -- --coverage --run
```

- Use `--run` flag to run tests once and exit (non-interactive mode)
- Generates coverage report in `coverage/` directory

### Backend Tests

```bash
cd /Users/danielmarczydlo/Workspace/wag-wise-mentor/apps/backend
npm test -- --coverage
```

- Uses Mocha with coverage reporting
- Generates coverage report in `coverage/` directory

### Shared Package Tests

```bash
cd /Users/danielmarczydlo/Workspace/wag-wise-mentor/packages/shared
npm test -- --coverage --run
```

- Use `--run` flag for non-interactive mode
- Generates coverage report in `coverage/` directory

### UI Package Tests

```bash
cd /Users/danielmarczydlo/Workspace/wag-wise-mentor/packages/ui
npm test -- --coverage --run
```

- Use `--run` flag for non-interactive mode
- Generates coverage report in `coverage/` directory

## Coverage Analysis:

### Expected Coverage Thresholds:

- **Shared Package**: Should maintain >95% coverage (utility functions)
- **Backend**: Should maintain >80% coverage (business logic)
- **Frontend**: Should maintain >70% coverage (components and pages)
- **UI Package**: Should maintain >60% coverage (reusable components)

### Coverage Report Locations:

- Frontend: `apps/frontend/coverage/`
- Backend: `apps/backend/coverage/`
- Shared: `packages/shared/coverage/`
- UI: `packages/ui/coverage/`

## Expected Outcomes:

- ✅ All tests passing across all packages
- ✅ Coverage reports generated for analysis
- ✅ Coverage thresholds met or exceeded
- ✅ No failing tests or configuration issues
- ✅ Test suite runs in non-interactive mode

## Troubleshooting:

### Common Issues:

1. **Tests hanging**: Use `--run` flag for Vitest packages
2. **Coverage not generated**: Check if coverage tools are properly configured
3. **Low coverage**: Focus on testing business logic and critical components first
4. **Test failures**: Check test setup and dependencies

### Reference Documentation:

- Check `docs/testing-strategy.md` for detailed testing guidelines
- Review package-specific test configurations in `vitest.config.ts` or `mocha` configs
