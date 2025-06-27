export interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  username: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly email: string,
    public readonly created_at?: string,
    public readonly updated_at?: string
  ) {}

  static create(data: User): UserEntity {
    return new UserEntity(
      data.id,
      data.username,
      data.email,
      data.created_at,
      data.updated_at
    );
  }

  toJSON(): User {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
