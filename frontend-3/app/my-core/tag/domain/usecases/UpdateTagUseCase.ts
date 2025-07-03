import { TagRepository } from "../TagRepository";
import { TagEntity, UpdateTagData } from "../Tag";
import { DataError } from "../../../common/domain/DataError";
import { Either } from "../../../common/domain/Either";

export class UpdateTagUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute(
    id: number,
    data: UpdateTagData,
    userId: number
  ): Promise<Either<DataError, TagEntity>> {
    return this.tagRepository.update(id, data, userId);
  }
}
