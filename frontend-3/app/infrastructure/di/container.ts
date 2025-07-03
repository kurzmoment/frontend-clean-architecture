import { ConfidentPloc } from "../../my-core/confident/presentation/ConfidentPloc";
import { ProjectPloc } from "../../my-core/project/presentation/ProjectPloc";
import { TagPloc } from "../../my-core/tag/presentation/TagPloc";
import { ConfidentDatabaseRepository } from "../../my-core/confident/data/ConfidentDatabaseRepository";
import { ProjectDatabaseRepository } from "../../my-core/project/data/ProjectDatabaseRepository";
import { TagDatabaseRepository } from "../../my-core/tag/data/TagDatabaseRepository";
import { GetConfidentsUseCase } from "../../my-core/confident/domain/usecases/GetConfidentsUseCase";
import { CreateConfidentUseCase } from "../../my-core/confident/domain/usecases/CreateConfidentUseCase";
import { UpdateConfidentUseCase } from "../../my-core/confident/domain/usecases/UpdateConfidentUseCase";
import { DeleteConfidentUseCase } from "../../my-core/confident/domain/usecases/DeleteConfidentUseCase";
import { GetProjectsUseCase } from "../../my-core/project/domain/usecases/GetProjectsUseCase";
import { CreateProjectUseCase } from "../../my-core/project/domain/usecases/CreateProjectUseCase";
import { UpdateProjectUseCase } from "../../my-core/project/domain/usecases/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "../../my-core/project/domain/usecases/DeleteProjectUseCase";
import { GetTagsUseCase } from "../../my-core/tag/domain/usecases/GetTagsUseCase";
import { CreateTagUseCase } from "../../my-core/tag/domain/usecases/CreateTagUseCase";
import { UpdateTagUseCase } from "../../my-core/tag/domain/usecases/UpdateTagUseCase";
import { DeleteTagUseCase } from "../../my-core/tag/domain/usecases/DeleteTagUseCase";

export class DependenciesContainer {
  private static instance: DependenciesContainer;
  private confidentPloc: ConfidentPloc | null = null;
  private projectPloc: ProjectPloc | null = null;
  private tagPloc: TagPloc | null = null;

  private constructor() {}

  static getInstance(): DependenciesContainer {
    if (!DependenciesContainer.instance) {
      DependenciesContainer.instance = new DependenciesContainer();
    }
    return DependenciesContainer.instance;
  }

  // Repository factories
  private createConfidentRepository() {
    return new ConfidentDatabaseRepository();
  }

  private createProjectRepository() {
    return new ProjectDatabaseRepository();
  }

  private createTagRepository() {
    return new TagDatabaseRepository();
  }

  // Use case factories
  private createConfidentUseCases() {
    const repository = this.createConfidentRepository();
    return {
      getConfidents: new GetConfidentsUseCase(repository),
      createConfident: new CreateConfidentUseCase(repository),
      updateConfident: new UpdateConfidentUseCase(repository),
      deleteConfident: new DeleteConfidentUseCase(repository),
    };
  }

  private createProjectUseCases() {
    const repository = this.createProjectRepository();
    return {
      getProjects: new GetProjectsUseCase(repository),
      createProject: new CreateProjectUseCase(repository),
      updateProject: new UpdateProjectUseCase(repository),
      deleteProject: new DeleteProjectUseCase(repository),
    };
  }

  private createTagUseCases() {
    const repository = this.createTagRepository();
    return {
      getTags: new GetTagsUseCase(repository),
      createTag: new CreateTagUseCase(repository),
      updateTag: new UpdateTagUseCase(repository),
      deleteTag: new DeleteTagUseCase(repository),
    };
  }

  // PLOC factories
  getConfidentPloc(userId: number): ConfidentPloc {
    if (!this.confidentPloc) {
      const useCases = this.createConfidentUseCases();
      this.confidentPloc = new ConfidentPloc(
        useCases.getConfidents,
        useCases.createConfident,
        useCases.updateConfident,
        useCases.deleteConfident,
        userId
      );
    }
    return this.confidentPloc;
  }

  getProjectPloc(userId: number): ProjectPloc {
    if (!this.projectPloc) {
      const useCases = this.createProjectUseCases();
      this.projectPloc = new ProjectPloc(
        useCases.getProjects,
        useCases.createProject,
        useCases.updateProject,
        useCases.deleteProject,
        userId
      );
    }
    return this.projectPloc;
  }

  getTagPloc(userId: number): TagPloc {
    if (!this.tagPloc) {
      const useCases = this.createTagUseCases();
      this.tagPloc = new TagPloc(
        useCases.getTags,
        useCases.createTag,
        useCases.updateTag,
        useCases.deleteTag,
        userId
      );
    }
    return this.tagPloc;
  }

  // Cleanup method
  dispose() {
    if (this.confidentPloc) {
      this.confidentPloc.dispose();
      this.confidentPloc = null;
    }
    if (this.projectPloc) {
      this.projectPloc.dispose();
      this.projectPloc = null;
    }
    if (this.tagPloc) {
      this.tagPloc.dispose();
      this.tagPloc = null;
    }
  }
}

export const container = DependenciesContainer.getInstance();
