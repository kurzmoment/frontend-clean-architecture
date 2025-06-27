export interface Tag {
  id: number;
  name: string;
  color: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
}

export class TagEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly color: string,
    public readonly user_id: number,
    public readonly created_at: string | undefined,
    public readonly updated_at: string | undefined
  ) {}

  static create(data: Tag): TagEntity {
    return new TagEntity(
      data.id,
      data.name,
      data.color,
      data.user_id,
      data.created_at,
      data.updated_at
    );
  }

  toJSON(): Tag {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      user_id: this.user_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
