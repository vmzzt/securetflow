import { apiClient } from '../../hooks/useApi';
import { authManager } from '../../utils/auth';

// Base API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Targets
  TARGETS: {
    LIST: '/targets',
    CREATE: '/targets',
    GET: (id: string) => `/targets/${id}`,
    UPDATE: (id: string) => `/targets/${id}`,
    DELETE: (id: string) => `/targets/${id}`,
    SCAN: (id: string) => `/targets/${id}/scan`,
    VULNERABILITIES: (id: string) => `/targets/${id}/vulnerabilities`,
  },
  
  // Scans
  SCANS: {
    LIST: '/scans',
    CREATE: '/scans',
    GET: (id: string) => `/scans/${id}`,
    UPDATE: (id: string) => `/scans/${id}`,
    DELETE: (id: string) => `/scans/${id}`,
    START: (id: string) => `/scans/${id}/start`,
    STOP: (id: string) => `/scans/${id}/stop`,
    PAUSE: (id: string) => `/scans/${id}/pause`,
    RESUME: (id: string) => `/scans/${id}/resume`,
    RESULTS: (id: string) => `/scans/${id}/results`,
    LOGS: (id: string) => `/scans/${id}/logs`,
  },
  
  // Vulnerabilities
  VULNERABILITIES: {
    LIST: '/vulnerabilities',
    CREATE: '/vulnerabilities',
    GET: (id: string) => `/vulnerabilities/${id}`,
    UPDATE: (id: string) => `/vulnerabilities/${id}`,
    DELETE: (id: string) => `/vulnerabilities/${id}`,
    BULK_UPDATE: '/vulnerabilities/bulk-update',
    EXPORT: '/vulnerabilities/export',
  },
  
  // Reports
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    GET: (id: string) => `/reports/${id}`,
    UPDATE: (id: string) => `/reports/${id}`,
    DELETE: (id: string) => `/reports/${id}`,
    GENERATE: '/reports/generate',
    EXPORT: (id: string) => `/reports/${id}/export`,
    TEMPLATES: '/reports/templates',
  },
  
  // Tools
  TOOLS: {
    LIST: '/tools',
    CREATE: '/tools',
    GET: (id: string) => `/tools/${id}`,
    UPDATE: (id: string) => `/tools/${id}`,
    DELETE: (id: string) => `/tools/${id}`,
    EXECUTE: (id: string) => `/tools/${id}/execute`,
    STOP: (id: string) => `/tools/${id}/stop`,
    CONFIG: (id: string) => `/tools/${id}/config`,
  },
  
  // Integrations
  INTEGRATIONS: {
    LIST: '/integrations',
    CREATE: '/integrations',
    GET: (id: string) => `/integrations/${id}`,
    UPDATE: (id: string) => `/integrations/${id}`,
    DELETE: (id: string) => `/integrations/${id}`,
    TEST: (id: string) => `/integrations/${id}/test`,
    SYNC: (id: string) => `/integrations/${id}/sync`,
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    VULNERABILITIES: '/analytics/vulnerabilities',
    SCANS: '/analytics/scans',
    TARGETS: '/analytics/targets',
    TRENDS: '/analytics/trends',
    METRICS: '/analytics/metrics',
  },
  
  // System
  SYSTEM: {
    STATUS: '/system/status',
    HEALTH: '/system/health',
    CONFIG: '/system/config',
    LOGS: '/system/logs',
    METRICS: '/system/metrics',
    BACKUP: '/system/backup',
    RESTORE: '/system/restore',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    ROLES: '/users/roles',
    PERMISSIONS: '/users/permissions',
  },
} as const;

// Request/Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  type?: string;
  severity?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Generic API service class
export class ApiService {
  private client = apiClient;

  // Generic CRUD operations
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.client.get<ApiResponse<T>>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.post<ApiResponse<T>>(endpoint, data);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.put<ApiResponse<T>>(endpoint, data);
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.patch<ApiResponse<T>>(endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.client.delete<ApiResponse<T>>(endpoint);
  }

  // File upload
  async upload<T>(endpoint: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post<ApiResponse<T>>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Download file
  async download(endpoint: string, filename?: string): Promise<void> {
    const response = await fetch(`${this.client.baseURL}${endpoint}`, {
      headers: {
        'Authorization': authManager.getAuthHeader() || '',
      },
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // WebSocket connection
  createWebSocketConnection(endpoint: string): WebSocket {
    const token = authManager.getAuthHeader()?.replace('Bearer ', '') || '';
    const wsUrl = `${this.client.baseURL.replace('http', 'ws')}${endpoint}?token=${token}`;
    return new WebSocket(wsUrl);
  }
}

// Create global API service instance
export const apiService = new ApiService();

// Utility functions for common operations
export const apiUtils = {
  // Build query string from params
  buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, item.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    return searchParams.toString();
  },

  // Build pagination params
  buildPaginationParams(params: PaginationParams & FilterParams): Record<string, any> {
    const queryParams: Record<string, any> = {};
    
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.sort) queryParams.sort = params.sort;
    if (params.order) queryParams.order = params.order;
    if (params.search) queryParams.search = params.search;
    if (params.status) queryParams.status = params.status;
    if (params.type) queryParams.type = params.type;
    if (params.severity) queryParams.severity = params.severity;
    if (params.dateFrom) queryParams.date_from = params.dateFrom;
    if (params.dateTo) queryParams.date_to = params.dateTo;
    
    return queryParams;
  },

  // Handle API errors
  handleError(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred';
  },

  // Retry function with exponential backoff
  async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError!;
  },
};

export default apiService; 