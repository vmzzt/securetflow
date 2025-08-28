import { apiService, API_ENDPOINTS } from './client';

export interface Report {
  id: string;
  title: string;
  type: 'executive' | 'technical' | 'compliance' | 'custom';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  target: string;
  targetName: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  description?: string;
  tags: string[];
  format: 'pdf' | 'html' | 'docx' | 'json';
  template?: string;
  sections?: string[];
  data?: Record<string, any>;
}

export interface CreateReportData {
  title: string;
  type: Report['type'];
  target: string;
  description?: string;
  tags?: string[];
  format?: Report['format'];
  template?: string;
  sections?: string[];
}

export interface UpdateReportData {
  title?: string;
  description?: string;
  tags?: string[];
  format?: Report['format'];
  template?: string;
  sections?: string[];
}

export interface ReportFilters {
  search?: string;
  type?: string;
  status?: string;
  target?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ReportStats {
  total: number;
  draft: number;
  inProgress: number;
  completed: number;
  archived: number;
  executive: number;
  technical: number;
  compliance: number;
  custom: number;
}

class ReportsService {
  // Get all reports
  async getReports(filters?: ReportFilters, pagination?: { page: number; limit: number }): Promise<{
    reports: Report[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const params = { ...filters, ...pagination };
    const response = await apiService.get<{ reports: Report[]; pagination: any }>(
      API_ENDPOINTS.REPORTS.LIST,
      params
    );
    
    return {
      reports: response.data.reports || response.data,
      pagination: response.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
    };
  }

  // Get report by ID
  async getReport(id: string): Promise<Report> {
    const response = await apiService.get<Report>(API_ENDPOINTS.REPORTS.GET(id));
    return response.data;
  }

  // Create new report
  async createReport(data: CreateReportData): Promise<Report> {
    const response = await apiService.post<Report>(API_ENDPOINTS.REPORTS.CREATE, data);
    return response.data;
  }

  // Update report
  async updateReport(id: string, data: UpdateReportData): Promise<Report> {
    const response = await apiService.put<Report>(API_ENDPOINTS.REPORTS.UPDATE(id), data);
    return response.data;
  }

  // Delete report
  async deleteReport(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.REPORTS.DELETE(id));
  }

  // Generate report
  async generateReport(id: string): Promise<{ status: string; message: string }> {
    const response = await apiService.post(API_ENDPOINTS.REPORTS.GENERATE, { reportId: id });
    return response.data;
  }

  // Export report
  async exportReport(id: string, format: 'pdf' | 'html' | 'docx' | 'json'): Promise<void> {
    const params = { format };
    await apiService.download(API_ENDPOINTS.REPORTS.EXPORT(id), params);
  }

  // Duplicate report
  async duplicateReport(id: string, newName?: string): Promise<Report> {
    const response = await apiService.post(`${API_ENDPOINTS.REPORTS.GET(id)}/duplicate`, {
      name: newName,
    });
    return response.data;
  }

  // Archive report
  async archiveReport(id: string): Promise<void> {
    await apiService.post(`${API_ENDPOINTS.REPORTS.GET(id)}/archive`);
  }

  // Restore report
  async restoreReport(id: string): Promise<void> {
    await apiService.post(`${API_ENDPOINTS.REPORTS.GET(id)}/restore`);
  }

  // Get report templates
  async getReportTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    sections: string[];
    config: Record<string, any>;
  }>> {
    const response = await apiService.get(API_ENDPOINTS.REPORTS.TEMPLATES);
    return response.data;
  }

  // Create report template
  async createReportTemplate(template: {
    name: string;
    description: string;
    type: string;
    sections: string[];
    config: Record<string, any>;
  }): Promise<{ id: string }> {
    const response = await apiService.post(API_ENDPOINTS.REPORTS.TEMPLATES, template);
    return response.data;
  }

  // Get report types
  async getReportTypes(): Promise<Array<{
    value: string;
    label: string;
    description: string;
    templates: string[];
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/types`);
    return response.data;
  }

  // Get report formats
  async getReportFormats(): Promise<Array<{
    value: string;
    label: string;
    description: string;
    supported: boolean;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/formats`);
    return response.data;
  }

  // Get report statistics
  async getReportStats(): Promise<ReportStats> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/stats`);
    return response.data;
  }

  // Get reports by type
  async getReportsByType(type: string): Promise<Report[]> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/by-type/${type}`);
    return response.data;
  }

  // Get reports by status
  async getReportsByStatus(status: string): Promise<Report[]> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/by-status/${status}`);
    return response.data;
  }

  // Get reports by target
  async getReportsByTarget(targetId: string): Promise<Report[]> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/by-target/${targetId}`);
    return response.data;
  }

  // Get reports by author
  async getReportsByAuthor(author: string): Promise<Report[]> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/by-author/${author}`);
    return response.data;
  }

  // Get completed reports
  async getCompletedReports(): Promise<Report[]> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/completed`);
    return response.data;
  }

  // Get draft reports
  async getDraftReports(): Promise<Report[]> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/draft`);
    return response.data;
  }

  // Get reports by tag
  async getReportsByTag(tag: string): Promise<Report[]> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/by-tag/${tag}`);
    return response.data;
  }

  // Search reports
  async searchReports(query: string, filters?: ReportFilters): Promise<Report[]> {
    const params = { q: query, ...filters };
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/search`, params);
    return response.data;
  }

  // Get recent reports
  async getRecentReports(limit: number = 10): Promise<Report[]> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/recent`, { limit });
    return response.data;
  }

  // Get report history
  async getReportHistory(id: string): Promise<Array<{
    action: string;
    timestamp: string;
    user: string;
    details: any;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.GET(id)}/history`);
    return response.data;
  }

  // Get report preview
  async getReportPreview(id: string): Promise<{
    content: string;
    sections: Array<{
      id: string;
      title: string;
      content: string;
    }>;
  }> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.GET(id)}/preview`);
    return response.data;
  }

  // Validate report configuration
  async validateReportConfig(config: Record<string, any>): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.REPORTS.LIST}/validate-config`, config);
    return response.data;
  }

  // Get report sections
  async getReportSections(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    required: boolean;
    configurable: boolean;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/sections`);
    return response.data;
  }

  // Get report tags
  async getReportTags(): Promise<string[]> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/tags`);
    return response.data;
  }

  // Bulk operations
  async bulkDeleteReports(ids: string[]): Promise<{ deleted: number; failed: number; errors: string[] }> {
    const response = await apiService.post(`${API_ENDPOINTS.REPORTS.LIST}/bulk-delete`, { ids });
    return response.data;
  }

  async bulkExportReports(ids: string[], format: string): Promise<void> {
    const params = { ids, format };
    await apiService.download(`${API_ENDPOINTS.REPORTS.LIST}/bulk-export`, params);
  }

  async bulkArchiveReports(ids: string[]): Promise<{ archived: number; failed: number; errors: string[] }> {
    const response = await apiService.post(`${API_ENDPOINTS.REPORTS.LIST}/bulk-archive`, { ids });
    return response.data;
  }

  // Get report metrics
  async getReportMetrics(): Promise<{
    totalReports: number;
    averageGenerationTime: number;
    mostCommonType: string;
    mostCommonFormat: string;
    topAuthors: Array<{ author: string; count: number }>;
    topTargets: Array<{ target: string; count: number }>;
  }> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/metrics`);
    return response.data;
  }

  // Get report trends
  async getReportTrends(period: 'day' | 'week' | 'month' | 'year'): Promise<Array<{
    date: string;
    reports: number;
    completed: number;
    inProgress: number;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.LIST}/trends`, { period });
    return response.data;
  }

  // Schedule report generation
  async scheduleReport(id: string, schedule: {
    type: 'once' | 'daily' | 'weekly' | 'monthly';
    startDate: string;
    startTime: string;
    timezone: string;
    enabled: boolean;
  }): Promise<{ scheduleId: string }> {
    const response = await apiService.post(`${API_ENDPOINTS.REPORTS.GET(id)}/schedule`, schedule);
    return response.data;
  }

  // Get report schedule
  async getReportSchedule(id: string): Promise<{
    scheduleId: string;
    type: string;
    startDate: string;
    startTime: string;
    timezone: string;
    enabled: boolean;
    nextRun?: string;
  }> {
    const response = await apiService.get(`${API_ENDPOINTS.REPORTS.GET(id)}/schedule`);
    return response.data;
  }

  // Update report schedule
  async updateReportSchedule(id: string, schedule: {
    type?: string;
    startDate?: string;
    startTime?: string;
    timezone?: string;
    enabled?: boolean;
  }): Promise<void> {
    await apiService.put(`${API_ENDPOINTS.REPORTS.GET(id)}/schedule`, schedule);
  }

  // Delete report schedule
  async deleteReportSchedule(id: string): Promise<void> {
    await apiService.delete(`${API_ENDPOINTS.REPORTS.GET(id)}/schedule`);
  }
}

// Create singleton instance
export const reportsService = new ReportsService();

export default reportsService; 