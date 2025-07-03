// Export shared utilities
export { queryKeys } from "./shared/query-keys";
export * from "./shared/types";

// Export domain-specific queries and mutations
export * from "./projects";
export * from "./confidents";
export * from "./tags";

// Export query client and provider
export { QueryProvider } from "./query-provider";
export { createQueryClient } from "./query-client";
