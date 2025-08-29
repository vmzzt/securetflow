import { create } from 'zustand';

interface Scan {
  id: string | number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  target: string;
  createdAt: string;
  completedAt?: string;
  duration?: string;
  results?: any;
}

interface ScanState {
  scans: Scan[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchScans: () => Promise<Scan[]>;
  createScan: (scan: Partial<Scan>) => Promise<Scan>;
  updateScan: (id: string | number, updates: Partial<Scan>) => void;
  deleteScan: (id: string | number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useScanStore = create<ScanState>((set, get) => ({
  scans: [
    {
      id: '1',
      name: 'Scan de Vulnerabilidades Web',
      status: 'completed',
      target: 'https://example.com',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      duration: '2m 34s'
    },
    {
      id: '2',
      name: 'Scan de Portas',
      status: 'running',
      target: '192.168.1.100',
      createdAt: new Date().toISOString()
    }
  ],
  isLoading: false,
  error: null,

  fetchScans: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const scans = get().scans;
      set({ scans, isLoading: false });
      return scans;
    } catch (error) {
      set({ error: 'Erro ao carregar scans', isLoading: false });
      return [];
    }
  },

  createScan: async (scanData: Partial<Scan>) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newScan: Scan = {
        id: Date.now().toString(),
        name: scanData.name || 'Novo Scan',
        status: 'pending',
        target: scanData.target || '',
        createdAt: new Date().toISOString(),
        ...scanData
      };
      
      set(state => ({ 
        scans: [...state.scans, newScan], 
        isLoading: false 
      }));
      
      return newScan;
    } catch (error) {
      set({ error: 'Erro ao criar scan', isLoading: false });
      throw error;
    }
  },

  updateScan: (id: string | number, updates: Partial<Scan>) => {
    set(state => ({
      scans: state.scans.map(scan => 
        scan.id === id ? { ...scan, ...updates } : scan
      )
    }));
  },

  deleteScan: (id: string | number) => {
    set(state => ({
      scans: state.scans.filter(scan => scan.id !== id)
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  }
})); 