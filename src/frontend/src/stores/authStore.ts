import { create } from 'zustand';

// Basic interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  permissions: string[];
}

export interface AuthToken {
  access: string;
  refresh: string;
  expires: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (user: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock login - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (credentials.email === 'admin@securet-flow.com' && credentials.password === 'admin123') {
        const user: User = {
          id: '1',
          name: 'Admin User',
          email: credentials.email,
          role: 'admin',
          avatar: 'https://via.placeholder.com/40',
          permissions: ['read', 'write', 'admin']
        };
        
        const token: AuthToken = {
          access: 'mock-jwt-token-' + Date.now(),
          refresh: 'mock-refresh-token-' + Date.now(),
          expires: Date.now() + 3600000 // 1 hour
        };
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({
        isLoading: false,
        error: errorMessage
      });
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  },

  refreshToken: async () => {
    try {
      // Mock token refresh - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newToken: AuthToken = {
        access: 'mock-jwt-token-refreshed-' + Date.now(),
        refresh: 'mock-refresh-token-refreshed-' + Date.now(),
        expires: Date.now() + 3600000 // 1 hour
      };
      
      set({
        token: newToken,
        isAuthenticated: true
      });
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false
      });
    }
  },

  updateProfile: (user: Partial<User>) => {
    const currentUser = get().user;
    
    if (currentUser) {
      set({
        user: { ...currentUser, ...user }
      });
    }
  },

  clearError: () => {
    set({ error: null });
  }
})); 