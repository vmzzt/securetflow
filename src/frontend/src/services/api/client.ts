import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Inicializar token do storage persistente (zustand persist: auth-storage)
    try {
      const raw = window.localStorage.getItem('auth-storage');
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        if (token) {
          this.authToken = token;
        }
      }
    } catch {}

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      return config;
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  // Generic methods
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, { params });
    return {
      data: response.data,
      success: true
    };
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data);
    return {
      data: response.data,
      success: true
    };
  }

  async postForm<T>(url: string, data: URLSearchParams | string): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return {
      data: response.data,
      success: true
    };
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data);
    return {
      data: response.data,
      success: true
    };
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url);
    return {
      data: response.data,
      success: true
    };
  }
}

export const apiService = new ApiService(); 