import { ConfidentRepository } from "../domain/ConfidentRepository";
import {
  ConfidentEntity,
  CreateConfidentData,
  UpdateConfidentData,
} from "../domain/Confident";
import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";
import { apiClient } from "../../../infrastructure/api/api-client";

export class ConfidentDatabaseRepository implements ConfidentRepository {
  async getAll(userId: number): Promise<Either<DataError, ConfidentEntity[]>> {
    try {
      const response = await apiClient.get<any[]>("/confidents");

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Failed to fetch confidents"),
        });
      }

      const confidents = response.data.map((confident) =>
        ConfidentEntity.fromJSON(confident)
      );

      return Either.right(confidents);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async getById(
    id: number,
    userId: number
  ): Promise<Either<DataError, ConfidentEntity>> {
    try {
      const response = await apiClient.get<any>(`/confidents/${id}`);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error(
            response.data.message || "Failed to fetch confident"
          ),
        });
      }

      const confident = ConfidentEntity.fromJSON(response.data);
      return Either.right(confident);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async create(
    data: CreateConfidentData,
    userId: number
  ): Promise<Either<DataError, ConfidentEntity>> {
    try {
      const response = await apiClient.post<any>("/confidents", data);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error(
            response.data.message || "Failed to create confident"
          ),
        });
      }

      const confident = ConfidentEntity.fromJSON(response.data.confident);
      return Either.right(confident);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async update(
    id: number,
    data: UpdateConfidentData,
    userId: number
  ): Promise<Either<DataError, ConfidentEntity>> {
    try {
      const response = await apiClient.put<any>(`/confidents/${id}`, data);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error(
            response.data.message || "Failed to update confident"
          ),
        });
      }

      // Since the API doesn't return the updated confident, we need to fetch it
      return this.getById(id, userId);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }

  async delete(
    id: number,
    userId: number
  ): Promise<Either<DataError, boolean>> {
    try {
      const response = await apiClient.delete<any>(`/confidents/${id}`);

      if (!response.ok) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error(
            response.data.message || "Failed to delete confident"
          ),
        });
      }

      return Either.right(true);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }
}
