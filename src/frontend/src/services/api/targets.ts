import { apiService, API_ENDPOINTS } from './client';

export interface Target {
  id: string;
  name: string;
  url: string;
  type: 'web' | 'api' | 'network' | 'mobile';
  status: 'active' | 'inactive' | 'scanning' | 'error';
  lastScan?: string;
  vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTargetData {
  name: string;
  url: string;
  type: Target['type'];
  description?: string;
  tags?: string[];
}

export interface UpdateTargetData {
  name?: string;
  url?: string;
  type?: Target['type'];
  description?: string;
  tags?: string[];
  status?: Target['status'];
}

export interface TargetFilters {
  search?: string;
  status?: string;
  type?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface TargetStats {
  total: number;
  active: number;
  scanning: number;
  inactive: number;
  error: number;
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

class TargetsService {
  // Get all targets
  async getTargets(filters?: TargetFilters, pagination?: { page: number; limit: number }): Promise<{
    targets: Target[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const params = { ...filters, ...pagination };
    const response = await apiService.get<{ targets: Target[]; pagination: any }>(
      API_ENDPOINTS.TARGETS.LIST,
      params
    );
    
    return {
      targets: response.data.targets || response.data,
      pagination: response.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
    };
  }

  // Get target by ID
  async getTarget(id: string): Promise<Target> {
    const response = await apiService.get<Target>(API_ENDPOINTS.TARGETS.GET(id));
    return response.data;
  }

  // Create new target
  async createTarget(data: CreateTargetData): Promise<Target> {
    const response = await apiService.post<Target>(API_ENDPOINTS.TARGETS.CREATE, data);
    return response.data;
  }

  // Update target
  async updateTarget(id: string, data: UpdateTargetData): Promise<Target> {
    const response = await apiService.put<Target>(API_ENDPOINTS.TARGETS.UPDATE(id), data);
    return response.data;
  }

  // Delete target
  async deleteTarget(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.TARGETS.DELETE(id));
  }

  // Start scan on target
  async startScan(id: string, scanConfig?: any): Promise<{ scanId: string; status: string }> {
    const response = await apiService.post(API_ENDPOINTS.TARGETS.SCAN(id), scanConfig);
    return response.data;
  }

  // Get target vulnerabilities
  async getTargetVulnerabilities(id: string): Promise<{
    vulnerabilities: any[];
    stats: { critical: number; high: number; medium: number; low: number; total: number };
  }> {
    const response = await apiService.get(API_ENDPOINTS.TARGETS.VULNERABILITIES(id));
    return response.data;
  }

  // Get target statistics
  async getTargetStats(id: string): Promise<{
    scans: { total: number; completed: number; failed: number };
    vulnerabilities: { total: number; critical: number; high: number; medium: number; low: number };
    lastScan?: { id: string; status: string; completedAt: string };
  }> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.GET(id)}/stats`);
    return response.data;
  }

  // Get targets statistics
  async getTargetsStats(): Promise<TargetStats> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.LIST}/stats`);
    return response.data;
  }

  // Bulk operations
  async bulkUpdateTargets(ids: string[], updates: UpdateTargetData): Promise<void> {
    await apiService.post(`${API_ENDPOINTS.TARGETS.LIST}/bulk-update`, {
      ids,
      updates,
    });
  }

  async bulkDeleteTargets(ids: string[]): Promise<void> {
    await apiService.post(`${API_ENDPOINTS.TARGETS.LIST}/bulk-delete`, { ids });
  }

  async bulkStartScans(ids: string[], scanConfig?: any): Promise<{ scanIds: string[] }> {
    const response = await apiService.post(`${API_ENDPOINTS.TARGETS.LIST}/bulk-scan`, {
      ids,
      config: scanConfig,
    });
    return response.data;
  }

  // Export targets
  async exportTargets(format: 'csv' | 'json' | 'pdf', filters?: TargetFilters): Promise<void> {
    const params = { format, ...filters };
    await apiService.download(`${API_ENDPOINTS.TARGETS.LIST}/export`, params);
  }

  // Import targets
  async importTargets(file: File): Promise<{ imported: number; failed: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiService.post(`${API_ENDPOINTS.TARGETS.LIST}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  // Validate target URL
  async validateTarget(url: string): Promise<{
    valid: boolean;
    accessible: boolean;
    type?: string;
    error?: string;
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.TARGETS.LIST}/validate`, { url });
    return response.data;
  }

  // Get target types
  async getTargetTypes(): Promise<Array<{ value: string; label: string; description: string }>> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.LIST}/types`);
    return response.data;
  }

  // Get target tags
  async getTargetTags(): Promise<string[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.LIST}/tags`);
    return response.data;
  }

  // Search targets
  async searchTargets(query: string, filters?: TargetFilters): Promise<Target[]> {
    const params = { q: query, ...filters };
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.LIST}/search`, params);
    return response.data;
  }

  // Get targets by tag
  async getTargetsByTag(tag: string): Promise<Target[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.LIST}/by-tag/${tag}`);
    return response.data;
  }

  // Get targets by type
  async getTargetsByType(type: string): Promise<Target[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.LIST}/by-type/${type}`);
    return response.data;
  }

  // Get targets by status
  async getTargetsByStatus(status: string): Promise<Target[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.LIST}/by-status/${status}`);
    return response.data;
  }

  // Get recent targets
  async getRecentTargets(limit: number = 10): Promise<Target[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.LIST}/recent`, { limit });
    return response.data;
  }

  // Get targets with vulnerabilities
  async getTargetsWithVulnerabilities(severity?: string): Promise<Target[]> {
    const params = severity ? { severity } : {};
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.LIST}/with-vulnerabilities`, params);
    return response.data;
  }

  // Get targets without scans
  async getTargetsWithoutScans(): Promise<Target[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.LIST}/without-scans`);
    return response.data;
  }

  // Get targets with failed scans
  async getTargetsWithFailedScans(): Promise<Target[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.LIST}/with-failed-scans`);
    return response.data;
  }

  // Duplicate target
  async duplicateTarget(id: string, newName?: string): Promise<Target> {
    const response = await apiService.post(`${API_ENDPOINTS.TARGETS.GET(id)}/duplicate`, {
      name: newName,
    });
    return response.data;
  }

  // Archive target
  async archiveTarget(id: string): Promise<void> {
    await apiService.post(`${API_ENDPOINTS.TARGETS.GET(id)}/archive`);
  }

  // Restore target
  async restoreTarget(id: string): Promise<void> {
    await apiService.post(`${API_ENDPOINTS.TARGETS.GET(id)}/restore`);
  }

  // Get target history
  async getTargetHistory(id: string): Promise<Array<{
    action: string;
    timestamp: string;
    user: string;
    details: any;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.GET(id)}/history`);
    return response.data;
  }

  // Add target note
  async addTargetNote(id: string, note: string): Promise<void> {
    await apiService.post(`${API_ENDPOINTS.TARGETS.GET(id)}/notes`, { note });
  }

  // Get target notes
  async getTargetNotes(id: string): Promise<Array<{
    id: string;
    note: string;
    createdAt: string;
    user: string;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.TARGETS.GET(id)}/notes`);
    return response.data;
  }
}

// Create singleton instance
export const targetsService = new TargetsService();

export default targetsService; 