import { apiService } from './client';

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  full_name?: string | null;
  is_active: boolean;
  department?: string | null;
  role_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserCreateDTO {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  department?: string;
  role_id?: number;
}

export interface UserUpdateDTO {
  username?: string;
  email?: string;
  full_name?: string;
  is_active?: boolean;
  department?: string;
  role_id?: number;
}

class UsersApi {
  async list(params?: { skip?: number; limit?: number }): Promise<UserDTO[]> {
    const res = await apiService.get<UserDTO[]>('/api/v1/users/', params);
    return res.data;
  }

  async get(id: number): Promise<UserDTO> {
    const res = await apiService.get<UserDTO>(`/api/v1/users/${id}`);
    return res.data;
  }

  async create(payload: UserCreateDTO): Promise<UserDTO> {
    const res = await apiService.post<UserDTO>('/api/v1/users/', payload);
    return res.data;
  }

  async update(id: number, payload: UserUpdateDTO): Promise<UserDTO> {
    const res = await apiService.put<UserDTO>(`/api/v1/users/${id}`, payload);
    return res.data;
  }

  async remove(id: number): Promise<{ message: string }> {
    const res = await apiService.delete<{ message: string }>(`/api/v1/users/${id}`);
    return res.data;
  }
}

export const usersApi = new UsersApi(); 