import { apiService } from './client';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  role?: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

class AuthApi {
  setToken(token: string) {
    apiService.setAuthToken(token);
  }

  clearToken() {
    apiService.clearAuthToken();
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/api/v1/auth/login', {
      username,
      password
    });
    
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/api/v1/auth/user');
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/api/v1/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      this.clearToken();
    }
  }
}

export const authApi = new AuthApi(); 