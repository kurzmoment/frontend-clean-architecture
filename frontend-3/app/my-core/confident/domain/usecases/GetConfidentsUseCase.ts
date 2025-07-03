import { ConfidentRepository } from "../ConfidentRepository";
import { ConfidentEntity } from "../Confident";
import { Either } from "../../../common/domain/Either";
import { DataError } from "../../../common/domain/DataError";

export class GetConfidentsUseCase {
  constructor(private confidentRepository: ConfidentRepository) {}

  async execute(userId: number): Promise<Either<DataError, ConfidentEntity[]>> {
    return this.confidentRepository.getAll(userId);
  }
}
