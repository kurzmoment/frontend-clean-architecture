import { ProjectRepository } from "../ProjectRepository";
import { Either } from "../../../common/domain/Either";
import { DataError } from "../../../common/domain/DataError";

export class DeleteProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(
    id: number,
    userId: number
  ): Promise<Either<DataError, boolean>> {
    return this.projectRepository.delete(id, userId);
  }
}
