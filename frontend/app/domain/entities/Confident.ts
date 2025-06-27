export interface Confident {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateConfidentRequest {
  name: string;
  description?: string;
}

export interface UpdateConfidentRequest {
  name?: string;
  description?: string;
}

export class ConfidentEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly user_id: number,
    public readonly created_at: string | undefined,
    public readonly updated_at: string | undefined
  ) {}

  static create(data: Confident): ConfidentEntity {
    return new ConfidentEntity(
      data.id,
      data.name,
      data.description,
      data.user_id,
      data.created_at,
      data.updated_at
    );
  }

  toJSON(): Confident {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      user_id: this.user_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
