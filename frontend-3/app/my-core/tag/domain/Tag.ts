export interface Tag {
  id: number;
  name: string;
  color?: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTagData {
  name: string;
  color?: string;
}

export interface UpdateTagData {
  name?: string;
  color?: string;
}

export class TagEntity {
  constructor(private readonly data: Tag) {}

  get id(): number {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get color(): string | undefined {
    return this.data.color;
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

  update(data: UpdateTagData): TagEntity {
    const updatedData: Tag = {
      ...this.data,
      ...data,
      updated_at: new Date().toISOString(),
    };
    return new TagEntity(updatedData);
  }

  toJSON(): Tag {
    return { ...this.data };
  }

  static create(data: CreateTagData, userId: number): TagEntity {
    const tagData: Tag = {
      id: 0, // Will be set by the database
      ...data,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return new TagEntity(tagData);
  }

  static fromJSON(data: Tag): TagEntity {
    return new TagEntity(data);
  }
}
