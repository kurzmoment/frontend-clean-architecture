# My-Core Integration with Frontend-3

This document explains how the `my-core` library has been integrated with the `frontend-3` application.

## Overview

The `my-core` library provides a clean architecture implementation with:

- **Domain Layer**: Entities, repositories, and use cases
- **Data Layer**: Repository implementations
- **Presentation Layer**: PLOCs (Presentation Logic Components) and state management

## Integration Components

### 1. Dependency Injection Container

- **Location**: `app/infrastructure/di/container.ts`
- **Purpose**: Creates and wires up all dependencies (repositories, use cases, PLOCs)
- **Usage**: Provides factory functions to create PLOC instances per user

### 2. PLOC Provider

- **Location**: `app/presentation/context/PlocProvider.tsx`
- **Purpose**: React context provider that manages PLOC instances
- **Features**:
  - Creates PLOCs when user logs in
  - Disposes PLOCs when user logs out
  - Provides hooks for accessing PLOCs

### 3. Authentication Integration

- **Location**: `app/presentation/hooks/use-ploc-auth.ts`
- **Purpose**: Combines authentication with PLOC initialization
- **Features**:
  - Automatically initializes PLOCs on login
  - Cleans up PLOCs on logout
  - Handles user persistence

## Available PLOCs

### ConfidentPloc

- **Use Case**: Manages confident (contact) data
- **Hook**: `useConfidentPloc()`
- **Features**: CRUD operations, state management, error handling

### ProjectPloc

- **Use Case**: Manages project data
- **Hook**: `useProjectPloc()`
- **Features**: CRUD operations, state management, error handling

## Usage Examples

### Using ConfidentPloc in a Component

```tsx
import { useConfidentPloc } from "../presentation/context/PlocProvider";

function MyComponent() {
  const confidentPloc = useConfidentPloc();

  // Access state
  const { state } = confidentPloc;

  // Perform operations
  const handleCreate = async (data) => {
    await confidentPloc.createConfident(data);
  };

  const handleUpdate = async (id, data) => {
    await confidentPloc.updateConfident(id, data);
  };

  const handleDelete = async (id) => {
    await confidentPloc.deleteConfident(id);
  };

  // Render based on state
  if (state.kind === "LoadingConfidentState") {
    return <div>Loading...</div>;
  }

  if (state.kind === "ErrorConfidentState") {
    return <div>Error: {state.error}</div>;
  }

  if (state.kind === "LoadedConfidentState") {
    return (
      <div>
        {state.confidents.map((confident) => (
          <div key={confident.id}>{confident.name}</div>
        ))}
      </div>
    );
  }
}
```

### Using Authentication with PLOCs

```tsx
import { usePlocAuth } from "../presentation/hooks/use-ploc-auth";

function LoginComponent() {
  const { login, logout } = usePlocAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // PLOCs are automatically initialized
    } catch (error) {
      console.error("Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // PLOCs are automatically disposed
    } catch (error) {
      console.error("Logout failed");
    }
  };
}
```

## Routes

### New PLOC-based Route

- **Path**: `/confidents-with-ploc`
- **Component**: `ConfidentListWithPloc`
- **Features**: Uses ConfidentPloc for state management

### Traditional Route (for comparison)

- **Path**: `/confidents`
- **Component**: Uses TanStack Query and server actions

## State Management

The PLOCs use a state machine pattern with three states:

1. **LoadingConfidentState**: Initial loading state
2. **LoadedConfidentState**: Successfully loaded with data
3. **ErrorConfidentState**: Error occurred with error message

## Benefits of My-Core Integration

1. **Clean Architecture**: Clear separation of concerns
2. **Testability**: Easy to unit test business logic
3. **Reusability**: PLOCs can be used across different UI frameworks
4. **Type Safety**: Full TypeScript support
5. **Error Handling**: Centralized error handling
6. **State Management**: Predictable state updates

## Migration Path

To migrate from the current implementation to my-core:

1. Replace TanStack Query hooks with PLOC hooks
2. Replace server actions with PLOC methods
3. Update components to use PLOC state
4. Remove direct API calls in favor of repository pattern

## File Structure

```
app/
├── my-core/                    # My-core library
│   ├── confident/             # Confident domain
│   ├── project/               # Project domain
│   ├── tag/                   # Tag domain
│   └── common/                # Shared utilities
├── infrastructure/
│   └── di/                    # Dependency injection
│       └── container.ts       # DI container
├── presentation/
│   ├── context/
│   │   └── PlocProvider.tsx   # PLOC context provider
│   ├── hooks/
│   │   └── use-ploc-auth.ts   # Auth + PLOC integration
│   └── components/
│       └── ConfidentListWithPloc.tsx  # PLOC-based component
└── routes/
    └── confidents-with-ploc.tsx  # PLOC-based route
```
