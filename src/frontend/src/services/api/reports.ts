import { apiService } from './client';

export type ReportStatus = 'draft' | 'published' | 'archived';

export interface ReportDTO {
  id: number;
  title: string;
  description?: string | null;
  report_type: 'vulnerability' | 'compliance' | 'audit' | 'custom';
  status: ReportStatus;
  content?: Record<string, any> | null;
  user_id?: number | null;
  scan_id?: number | null;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
}

export interface ReportCreateDTO {
  title: string;
  description?: string;
  report_type: 'vulnerability' | 'compliance' | 'audit' | 'custom';
  content?: Record<string, any>;
  scan_id?: number;
}

export interface ReportUpdateDTO extends Partial<ReportCreateDTO> {}

class ReportsApi {
  async list(params?: { skip?: number; limit?: number; report_type?: string; target_id?: number }): Promise<ReportDTO[]> {
    const res = await apiService.get<ReportDTO[]>('/api/v1/reports/', params);
    return res.data;
  }

  async get(id: number): Promise<ReportDTO> {
    const res = await apiService.get<ReportDTO>(`/api/v1/reports/${id}`);
    return res.data;
  }

  async create(payload: ReportCreateDTO): Promise<ReportDTO> {
    const res = await apiService.post<ReportDTO>('/api/v1/reports/', payload);
    return res.data;
  }

  async update(id: number, payload: ReportUpdateDTO): Promise<ReportDTO> {
    const res = await apiService.put<ReportDTO>(`/api/v1/reports/${id}`, payload);
    return res.data;
  }

  async remove(id: number): Promise<{ message: string }> {
    const res = await apiService.delete<{ message: string }>(`/api/v1/reports/${id}`);
    return res.data;
  }
}

export const reportsApi = new ReportsApi(); 