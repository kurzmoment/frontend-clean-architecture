import { ConfidentRepository } from "../ConfidentRepository";
import { ConfidentEntity, UpdateConfidentData } from "../Confident";
import { Either } from "../../../common/domain/Either";
import { DataError } from "../../../common/domain/DataError";

export class UpdateConfidentUseCase {
  constructor(private confidentRepository: ConfidentRepository) {}

  async execute(
    id: number,
    data: UpdateConfidentData,
    userId: number
  ): Promise<Either<DataError, ConfidentEntity>> {
    return this.confidentRepository.update(id, data, userId);
  }
}
