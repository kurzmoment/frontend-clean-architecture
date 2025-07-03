import { ProjectRepository } from "../ProjectRepository";
import { ProjectEntity, CreateProjectData } from "../Project";
import { Either } from "../../../common/domain/Either";
import { DataError } from "../../../common/domain/DataError";

export class CreateProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(
    data: CreateProjectData,
    userId: number
  ): Promise<Either<DataError, ProjectEntity>> {
    return this.projectRepository.create(data, userId);
  }
}
