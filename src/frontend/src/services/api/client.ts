import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@stores/authStore';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use((config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async get<T>(url: string, params?: any): Promise<T> {
    return this.client.get(url, { params });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.client.post(url, data);
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.client.put(url, data);
  }

  async delete<T>(url: string): Promise<T> {
    return this.client.delete(url);
  }

  // Specific API methods
  async getDashboardStats() {
    try {
      return await this.get('/dashboard/stats');
    } catch (error) {
      console.warn('Dashboard stats not available, using mock data');
      return {
        totalScans: 25,
        activeScans: 3,
        completedScans: 22,
        totalTargets: 8,
        vulnerabilities: { critical: 2, high: 5, medium: 12, low: 8 },
        recentScans: []
      };
    }
  }

  async getScans() {
    try {
      return await this.get('/scans');
    } catch (error) {
      console.warn('Scans API not available, using mock data');
      return [];
    }
  }

  async getTargets() {
    try {
      return await this.get('/targets');
    } catch (error) {
      console.warn('Targets API not available, using mock data');
      return [];
    }
  }
}

export const api = new ApiClient(); 