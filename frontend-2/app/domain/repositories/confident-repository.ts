import type {
  Confident,
  CreateConfidentRequest,
  UpdateConfidentRequest,
} from "../../shared-kernel";

export interface ConfidentRepository {
  getAll(): Promise<Confident[]>;
  getById(id: number): Promise<Confident>;
  create(
    confident: CreateConfidentRequest
  ): Promise<{ message: string; confident: Confident }>;
  update(
    id: number,
    confident: UpdateConfidentRequest
  ): Promise<{ message: string }>;
  delete(id: number): Promise<{ message: string }>;
}
