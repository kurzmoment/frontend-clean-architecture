# TanStack Query with React Router Implementation

This directory contains the TanStack Query (React Query) implementation integrated with React Router for optimal SSR performance.

## Overview

The implementation follows the [TanStack Query React Router example](https://codesandbox.io/p/devbox/github/tanstack/query/tree/main/examples/react/react-router?embed=1&file=%2Fsrc%2Findex.tsx&theme=light) pattern, providing:

- **Server-Side Rendering (SSR)**: Data is pre-fetched on the server
- **Client-Side Caching**: Automatic caching and background updates
- **Optimistic Updates**: Immediate UI updates with automatic rollback
- **Error Handling**: Built-in error states and retry logic
- **Loading States**: Automatic loading indicators

## Components

### `query-client.ts`

Configures the TanStack Query client with SSR-optimized settings:

- **staleTime**: 1 minute (prevents unnecessary refetches)
- **gcTime**: 10 minutes (formerly cacheTime, keeps data in memory)

### `query-provider.tsx`

React component that wraps the app with TanStack Query:

- Provides QueryClient to the component tree
- Includes React Query DevTools for development
- Supports custom QueryClient injection for SSR

### `queries.ts`

Contains query hooks and functions:

#### Query Keys

```typescript
export const queryKeys = {
  projects: ["projects"] as const,
  confidents: ["confidents"] as const,
  tags: ["tags"] as const,
  project: (id: number) => ["project", id] as const,
  confident: (id: number) => ["confident", id] as const,
  tag: (id: number) => ["tag", id] as const,
};
```

#### Query Functions

Server-side functions that fetch data from the API.

#### Query Hooks

- `useProjects()`: Fetches and caches projects
- `useConfidents()`: Fetches and caches confidents
- `useTags()`: Fetches and caches tags

### `mutations.ts`

Contains mutation hooks for CRUD operations:

#### Project Mutations

- `useCreateProject()`: Creates new projects
- `useUpdateProject()`: Updates existing projects
- `useDeleteProject()`: Deletes projects

#### Confident Mutations

- `useCreateConfident()`: Creates new confidents
- `useUpdateConfident()`: Updates existing confidents
- `useDeleteConfident()`: Deletes confidents

#### Tag Mutations

- `useCreateTag()`: Creates new tags
- `useUpdateTag()`: Updates existing tags
- `useDeleteTag()`: Deletes tags

## Usage

### In Loader Functions

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  // Check authentication
  if (!isServerAuthenticated(request)) {
    throw redirect("/login");
  }

  // Pre-fetch data for SSR
  const [projects, confidents, tags] = await Promise.all([
    queryFunctions.projects(),
    queryFunctions.confidents(),
    queryFunctions.tags(),
  ]);

  return { projects, confidents, tags };
}
```

### In Components

```typescript
function DashboardPage() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();

  const handleCreate = async (data) => {
    await createProject.mutateAsync(data);
    // Query is automatically invalidated and refetched
  };

  if (isLoading) return <LoadingSpinner />;

  return <ProjectList projects={projects} />;
}
```

## Benefits

1. **SSR Performance**: Data is pre-fetched on the server
2. **Automatic Caching**: Reduces API calls and improves UX
3. **Background Updates**: Data stays fresh automatically
4. **Optimistic Updates**: UI updates immediately
5. **Error Handling**: Built-in error states and retry logic
6. **Loading States**: Automatic loading indicators
7. **Type Safety**: Full TypeScript support

## How It Works

1. **Server-Side**: Loader pre-fetches data and returns it
2. **Client-Side**: TanStack Query uses the pre-fetched data as initial state
3. **Caching**: Data is cached and shared across components
4. **Mutations**: When data changes, queries are automatically invalidated
5. **Background Updates**: Stale data is refetched in the background

## Configuration

The QueryClient is configured with SSR-optimized settings:

- **staleTime**: 1 minute (prevents unnecessary refetches)
- **gcTime**: 10 minutes (keeps data in memory)
- **DevTools**: Included in development mode

## Integration with React Router

The implementation follows React Router's data loading patterns:

- Uses `loader` functions for server-side data fetching
- Integrates with React Router's error boundaries
- Supports redirects and error responses
- Maintains type safety throughout the data flow
