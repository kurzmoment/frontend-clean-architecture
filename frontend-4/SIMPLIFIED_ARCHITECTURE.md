# Simplified Architecture - Frontend 4

This frontend has been refactored to use **simple separation of concerns** instead of Clean Architecture.

## Structure

```
app/
├── services/           # All business logic and API calls
│   ├── api.ts         # HTTP requests to backend
│   ├── auth.ts        # Authentication management
│   ├── projects.ts    # Project operations
│   ├── confidents.ts  # Confident operations
│   ├── tags.ts        # Tag operations
│   ├── notifications.ts # UI notifications
│   └── index.ts       # Export all services
├── components/         # Reusable UI components
├── routes/            # Page components
└── lib/               # Utility functions
```

## Services

### API Service (`api.ts`)

- Handles all HTTP requests to backend
- Manages authentication headers
- Provides consistent error handling

### Auth Service (`auth.ts`)

- Manages user authentication state
- Handles login/logout
- Provides subscription to auth changes

### Entity Services

- **Projects Service**: CRUD operations for projects
- **Confidents Service**: CRUD operations for confidents
- **Tags Service**: CRUD operations for tags

### Notification Service (`notifications.ts`)

- Manages UI notifications (success, error, warning, info)
- Auto-removes notifications after timeout
- Provides subscription to notification changes

## Usage Example

```typescript
import {
  projectsService,
  confidentsService,
  notificationService,
} from "./services";

// Create a project
const result = await projectsService.create({
  name: "My Project",
  description: "Project description",
});

if (result.success) {
  notificationService.success("Project created!");
} else {
  notificationService.error(result.message || "Failed to create project");
}

// Get all confidents
const confidents = await confidentsService.getAll();
if (confidents.success) {
  console.log(confidents.data);
}
```

## Benefits

✅ **Simple to understand** - No complex layers
✅ **Easy to maintain** - Clear separation of concerns
✅ **Practical** - Focuses on what you actually need
✅ **Testable** - Each service can be tested independently
✅ **Flexible** - Easy to modify and extend

## Migration from Clean Architecture

- ❌ Removed: Complex domain models with validation
- ❌ Removed: Repository interfaces and implementations
- ❌ Removed: Use cases layer
- ❌ Removed: Dependency injection container
- ✅ Kept: Clear separation of concerns
- ✅ Kept: Type safety with TypeScript
- ✅ Kept: Error handling
- ✅ Kept: Service-based architecture

This approach is much simpler while still maintaining good code organization!
