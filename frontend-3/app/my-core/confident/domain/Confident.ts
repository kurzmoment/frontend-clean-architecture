export interface Confident {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateConfidentData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
}

export interface UpdateConfidentData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
}

export class ConfidentEntity {
  constructor(private readonly data: Confident) {}

  get id(): number {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get email(): string | undefined {
    return this.data.email;
  }

  get phone(): string | undefined {
    return this.data.phone;
  }

  get company(): string | undefined {
    return this.data.company;
  }

  get position(): string | undefined {
    return this.data.position;
  }

  get notes(): string | undefined {
    return this.data.notes;
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

  getDisplayName(): string {
    if (this.data.company && this.data.position) {
      return `${this.data.name} - ${this.data.position} at ${this.data.company}`;
    }
    if (this.data.company) {
      return `${this.data.name} - ${this.data.company}`;
    }
    if (this.data.position) {
      return `${this.data.name} - ${this.data.position}`;
    }
    return this.data.name;
  }

  hasContactInfo(): boolean {
    return !!(this.data.email || this.data.phone);
  }

  update(data: UpdateConfidentData): ConfidentEntity {
    const updatedData: Confident = {
      ...this.data,
      ...data,
      updated_at: new Date().toISOString(),
    };
    return new ConfidentEntity(updatedData);
  }

  toJSON(): Confident {
    return { ...this.data };
  }

  static create(data: CreateConfidentData, userId: number): ConfidentEntity {
    const confidentData: Confident = {
      id: 0, // Will be set by the database
      ...data,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return new ConfidentEntity(confidentData);
  }

  static fromJSON(data: Confident): ConfidentEntity {
    return new ConfidentEntity(data);
  }
}
