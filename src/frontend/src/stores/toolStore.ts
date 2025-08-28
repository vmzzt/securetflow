import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, API_ENDPOINTS } from '../services/api/client';

export interface Tool {
  id: string;
  name: string;
  category: 'network' | 'web' | 'vulnerability' | 'exploitation' | 'forensics' | 'custom';
  status: 'available' | 'running' | 'error' | 'maintenance';
  version: string;
  description: string;
  author: string;
  lastUsed?: string;
  usageCount: number;
  avgExecutionTime: number;
  tags: string[];
  command?: string;
  parameters?: string[];
  output?: string;
  isCustom: boolean;
}

export interface ToolFilters {
  search?: string;
  category?: string;
  status?: string;
  tags?: string[];
  isCustom?: boolean;
}

export interface ToolState {
  tools: Tool[];
  selectedTool: Tool | null;
  runningTools: Tool[];
  loading: boolean;
  error: string | null;
  filters: ToolFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    available: number;
    running: number;
    error: number;
    maintenance: number;
    network: number;
    web: number;
    vulnerability: number;
    exploitation: number;
    forensics: number;
    custom: number;
  };
}

export interface ToolActions {
  // State management
  setTools: (tools: Tool[]) => void;
  setSelectedTool: (tool: Tool | null) => void;
  setRunningTools: (tools: Tool[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ToolFilters) => void;
  setPagination: (pagination: ToolState['pagination']) => void;
  setStats: (stats: ToolState['stats']) => void;
  
  // CRUD operations
  fetchTools: (params?: Record<string, any>) => Promise<void>;
  fetchTool: (id: string) => Promise<void>;
  createTool: (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTool: (id: string, tool: Partial<Tool>) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  
  // Tool operations
  executeTool: (id: string, parameters?: Record<string, any>) => Promise<void>;
  stopTool: (id: string) => Promise<void>;
  getToolConfig: (id: string) => Promise<void>;
  updateToolConfig: (id: string, config: Record<string, any>) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  resetFilters: () => void;
  addTool: (tool: Tool) => void;
  removeTool: (id: string) => void;
  updateToolInList: (id: string, updates: Partial<Tool>) => void;
  calculateStats: () => void;
}

export type ToolStore = ToolState & ToolActions;

const initialState: ToolState = {
  tools: [],
  selectedTool: null,
  runningTools: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  stats: {
    total: 0,
    available: 0,
    running: 0,
    error: 0,
    maintenance: 0,
    network: 0,
    web: 0,
    vulnerability: 0,
    exploitation: 0,
    forensics: 0,
    custom: 0,
  },
};

export const useToolStore = create<ToolStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // State management
      setTools: (tools) => set({ tools }),
      setSelectedTool: (tool) => set({ selectedTool: tool }),
      setRunningTools: (tools) => set({ runningTools: tools }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set({ filters }),
      setPagination: (pagination) => set({ pagination }),
      setStats: (stats) => set({ stats }),

      // CRUD operations
      fetchTools: async (params = {}) => {
        const { filters, pagination } = get();
        
        set({ loading: true, error: null });
        
        try {
          const queryParams = {
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
            ...params,
          };

          const response = await apiService.get<Tool[]>(API_ENDPOINTS.TOOLS.LIST, queryParams);
          
          if (response.success) {
            const runningTools = response.data.filter(tool => tool.status === 'running');
            set({
              tools: response.data,
              runningTools,
              pagination: response.pagination || pagination,
              loading: false,
            });
            
            // Calculate stats after fetching
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to fetch tools', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch tools', loading: false });
        }
      },

      fetchTool: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.get<Tool>(API_ENDPOINTS.TOOLS.GET(id));
          
          if (response.success) {
            set({ selectedTool: response.data, loading: false });
          } else {
            set({ error: response.error || 'Failed to fetch tool', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch tool', loading: false });
        }
      },

      createTool: async (toolData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post<Tool>(API_ENDPOINTS.TOOLS.CREATE, toolData);
          
          if (response.success) {
            const { tools } = get();
            set({
              tools: [...tools, response.data],
              loading: false,
            });
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to create tool', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to create tool', loading: false });
        }
      },

      updateTool: async (id: string, toolData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.put<Tool>(API_ENDPOINTS.TOOLS.UPDATE(id), toolData);
          
          if (response.success) {
            const { tools, selectedTool, runningTools } = get();
            const updatedTools = tools.map(tool =>
              tool.id === id ? { ...tool, ...response.data } : tool
            );
            
            const updatedRunningTools = runningTools.map(tool =>
              tool.id === id ? { ...tool, ...response.data } : tool
            );
            
            set({
              tools: updatedTools,
              runningTools: updatedRunningTools,
              selectedTool: selectedTool?.id === id ? response.data : selectedTool,
              loading: false,
            });
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to update tool', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to update tool', loading: false });
        }
      },

      deleteTool: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.delete(API_ENDPOINTS.TOOLS.DELETE(id));
          
          if (response.success) {
            const { tools, selectedTool, runningTools } = get();
            const filteredTools = tools.filter(tool => tool.id !== id);
            const filteredRunningTools = runningTools.filter(tool => tool.id !== id);
            
            set({
              tools: filteredTools,
              runningTools: filteredRunningTools,
              selectedTool: selectedTool?.id === id ? null : selectedTool,
              loading: false,
            });
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to delete tool', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to delete tool', loading: false });
        }
      },

      // Tool operations
      executeTool: async (id: string, parameters = {}) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post(API_ENDPOINTS.TOOLS.EXECUTE(id), { parameters });
          
          if (response.success) {
            const { tools, runningTools } = get();
            const updatedTools = tools.map(tool =>
              tool.id === id ? { ...tool, status: 'running' } : tool
            );
            
            const toolToAdd = tools.find(tool => tool.id === id);
            if (toolToAdd) {
              const updatedRunningTools = [...runningTools, { ...toolToAdd, status: 'running' }];
              set({ tools: updatedTools, runningTools: updatedRunningTools, loading: false });
            }
          } else {
            set({ error: response.error || 'Failed to execute tool', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to execute tool', loading: false });
        }
      },

      stopTool: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post(API_ENDPOINTS.TOOLS.STOP(id));
          
          if (response.success) {
            const { tools, runningTools } = get();
            const updatedTools = tools.map(tool =>
              tool.id === id ? { ...tool, status: 'available' } : tool
            );
            
            const filteredRunningTools = runningTools.filter(tool => tool.id !== id);
            set({ tools: updatedTools, runningTools: filteredRunningTools, loading: false });
          } else {
            set({ error: response.error || 'Failed to stop tool', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to stop tool', loading: false });
        }
      },

      getToolConfig: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.get(API_ENDPOINTS.TOOLS.CONFIG(id));
          
          if (response.success) {
            const { selectedTool } = get();
            if (selectedTool?.id === id) {
              set({
                selectedTool: { ...selectedTool, config: response.data.config },
                loading: false,
              });
            }
          } else {
            set({ error: response.error || 'Failed to fetch tool config', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch tool config', loading: false });
        }
      },

      updateToolConfig: async (id: string, config) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.put(API_ENDPOINTS.TOOLS.CONFIG(id), config);
          
          if (response.success) {
            const { tools, selectedTool } = get();
            const updatedTools = tools.map(tool =>
              tool.id === id ? { ...tool, config } : tool
            );
            
            set({
              tools: updatedTools,
              selectedTool: selectedTool?.id === id ? { ...selectedTool, config } : selectedTool,
              loading: false,
            });
          } else {
            set({ error: response.error || 'Failed to update tool config', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to update tool config', loading: false });
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),
      
      resetFilters: () => set({ filters: {} }),
      
      addTool: (tool) => {
        const { tools, runningTools } = get();
        set({ tools: [...tools, tool] });
        
        if (tool.status === 'running') {
          set({ runningTools: [...runningTools, tool] });
        }
        get().calculateStats();
      },
      
      removeTool: (id: string) => {
        const { tools, selectedTool, runningTools } = get();
        const filteredTools = tools.filter(tool => tool.id !== id);
        const filteredRunningTools = runningTools.filter(tool => tool.id !== id);
        
        set({
          tools: filteredTools,
          runningTools: filteredRunningTools,
          selectedTool: selectedTool?.id === id ? null : selectedTool,
        });
        get().calculateStats();
      },
      
      updateToolInList: (id: string, updates) => {
        const { tools, selectedTool, runningTools } = get();
        const updatedTools = tools.map(tool =>
          tool.id === id ? { ...tool, ...updates } : tool
        );
        
        const updatedRunningTools = runningTools.map(tool =>
          tool.id === id ? { ...tool, ...updates } : tool
        );
        
        set({
          tools: updatedTools,
          runningTools: updatedRunningTools,
          selectedTool: selectedTool?.id === id ? { ...selectedTool, ...updates } : selectedTool,
        });
        get().calculateStats();
      },

      calculateStats: () => {
        const { tools } = get();
        
        const stats = {
          total: tools.length,
          available: tools.filter(t => t.status === 'available').length,
          running: tools.filter(t => t.status === 'running').length,
          error: tools.filter(t => t.status === 'error').length,
          maintenance: tools.filter(t => t.status === 'maintenance').length,
          network: tools.filter(t => t.category === 'network').length,
          web: tools.filter(t => t.category === 'web').length,
          vulnerability: tools.filter(t => t.category === 'vulnerability').length,
          exploitation: tools.filter(t => t.category === 'exploitation').length,
          forensics: tools.filter(t => t.category === 'forensics').length,
          custom: tools.filter(t => t.category === 'custom').length,
        };
        
        set({ stats });
      },
    }),
    {
      name: 'tool-store',
      partialize: (state) => ({
        tools: state.tools,
        filters: state.filters,
        pagination: state.pagination,
        stats: state.stats,
      }),
    }
  )
);

// Selectors for better performance
export const toolSelectors = {
  getToolById: (id: string) => (state: ToolStore) =>
    state.tools.find(tool => tool.id === id),
  
  getToolsByCategory: (category: string) => (state: ToolStore) =>
    state.tools.filter(tool => tool.category === category),
  
  getToolsByStatus: (status: string) => (state: ToolStore) =>
    state.tools.filter(tool => tool.status === status),
  
  getCustomTools: (state: ToolStore) =>
    state.tools.filter(tool => tool.isCustom),
  
  getBuiltInTools: (state: ToolStore) =>
    state.tools.filter(tool => !tool.isCustom),
  
  getToolsByTag: (tag: string) => (state: ToolStore) =>
    state.tools.filter(tool => tool.tags.includes(tag)),
  
  getFilteredTools: (state: ToolStore) => {
    const { tools, filters } = state;
    let filtered = tools;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(search) ||
        tool.description.toLowerCase().includes(search) ||
        tool.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (filters.category) {
      filtered = filtered.filter(tool => tool.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(tool => tool.status === filters.status);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(tool =>
        filters.tags!.some(tag => tool.tags.includes(tag))
      );
    }

    if (filters.isCustom !== undefined) {
      filtered = filtered.filter(tool => tool.isCustom === filters.isCustom);
    }

    return filtered;
  },
};

export default useToolStore; 