import { ProjectState, projectInitialState } from "./ProjectState";
import { Ploc } from "../../common/presentation/Ploc";
import { GetProjectsUseCase } from "../domain/usecases/GetProjectsUseCase";
import { CreateProjectUseCase } from "../domain/usecases/CreateProjectUseCase";
import { UpdateProjectUseCase } from "../domain/usecases/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "../domain/usecases/DeleteProjectUseCase";
import {
  ProjectEntity,
  CreateProjectData,
  UpdateProjectData,
} from "../domain/Project";
import { DataError } from "../../common/domain/DataError";

export class ProjectPloc extends Ploc<ProjectState> {
  private currentUserId: number;

  constructor(
    private getProjectsUseCase: GetProjectsUseCase,
    private createProjectUseCase: CreateProjectUseCase,
    private updateProjectUseCase: UpdateProjectUseCase,
    private deleteProjectUseCase: DeleteProjectUseCase,
    userId: number
  ) {
    super(projectInitialState);
    this.currentUserId = userId;
    this.loadProjects();
  }

  async loadProjects() {
    const result = await this.getProjectsUseCase.execute(this.currentUserId);

    result.fold(
      (error) => this.changeState(this.handleError(error)),
      (projects) => this.changeState(this.mapToLoadedState(projects))
    );
  }

  async createProject(data: CreateProjectData) {
    const result = await this.createProjectUseCase.execute(
      data,
      this.currentUserId
    );

    result.fold(
      (error) => this.changeState(this.handleError(error)),
      (project) => {
        if (this.state.kind === "LoadedProjectState") {
          const updatedProjects = [...this.state.projects, project];
          this.changeState(this.mapToLoadedState(updatedProjects));
        }
      }
    );
  }

  async updateProject(id: number, data: UpdateProjectData) {
    const result = await this.updateProjectUseCase.execute(
      id,
      data,
      this.currentUserId
    );

    result.fold(
      (error) => this.changeState(this.handleError(error)),
      (updatedProject) => {
        if (this.state.kind === "LoadedProjectState") {
          const updatedProjects = this.state.projects.map((project) =>
            project.id === id ? updatedProject : project
          );
          this.changeState(this.mapToLoadedState(updatedProjects));
        }
      }
    );
  }

  async deleteProject(id: number) {
    const result = await this.deleteProjectUseCase.execute(
      id,
      this.currentUserId
    );

    result.fold(
      (error) => this.changeState(this.handleError(error)),
      (success) => {
        if (success && this.state.kind === "LoadedProjectState") {
          const updatedProjects = this.state.projects.filter(
            (project) => project.id !== id
          );
          this.changeState(this.mapToLoadedState(updatedProjects));
        }
      }
    );
  }

  private mapToLoadedState(projects: ProjectEntity[]): ProjectState {
    return {
      kind: "LoadedProjectState",
      projects,
    };
  }

  private handleError(error: DataError): ProjectState {
    switch (error.kind) {
      case "UnexpectedError": {
        return {
          kind: "ErrorProjectState",
          error: "Sorry, an error has occurred. Please try again later.",
        };
      }
    }
  }
}
