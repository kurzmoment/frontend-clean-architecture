import type { ConfidentRepository } from "../../domain/repositories/confident-repository";
import { confidentRepository } from "../../infrastructure/repositories/confident-repository-impl";

export function useConfidentRepository(): ConfidentRepository {
  return confidentRepository;
}
