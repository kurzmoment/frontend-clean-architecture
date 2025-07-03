import { ConfidentRepository } from "../ConfidentRepository";
import { Either } from "../../../common/domain/Either";
import { DataError } from "../../../common/domain/DataError";

export class DeleteConfidentUseCase {
  constructor(private confidentRepository: ConfidentRepository) {}

  async execute(
    id: number,
    userId: number
  ): Promise<Either<DataError, boolean>> {
    return this.confidentRepository.delete(id, userId);
  }
}
