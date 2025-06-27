import { ConfidentRepository } from "../../infrastructure/repositories/ConfidentRepository";
import {
  Confident,
  CreateConfidentRequest,
  UpdateConfidentRequest,
  ConfidentEntity,
} from "../../domain/entities/Confident";

export class ConfidentService {
  constructor(private confidentRepository: ConfidentRepository) {}

  async getAllConfidents(): Promise<ConfidentEntity[]> {
    try {
      const confidents = await this.confidentRepository.getAll();
      return confidents.map((confident) => ConfidentEntity.create(confident));
    } catch (error) {
      throw new Error("Failed to fetch confidents");
    }
  }

  async getConfidentById(id: number): Promise<ConfidentEntity> {
    try {
      const confident = await this.confidentRepository.getById(id);
      return ConfidentEntity.create(confident);
    } catch (error) {
      throw new Error("Confident not found");
    }
  }

  async createConfident(
    confidentData: CreateConfidentRequest
  ): Promise<ConfidentEntity> {
    try {
      const response = await this.confidentRepository.create(confidentData);
      return ConfidentEntity.create(response.confident);
    } catch (error) {
      throw new Error("Failed to create confident");
    }
  }

  async updateConfident(
    id: number,
    confidentData: UpdateConfidentRequest
  ): Promise<void> {
    try {
      await this.confidentRepository.update(id, confidentData);
    } catch (error) {
      throw new Error("Failed to update confident");
    }
  }

  async deleteConfident(id: number): Promise<void> {
    try {
      await this.confidentRepository.delete(id);
    } catch (error) {
      throw new Error("Failed to delete confident");
    }
  }
}
