// Export all services
export { apiService } from "./api";
export { authService } from "./auth";
export { projectsService } from "./projects";
export { confidentsService } from "./confidents";
export { tagsService } from "./tags";
export { notificationService } from "./notifications";

// Export types
export type { User, AuthState } from "./auth";
export type { Project, CreateProjectData, UpdateProjectData } from "./projects";
export type {
  Confident,
  CreateConfidentData,
  UpdateConfidentData,
} from "./confidents";
export type { Tag, CreateTagData, UpdateTagData } from "./tags";
export type { Notification, NotificationType } from "./notifications";
