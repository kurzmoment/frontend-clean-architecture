import { ConfidentRepository } from "../ConfidentRepository";
import { ConfidentEntity, CreateConfidentData } from "../Confident";
import { Either } from "../../../common/domain/Either";
import { DataError } from "../../../common/domain/DataError";

export class CreateConfidentUseCase {
  constructor(private confidentRepository: ConfidentRepository) {}

  async execute(
    data: CreateConfidentData,
    userId: number
  ): Promise<Either<DataError, ConfidentEntity>> {
    return this.confidentRepository.create(data, userId);
  }
}
