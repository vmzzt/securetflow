import { apiService } from './client';

export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
export type ScanType = 'vulnerability' | 'penetration' | 'compliance' | 'custom';

export interface ScanDTO {
  id: number;
  name: string;
  description?: string | null;
  target_id: number;
  user_id: number;
  scan_type: ScanType;
  status: ScanStatus;
  created_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  progress?: number | null;
  config?: Record<string, any> | null;
}

export interface ScanCreateDTO {
  name: string;
  description?: string;
  target_id: number;
  scan_type?: ScanType;
  config?: Record<string, any>;
}

export interface ScanUpdateDTO {
  name?: string;
  description?: string;
  scan_type?: ScanType;
  config?: Record<string, any>;
}

class ScansApi {
  async list(): Promise<ScanDTO[]> {
    const res = await apiService.get<ScanDTO[]>('/api/v1/scans/');
    return res.data;
    }

  async get(id: number): Promise<ScanDTO> {
    const res = await apiService.get<ScanDTO>(`/api/v1/scans/${id}`);
    return res.data;
  }

  async create(payload: ScanCreateDTO): Promise<ScanDTO> {
    const res = await apiService.post<ScanDTO>('/api/v1/scans/', payload);
    return res.data;
  }

  async update(id: number, payload: ScanUpdateDTO): Promise<ScanDTO> {
    const res = await apiService.put<ScanDTO>(`/api/v1/scans/${id}`, payload);
    return res.data;
  }

  async remove(id: number): Promise<{ message: string }> {
    const res = await apiService.delete<{ message: string }>(`/api/v1/scans/${id}`);
    return res.data;
  }

  async start(id: number): Promise<{ message: string }> {
    const res = await apiService.post<{ message: string }>(`/api/v1/scans/${id}/start`);
    return res.data;
  }

  async stop(id: number): Promise<{ message: string }> {
    const res = await apiService.post<{ message: string }>(`/api/v1/scans/${id}/stop`);
    return res.data;
  }
}

export const scansApi = new ScansApi(); 