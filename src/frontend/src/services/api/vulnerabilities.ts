import { apiService, API_ENDPOINTS } from './client';

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'open' | 'in_progress' | 'resolved' | 'false_positive';
  cvss: number;
  cve?: string;
  target: string;
  targetName: string;
  discoveredAt: string;
  lastUpdated: string;
  assignedTo?: string;
  tags: string[];
  references?: string[];
  remediation?: string;
  affected: string;
  impact: string;
  evidence?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVulnerabilityData {
  title: string;
  description: string;
  severity: Vulnerability['severity'];
  target: string;
  affected: string;
  impact: string;
  remediation?: string;
  references?: string[];
  tags?: string[];
}

export interface UpdateVulnerabilityData {
  title?: string;
  description?: string;
  severity?: Vulnerability['severity'];
  status?: Vulnerability['status'];
  assignedTo?: string;
  remediation?: string;
  references?: string[];
  tags?: string[];
}

export interface VulnerabilityFilters {
  search?: string;
  severity?: string;
  status?: string;
  target?: string;
  assignedTo?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface VulnerabilityStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  open: number;
  inProgress: number;
  resolved: number;
  falsePositive: number;
}

class VulnerabilitiesService {
  // Get all vulnerabilities
  async getVulnerabilities(filters?: VulnerabilityFilters, pagination?: { page: number; limit: number }): Promise<{
    vulnerabilities: Vulnerability[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const params = { ...filters, ...pagination };
    const response = await apiService.get<{ vulnerabilities: Vulnerability[]; pagination: any }>(
      API_ENDPOINTS.VULNERABILITIES.LIST,
      params
    );
    
    return {
      vulnerabilities: response.data.vulnerabilities || response.data,
      pagination: response.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
    };
  }

  // Get vulnerability by ID
  async getVulnerability(id: string): Promise<Vulnerability> {
    const response = await apiService.get<Vulnerability>(API_ENDPOINTS.VULNERABILITIES.GET(id));
    return response.data;
  }

  // Create new vulnerability
  async createVulnerability(data: CreateVulnerabilityData): Promise<Vulnerability> {
    const response = await apiService.post<Vulnerability>(API_ENDPOINTS.VULNERABILITIES.CREATE, data);
    return response.data;
  }

  // Update vulnerability
  async updateVulnerability(id: string, data: UpdateVulnerabilityData): Promise<Vulnerability> {
    const response = await apiService.put<Vulnerability>(API_ENDPOINTS.VULNERABILITIES.UPDATE(id), data);
    return response.data;
  }

  // Delete vulnerability
  async deleteVulnerability(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.VULNERABILITIES.DELETE(id));
  }

  // Bulk operations
  async bulkUpdateVulnerabilities(ids: string[], updates: UpdateVulnerabilityData): Promise<void> {
    await apiService.post(API_ENDPOINTS.VULNERABILITIES.BULK_UPDATE, {
      ids,
      updates,
    });
  }

  async bulkDeleteVulnerabilities(ids: string[]): Promise<void> {
    await apiService.post(`${API_ENDPOINTS.VULNERABILITIES.LIST}/bulk-delete`, { ids });
  }

  // Change vulnerability status
  async changeStatus(id: string, status: string): Promise<void> {
    await apiService.patch(API_ENDPOINTS.VULNERABILITIES.UPDATE(id), { status });
  }

  // Assign vulnerability
  async assignVulnerability(id: string, assignedTo: string): Promise<void> {
    await apiService.patch(API_ENDPOINTS.VULNERABILITIES.UPDATE(id), { assignedTo });
  }

  // Add comment to vulnerability
  async addComment(id: string, comment: string): Promise<void> {
    await apiService.post(`${API_ENDPOINTS.VULNERABILITIES.GET(id)}/comments`, { comment });
  }

  // Get vulnerability comments
  async getComments(id: string): Promise<Array<{
    id: string;
    comment: string;
    createdAt: string;
    user: string;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.GET(id)}/comments`);
    return response.data;
  }

  // Export vulnerabilities
  async exportVulnerabilities(format: 'csv' | 'json' | 'pdf', filters?: VulnerabilityFilters): Promise<void> {
    const params = { format, ...filters };
    await apiService.download(API_ENDPOINTS.VULNERABILITIES.EXPORT, params);
  }

  // Get vulnerability statistics
  async getVulnerabilityStats(): Promise<VulnerabilityStats> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/stats`);
    return response.data;
  }

  // Get vulnerabilities by severity
  async getVulnerabilitiesBySeverity(severity: string): Promise<Vulnerability[]> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/by-severity/${severity}`);
    return response.data;
  }

  // Get vulnerabilities by status
  async getVulnerabilitiesByStatus(status: string): Promise<Vulnerability[]> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/by-status/${status}`);
    return response.data;
  }

  // Get vulnerabilities by target
  async getVulnerabilitiesByTarget(targetId: string): Promise<Vulnerability[]> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/by-target/${targetId}`);
    return response.data;
  }

  // Get vulnerabilities by assignee
  async getVulnerabilitiesByAssignee(assignedTo: string): Promise<Vulnerability[]> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/by-assignee/${assignedTo}`);
    return response.data;
  }

  // Get critical vulnerabilities
  async getCriticalVulnerabilities(): Promise<Vulnerability[]> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/critical`);
    return response.data;
  }

  // Get open vulnerabilities
  async getOpenVulnerabilities(): Promise<Vulnerability[]> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/open`);
    return response.data;
  }

  // Get vulnerabilities by tag
  async getVulnerabilitiesByTag(tag: string): Promise<Vulnerability[]> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/by-tag/${tag}`);
    return response.data;
  }

  // Search vulnerabilities
  async searchVulnerabilities(query: string, filters?: VulnerabilityFilters): Promise<Vulnerability[]> {
    const params = { q: query, ...filters };
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/search`, params);
    return response.data;
  }

  // Get vulnerability trends
  async getVulnerabilityTrends(period: 'day' | 'week' | 'month' | 'year'): Promise<Array<{
    date: string;
    vulnerabilities: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/trends`, { period });
    return response.data;
  }

  // Get vulnerability history
  async getVulnerabilityHistory(id: string): Promise<Array<{
    action: string;
    timestamp: string;
    user: string;
    details: any;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.GET(id)}/history`);
    return response.data;
  }

  // Validate CVE
  async validateCVE(cve: string): Promise<{
    valid: boolean;
    exists: boolean;
    details?: any;
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.VULNERABILITIES.LIST}/validate-cve`, { cve });
    return response.data;
  }

  // Get CVE details
  async getCVEDetails(cve: string): Promise<any> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/cve/${cve}`);
    return response.data;
  }

  // Get vulnerability templates
  async getVulnerabilityTemplates(): Promise<Array<{
    id: string;
    title: string;
    description: string;
    severity: string;
    remediation: string;
    references: string[];
    tags: string[];
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/templates`);
    return response.data;
  }

  // Create vulnerability template
  async createVulnerabilityTemplate(template: {
    title: string;
    description: string;
    severity: string;
    remediation: string;
    references: string[];
    tags: string[];
  }): Promise<{ id: string }> {
    const response = await apiService.post(`${API_ENDPOINTS.VULNERABILITIES.LIST}/templates`, template);
    return response.data;
  }

  // Get vulnerability tags
  async getVulnerabilityTags(): Promise<string[]> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/tags`);
    return response.data;
  }

  // Get vulnerability severities
  async getVulnerabilitySeverities(): Promise<Array<{
    value: string;
    label: string;
    color: string;
    count: number;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/severities`);
    return response.data;
  }

  // Get vulnerability statuses
  async getVulnerabilityStatuses(): Promise<Array<{
    value: string;
    label: string;
    color: string;
    count: number;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/statuses`);
    return response.data;
  }

  // Get recent vulnerabilities
  async getRecentVulnerabilities(limit: number = 10): Promise<Vulnerability[]> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/recent`, { limit });
    return response.data;
  }

  // Get vulnerability comparison
  async compareVulnerabilities(vulnerabilityIds: string[]): Promise<{
    common: any[];
    unique: Record<string, any[]>;
    summary: Record<string, any>;
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.VULNERABILITIES.LIST}/compare`, { vulnerabilityIds });
    return response.data;
  }

  // Get vulnerability metrics
  async getVulnerabilityMetrics(): Promise<{
    totalVulnerabilities: number;
    averageCVSS: number;
    mostCommonSeverity: string;
    mostCommonStatus: string;
    topTags: Array<{ tag: string; count: number }>;
    topTargets: Array<{ target: string; count: number }>;
  }> {
    const response = await apiService.get(`${API_ENDPOINTS.VULNERABILITIES.LIST}/metrics`);
    return response.data;
  }
}

// Create singleton instance
export const vulnerabilitiesService = new VulnerabilitiesService();

export default vulnerabilitiesService; 