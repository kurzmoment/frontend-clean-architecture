import { ProjectRepository } from "../ProjectRepository";
import { ProjectEntity, UpdateProjectData } from "../Project";
import { Either } from "../../../common/domain/Either";
import { DataError } from "../../../common/domain/DataError";

export class UpdateProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(
    id: number,
    data: UpdateProjectData,
    userId: number
  ): Promise<Either<DataError, ProjectEntity>> {
    return this.projectRepository.update(id, data, userId);
  }
}
