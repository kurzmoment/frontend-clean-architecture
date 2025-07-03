import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";
import { TagEntity, CreateTagData, UpdateTagData } from "./Tag";

export interface TagRepository {
  getAll(userId: number): Promise<Either<DataError, TagEntity[]>>;
  getById(id: number, userId: number): Promise<Either<DataError, TagEntity>>;
  create(
    data: CreateTagData,
    userId: number
  ): Promise<Either<DataError, TagEntity>>;
  update(
    id: number,
    data: UpdateTagData,
    userId: number
  ): Promise<Either<DataError, TagEntity>>;
  delete(id: number, userId: number): Promise<Either<DataError, boolean>>;
}
