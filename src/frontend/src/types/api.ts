// Essential API types

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export interface Target {
  id: string;
  name: string;
  url?: string;
  ip?: string;
  type: string;
  status: string;
}

export interface Scan {
  id: string;
  name: string;
  target_id: string;
  status: string;
  created_at: string;
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: string;
  status: string;
  target: string;
} 