import type { TagRepository } from "../../domain/repositories/tag-repository";
import { tagRepository } from "../../infrastructure/repositories/tag-repository-impl";

export function useTagRepository(): TagRepository {
  return tagRepository;
}
