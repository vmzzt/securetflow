import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api/client';

export interface Scan {
  id: number;
  name: string;
  description?: string;
  target_id: number;
  user_id: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  scan_type: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  progress?: number;
  vulnerabilities?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface ScanFilters {
  search?: string;
  status?: string;
  type?: string;
  target?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ScanState {
  scans: Scan[];
  selectedScan: Scan | null;
  runningScans: Scan[];
  loading: boolean;
  error: string | null;
  filters: ScanFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ScanActions {
  // State management
  setScans: (scans: Scan[]) => void;
  setSelectedScan: (scan: Scan | null) => void;
  setRunningScans: (scans: Scan[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ScanFilters) => void;
  setPagination: (pagination: ScanState['pagination']) => void;
  
  // CRUD operations
  fetchScans: (params?: Record<string, any>) => Promise<void>;
  fetchScan: (id: number) => Promise<void>;
  createScan: (scan: Omit<Scan, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateScan: (id: number, scan: Partial<Scan>) => Promise<void>;
  deleteScan: (id: number) => Promise<void>;
  
  // Scan operations
  startScan: (id: number) => Promise<void>;
  stopScan: (id: number) => Promise<void>;
  pauseScan: (id: number) => Promise<void>;
  resumeScan: (id: number) => Promise<void>;
  getScanResults: (id: number) => Promise<void>;
  getScanLogs: (id: number) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  resetFilters: () => void;
  addScan: (scan: Scan) => void;
  removeScan: (id: number) => void;
  updateScanInList: (id: number, updates: Partial<Scan>) => void;
  updateScanProgress: (id: number, progress: number) => void;
}

export type ScanStore = ScanState & ScanActions;

const initialState: ScanState = {
  scans: [],
  selectedScan: null,
  runningScans: [],
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

export const useScanStore = create<ScanStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // State management
      setScans: (scans) => set({ scans }),
      setSelectedScan: (selectedScan) => set({ selectedScan }),
      setRunningScans: (runningScans) => set({ runningScans }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set({ filters }),
      setPagination: (pagination) => set({ pagination }),

      // CRUD operations
      fetchScans: async (params = {}) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get('/scans/', { params });
          set({ scans: response, loading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao carregar scans',
            loading: false 
          });
        }
      },

      fetchScan: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get(`/scans/${id}`);
          set({ selectedScan: response, loading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao carregar scan',
            loading: false 
          });
        }
      },

      createScan: async (scanData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/scans/', scanData);
          const { scans } = get();
          set({ 
            scans: [response, ...scans],
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao criar scan',
            loading: false 
          });
        }
      },

      updateScan: async (id, scanData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.put(`/scans/${id}`, scanData);
          const { scans } = get();
          const updatedScans = scans.map(scan => 
            scan.id === id ? response : scan
          );
          set({ 
            scans: updatedScans,
            selectedScan: response,
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao atualizar scan',
            loading: false 
          });
        }
      },

      deleteScan: async (id) => {
        try {
          set({ loading: true, error: null });
          await api.delete(`/scans/${id}`);
          const { scans } = get();
          const filteredScans = scans.filter(scan => scan.id !== id);
          set({ 
            scans: filteredScans,
            selectedScan: null,
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao deletar scan',
            loading: false 
          });
        }
      },

      // Scan operations
      startScan: async (id) => {
        try {
          set({ loading: true, error: null });
          await api.post(`/scans/${id}/start`);
          await get().fetchScans();
          set({ loading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao iniciar scan',
            loading: false 
          });
        }
      },

      stopScan: async (id) => {
        try {
          set({ loading: true, error: null });
          await api.post(`/scans/${id}/stop`);
          await get().fetchScans();
          set({ loading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || 'Erro ao parar scan',
            loading: false 
          });
        }
      },

      pauseScan: async (id) => {
        try {
          set({ loading: true, error: null });
          // Implementar quando o backend suportar
          set({ loading: false });
        } catch (error: any) {
          set({ 
            error: 'Funcionalidade não implementada',
            loading: false 
          });
        }
      },

      resumeScan: async (id) => {
        try {
          set({ loading: true, error: null });
          // Implementar quando o backend suportar
          set({ loading: false });
        } catch (error: any) {
          set({ 
            error: 'Funcionalidade não implementada',
            loading: false 
          });
        }
      },

      getScanResults: async (id) => {
        try {
          set({ loading: true, error: null });
          // Implementar quando o backend suportar
          set({ loading: false });
        } catch (error: any) {
          set({ 
            error: 'Funcionalidade não implementada',
            loading: false 
          });
        }
      },

      getScanLogs: async (id) => {
        try {
          set({ loading: true, error: null });
          // Implementar quando o backend suportar
          set({ loading: false });
        } catch (error: any) {
          set({ 
            error: 'Funcionalidade não implementada',
            loading: false 
          });
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),
      resetFilters: () => set({ filters: {} }),
      addScan: (scan) => {
        const { scans } = get();
        set({ scans: [scan, ...scans] });
      },
      removeScan: (id) => {
        const { scans } = get();
        set({ scans: scans.filter(scan => scan.id !== id) });
      },
      updateScanInList: (id, updates) => {
        const { scans } = get();
        const updatedScans = scans.map(scan => 
          scan.id === id ? { ...scan, ...updates } : scan
        );
        set({ scans: updatedScans });
      },
      updateScanProgress: (id, progress) => {
        get().updateScanInList(id, { progress });
      },
    }),
    {
      name: 'scan-storage',
      partialize: (state) => ({ 
        scans: state.scans,
        filters: state.filters,
        pagination: state.pagination
      }),
    }
  )
);

// Selectors for better performance
export const scanSelectors = {
  getScanById: (id: number) => (state: ScanStore) =>
    state.scans.find(scan => scan.id === id),
  
  getScansByStatus: (status: string) => (state: ScanStore) =>
    state.scans.filter(scan => scan.status === status),
  
  getScansByType: (type: string) => (state: ScanStore) =>
    state.scans.filter(scan => scan.scan_type === type),
  
  getRunningScans: (state: ScanStore) =>
    state.scans.filter(scan => scan.status === 'running'),
  
  getCompletedScans: (state: ScanStore) =>
    state.scans.filter(scan => scan.status === 'completed'),
  
  getFailedScans: (state: ScanStore) =>
    state.scans.filter(scan => scan.status === 'failed'),
  
  getScansByTarget: (targetId: number) => (state: ScanStore) =>
    state.scans.filter(scan => scan.target_id === targetId),
  
  getFilteredScans: (state: ScanStore) => {
    const { scans, filters } = state;
    let filtered = scans;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(scan =>
        scan.name.toLowerCase().includes(search) ||
        scan.description?.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(scan => scan.status === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter(scan => scan.scan_type === filters.type);
    }

    if (filters.target) {
      filtered = filtered.filter(scan => scan.target_id === parseInt(filters.target, 10));
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(scan => scan.created_at >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(scan => scan.created_at <= filters.dateTo!);
    }

    return filtered;
  },
};

export default useScanStore; 