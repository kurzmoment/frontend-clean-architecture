// Shared query keys for all domains
export const queryKeys = {
  projects: ["projects"] as const,
  confidents: ["confidents"] as const,
  tags: ["tags"] as const,
  project: (id: number) => ["project", id] as const,
  confident: (id: number) => ["confident", id] as const,
  tag: (id: number) => ["tag", id] as const,
};
