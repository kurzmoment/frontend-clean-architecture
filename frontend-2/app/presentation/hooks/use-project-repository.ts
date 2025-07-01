import type { ProjectRepository } from "../../domain/repositories/project-repository";
import { projectRepository } from "../../infrastructure/repositories/project-repository-impl";

export function useProjectRepository(): ProjectRepository {
  return projectRepository;
}
