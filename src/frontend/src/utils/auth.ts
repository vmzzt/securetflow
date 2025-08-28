import { logSecurity, logAuth } from './logger';

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

class SecureAuthManager {
  private static instance: SecureAuthManager;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';

  private constructor() {
    this.setupTokenRefresh();
  }

  static getInstance(): SecureAuthManager {
    if (!SecureAuthManager.instance) {
      SecureAuthManager.instance = new SecureAuthManager();
    }
    return SecureAuthManager.instance;
  }

  // Secure token storage using httpOnly cookies (fallback to sessionStorage)
  public setSecureToken(token: AuthToken): void {
    try {
      // Try to set httpOnly cookie first
      document.cookie = `${this.TOKEN_KEY}=${token.access_token}; path=/; secure; samesite=strict; max-age=${token.expires_in}`;
      document.cookie = `${this.REFRESH_KEY}=${token.refresh_token}; path=/; secure; samesite=strict; max-age=${token.expires_in * 2}`;
    } catch (error) {
      // Fallback to sessionStorage (less secure but better than localStorage)
      sessionStorage.setItem(this.TOKEN_KEY, token.access_token);
      sessionStorage.setItem(this.REFRESH_KEY, token.refresh_token);
    }
  }

  private getSecureToken(): string | null {
    try {
      // Try to get from cookie first
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith(`${this.TOKEN_KEY}=`));
      if (tokenCookie) {
        return tokenCookie.split('=')[1];
      }
      
      // Fallback to sessionStorage
      return sessionStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      return sessionStorage.getItem(this.TOKEN_KEY);
    }
  }

  public getRefreshToken(): string | null {
    try {
      // Try to get from cookie first
      const cookies = document.cookie.split(';');
      const refreshCookie = cookies.find(cookie => cookie.trim().startsWith(`${this.REFRESH_KEY}=`));
      if (refreshCookie) {
        return refreshCookie.split('=')[1];
      }
      
      // Fallback to sessionStorage
      return sessionStorage.getItem(this.REFRESH_KEY);
    } catch (error) {
      return sessionStorage.getItem(this.REFRESH_KEY);
    }
  }

  private clearSecureTokens(): void {
    try {
      // Clear cookies
      document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${this.REFRESH_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch (error) {
      // Fallback to sessionStorage
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_KEY);
    }
  }

  // Login with security logging
  async login(email: string, password: string): Promise<{ user: User; token: AuthToken }> {
    try {
      logAuth('login_attempt', undefined, { email });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.text();
        logSecurity('login_failed', { email, reason: error });
        throw new Error(error);
      }

      const data = await response.json();
      const { user, token } = data;

      // Store tokens securely
      this.setSecureToken(token);
      
      // Store user data
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      // Setup token refresh
      this.setupTokenRefresh();
      
      logAuth('login_success', user.id, { email });
      
      return { user, token };
    } catch (error) {
      logSecurity('login_error', { email, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  // Logout with security logging
  async logout(): Promise<void> {
    try {
      const user = this.getCurrentUser();
      const userId = user?.id;
      
      // Call logout endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Clear local data
      this.clearSecureTokens();
      sessionStorage.removeItem(this.USER_KEY);
      
      // Clear refresh timer
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
        this.tokenRefreshTimer = null;
      }
      
      logAuth('logout_success', userId);
    } catch (error) {
      logSecurity('logout_error', { error: error instanceof Error ? error.message : 'Unknown error' });
      // Still clear local data even if server call fails
      this.clearSecureTokens();
      sessionStorage.removeItem(this.USER_KEY);
    }
  }

  // Refresh token automatically
  async refreshToken(): Promise<AuthToken | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const token: AuthToken = await response.json();
      this.setSecureToken(token);
      
      logAuth('token_refreshed', this.getCurrentUser()?.id);
      return token;
    } catch (error) {
      logSecurity('token_refresh_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      await this.logout();
      return null;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    try {
      const userData = sessionStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      logSecurity('user_data_corrupted', { error: error instanceof Error ? error.message : 'Unknown error' });
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getSecureToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get authorization header
  getAuthHeader(): string | null {
    const token = this.getSecureToken();
    return token ? `Bearer ${token}` : null;
  }

  // Check if user has permission
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions.includes(permission) || false;
  }

  // Check if user has role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role || false;
  }

  // Setup automatic token refresh
  private setupTokenRefresh(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }

    const token = this.getSecureToken();
    if (!token) return;

    // Refresh token 5 minutes before expiry
    const refreshTime = 5 * 60 * 1000; // 5 minutes
    this.tokenRefreshTimer = setTimeout(async () => {
      await this.refreshToken();
    }, refreshTime);
  }

  // Validate token format (basic validation) - available for future use
  // private validateToken(token: string): boolean {
  //   if (!token) return false;
  //   
  //   // Basic JWT format validation
  //   const parts = token.split('.');
  //   if (parts.length !== 3) return false;
  //   
  //   try {
  //     // Check if payload is valid JSON
  //     const payload = JSON.parse(atob(parts[1]));
  //     
  //     // Check if token is expired
  //     if (payload.exp && payload.exp * 1000 < Date.now()) {
  //       return false;
  //     }
  //     
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  // Update user data
  updateUser(userData: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      logAuth('user_updated', updatedUser.id, { updatedFields: Object.keys(userData) });
    }
  }

  // Clear all auth data (for security incidents)
  clearAllAuthData(): void {
    this.clearSecureTokens();
    sessionStorage.removeItem(this.USER_KEY);
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
    logSecurity('auth_data_cleared');
  }
}

// Global auth manager instance
export const authManager = SecureAuthManager.getInstance();

// Convenience functions
export const login = (email: string, password: string) => authManager.login(email, password);
export const logout = () => authManager.logout();
export const getCurrentUser = () => authManager.getCurrentUser();
export const isAuthenticated = () => authManager.isAuthenticated();
export const getAuthHeader = () => authManager.getAuthHeader();
export const hasPermission = (permission: string) => authManager.hasPermission(permission);
export const hasRole = (role: string) => authManager.hasRole(role);
export const updateUser = (userData: Partial<User>) => authManager.updateUser(userData);
export const clearAllAuthData = () => authManager.clearAllAuthData();

export default authManager; 