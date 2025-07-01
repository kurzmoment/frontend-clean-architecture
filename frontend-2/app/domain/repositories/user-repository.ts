import type {
  User,
  CreateUserRequest,
  LoginRequest,
  AuthResponse,
} from "../../shared-kernel";

export interface UserRepository {
  // Authentication operations
  login(credentials: LoginRequest): Promise<AuthResponse>;
  register(userData: CreateUserRequest): Promise<AuthResponse>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;

  // User management operations
  getAll(): Promise<User[]>;
  getById(id: number): Promise<User>;
  create(user: CreateUserRequest): Promise<{ message: string; user: User }>;
  update(id: number, user: Partial<User>): Promise<{ message: string }>;
  delete(id: number): Promise<{ message: string }>;
}
