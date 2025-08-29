import { create } from 'zustand';

interface Target {
  id: string | number;
  name: string;
  url: string;
  type: 'web' | 'api' | 'network' | 'mobile';
  status: 'active' | 'inactive' | 'scanning';
  description?: string;
  lastScan?: string;
  vulnerabilities?: number;
  createdAt: string;
}

interface TargetState {
  targets: Target[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTargets: () => Promise<Target[]>;
  createTarget: (target: Partial<Target>) => Promise<Target>;
  updateTarget: (id: string | number, updates: Partial<Target>) => void;
  deleteTarget: (id: string | number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTargetStore = create<TargetState>((set, get) => ({
  targets: [
    {
      id: '1',
      name: 'Site Principal',
      url: 'https://example.com',
      type: 'web',
      status: 'active',
      description: 'Site principal da empresa',
      lastScan: new Date().toISOString(),
      vulnerabilities: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'API Gateway',
      url: 'https://api.example.com',
      type: 'api',
      status: 'active',
      description: 'Gateway de APIs',
      vulnerabilities: 1,
      createdAt: new Date().toISOString()
    }
  ],
  isLoading: false,
  error: null,

  fetchTargets: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const targets = get().targets;
      set({ targets, isLoading: false });
      return targets;
    } catch (error) {
      set({ error: 'Erro ao carregar targets', isLoading: false });
      return [];
    }
  },

  createTarget: async (targetData: Partial<Target>) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newTarget: Target = {
        id: Date.now().toString(),
        name: targetData.name || 'Novo Target',
        url: targetData.url || '',
        type: targetData.type || 'web',
        status: 'active',
        vulnerabilities: 0,
        createdAt: new Date().toISOString(),
        ...targetData
      };
      
      set(state => ({ 
        targets: [...state.targets, newTarget], 
        isLoading: false 
      }));
      
      return newTarget;
    } catch (error) {
      set({ error: 'Erro ao criar target', isLoading: false });
      throw error;
    }
  },

  updateTarget: (id: string | number, updates: Partial<Target>) => {
    set(state => ({
      targets: state.targets.map(target => 
        target.id === id ? { ...target, ...updates } : target
      )
    }));
  },

  deleteTarget: (id: string | number) => {
    set(state => ({
      targets: state.targets.filter(target => target.id !== id)
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  }
})); 