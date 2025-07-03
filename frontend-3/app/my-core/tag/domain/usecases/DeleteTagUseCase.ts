import { TagRepository } from "../TagRepository";
import { DataError } from "../../../common/domain/DataError";
import { Either } from "../../../common/domain/Either";

export class DeleteTagUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute(
    id: number,
    userId: number
  ): Promise<Either<DataError, boolean>> {
    return this.tagRepository.delete(id, userId);
  }
}
