import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, API_ENDPOINTS } from '../services/api/client';

export interface Target {
  id: string;
  name: string;
  url: string;
  type: 'web' | 'api' | 'network' | 'mobile';
  status: 'active' | 'inactive' | 'scanning' | 'error';
  lastScan?: string;
  vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TargetFilters {
  search?: string;
  status?: string;
  type?: string;
  tags?: string[];
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
  fetchTarget: (id: string) => Promise<void>;
  createTarget: (target: Omit<Target, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTarget: (id: string, target: Partial<Target>) => Promise<void>;
  deleteTarget: (id: string) => Promise<void>;
  
  // Target operations
  startScan: (id: string) => Promise<void>;
  stopScan: (id: string) => Promise<void>;
  getTargetVulnerabilities: (id: string) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  resetFilters: () => void;
  addTarget: (target: Target) => void;
  removeTarget: (id: string) => void;
  updateTargetInList: (id: string, updates: Partial<Target>) => void;
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
      setSelectedTarget: (target) => set({ selectedTarget: target }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set({ filters }),
      setPagination: (pagination) => set({ pagination }),

      // CRUD operations
      fetchTargets: async (params = {}) => {
        const { filters, pagination } = get();
        
        set({ loading: true, error: null });
        
        try {
          const queryParams = {
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
            ...params,
          };

          const response = await apiService.get<Target[]>(API_ENDPOINTS.TARGETS.LIST, queryParams);
          
          if (response.success) {
            set({
              targets: response.data,
              pagination: response.pagination || pagination,
              loading: false,
            });
          } else {
            set({ error: response.error || 'Failed to fetch targets', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch targets', loading: false });
        }
      },

      fetchTarget: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.get<Target>(API_ENDPOINTS.TARGETS.GET(id));
          
          if (response.success) {
            set({ selectedTarget: response.data, loading: false });
          } else {
            set({ error: response.error || 'Failed to fetch target', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch target', loading: false });
        }
      },

      createTarget: async (targetData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post<Target>(API_ENDPOINTS.TARGETS.CREATE, targetData);
          
          if (response.success) {
            const { targets } = get();
            set({
              targets: [...targets, response.data],
              loading: false,
            });
          } else {
            set({ error: response.error || 'Failed to create target', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to create target', loading: false });
        }
      },

      updateTarget: async (id: string, targetData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.put<Target>(API_ENDPOINTS.TARGETS.UPDATE(id), targetData);
          
          if (response.success) {
            const { targets, selectedTarget } = get();
            const updatedTargets = targets.map(target =>
              target.id === id ? { ...target, ...response.data } : target
            );
            
            set({
              targets: updatedTargets,
              selectedTarget: selectedTarget?.id === id ? response.data : selectedTarget,
              loading: false,
            });
          } else {
            set({ error: response.error || 'Failed to update target', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to update target', loading: false });
        }
      },

      deleteTarget: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.delete(API_ENDPOINTS.TARGETS.DELETE(id));
          
          if (response.success) {
            const { targets, selectedTarget } = get();
            const filteredTargets = targets.filter(target => target.id !== id);
            
            set({
              targets: filteredTargets,
              selectedTarget: selectedTarget?.id === id ? null : selectedTarget,
              loading: false,
            });
          } else {
            set({ error: response.error || 'Failed to delete target', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to delete target', loading: false });
        }
      },

      // Target operations
      startScan: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post(API_ENDPOINTS.TARGETS.SCAN(id));
          
          if (response.success) {
            const { targets } = get();
            const updatedTargets = targets.map(target =>
              target.id === id ? { ...target, status: 'scanning' } : target
            );
            
            set({ targets: updatedTargets, loading: false });
          } else {
            set({ error: response.error || 'Failed to start scan', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to start scan', loading: false });
        }
      },

      stopScan: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post(API_ENDPOINTS.SCANS.STOP(id));
          
          if (response.success) {
            const { targets } = get();
            const updatedTargets = targets.map(target =>
              target.id === id ? { ...target, status: 'active' } : target
            );
            
            set({ targets: updatedTargets, loading: false });
          } else {
            set({ error: response.error || 'Failed to stop scan', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to stop scan', loading: false });
        }
      },

      getTargetVulnerabilities: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.get(API_ENDPOINTS.TARGETS.VULNERABILITIES(id));
          
          if (response.success) {
            // Update target with vulnerability counts
            const { targets } = get();
            const updatedTargets = targets.map(target =>
              target.id === id ? { ...target, ...response.data } : target
            );
            
            set({ targets: updatedTargets, loading: false });
          } else {
            set({ error: response.error || 'Failed to fetch vulnerabilities', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch vulnerabilities', loading: false });
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),
      
      resetFilters: () => set({ filters: {} }),
      
      addTarget: (target) => {
        const { targets } = get();
        set({ targets: [...targets, target] });
      },
      
      removeTarget: (id: string) => {
        const { targets, selectedTarget } = get();
        const filteredTargets = targets.filter(target => target.id !== id);
        
        set({
          targets: filteredTargets,
          selectedTarget: selectedTarget?.id === id ? null : selectedTarget,
        });
      },
      
      updateTargetInList: (id: string, updates) => {
        const { targets, selectedTarget } = get();
        const updatedTargets = targets.map(target =>
          target.id === id ? { ...target, ...updates } : target
        );
        
        set({
          targets: updatedTargets,
          selectedTarget: selectedTarget?.id === id ? { ...selectedTarget, ...updates } : selectedTarget,
        });
      },
    }),
    {
      name: 'target-store',
      partialize: (state) => ({
        targets: state.targets,
        filters: state.filters,
        pagination: state.pagination,
      }),
    }
  )
);

// Selectors for better performance
export const targetSelectors = {
  getTargetById: (id: string) => (state: TargetStore) =>
    state.targets.find(target => target.id === id),
  
  getTargetsByStatus: (status: string) => (state: TargetStore) =>
    state.targets.filter(target => target.status === status),
  
  getTargetsByType: (type: string) => (state: TargetStore) =>
    state.targets.filter(target => target.type === type),
  
  getActiveTargets: (state: TargetStore) =>
    state.targets.filter(target => target.status === 'active'),
  
  getScanningTargets: (state: TargetStore) =>
    state.targets.filter(target => target.status === 'scanning'),
  
  getTargetsWithVulnerabilities: (state: TargetStore) =>
    state.targets.filter(target => target.vulnerabilities > 0),
  
  getTargetsByTag: (tag: string) => (state: TargetStore) =>
    state.targets.filter(target => target.tags.includes(tag)),
  
  getFilteredTargets: (state: TargetStore) => {
    const { targets, filters } = state;
    let filtered = targets;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(target =>
        target.name.toLowerCase().includes(search) ||
        target.url.toLowerCase().includes(search) ||
        target.description?.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(target => target.status === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter(target => target.type === filters.type);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(target =>
        filters.tags!.some(tag => target.tags.includes(tag))
      );
    }

    return filtered;
  },
};

export default useTargetStore; 