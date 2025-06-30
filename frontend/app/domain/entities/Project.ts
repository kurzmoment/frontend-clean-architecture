import type { Confident } from "./Confident";
import type { Tag } from "./Tag";

export interface Project {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  confidents?: Confident[];
  tags?: Tag[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export class ProjectEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly user_id: number,
    public readonly created_at: string | undefined,
    public readonly updated_at: string | undefined,
    public readonly confidents: Confident[] = [],
    public readonly tags: Tag[] = []
  ) {}

  static create(data: Project): ProjectEntity {
    return new ProjectEntity(
      data.id,
      data.name,
      data.description,
      data.user_id,
      data.created_at,
      data.updated_at,
      data.confidents || [],
      data.tags || []
    );
  }

  toJSON(): Project {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      user_id: this.user_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      confidents: this.confidents,
      tags: this.tags,
    };
  }

  hasConfident(confidentId: number): boolean {
    return this.confidents.some((confident) => confident.id === confidentId);
  }

  hasTag(tagId: number): boolean {
    return this.tags.some((tag) => tag.id === tagId);
  }
}
