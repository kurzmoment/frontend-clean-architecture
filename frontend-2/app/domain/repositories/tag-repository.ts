import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
} from "../../shared-kernel";

export interface TagRepository {
  getAll(): Promise<Tag[]>;
  getById(id: number): Promise<Tag>;
  create(tag: CreateTagRequest): Promise<{ message: string; tag: Tag }>;
  update(id: number, tag: UpdateTagRequest): Promise<{ message: string }>;
  delete(id: number): Promise<{ message: string }>;
}
