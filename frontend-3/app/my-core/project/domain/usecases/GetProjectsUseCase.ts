import { ProjectRepository } from "../ProjectRepository";
import { ProjectEntity } from "../Project";
import { Either } from "../../../common/domain/Either";
import { DataError } from "../../../common/domain/DataError";

export class GetProjectsUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(userId: number): Promise<Either<DataError, ProjectEntity[]>> {
    return this.projectRepository.getAll(userId);
  }
}
