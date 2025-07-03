import { ConfidentRepository } from "../domain/ConfidentRepository";
import {
  ConfidentEntity,
  CreateConfidentData,
  UpdateConfidentData,
} from "../domain/Confident";
import { DataError } from "../../common/domain/DataError";
import { Either } from "../../common/domain/Either";

export class ConfidentInMemoryRepository implements ConfidentRepository {
  private confidents: ConfidentEntity[] = [];

  async getAll(userId: number): Promise<Either<DataError, ConfidentEntity[]>> {
    try {
      const userConfidents = this.confidents.filter(
        (confident) => confident.user_id === userId
      );
      return Either.right(userConfidents);
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
      const confident = this.confidents.find(
        (c) => c.id === id && c.user_id === userId
      );

      if (!confident) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Confident not found"),
        });
      }

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
      const newId = Math.max(0, ...this.confidents.map((c) => c.id)) + 1;
      const confident = ConfidentEntity.create(data, userId);
      const confidentWithId = new ConfidentEntity({
        ...confident.toJSON(),
        id: newId,
      });

      this.confidents.push(confidentWithId);
      return Either.right(confidentWithId);
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
      const index = this.confidents.findIndex(
        (c) => c.id === id && c.user_id === userId
      );

      if (index === -1) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Confident not found"),
        });
      }

      const updatedConfident = this.confidents[index].update(data);
      this.confidents[index] = updatedConfident;

      return Either.right(updatedConfident);
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
      const index = this.confidents.findIndex(
        (c) => c.id === id && c.user_id === userId
      );

      if (index === -1) {
        return Either.left({
          kind: "UnexpectedError",
          error: new Error("Confident not found"),
        });
      }

      this.confidents.splice(index, 1);
      return Either.right(true);
    } catch (error) {
      return Either.left({
        kind: "UnexpectedError",
        error: error as Error,
      });
    }
  }
}
