import { TagRepository } from "../TagRepository";
import { TagEntity, CreateTagData } from "../Tag";
import { Either } from "../../../common/domain/Either";
import { DataError } from "../../../common/domain/DataError";

export class CreateTagUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute(
    data: CreateTagData,
    userId: number
  ): Promise<Either<DataError, TagEntity>> {
    return this.tagRepository.create(data, userId);
  }
}
