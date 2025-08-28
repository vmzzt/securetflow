import { apiService, API_ENDPOINTS } from './client';

export interface AnalyticsData {
  id: string;
  type: 'dashboard' | 'vulnerabilities' | 'scans' | 'targets' | 'reports' | 'performance';
  data: Record<string, any>;
  timestamp: string;
  period: 'hour' | 'day' | 'week' | 'month' | 'year';
}

export interface DashboardMetrics {
  totalTargets: number;
  activeScans: number;
  criticalVulnerabilities: number;
  totalReports: number;
  systemHealth: number;
  lastScanTime?: string;
  uptime: number;
}

export interface VulnerabilityTrends {
  period: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface ScanAnalytics {
  totalScans: number;
  successfulScans: number;
  failedScans: number;
  averageDuration: number;
  scansByType: Record<string, number>;
  scansByStatus: Record<string, number>;
  recentScans: Array<{
    id: string;
    target: string;
    status: string;
    duration: number;
    vulnerabilities: number;
    timestamp: string;
  }>;
}

export interface TargetAnalytics {
  totalTargets: number;
  activeTargets: number;
  inactiveTargets: number;
  targetsByType: Record<string, number>;
  targetsByStatus: Record<string, number>;
  topTargets: Array<{
    id: string;
    name: string;
    vulnerabilities: number;
    lastScan: string;
    status: string;
  }>;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  period?: 'hour' | 'day' | 'week' | 'month' | 'year';
  type?: string;
  target?: string;
}

class AnalyticsService {
  // Get dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await apiService.get<DashboardMetrics>(API_ENDPOINTS.ANALYTICS.DASHBOARD);
    return response.data;
  }

  // Get vulnerability trends
  async getVulnerabilityTrends(period: string = 'month'): Promise<VulnerabilityTrends[]> {
    const response = await apiService.get<VulnerabilityTrends[]>(
      `${API_ENDPOINTS.ANALYTICS.VULNERABILITIES}/trends`,
      { period }
    );
    return response.data;
  }

  // Get scan analytics
  async getScanAnalytics(filters?: AnalyticsFilters): Promise<ScanAnalytics> {
    const response = await apiService.get<ScanAnalytics>(
      API_ENDPOINTS.ANALYTICS.SCANS,
      filters
    );
    return response.data;
  }

  // Get target analytics
  async getTargetAnalytics(filters?: AnalyticsFilters): Promise<TargetAnalytics> {
    const response = await apiService.get<TargetAnalytics>(
      API_ENDPOINTS.ANALYTICS.TARGETS,
      filters
    );
    return response.data;
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const response = await apiService.get<PerformanceMetrics>(
      API_ENDPOINTS.ANALYTICS.PERFORMANCE
    );
    return response.data;
  }

  // Get custom analytics
  async getCustomAnalytics(type: string, filters?: AnalyticsFilters): Promise<AnalyticsData> {
    const response = await apiService.get<AnalyticsData>(
      `${API_ENDPOINTS.ANALYTICS.CUSTOM}/${type}`,
      filters
    );
    return response.data;
  }

  // Get analytics by date range
  async getAnalyticsByDateRange(
    startDate: string,
    endDate: string,
    type?: string
  ): Promise<AnalyticsData[]> {
    const params = { startDate, endDate, type };
    const response = await apiService.get<AnalyticsData[]>(
      API_ENDPOINTS.ANALYTICS.DATE_RANGE,
      params
    );
    return response.data;
  }

  // Get real-time analytics
  async getRealTimeAnalytics(): Promise<{
    activeUsers: number;
    activeScans: number;
    systemLoad: number;
    recentActivity: Array<{
      type: string;
      description: string;
      timestamp: string;
    }>;
  }> {
    const response = await apiService.get(API_ENDPOINTS.ANALYTICS.REAL_TIME);
    return response.data;
  }

  // Get analytics summary
  async getAnalyticsSummary(period: string = 'month'): Promise<{
    overview: DashboardMetrics;
    trends: VulnerabilityTrends[];
    performance: PerformanceMetrics;
    insights: Array<{
      type: string;
      title: string;
      description: string;
      severity: 'info' | 'warning' | 'critical';
    }>;
  }> {
    const response = await apiService.get(
      `${API_ENDPOINTS.ANALYTICS.SUMMARY}`,
      { period }
    );
    return response.data;
  }

  // Export analytics data
  async exportAnalytics(
    type: string,
    format: 'csv' | 'json' | 'pdf',
    filters?: AnalyticsFilters
  ): Promise<void> {
    const params = { type, format, ...filters };
    await apiService.download(API_ENDPOINTS.ANALYTICS.EXPORT, params);
  }

  // Get analytics configuration
  async getAnalyticsConfig(): Promise<{
    enabled: boolean;
    retentionDays: number;
    autoExport: boolean;
    exportSchedule: string;
    metrics: string[];
  }> {
    const response = await apiService.get(API_ENDPOINTS.ANALYTICS.CONFIG);
    return response.data;
  }

  // Update analytics configuration
  async updateAnalyticsConfig(config: {
    enabled?: boolean;
    retentionDays?: number;
    autoExport?: boolean;
    exportSchedule?: string;
    metrics?: string[];
  }): Promise<void> {
    await apiService.put(API_ENDPOINTS.ANALYTICS.CONFIG, config);
  }

  // Get analytics alerts
  async getAnalyticsAlerts(): Promise<Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
    acknowledged: boolean;
  }>> {
    const response = await apiService.get(API_ENDPOINTS.ANALYTICS.ALERTS);
    return response.data;
  }

  // Acknowledge analytics alert
  async acknowledgeAlert(alertId: string): Promise<void> {
    await apiService.post(`${API_ENDPOINTS.ANALYTICS.ALERTS}/${alertId}/acknowledge`);
  }

  // Get analytics reports
  async getAnalyticsReports(): Promise<Array<{
    id: string;
    name: string;
    type: string;
    schedule: string;
    lastGenerated?: string;
    nextGeneration?: string;
    enabled: boolean;
  }>> {
    const response = await apiService.get(API_ENDPOINTS.ANALYTICS.REPORTS);
    return response.data;
  }

  // Create analytics report
  async createAnalyticsReport(report: {
    name: string;
    type: string;
    schedule: string;
    filters?: AnalyticsFilters;
  }): Promise<{ id: string }> {
    const response = await apiService.post(API_ENDPOINTS.ANALYTICS.REPORTS, report);
    return response.data;
  }

  // Update analytics report
  async updateAnalyticsReport(
    reportId: string,
    updates: {
      name?: string;
      schedule?: string;
      filters?: AnalyticsFilters;
      enabled?: boolean;
    }
  ): Promise<void> {
    await apiService.put(`${API_ENDPOINTS.ANALYTICS.REPORTS}/${reportId}`, updates);
  }

  // Delete analytics report
  async deleteAnalyticsReport(reportId: string): Promise<void> {
    await apiService.delete(`${API_ENDPOINTS.ANALYTICS.REPORTS}/${reportId}`);
  }

  // Generate analytics report
  async generateAnalyticsReport(reportId: string): Promise<{ reportUrl: string }> {
    const response = await apiService.post(
      `${API_ENDPOINTS.ANALYTICS.REPORTS}/${reportId}/generate`
    );
    return response.data;
  }

  // Get analytics insights
  async getAnalyticsInsights(): Promise<Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    confidence: number;
    recommendations: string[];
    timestamp: string;
  }>> {
    const response = await apiService.get(API_ENDPOINTS.ANALYTICS.INSIGHTS);
    return response.data;
  }

  // Get analytics comparison
  async getAnalyticsComparison(
    period1: { start: string; end: string },
    period2: { start: string; end: string },
    metrics: string[]
  ): Promise<{
    period1: Record<string, number>;
    period2: Record<string, number>;
    changes: Record<string, { value: number; percentage: number; trend: 'up' | 'down' | 'stable' }>;
  }> {
    const params = { period1, period2, metrics };
    const response = await apiService.post(API_ENDPOINTS.ANALYTICS.COMPARISON, params);
    return response.data;
  }

  // Get analytics forecast
  async getAnalyticsForecast(
    metric: string,
    periods: number = 30
  ): Promise<Array<{
    date: string;
    predicted: number;
    confidence: number;
  }>> {
    const params = { metric, periods };
    const response = await apiService.get(API_ENDPOINTS.ANALYTICS.FORECAST, params);
    return response.data;
  }

  // Get analytics anomalies
  async getAnalyticsAnomalies(
    metric: string,
    threshold: number = 2.0
  ): Promise<Array<{
    timestamp: string;
    value: number;
    expected: number;
    deviation: number;
    severity: 'low' | 'medium' | 'high';
  }>> {
    const params = { metric, threshold };
    const response = await apiService.get(API_ENDPOINTS.ANALYTICS.ANOMALIES, params);
    return response.data;
  }

  // Track custom event
  async trackEvent(event: {
    name: string;
    category: string;
    properties?: Record<string, any>;
    timestamp?: string;
  }): Promise<void> {
    await apiService.post(API_ENDPOINTS.ANALYTICS.TRACK, event);
  }

  // Get user analytics
  async getUserAnalytics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userEngagement: number;
    topUsers: Array<{
      id: string;
      name: string;
      activity: number;
      lastActive: string;
    }>;
  }> {
    const response = await apiService.get(API_ENDPOINTS.ANALYTICS.USERS);
    return response.data;
  }

  // Get security analytics
  async getSecurityAnalytics(): Promise<{
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    recentThreats: Array<{
      type: string;
      severity: string;
      description: string;
      timestamp: string;
    }>;
    securityScore: number;
    recommendations: string[];
  }> {
    const response = await apiService.get(API_ENDPOINTS.ANALYTICS.SECURITY);
    return response.data;
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

export default analyticsService; 