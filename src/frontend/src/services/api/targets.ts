import { apiService } from './client';

export interface TargetDTO {
  id: number;
  name: string;
  host: string;
  port?: number | null;
  protocol: string;
  description?: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TargetCreateDTO {
  name: string;
  host: string;
  port?: number;
  protocol: string;
  description?: string;
}

export interface TargetUpdateDTO {
  name?: string;
  host?: string;
  port?: number;
  protocol?: string;
  description?: string;
}

class TargetsApi {
  async list(): Promise<TargetDTO[]> {
    const res = await apiService.get<TargetDTO[]>('/api/v1/targets/');
    return res.data;
  }

  async get(id: number): Promise<TargetDTO> {
    const res = await apiService.get<TargetDTO>(`/api/v1/targets/${id}`);
    return res.data;
  }

  async create(payload: TargetCreateDTO): Promise<TargetDTO> {
    const res = await apiService.post<TargetDTO>('/api/v1/targets/', payload);
    return res.data;
  }

  async update(id: number, payload: TargetUpdateDTO): Promise<TargetDTO> {
    const res = await apiService.put<TargetDTO>(`/api/v1/targets/${id}`, payload);
    return res.data;
  }

  async remove(id: number): Promise<{ message: string }> {
    const res = await apiService.delete<{ message: string }>(`/api/v1/targets/${id}`);
    return res.data;
  }
}

export const targetsApi = new TargetsApi(); 