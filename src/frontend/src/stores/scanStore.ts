import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, API_ENDPOINTS } from '../services/api/client';

export interface Scan {
  id: string;
  name: string;
  target: string;
  targetName: string;
  type: 'vulnerability' | 'port' | 'web' | 'api' | 'custom';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  tools: string[];
  description?: string;
  config: Record<string, any>;
  logs?: string[];
  createdAt: string;
  updatedAt: string;
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
  fetchScan: (id: string) => Promise<void>;
  createScan: (scan: Omit<Scan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateScan: (id: string, scan: Partial<Scan>) => Promise<void>;
  deleteScan: (id: string) => Promise<void>;
  
  // Scan operations
  startScan: (id: string) => Promise<void>;
  stopScan: (id: string) => Promise<void>;
  pauseScan: (id: string) => Promise<void>;
  resumeScan: (id: string) => Promise<void>;
  getScanResults: (id: string) => Promise<void>;
  getScanLogs: (id: string) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  resetFilters: () => void;
  addScan: (scan: Scan) => void;
  removeScan: (id: string) => void;
  updateScanInList: (id: string, updates: Partial<Scan>) => void;
  updateScanProgress: (id: string, progress: number) => void;
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
      setSelectedScan: (scan) => set({ selectedScan: scan }),
      setRunningScans: (scans) => set({ runningScans: scans }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set({ filters }),
      setPagination: (pagination) => set({ pagination }),

      // CRUD operations
      fetchScans: async (params = {}) => {
        const { filters, pagination } = get();
        
        set({ loading: true, error: null });
        
        try {
          const queryParams = {
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
            ...params,
          };

          const response = await apiService.get<Scan[]>(API_ENDPOINTS.SCANS.LIST, queryParams);
          
          if (response.success) {
            const runningScans = response.data.filter(scan => scan.status === 'running');
            set({
              scans: response.data,
              runningScans,
              pagination: response.pagination || pagination,
              loading: false,
            });
          } else {
            set({ error: response.error || 'Failed to fetch scans', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch scans', loading: false });
        }
      },

      fetchScan: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.get<Scan>(API_ENDPOINTS.SCANS.GET(id));
          
          if (response.success) {
            set({ selectedScan: response.data, loading: false });
          } else {
            set({ error: response.error || 'Failed to fetch scan', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch scan', loading: false });
        }
      },

      createScan: async (scanData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post<Scan>(API_ENDPOINTS.SCANS.CREATE, scanData);
          
          if (response.success) {
            const { scans } = get();
            set({
              scans: [...scans, response.data],
              loading: false,
            });
          } else {
            set({ error: response.error || 'Failed to create scan', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to create scan', loading: false });
        }
      },

      updateScan: async (id: string, scanData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.put<Scan>(API_ENDPOINTS.SCANS.UPDATE(id), scanData);
          
          if (response.success) {
            const { scans, selectedScan, runningScans } = get();
            const updatedScans = scans.map(scan =>
              scan.id === id ? { ...scan, ...response.data } : scan
            );
            
            const updatedRunningScans = runningScans.map(scan =>
              scan.id === id ? { ...scan, ...response.data } : scan
            );
            
            set({
              scans: updatedScans,
              runningScans: updatedRunningScans,
              selectedScan: selectedScan?.id === id ? response.data : selectedScan,
              loading: false,
            });
          } else {
            set({ error: response.error || 'Failed to update scan', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to update scan', loading: false });
        }
      },

      deleteScan: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.delete(API_ENDPOINTS.SCANS.DELETE(id));
          
          if (response.success) {
            const { scans, selectedScan, runningScans } = get();
            const filteredScans = scans.filter(scan => scan.id !== id);
            const filteredRunningScans = runningScans.filter(scan => scan.id !== id);
            
            set({
              scans: filteredScans,
              runningScans: filteredRunningScans,
              selectedScan: selectedScan?.id === id ? null : selectedScan,
              loading: false,
            });
          } else {
            set({ error: response.error || 'Failed to delete scan', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to delete scan', loading: false });
        }
      },

      // Scan operations
      startScan: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post(API_ENDPOINTS.SCANS.START(id));
          
          if (response.success) {
            const { scans, runningScans } = get();
            const updatedScans = scans.map(scan =>
              scan.id === id ? { ...scan, status: 'running', progress: 0 } : scan
            );
            
            const scanToAdd = scans.find(scan => scan.id === id);
            if (scanToAdd) {
              const updatedRunningScans = [...runningScans, { ...scanToAdd, status: 'running', progress: 0 }];
              set({ scans: updatedScans, runningScans: updatedRunningScans, loading: false });
            }
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
            const { scans, runningScans } = get();
            const updatedScans = scans.map(scan =>
              scan.id === id ? { ...scan, status: 'failed', progress: 0 } : scan
            );
            
            const filteredRunningScans = runningScans.filter(scan => scan.id !== id);
            set({ scans: updatedScans, runningScans: filteredRunningScans, loading: false });
          } else {
            set({ error: response.error || 'Failed to stop scan', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to stop scan', loading: false });
        }
      },

      pauseScan: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post(API_ENDPOINTS.SCANS.PAUSE(id));
          
          if (response.success) {
            const { scans, runningScans } = get();
            const updatedScans = scans.map(scan =>
              scan.id === id ? { ...scan, status: 'paused' } : scan
            );
            
            const filteredRunningScans = runningScans.filter(scan => scan.id !== id);
            set({ scans: updatedScans, runningScans: filteredRunningScans, loading: false });
          } else {
            set({ error: response.error || 'Failed to pause scan', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to pause scan', loading: false });
        }
      },

      resumeScan: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post(API_ENDPOINTS.SCANS.RESUME(id));
          
          if (response.success) {
            const { scans, runningScans } = get();
            const updatedScans = scans.map(scan =>
              scan.id === id ? { ...scan, status: 'running' } : scan
            );
            
            const scanToAdd = scans.find(scan => scan.id === id);
            if (scanToAdd) {
              const updatedRunningScans = [...runningScans, { ...scanToAdd, status: 'running' }];
              set({ scans: updatedScans, runningScans: updatedRunningScans, loading: false });
            }
          } else {
            set({ error: response.error || 'Failed to resume scan', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to resume scan', loading: false });
        }
      },

      getScanResults: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.get(API_ENDPOINTS.SCANS.RESULTS(id));
          
          if (response.success) {
            const { scans } = get();
            const updatedScans = scans.map(scan =>
              scan.id === id ? { ...scan, ...response.data } : scan
            );
            
            set({ scans: updatedScans, loading: false });
          } else {
            set({ error: response.error || 'Failed to fetch scan results', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch scan results', loading: false });
        }
      },

      getScanLogs: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.get(API_ENDPOINTS.SCANS.LOGS(id));
          
          if (response.success) {
            const { scans } = get();
            const updatedScans = scans.map(scan =>
              scan.id === id ? { ...scan, logs: response.data } : scan
            );
            
            set({ scans: updatedScans, loading: false });
          } else {
            set({ error: response.error || 'Failed to fetch scan logs', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch scan logs', loading: false });
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),
      
      resetFilters: () => set({ filters: {} }),
      
      addScan: (scan) => {
        const { scans, runningScans } = get();
        set({ scans: [...scans, scan] });
        
        if (scan.status === 'running') {
          set({ runningScans: [...runningScans, scan] });
        }
      },
      
      removeScan: (id: string) => {
        const { scans, selectedScan, runningScans } = get();
        const filteredScans = scans.filter(scan => scan.id !== id);
        const filteredRunningScans = runningScans.filter(scan => scan.id !== id);
        
        set({
          scans: filteredScans,
          runningScans: filteredRunningScans,
          selectedScan: selectedScan?.id === id ? null : selectedScan,
        });
      },
      
      updateScanInList: (id: string, updates) => {
        const { scans, selectedScan, runningScans } = get();
        const updatedScans = scans.map(scan =>
          scan.id === id ? { ...scan, ...updates } : scan
        );
        
        const updatedRunningScans = runningScans.map(scan =>
          scan.id === id ? { ...scan, ...updates } : scan
        );
        
        set({
          scans: updatedScans,
          runningScans: updatedRunningScans,
          selectedScan: selectedScan?.id === id ? { ...selectedScan, ...updates } : selectedScan,
        });
      },

      updateScanProgress: (id: string, progress: number) => {
        const { scans, runningScans } = get();
        const updatedScans = scans.map(scan =>
          scan.id === id ? { ...scan, progress } : scan
        );
        
        const updatedRunningScans = runningScans.map(scan =>
          scan.id === id ? { ...scan, progress } : scan
        );
        
        set({ scans: updatedScans, runningScans: updatedRunningScans });
      },
    }),
    {
      name: 'scan-store',
      partialize: (state) => ({
        scans: state.scans,
        filters: state.filters,
        pagination: state.pagination,
      }),
    }
  )
);

// Selectors for better performance
export const scanSelectors = {
  getScanById: (id: string) => (state: ScanStore) =>
    state.scans.find(scan => scan.id === id),
  
  getScansByStatus: (status: string) => (state: ScanStore) =>
    state.scans.filter(scan => scan.status === status),
  
  getScansByType: (type: string) => (state: ScanStore) =>
    state.scans.filter(scan => scan.type === type),
  
  getRunningScans: (state: ScanStore) =>
    state.scans.filter(scan => scan.status === 'running'),
  
  getCompletedScans: (state: ScanStore) =>
    state.scans.filter(scan => scan.status === 'completed'),
  
  getFailedScans: (state: ScanStore) =>
    state.scans.filter(scan => scan.status === 'failed'),
  
  getScansByTarget: (targetId: string) => (state: ScanStore) =>
    state.scans.filter(scan => scan.target === targetId),
  
  getFilteredScans: (state: ScanStore) => {
    const { scans, filters } = state;
    let filtered = scans;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(scan =>
        scan.name.toLowerCase().includes(search) ||
        scan.targetName.toLowerCase().includes(search) ||
        scan.description?.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(scan => scan.status === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter(scan => scan.type === filters.type);
    }

    if (filters.target) {
      filtered = filtered.filter(scan => scan.target === filters.target);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(scan => scan.startTime >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(scan => scan.startTime <= filters.dateTo!);
    }

    return filtered;
  },
};

export default useScanStore; 