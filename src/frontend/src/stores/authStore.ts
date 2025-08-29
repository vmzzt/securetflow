import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/services/api/client';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ loading: true, error: null });
          
          const response = await api.post('/auth/login', credentials);
          
          // Salvar token
          localStorage.setItem('access_token', response.access_token);
          
          // Buscar dados do usuário
          const userResponse = await api.get('/auth/me');
          
          set({
            user: userResponse,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.detail || 'Erro ao fazer login',
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ loading: true, error: null });
          
          const response = await api.post('/auth/register', data);
          
          set({
            user: response,
            isAuthenticated: false,
            loading: false,
            error: null
          });
          
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.detail || 'Erro ao registrar usuário'
          });
          throw error;
        }
      },

      logout: () => {
        // Remover token
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
      },

      refreshUser: async () => {
        try {
          const token = localStorage.getItem('access_token');
          if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
          }
          
          const user = await api.get('/auth/me');
          
          set({
            user,
            isAuthenticated: true,
            error: null
          });
          
        } catch (error: any) {
          // Token inválido ou expirado
          localStorage.removeItem('access_token');
          set({
            user: null,
            isAuthenticated: false,
            error: null
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 