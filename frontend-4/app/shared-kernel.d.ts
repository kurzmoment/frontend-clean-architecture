// Shared Kernel - Global type annotations that can be accessed anywhere in the app

declare module "animate-ui";

export type User = {
  id: number;
  email: string;
  username: string;
  created_at?: string;
  updated_at?: string;
};

export type Project = {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  confidents?: Confident[];
  tags?: Tag[];
};

export type Confident = {
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
};

export type Tag = {
  id: number;
  name: string;
  color?: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
};

export type Cart = {
  products: Project[];
};

export type NotificationType = "success" | "error" | "warning" | "info";

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
};

// Request/Response types
export type CreateUserRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
  message?: string;
};

export type CreateProjectRequest = {
  name: string;
  description?: string;
  confident_ids?: number[];
  tag_ids?: number[];
};

export type UpdateProjectRequest = {
  name?: string;
  description?: string;
  confident_ids?: number[];
  tag_ids?: number[];
};

export type CreateConfidentRequest = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
};

export type UpdateConfidentRequest = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
};

export type CreateTagRequest = {
  name: string;
  color?: string;
};

export type UpdateTagRequest = {
  name?: string;
  color?: string;
};
