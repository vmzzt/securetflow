import { apiService } from './client';

export type VulnerabilitySeverity = 'critical' | 'high' | 'medium' | 'low';
export type VulnerabilityStatus = 'open' | 'in-progress' | 'resolved' | 'false-positive';

export interface VulnerabilityDTO {
  id: number;
  title: string;
  description?: string | null;
  severity: VulnerabilitySeverity;
  category?: string | null;
  cvss?: number | null;
  status: VulnerabilityStatus;
  solution?: string | null;
  references?: string[] | null;
  cve?: string | null;
  target_id?: number | null;
  user_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface VulnerabilityCreateDTO {
  title: string;
  description?: string;
  severity: VulnerabilitySeverity;
  category?: string;
  cvss?: number;
  status?: VulnerabilityStatus;
  solution?: string;
  references?: string[];
  cve?: string;
  target_id?: number;
}

export interface VulnerabilityUpdateDTO extends Partial<VulnerabilityCreateDTO> {}

class VulnerabilitiesApi {
  async list(params?: { skip?: number; limit?: number; severity?: VulnerabilitySeverity; status?: VulnerabilityStatus; target_id?: number; }): Promise<VulnerabilityDTO[]> {
    const res = await apiService.get<VulnerabilityDTO[]>('/api/v1/vulnerabilities/', params);
    return res.data;
  }

  async get(id: number): Promise<VulnerabilityDTO> {
    const res = await apiService.get<VulnerabilityDTO>(`/api/v1/vulnerabilities/${id}`);
    return res.data;
  }

  async create(payload: VulnerabilityCreateDTO): Promise<VulnerabilityDTO> {
    const res = await apiService.post<VulnerabilityDTO>('/api/v1/vulnerabilities/', payload);
    return res.data;
  }

  async update(id: number, payload: VulnerabilityUpdateDTO): Promise<VulnerabilityDTO> {
    const res = await apiService.put<VulnerabilityDTO>(`/api/v1/vulnerabilities/${id}`, payload);
    return res.data;
  }

  async remove(id: number): Promise<{ message: string }> {
    const res = await apiService.delete<{ message: string }>(`/api/v1/vulnerabilities/${id}`);
    return res.data;
  }
}

export const vulnerabilitiesApi = new VulnerabilitiesApi(); 