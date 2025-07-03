import { ConfidentEntity } from "../../confident/domain/Confident";
import { TagEntity } from "../../tag/domain/Tag";

export interface Project {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  confidents?: ConfidentEntity[];
  tags?: TagEntity[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  confident_ids?: number[];
  tag_ids?: number[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  confident_ids?: number[];
  tag_ids?: number[];
}

export class ProjectEntity {
  constructor(private readonly data: Project) {}

  get id(): number {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get description(): string | undefined {
    return this.data.description;
  }

  get user_id(): number {
    return this.data.user_id;
  }

  get created_at(): string | undefined {
    return this.data.created_at;
  }

  get updated_at(): string | undefined {
    return this.data.updated_at;
  }

  get confidents(): ConfidentEntity[] {
    return this.data.confidents || [];
  }

  get tags(): TagEntity[] {
    return this.data.tags || [];
  }

  hasConfident(confidentId: number): boolean {
    return this.confidents.some((confident) => confident.id === confidentId);
  }

  hasTag(tagId: number): boolean {
    return this.tags.some((tag) => tag.id === tagId);
  }

  getConfidentCount(): number {
    return this.confidents.length;
  }

  getTagCount(): number {
    return this.tags.length;
  }

  addConfident(confident: ConfidentEntity): ProjectEntity {
    const updatedConfidents = [...this.confidents, confident];
    return new ProjectEntity({
      ...this.data,
      confidents: updatedConfidents,
    });
  }

  addTag(tag: TagEntity): ProjectEntity {
    const updatedTags = [...this.tags, tag];
    return new ProjectEntity({
      ...this.data,
      tags: updatedTags,
    });
  }

  removeConfident(confidentId: number): ProjectEntity {
    const updatedConfidents = this.confidents.filter(
      (confident) => confident.id !== confidentId
    );
    return new ProjectEntity({
      ...this.data,
      confidents: updatedConfidents,
    });
  }

  removeTag(tagId: number): ProjectEntity {
    const updatedTags = this.tags.filter((tag) => tag.id !== tagId);
    return new ProjectEntity({
      ...this.data,
      tags: updatedTags,
    });
  }

  update(data: UpdateProjectData): ProjectEntity {
    const updatedData: Project = {
      ...this.data,
      ...data,
      updated_at: new Date().toISOString(),
    };
    return new ProjectEntity(updatedData);
  }

  toJSON(): Project {
    return { ...this.data };
  }

  static create(data: CreateProjectData, userId: number): ProjectEntity {
    const projectData: Project = {
      id: 0, // Will be set by the database
      ...data,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      confidents: [],
      tags: [],
    };
    return new ProjectEntity(projectData);
  }

  static fromJSON(data: Project): ProjectEntity {
    return new ProjectEntity(data);
  }
}
