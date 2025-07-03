import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";
import { ProjectEntity, CreateProjectData, UpdateProjectData } from "./Project";

export interface ProjectRepository {
  getAll(userId: number): Promise<Either<DataError, ProjectEntity[]>>;
  getById(
    id: number,
    userId: number
  ): Promise<Either<DataError, ProjectEntity>>;
  create(
    data: CreateProjectData,
    userId: number
  ): Promise<Either<DataError, ProjectEntity>>;
  update(
    id: number,
    data: UpdateProjectData,
    userId: number
  ): Promise<Either<DataError, ProjectEntity>>;
  delete(id: number, userId: number): Promise<Either<DataError, boolean>>;
}
