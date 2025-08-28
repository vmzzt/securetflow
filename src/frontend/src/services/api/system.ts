import { apiService, API_ENDPOINTS } from './client';

export interface SystemInfo {
  version: string;
  build: string;
  environment: 'development' | 'staging' | 'production';
  uptime: number;
  startTime: string;
  nodeVersion: string;
  platform: string;
  arch: string;
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  cpu: {
    cores: number;
    usage: number;
    load: number[];
  };
  disk: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connections: number;
  };
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message: string;
    duration: number;
    timestamp: string;
  }>;
  overall: {
    status: 'healthy' | 'warning' | 'critical';
    message: string;
    timestamp: string;
  };
}

export interface SystemConfig {
  app: {
    name: string;
    version: string;
    debug: boolean;
    logLevel: string;
  };
  database: {
    host: string;
    port: number;
    name: string;
    pool: {
      min: number;
      max: number;
    };
  };
  redis: {
    host: string;
    port: number;
    db: number;
  };
  security: {
    jwtSecret: string;
    jwtExpiry: number;
    bcryptRounds: number;
    corsOrigins: string[];
  };
  email: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
  };
  storage: {
    type: 'local' | 's3' | 'gcs';
    path: string;
    bucket?: string;
  };
}

export interface SystemLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  timestamp: string;
  source: string;
  context?: Record<string, any>;
  trace?: string;
}

export interface SystemMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
  };
  errors: {
    total: number;
    byType: Record<string, number>;
    recent: Array<{
      type: string;
      message: string;
      count: number;
      lastOccurrence: string;
    }>;
  };
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkUsage: number;
  };
}

class SystemService {
  // Get system information
  async getSystemInfo(): Promise<SystemInfo> {
    const response = await apiService.get<SystemInfo>(API_ENDPOINTS.SYSTEM.INFO);
    return response.data;
  }

  // Get system health
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await apiService.get<SystemHealth>(API_ENDPOINTS.SYSTEM.HEALTH);
    return response.data;
  }

  // Get system configuration
  async getSystemConfig(): Promise<SystemConfig> {
    const response = await apiService.get<SystemConfig>(API_ENDPOINTS.SYSTEM.CONFIG);
    return response.data;
  }

  // Update system configuration
  async updateSystemConfig(config: Partial<SystemConfig>): Promise<void> {
    await apiService.put(API_ENDPOINTS.SYSTEM.CONFIG, config);
  }

  // Get system logs
  async getSystemLogs(filters?: {
    level?: string;
    source?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<SystemLog[]> {
    const response = await apiService.get<SystemLog[]>(API_ENDPOINTS.SYSTEM.LOGS, filters);
    return response.data;
  }

  // Get system metrics
  async getSystemMetrics(): Promise<SystemMetrics> {
    const response = await apiService.get<SystemMetrics>(API_ENDPOINTS.SYSTEM.METRICS);
    return response.data;
  }

  // Restart system
  async restartSystem(): Promise<{ message: string; estimatedTime: number }> {
    const response = await apiService.post(API_ENDPOINTS.SYSTEM.RESTART);
    return response.data;
  }

  // Shutdown system
  async shutdownSystem(): Promise<{ message: string }> {
    const response = await apiService.post(API_ENDPOINTS.SYSTEM.SHUTDOWN);
    return response.data;
  }

  // Get system status
  async getSystemStatus(): Promise<{
    status: 'running' | 'starting' | 'stopping' | 'stopped' | 'error';
    message: string;
    timestamp: string;
  }> {
    const response = await apiService.get(API_ENDPOINTS.SYSTEM.STATUS);
    return response.data;
  }

  // Get system resources
  async getSystemResources(): Promise<{
    cpu: {
      usage: number;
      cores: number;
      temperature: number;
    };
    memory: {
      total: number;
      used: number;
      free: number;
      cached: number;
      buffers: number;
    };
    disk: {
      total: number;
      used: number;
      free: number;
      readSpeed: number;
      writeSpeed: number;
    };
    network: {
      bytesIn: number;
      bytesOut: number;
      packetsIn: number;
      packetsOut: number;
      errors: number;
    };
  }> {
    const response = await apiService.get(API_ENDPOINTS.SYSTEM.RESOURCES);
    return response.data;
  }

  // Get system processes
  async getSystemProcesses(): Promise<Array<{
    pid: number;
    name: string;
    cpu: number;
    memory: number;
    status: string;
    startTime: string;
  }>> {
    const response = await apiService.get(API_ENDPOINTS.SYSTEM.PROCESSES);
    return response.data;
  }

  // Kill system process
  async killProcess(pid: number): Promise<{ message: string }> {
    const response = await apiService.post(`${API_ENDPOINTS.SYSTEM.PROCESSES}/${pid}/kill`);
    return response.data;
  }

  // Get system services
  async getSystemServices(): Promise<Array<{
    name: string;
    status: 'running' | 'stopped' | 'starting' | 'stopping' | 'error';
    description: string;
    startTime?: string;
    pid?: number;
  }>> {
    const response = await apiService.get(API_ENDPOINTS.SYSTEM.SERVICES);
    return response.data;
  }

  // Start system service
  async startService(serviceName: string): Promise<{ message: string }> {
    const response = await apiService.post(`${API_ENDPOINTS.SYSTEM.SERVICES}/${serviceName}/start`);
    return response.data;
  }

  // Stop system service
  async stopService(serviceName: string): Promise<{ message: string }> {
    const response = await apiService.post(`${API_ENDPOINTS.SYSTEM.SERVICES}/${serviceName}/stop`);
    return response.data;
  }

  // Restart system service
  async restartService(serviceName: string): Promise<{ message: string }> {
    const response = await apiService.post(`${API_ENDPOINTS.SYSTEM.SERVICES}/${serviceName}/restart`);
    return response.data;
  }

  // Get system backups
  async getSystemBackups(): Promise<Array<{
    id: string;
    name: string;
    size: number;
    createdAt: string;
    status: 'completed' | 'failed' | 'in_progress';
    type: 'full' | 'incremental';
  }>> {
    const response = await apiService.get(API_ENDPOINTS.SYSTEM.BACKUPS);
    return response.data;
  }

  // Create system backup
  async createSystemBackup(options?: {
    type?: 'full' | 'incremental';
    name?: string;
    includeLogs?: boolean;
  }): Promise<{ backupId: string; message: string }> {
    const response = await apiService.post(API_ENDPOINTS.SYSTEM.BACKUPS, options);
    return response.data;
  }

  // Restore system backup
  async restoreSystemBackup(backupId: string): Promise<{ message: string; estimatedTime: number }> {
    const response = await apiService.post(`${API_ENDPOINTS.SYSTEM.BACKUPS}/${backupId}/restore`);
    return response.data;
  }

  // Delete system backup
  async deleteSystemBackup(backupId: string): Promise<{ message: string }> {
    await apiService.delete(`${API_ENDPOINTS.SYSTEM.BACKUPS}/${backupId}`);
  }

  // Get system updates
  async getSystemUpdates(): Promise<{
    currentVersion: string;
    latestVersion: string;
    updateAvailable: boolean;
    changelog?: string;
    releaseDate?: string;
  }> {
    const response = await apiService.get(API_ENDPOINTS.SYSTEM.UPDATES);
    return response.data;
  }

  // Install system update
  async installSystemUpdate(): Promise<{ message: string; estimatedTime: number }> {
    const response = await apiService.post(API_ENDPOINTS.SYSTEM.UPDATES);
    return response.data;
  }

  // Get system maintenance
  async getSystemMaintenance(): Promise<{
    enabled: boolean;
    schedule: string;
    lastRun?: string;
    nextRun?: string;
    tasks: Array<{
      name: string;
      description: string;
      status: 'pending' | 'running' | 'completed' | 'failed';
      lastRun?: string;
      duration?: number;
    }>;
  }> {
    const response = await apiService.get(API_ENDPOINTS.SYSTEM.MAINTENANCE);
    return response.data;
  }

  // Run system maintenance
  async runSystemMaintenance(): Promise<{ message: string; estimatedTime: number }> {
    const response = await apiService.post(API_ENDPOINTS.SYSTEM.MAINTENANCE);
    return response.data;
  }

  // Get system alerts
  async getSystemAlerts(): Promise<Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'critical';
    title: string;
    message: string;
    timestamp: string;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
  }>> {
    const response = await apiService.get(API_ENDPOINTS.SYSTEM.ALERTS);
    return response.data;
  }

  // Acknowledge system alert
  async acknowledgeAlert(alertId: string): Promise<{ message: string }> {
    const response = await apiService.post(`${API_ENDPOINTS.SYSTEM.ALERTS}/${alertId}/acknowledge`);
    return response.data;
  }

  // Get system diagnostics
  async getSystemDiagnostics(): Promise<{
    system: SystemInfo;
    health: SystemHealth;
    resources: any;
    logs: SystemLog[];
    metrics: SystemMetrics;
  }> {
    const response = await apiService.get(API_ENDPOINTS.SYSTEM.DIAGNOSTICS);
    return response.data;
  }

  // Export system diagnostics
  async exportSystemDiagnostics(format: 'json' | 'html' | 'pdf'): Promise<void> {
    const params = { format };
    await apiService.download(API_ENDPOINTS.SYSTEM.DIAGNOSTICS, params);
  }

  // Get system performance
  async getSystemPerformance(period: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<Array<{
    timestamp: string;
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  }>> {
    const response = await apiService.get(API_ENDPOINTS.SYSTEM.PERFORMANCE, { period });
    return response.data;
  }

  // Clear system cache
  async clearSystemCache(): Promise<{ message: string }> {
    const response = await apiService.post(API_ENDPOINTS.SYSTEM.CACHE_CLEAR);
    return response.data;
  }

  // Get system cache info
  async getSystemCacheInfo(): Promise<{
    size: number;
    items: number;
    hitRate: number;
    missRate: number;
  }> {
    const response = await apiService.get(API_ENDPOINTS.SYSTEM.CACHE_INFO);
    return response.data;
  }
}

// Create singleton instance
export const systemService = new SystemService();

export default systemService; 