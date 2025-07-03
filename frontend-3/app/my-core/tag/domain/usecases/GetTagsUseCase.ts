import { TagRepository } from "../TagRepository";
import { TagEntity } from "../Tag";
import { Either } from "../../../common/domain/Either";
import { DataError } from "../../../common/domain/DataError";

export class GetTagsUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute(userId: number): Promise<Either<DataError, TagEntity[]>> {
    return this.tagRepository.getAll(userId);
  }
}
