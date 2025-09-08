import { apiService } from './client';

export interface RoleDTO {
  id: number;
  name: string;
  description?: string | null;
}

class RolesApi {
  async list(): Promise<RoleDTO[]> {
    const res = await apiService.get<RoleDTO[]>('/api/v1/roles/');
    return res.data;
  }
}

export const rolesApi = new RolesApi(); 