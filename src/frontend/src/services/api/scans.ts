import { apiService, API_ENDPOINTS } from './client';

export interface Scan {
  id: string;
  name: string;
  target: string;
  targetName: string;
  type: 'vulnerability' | 'port' | 'web' | 'api' | 'custom';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  tools: string[];
  description?: string;
  config: Record<string, any>;
  logs?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateScanData {
  name: string;
  target: string;
  type: Scan['type'];
  tools?: string[];
  description?: string;
  config?: Record<string, any>;
}

export interface UpdateScanData {
  name?: string;
  description?: string;
  config?: Record<string, any>;
}

export interface ScanFilters {
  search?: string;
  status?: string;
  type?: string;
  target?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ScanStats {
  total: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
  paused: number;
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

class ScansService {
  // Get all scans
  async getScans(filters?: ScanFilters, pagination?: { page: number; limit: number }): Promise<{
    scans: Scan[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const params = { ...filters, ...pagination };
    const response = await apiService.get<{ scans: Scan[]; pagination: any }>(
      API_ENDPOINTS.SCANS.LIST,
      params
    );
    
    return {
      scans: response.data.scans || response.data,
      pagination: response.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
    };
  }

  // Get scan by ID
  async getScan(id: string): Promise<Scan> {
    const response = await apiService.get<Scan>(API_ENDPOINTS.SCANS.GET(id));
    return response.data;
  }

  // Create new scan
  async createScan(data: CreateScanData): Promise<Scan> {
    const response = await apiService.post<Scan>(API_ENDPOINTS.SCANS.CREATE, data);
    return response.data;
  }

  // Update scan
  async updateScan(id: string, data: UpdateScanData): Promise<Scan> {
    const response = await apiService.put<Scan>(API_ENDPOINTS.SCANS.UPDATE(id), data);
    return response.data;
  }

  // Delete scan
  async deleteScan(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.SCANS.DELETE(id));
  }

  // Start scan
  async startScan(id: string): Promise<{ status: string; message: string }> {
    const response = await apiService.post(API_ENDPOINTS.SCANS.START(id));
    return response.data;
  }

  // Stop scan
  async stopScan(id: string): Promise<{ status: string; message: string }> {
    const response = await apiService.post(API_ENDPOINTS.SCANS.STOP(id));
    return response.data;
  }

  // Pause scan
  async pauseScan(id: string): Promise<{ status: string; message: string }> {
    const response = await apiService.post(API_ENDPOINTS.SCANS.PAUSE(id));
    return response.data;
  }

  // Resume scan
  async resumeScan(id: string): Promise<{ status: string; message: string }> {
    const response = await apiService.post(API_ENDPOINTS.SCANS.RESUME(id));
    return response.data;
  }

  // Get scan results
  async getScanResults(id: string): Promise<{
    vulnerabilities: any[];
    summary: {
      total: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    scanInfo: {
      duration: string;
      tools: string[];
      config: Record<string, any>;
    };
  }> {
    const response = await apiService.get(API_ENDPOINTS.SCANS.RESULTS(id));
    return response.data;
  }

  // Get scan logs
  async getScanLogs(id: string): Promise<Array<{
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'debug';
    message: string;
    tool?: string;
  }>> {
    const response = await apiService.get(API_ENDPOINTS.SCANS.LOGS(id));
    return response.data;
  }

  // Get scan statistics
  async getScanStats(id: string): Promise<{
    progress: number;
    currentTool?: string;
    estimatedTime?: string;
    vulnerabilitiesFound: number;
    errors: number;
    warnings: number;
  }> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.GET(id)}/stats`);
    return response.data;
  }

  // Get scans statistics
  async getScansStats(): Promise<ScanStats> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/stats`);
    return response.data;
  }

  // Bulk operations
  async bulkStartScans(ids: string[]): Promise<{ started: number; failed: number; errors: string[] }> {
    const response = await apiService.post(`${API_ENDPOINTS.SCANS.LIST}/bulk-start`, { ids });
    return response.data;
  }

  async bulkStopScans(ids: string[]): Promise<{ stopped: number; failed: number; errors: string[] }> {
    const response = await apiService.post(`${API_ENDPOINTS.SCANS.LIST}/bulk-stop`, { ids });
    return response.data;
  }

  async bulkDeleteScans(ids: string[]): Promise<{ deleted: number; failed: number; errors: string[] }> {
    const response = await apiService.post(`${API_ENDPOINTS.SCANS.LIST}/bulk-delete`, { ids });
    return response.data;
  }

  // Export scan results
  async exportScanResults(id: string, format: 'pdf' | 'html' | 'json' | 'csv'): Promise<void> {
    const params = { format };
    await apiService.download(`${API_ENDPOINTS.SCANS.RESULTS(id)}/export`, params);
  }

  // Export scan logs
  async exportScanLogs(id: string, format: 'txt' | 'json'): Promise<void> {
    const params = { format };
    await apiService.download(`${API_ENDPOINTS.SCANS.LOGS(id)}/export`, params);
  }

  // Duplicate scan
  async duplicateScan(id: string, newName?: string): Promise<Scan> {
    const response = await apiService.post(`${API_ENDPOINTS.SCANS.GET(id)}/duplicate`, {
      name: newName,
    });
    return response.data;
  }

  // Schedule scan
  async scheduleScan(id: string, schedule: {
    type: 'once' | 'daily' | 'weekly' | 'monthly';
    startDate: string;
    startTime: string;
    timezone: string;
    enabled: boolean;
  }): Promise<{ scheduleId: string }> {
    const response = await apiService.post(`${API_ENDPOINTS.SCANS.GET(id)}/schedule`, schedule);
    return response.data;
  }

  // Get scan schedule
  async getScanSchedule(id: string): Promise<{
    scheduleId: string;
    type: string;
    startDate: string;
    startTime: string;
    timezone: string;
    enabled: boolean;
    nextRun?: string;
  }> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.GET(id)}/schedule`);
    return response.data;
  }

  // Update scan schedule
  async updateScanSchedule(id: string, schedule: {
    type?: string;
    startDate?: string;
    startTime?: string;
    timezone?: string;
    enabled?: boolean;
  }): Promise<void> {
    await apiService.put(`${API_ENDPOINTS.SCANS.GET(id)}/schedule`, schedule);
  }

  // Delete scan schedule
  async deleteScanSchedule(id: string): Promise<void> {
    await apiService.delete(`${API_ENDPOINTS.SCANS.GET(id)}/schedule`);
  }

  // Get scan templates
  async getScanTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    tools: string[];
    config: Record<string, any>;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/templates`);
    return response.data;
  }

  // Create scan template
  async createScanTemplate(template: {
    name: string;
    description: string;
    type: string;
    tools: string[];
    config: Record<string, any>;
  }): Promise<{ id: string }> {
    const response = await apiService.post(`${API_ENDPOINTS.SCANS.LIST}/templates`, template);
    return response.data;
  }

  // Get scan types
  async getScanTypes(): Promise<Array<{
    value: string;
    label: string;
    description: string;
    tools: string[];
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/types`);
    return response.data;
  }

  // Get available tools
  async getAvailableTools(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    version: string;
    status: string;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/tools`);
    return response.data;
  }

  // Validate scan configuration
  async validateScanConfig(config: Record<string, any>): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.SCANS.LIST}/validate-config`, config);
    return response.data;
  }

  // Get scan history
  async getScanHistory(id: string): Promise<Array<{
    action: string;
    timestamp: string;
    user: string;
    details: any;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.GET(id)}/history`);
    return response.data;
  }

  // Get recent scans
  async getRecentScans(limit: number = 10): Promise<Scan[]> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/recent`, { limit });
    return response.data;
  }

  // Get scans by status
  async getScansByStatus(status: string): Promise<Scan[]> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/by-status/${status}`);
    return response.data;
  }

  // Get scans by type
  async getScansByType(type: string): Promise<Scan[]> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/by-type/${type}`);
    return response.data;
  }

  // Get scans by target
  async getScansByTarget(targetId: string): Promise<Scan[]> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/by-target/${targetId}`);
    return response.data;
  }

  // Get failed scans
  async getFailedScans(): Promise<Scan[]> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/failed`);
    return response.data;
  }

  // Get completed scans
  async getCompletedScans(): Promise<Scan[]> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/completed`);
    return response.data;
  }

  // Get running scans
  async getRunningScans(): Promise<Scan[]> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/running`);
    return response.data;
  }

  // Search scans
  async searchScans(query: string, filters?: ScanFilters): Promise<Scan[]> {
    const params = { q: query, ...filters };
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/search`, params);
    return response.data;
  }

  // Get scan comparison
  async compareScans(scanIds: string[]): Promise<{
    commonVulnerabilities: any[];
    uniqueVulnerabilities: Record<string, any[]>;
    summary: Record<string, any>;
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.SCANS.LIST}/compare`, { scanIds });
    return response.data;
  }

  // Get scan trends
  async getScanTrends(period: 'day' | 'week' | 'month' | 'year'): Promise<Array<{
    date: string;
    scans: number;
    vulnerabilities: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.SCANS.LIST}/trends`, { period });
    return response.data;
  }
}

// Create singleton instance
export const scansService = new ScansService();

export default scansService; 