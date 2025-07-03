# Testing Guide for Frontend-2

This document describes the testing strategy and setup for the frontend-2 application, which follows functional clean architecture principles.

## Testing Stack

- **Vitest**: Fast unit test runner with native TypeScript support
- **React Testing Library**: Testing utilities for React components
- **@testing-library/user-event**: Simulate user interactions
- **@testing-library/jest-dom**: Custom matchers for DOM testing
- **jsdom**: DOM environment for testing

## Test Structure

```
tests/
├── setup.ts                    # Global test setup and mocks
├── utils/
│   └── test-utils.tsx         # Custom render function and test utilities
├── domain/
│   └── model/
│       └── confident.test.ts  # Domain model tests
├── application/
│   └── use-cases/
│       └── confidents.test.ts # Application use case tests
├── infrastructure/
│   └── api/
│       └── api-client.test.ts # Infrastructure tests
├── presentation/
│   └── components/
│       └── ConfidentForm.test.tsx # Component tests
└── example.test.ts            # Example test
```

## Testing Strategy by Layer

### 1. Domain Layer Tests

**Purpose**: Test pure business logic and domain rules
**Location**: `tests/domain/`
**Focus**:

- Pure functions
- Business rules validation
- Domain model creation and validation

**Example**:

```typescript
import { describe, it, expect } from "vitest";
import {
  createConfident,
  isConfidentValid,
} from "../../../app/domain/model/confident";

describe("Confident Domain Model", () => {
  it("should create a confident with valid data", () => {
    const data = { name: "John Doe", user_id: 1 };
    const result = createConfident(data);

    expect(result.id).toBe(0);
    expect(result.name).toBe("John Doe");
  });
});
```

### 2. Application Layer Tests

**Purpose**: Test use cases and application services
**Location**: `tests/application/`
**Focus**:

- Use case orchestration
- Error handling
- Notification service integration
- Repository interactions

**Example**:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createNewConfident } from "../../../app/application/use-cases/confidents";

describe("Confident Use Cases", () => {
  let mockRepository;
  let mockNotifier;

  beforeEach(() => {
    mockRepository = { create: vi.fn() };
    mockNotifier = { success: vi.fn(), error: vi.fn() };
  });

  it("should create confident successfully", async () => {
    mockRepository.create.mockResolvedValue({
      confident: { id: 1, name: "John" },
    });

    const result = await createNewConfident(
      { name: "John" },
      1,
      mockRepository,
      mockNotifier
    );

    expect(result.name).toBe("John");
    expect(mockNotifier.success).toHaveBeenCalled();
  });
});
```

### 3. Infrastructure Layer Tests

**Purpose**: Test external integrations and data access
**Location**: `tests/infrastructure/`
**Focus**:

- API client functionality
- Repository implementations
- External service integrations
- Error handling for network issues

**Example**:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "../../../app/infrastructure/api/api-client";

global.fetch = vi.fn();

describe("API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should make successful GET request", async () => {
    const mockResponse = { data: "test" };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await apiClient.get("/test");

    expect(result.ok).toBe(true);
    expect(result.data).toEqual(mockResponse);
  });
});
```

### 4. Presentation Layer Tests

**Purpose**: Test React components and user interactions
**Location**: `tests/presentation/`
**Focus**:

- Component rendering
- User interactions
- Form validation
- State management
- Integration with hooks

**Example**:

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfidentForm } from "../../../app/presentation/components/ConfidentForm";

describe("ConfidentForm", () => {
  it("should render form fields correctly", () => {
    render(<ConfidentForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("should handle form submission", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    render(<ConfidentForm onSubmit={mockSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "",
      // ... other fields
    });
  });
});
```

## Test Utilities

### Custom Render Function

The `test-utils.tsx` file provides a custom render function that includes all necessary providers:

```typescript
import { render } from "../tests/utils/test-utils";

// This automatically includes Router and NotificationProvider
render(<MyComponent />);
```

### Mock Data Factories

```typescript
import { createMockConfident, createMockUser } from "../tests/utils/test-utils";

const mockConfident = createMockConfident({ name: "Custom Name" });
const mockUser = createMockUser({ email: "custom@example.com" });
```

### Mock Services

```typescript
import { createMockConfidentRepository } from "../tests/utils/test-utils";

const mockRepository = createMockConfidentRepository();
mockRepository.getAll.mockResolvedValue([mockConfident]);
```

## Running Tests

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Test Configuration

### Vitest Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

### Test Setup (`tests/setup.ts`)

```typescript
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock React Router
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: "/" }),
  };
});

// Mock browser APIs
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

## Testing Best Practices

### 1. Test Structure

- Use descriptive test names that explain the behavior
- Group related tests using `describe` blocks
- Follow the AAA pattern: Arrange, Act, Assert

### 2. Mocking

- Mock external dependencies (APIs, services)
- Use `vi.fn()` for function mocks
- Reset mocks in `beforeEach` hooks

### 3. Component Testing

- Test user interactions, not implementation details
- Use `userEvent` for realistic user interactions
- Test accessibility features (ARIA labels, keyboard navigation)

### 4. Async Testing

- Use `waitFor` for asynchronous operations
- Handle loading states and error states
- Test both success and failure scenarios

### 5. Coverage

- Aim for high coverage in domain and application layers
- Focus on business logic over trivial code
- Use coverage reports to identify untested code paths

## Common Testing Patterns

### Testing Hooks

```typescript
import { renderHook, act } from "@testing-library/react";
import { useConfidents } from "../../../app/presentation/hooks/use-confidents";

describe("useConfidents", () => {
  it("should fetch confidents", async () => {
    const { result } = renderHook(() => useConfidents());

    await act(async () => {
      const confidents = await result.current.getAll();
      expect(confidents).toHaveLength(2);
    });
  });
});
```

### Testing Error Boundaries

```typescript
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../../../app/root";

describe("ErrorBoundary", () => {
  it("should render error message when error occurs", () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

### Testing Form Validation

```typescript
it("should show validation errors", async () => {
  const user = userEvent.setup();
  render(<ConfidentForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

  await user.click(screen.getByRole("button", { name: /save/i }));

  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Vitest types not found**: Ensure `vitest` is installed and TypeScript is configured correctly
2. **React Router mocks**: Check that all React Router hooks are properly mocked in `setup.ts`
3. **DOM environment**: Ensure `jsdom` is configured in Vitest config
4. **CSS imports**: Add `css: true` to Vitest config for CSS module support

### Debugging Tests

```bash
# Run specific test file
npm test -- tests/domain/model/confident.test.ts

# Run tests with verbose output
npm test -- --verbose

# Run tests with debug logging
DEBUG=* npm test
```

## Continuous Integration

Add this to your CI pipeline:

```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage report
  run: npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

This testing setup provides comprehensive coverage across all layers of the clean architecture, ensuring that business logic, user interactions, and external integrations are all properly tested.
