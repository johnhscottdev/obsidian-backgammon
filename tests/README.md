# Testing

This project uses Jest for unit testing. The test suite covers:

## Test Structure

### `parseXGID.test.ts`
- **Input validation**: Tests for invalid XGID formats, null/undefined inputs
- **Position parsing**: Tests for checker placement using a-z/A-Z encoding
- **Game state parsing**: Tests for cube ownership, turn, dice, scores, rules
- **Real-world examples**: Tests with actual XGID strings from backgammon games
- **Move analysis extraction**: Tests for extracting XG analysis blocks

### `renderBoard.test.ts` 
- **Canvas setup**: Tests for canvas creation and context initialization
- **Responsive scaling**: Tests for different container widths
- **Error handling**: Tests that rendering completes without errors for various board states
- **Special rules**: Tests for Crawford rule, different player turns, pip counts

### `main.test.ts`
- **Plugin lifecycle**: Tests for onload/onunload functionality
- **Code block processing**: Tests for 'xgid' code block registration
- **Error handling**: Tests for invalid XGID input with proper error display
- **Analysis rendering**: Tests for creating analysis containers

## Coverage
- **Overall**: ~69% coverage
- **parseXGID**: 98% coverage (excellent parsing logic coverage)
- **renderBoard**: ~63% coverage (focused on testable parts in headless environment)
- **main**: ~87% coverage (good plugin integration coverage)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Environment

Tests run in a jsdom environment with mocked Canvas API and ResizeObserver for headless testing.