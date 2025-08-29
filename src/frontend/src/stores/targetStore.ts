import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api/client';

export interface Target {
  id: number;
  name: string;
  host: string;
  port?: number;
  protocol: string;
  description?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TargetFilters {
  search?: string;
  protocol?: string;
  port?: number;
}

export interface TargetState {
  targets: Target[];
  selectedTarget: Target | null;
  loading: boolean;
  error: string | null;
  filters: TargetFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TargetActions {
  // State management
  setTargets: (targets: Target[]) => void;
  setSelectedTarget: (target: Target | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: TargetFilters) => void;
  setPagination: (pagination: TargetState['pagination']) => void;
  
  // CRUD operations
  fetchTargets: (params?: Record<string, any>) => Promise<void>;
  fetchTarget: (id: number) => Promise<void>;
  createTarget: (target: Omit<Target, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
  updateTarget: (id: number, target: Partial<Target>) => Promise<void>;
  deleteTarget: (id: number) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  resetFilters: () => void;
  addTarget: (target: Target) => void;
  removeTarget: (id: number) => void;
  updateTargetInList: (id: number, updates: Partial<Target>) => void;
}

export type TargetStore = TargetState & TargetActions;

const initialState: TargetState = {
  targets: [],
  selectedTarget: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

export const useTargetStore = create<TargetStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // State management
      setTargets: (targets) => set({ targets }),
      setSelectedTarget: (selectedTarget) => set({ selectedTarget }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set({ filters }),
      setPagination: (pagination) => set({ pagination }),

      // CRUD operations
      fetchTargets: async (params = {}) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get('/targets/', { params });
          set({ targets: response, loading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao carregar targets',
            loading: false 
          });
        }
      },

      fetchTarget: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get(`/targets/${id}`);
          set({ selectedTarget: response, loading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao carregar target',
            loading: false 
          });
        }
      },

      createTarget: async (targetData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/targets/', targetData);
          const { targets } = get();
          set({ 
            targets: [response, ...targets],
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao criar target',
            loading: false 
          });
        }
      },

      updateTarget: async (id, targetData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.put(`/targets/${id}`, targetData);
          const { targets } = get();
          const updatedTargets = targets.map(target => 
            target.id === id ? response : target
          );
          set({ 
            targets: updatedTargets,
            selectedTarget: response,
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao atualizar target',
            loading: false 
          });
        }
      },

      deleteTarget: async (id) => {
        try {
          set({ loading: true, error: null });
          await api.delete(`/targets/${id}`);
          const { targets } = get();
          const filteredTargets = targets.filter(target => target.id !== id);
          set({ 
            targets: filteredTargets,
            selectedTarget: null,
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao deletar target',
            loading: false 
          });
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),
      resetFilters: () => set({ filters: {} }),
      addTarget: (target) => {
        const { targets } = get();
        set({ targets: [target, ...targets] });
      },
      removeTarget: (id) => {
        const { targets } = get();
        set({ targets: targets.filter(target => target.id !== id) });
      },
      updateTargetInList: (id, updates) => {
        const { targets } = get();
        const updatedTargets = targets.map(target => 
          target.id === id ? { ...target, ...updates } : target
        );
        set({ targets: updatedTargets });
      },
    }),
    {
      name: 'target-storage',
      partialize: (state) => ({ 
        targets: state.targets,
        filters: state.filters,
        pagination: state.pagination
      }),
    }
  )
);

// Selectors for better performance
export const targetSelectors = {
  getTargetById: (id: number) => (state: TargetStore) =>
    state.targets.find(target => target.id === id),
  
  getTargetsByProtocol: (protocol: string) => (state: TargetStore) =>
    state.targets.filter(target => target.protocol === protocol),
  
  getTargetsByPort: (port: number) => (state: TargetStore) =>
    state.targets.filter(target => target.port === port),
  
  getTargetsByHost: (host: string) => (state: TargetStore) =>
    state.targets.filter(target => target.host.includes(host)),
  
  getFilteredTargets: (state: TargetStore) => {
    const { targets, filters } = state;
    let filtered = [...targets];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(target =>
        target.name.toLowerCase().includes(search) ||
        target.host.toLowerCase().includes(search) ||
        target.description?.toLowerCase().includes(search)
      );
    }

    if (filters.protocol) {
      filtered = filtered.filter(target => target.protocol === filters.protocol);
    }

    if (filters.port) {
      filtered = filtered.filter(target => target.port === filters.port);
    }

    return filtered;
  },

  getTargetsCount: (state: TargetStore) => state.targets.length,
  
  getTargetsByProtocolCount: (protocol: string) => (state: TargetStore) =>
    state.targets.filter(target => target.protocol === protocol).length,
};

export default useTargetStore; 