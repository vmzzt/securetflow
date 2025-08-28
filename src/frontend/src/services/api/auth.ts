import { apiService, API_ENDPOINTS } from './client';
import { authManager } from '../../utils/auth';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
}

class AuthService {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    if (response.success) {
      // Store tokens securely using authManager
      const token: any = {
        access_token: response.data.token,
        refresh_token: response.data.refreshToken || '',
        expires_in: 3600,
        token_type: 'Bearer'
      };
      authManager.setSecureToken(token);
      authManager.updateUser(response.data.user);
    }
    
    return response.data;
  }

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    
    if (response.success) {
      // Store tokens securely using authManager
      const token: any = {
        access_token: response.data.token,
        refresh_token: response.data.refreshToken || '',
        expires_in: 3600,
        token_type: 'Bearer'
      };
      authManager.setSecureToken(token);
      authManager.updateUser(response.data.user);
    }
    
    return response.data;
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Clear secure storage using authManager
      authManager.clearAllAuthData();
    }
  }

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = authManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    
    if (response.success) {
      // Update stored tokens securely
      const token: any = {
        access_token: response.data.token,
        refresh_token: response.data.refreshToken || refreshToken,
        expires_in: 3600,
        token_type: 'Bearer'
      };
      authManager.setSecureToken(token);
    }
    
    return response.data;
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await apiService.get<User>(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }

  // Update profile
  async updateProfile(data: ProfileUpdateData): Promise<User> {
    const response = await apiService.put<User>(API_ENDPOINTS.AUTH.PROFILE, data);
    
    if (response.success) {
      // Update stored user data securely
      authManager.updateUser(response.data);
    }
    
    return response.data;
  }

  // Change password
  async changePassword(data: ChangePasswordData): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return authManager.isAuthenticated();
  }

  // Get stored token
  getToken(): string | null {
    return authManager.getAuthHeader()?.replace('Bearer ', '') || null;
  }

  // Get stored user
  getStoredUser(): User | null {
    const user = authManager.getCurrentUser();
    return user ? {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as User : null;
  }

  // Set stored user
  setStoredUser(user: User): void {
    authManager.updateUser(user);
  }

  // Clear stored data
  clearStoredData(): void {
    authManager.clearAllAuthData();
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Get token expiration time
  getTokenExpiration(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  // Auto-refresh token if needed
  async ensureValidToken(): Promise<string | null> {
    if (this.isTokenExpired()) {
      try {
        const authResponse = await this.refreshToken();
        return authResponse.token;
      } catch (error) {
        this.clearStoredData();
        return null;
      }
    }
    
    return this.getToken();
  }
}

// Create singleton instance
export const authService = new AuthService();

export default authService; 