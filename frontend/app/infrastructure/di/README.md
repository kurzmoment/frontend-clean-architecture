# Dependency Injection Implementation

This directory contains the dependency injection (DI) implementation for the application, following clean architecture principles.

## Architecture Overview

The DI system consists of:

1. **Service Container** (`container.ts`) - Singleton container that manages service instances
2. **Service Provider** (`ServiceProvider.tsx`) - React context provider for making services available to components
3. **Service Interfaces** - TypeScript interfaces defining service contracts

## Services

The following services are available through the DI container:

- **AuthService** - Handles authentication and user management
- **ProjectService** - Manages project operations
- **ConfidentService** - Manages confident operations
- **TagService** - Manages tag operations

## Usage

### In React Components

```tsx
import {
  useAuthService,
  useProjectService,
} from "../infrastructure/di/ServiceProvider";

function MyComponent() {
  const authService = useAuthService();
  const projectService = useProjectService();

  const handleLogin = async () => {
    const result = await authService.login({ email, password });
    // Handle login result
  };

  const handleCreateProject = async () => {
    const project = await projectService.createProject({ name, description });
    // Handle project creation
  };
}
```

### Direct Service Access

```tsx
import { getAuthService } from "../infrastructure/di/container";

const authService = getAuthService();
const result = await authService.login(credentials);
```

## Benefits

1. **Separation of Concerns** - Business logic is separated from UI components
2. **Testability** - Services can be easily mocked for testing
3. **Maintainability** - Changes to business logic don't require UI changes
4. **Reusability** - Services can be used across multiple components
5. **Type Safety** - Full TypeScript support with interfaces

## Service Layer Pattern

Each service:

- Implements business logic
- Handles error management
- Provides a clean API for components
- Depends on repository interfaces (not implementations)

## Repository Pattern

Repositories:

- Handle data access
- Implement repository interfaces
- Are injected into services
- Provide abstraction over API calls

This implementation follows the Dependency Inversion Principle and makes the application more modular and maintainable.
