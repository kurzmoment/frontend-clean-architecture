import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../shared-kernel";

export interface ProjectRepository {
  getAll(): Promise<Project[]>;
  getById(id: number): Promise<Project>;
  create(
    project: CreateProjectRequest
  ): Promise<{ message: string; project: Project }>;
  update(
    id: number,
    project: UpdateProjectRequest
  ): Promise<{ message: string }>;
  delete(id: number): Promise<{ message: string }>;

  // Relationship operations
  addConfident(
    projectId: number,
    confidentId: number
  ): Promise<{ message: string }>;
  removeConfident(
    projectId: number,
    confidentId: number
  ): Promise<{ message: string }>;
  addTag(projectId: number, tagId: number): Promise<{ message: string }>;
  removeTag(projectId: number, tagId: number): Promise<{ message: string }>;
}
