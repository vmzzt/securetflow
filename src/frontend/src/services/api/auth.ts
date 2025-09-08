import { apiService } from './client';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  role_id?: number;
  department?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

class AuthApi {
  setToken(token: string) {
    apiService.setAuthToken(token);
  }

  clearToken() {
    apiService.clearAuthToken();
  }

  async login(username: string, password: string): Promise<TokenResponse> {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);
    
    const response = await apiService.postForm<TokenResponse>('/api/v1/auth/login', form);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/api/v1/auth/me');
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