import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";
import {
  ConfidentEntity,
  CreateConfidentData,
  UpdateConfidentData,
} from "./Confident";

export interface ConfidentRepository {
  getAll(userId: number): Promise<Either<DataError, ConfidentEntity[]>>;
  getById(
    id: number,
    userId: number
  ): Promise<Either<DataError, ConfidentEntity>>;
  create(
    data: CreateConfidentData,
    userId: number
  ): Promise<Either<DataError, ConfidentEntity>>;
  update(
    id: number,
    data: UpdateConfidentData,
    userId: number
  ): Promise<Either<DataError, ConfidentEntity>>;
  delete(id: number, userId: number): Promise<Either<DataError, boolean>>;
}
