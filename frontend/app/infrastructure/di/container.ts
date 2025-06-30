import { AuthService } from "../../application/services/AuthService";
import { ProjectService } from "../../application/services/ProjectService";
import { ConfidentService } from "../../application/services/ConfidentService";
import { TagService } from "../../application/services/TagService";
import { AuthRepositoryImpl } from "../repositories/AuthRepository";
import { ProjectRepositoryImpl } from "../repositories/ProjectRepository";
import { ConfidentRepositoryImpl } from "../repositories/ConfidentRepository";
import { TagRepositoryImpl } from "../repositories/TagRepository";

// Service interfaces
export interface IAuthService {
  login(credentials: any): Promise<{ user: any; token: string }>;
  register(userData: any): Promise<{ user: any; token: string }>;
  getCurrentUser(): Promise<any | null>;
  logout(): Promise<void>;
  isAuthenticated(): boolean;
  getStoredUser(): any | null;
}

export interface IProjectService {
  getAllProjects(): Promise<any[]>;
  getProjectById(id: number): Promise<any>;
  createProject(projectData: any): Promise<any>;
  updateProject(id: number, projectData: any): Promise<void>;
  deleteProject(id: number): Promise<void>;
  addConfidentToProject(projectId: number, confidentId: number): Promise<void>;
  removeConfidentFromProject(
    projectId: number,
    confidentId: number
  ): Promise<void>;
  addTagToProject(projectId: number, tagId: number): Promise<void>;
  removeTagFromProject(projectId: number, tagId: number): Promise<void>;
}

export interface IConfidentService {
  getAllConfidents(): Promise<any[]>;
  getConfidentById(id: number): Promise<any>;
  createConfident(confidentData: any): Promise<any>;
  updateConfident(id: number, confidentData: any): Promise<void>;
  deleteConfident(id: number): Promise<void>;
}

export interface ITagService {
  getAllTags(): Promise<any[]>;
  getTagById(id: number): Promise<any>;
  createTag(tagData: any): Promise<any>;
  updateTag(id: number, tagData: any): Promise<void>;
  deleteTag(id: number): Promise<void>;
}

class ServiceContainer {
  private static instance: ServiceContainer;
  private services: Map<string, any> = new Map();
  private initialized = false;

  private constructor() {}

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  private initializeServices(): void {
    if (this.initialized) return;

    // Initialize repositories
    const authRepository = new AuthRepositoryImpl();
    const projectRepository = new ProjectRepositoryImpl();
    const confidentRepository = new ConfidentRepositoryImpl();
    const tagRepository = new TagRepositoryImpl();

    // Initialize services with their dependencies
    const authService = new AuthService(authRepository);
    const projectService = new ProjectService(projectRepository);
    const confidentService = new ConfidentService(confidentRepository);
    const tagService = new TagService(tagRepository);

    // Register services
    this.services.set("authService", authService);
    this.services.set("projectService", projectService);
    this.services.set("confidentService", confidentService);
    this.services.set("tagService", tagService);

    this.initialized = true;
  }

  public getAuthService(): IAuthService {
    this.initializeServices();
    return this.services.get("authService");
  }

  public getProjectService(): IProjectService {
    this.initializeServices();
    return this.services.get("projectService");
  }

  public getConfidentService(): IConfidentService {
    this.initializeServices();
    return this.services.get("confidentService");
  }

  public getTagService(): ITagService {
    this.initializeServices();
    return this.services.get("tagService");
  }

  public getService<T>(serviceName: string): T {
    this.initializeServices();
    return this.services.get(serviceName);
  }
}

// Export singleton instance
export const serviceContainer = ServiceContainer.getInstance();

// Convenience functions for getting services
export const getAuthService = () => serviceContainer.getAuthService();
export const getProjectService = () => serviceContainer.getProjectService();
export const getConfidentService = () => serviceContainer.getConfidentService();
export const getTagService = () => serviceContainer.getTagService();
