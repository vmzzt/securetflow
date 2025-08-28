import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, API_ENDPOINTS } from '../services/api/client';

export interface Report {
  id: string;
  title: string;
  type: 'executive' | 'technical' | 'compliance' | 'custom';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  target: string;
  targetName: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  description?: string;
  tags: string[];
  format: 'pdf' | 'html' | 'docx' | 'json';
  template?: string;
  sections?: string[];
  data?: Record<string, any>;
}

export interface ReportFilters {
  search?: string;
  type?: string;
  status?: string;
  target?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ReportState {
  reports: Report[];
  selectedReport: Report | null;
  loading: boolean;
  error: string | null;
  filters: ReportFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    draft: number;
    inProgress: number;
    completed: number;
    archived: number;
    executive: number;
    technical: number;
    compliance: number;
    custom: number;
  };
}

export interface ReportActions {
  // State management
  setReports: (reports: Report[]) => void;
  setSelectedReport: (report: Report | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ReportFilters) => void;
  setPagination: (pagination: ReportState['pagination']) => void;
  setStats: (stats: ReportState['stats']) => void;
  
  // CRUD operations
  fetchReports: (params?: Record<string, any>) => Promise<void>;
  fetchReport: (id: string) => Promise<void>;
  createReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateReport: (id: string, report: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  
  // Report operations
  generateReport: (id: string) => Promise<void>;
  exportReport: (id: string, format: string) => Promise<void>;
  duplicateReport: (id: string) => Promise<void>;
  archiveReport: (id: string) => Promise<void>;
  restoreReport: (id: string) => Promise<void>;
  
  // Templates
  fetchTemplates: () => Promise<void>;
  createTemplate: (template: any) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  resetFilters: () => void;
  addReport: (report: Report) => void;
  removeReport: (id: string) => void;
  updateReportInList: (id: string, updates: Partial<Report>) => void;
  calculateStats: () => void;
}

export type ReportStore = ReportState & ReportActions;

const initialState: ReportState = {
  reports: [],
  selectedReport: null,
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
    draft: 0,
    inProgress: 0,
    completed: 0,
    archived: 0,
    executive: 0,
    technical: 0,
    compliance: 0,
    custom: 0,
  },
};

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // State management
      setReports: (reports) => set({ reports }),
      setSelectedReport: (report) => set({ selectedReport: report }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set({ filters }),
      setPagination: (pagination) => set({ pagination }),
      setStats: (stats) => set({ stats }),

      // CRUD operations
      fetchReports: async (params = {}) => {
        const { filters, pagination } = get();
        
        set({ loading: true, error: null });
        
        try {
          const queryParams = {
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
            ...params,
          };

          const response = await apiService.get<Report[]>(API_ENDPOINTS.REPORTS.LIST, queryParams);
          
          if (response.success) {
            set({
              reports: response.data,
              pagination: response.pagination || pagination,
              loading: false,
            });
            
            // Calculate stats after fetching
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to fetch reports', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch reports', loading: false });
        }
      },

      fetchReport: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.get<Report>(API_ENDPOINTS.REPORTS.GET(id));
          
          if (response.success) {
            set({ selectedReport: response.data, loading: false });
          } else {
            set({ error: response.error || 'Failed to fetch report', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch report', loading: false });
        }
      },

      createReport: async (reportData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post<Report>(API_ENDPOINTS.REPORTS.CREATE, reportData);
          
          if (response.success) {
            const { reports } = get();
            set({
              reports: [...reports, response.data],
              loading: false,
            });
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to create report', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to create report', loading: false });
        }
      },

      updateReport: async (id: string, reportData) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.put<Report>(API_ENDPOINTS.REPORTS.UPDATE(id), reportData);
          
          if (response.success) {
            const { reports, selectedReport } = get();
            const updatedReports = reports.map(report =>
              report.id === id ? { ...report, ...response.data } : report
            );
            
            set({
              reports: updatedReports,
              selectedReport: selectedReport?.id === id ? response.data : selectedReport,
              loading: false,
            });
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to update report', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to update report', loading: false });
        }
      },

      deleteReport: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.delete(API_ENDPOINTS.REPORTS.DELETE(id));
          
          if (response.success) {
            const { reports, selectedReport } = get();
            const filteredReports = reports.filter(report => report.id !== id);
            
            set({
              reports: filteredReports,
              selectedReport: selectedReport?.id === id ? null : selectedReport,
              loading: false,
            });
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to delete report', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to delete report', loading: false });
        }
      },

      // Report operations
      generateReport: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post(API_ENDPOINTS.REPORTS.GENERATE, { reportId: id });
          
          if (response.success) {
            const { reports, selectedReport } = get();
            const updatedReports = reports.map(report =>
              report.id === id ? { ...report, status: 'in_progress' } : report
            );
            
            set({
              reports: updatedReports,
              selectedReport: selectedReport?.id === id ? { ...selectedReport, status: 'in_progress' } : selectedReport,
              loading: false,
            });
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to generate report', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to generate report', loading: false });
        }
      },

      exportReport: async (id: string, format: string) => {
        set({ loading: true, error: null });
        
        try {
          await apiService.download(API_ENDPOINTS.REPORTS.EXPORT(id), { format });
          set({ loading: false });
        } catch (error) {
          set({ error: 'Failed to export report', loading: false });
        }
      },

      duplicateReport: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post(API_ENDPOINTS.REPORTS.CREATE, {
            duplicateFrom: id,
          });
          
          if (response.success) {
            const { reports } = get();
            set({
              reports: [...reports, response.data],
              loading: false,
            });
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to duplicate report', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to duplicate report', loading: false });
        }
      },

      archiveReport: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.patch(API_ENDPOINTS.REPORTS.UPDATE(id), { status: 'archived' });
          
          if (response.success) {
            const { reports, selectedReport } = get();
            const updatedReports = reports.map(report =>
              report.id === id ? { ...report, status: 'archived' } : report
            );
            
            set({
              reports: updatedReports,
              selectedReport: selectedReport?.id === id ? { ...selectedReport, status: 'archived' } : selectedReport,
              loading: false,
            });
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to archive report', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to archive report', loading: false });
        }
      },

      restoreReport: async (id: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.patch(API_ENDPOINTS.REPORTS.UPDATE(id), { status: 'draft' });
          
          if (response.success) {
            const { reports, selectedReport } = get();
            const updatedReports = reports.map(report =>
              report.id === id ? { ...report, status: 'draft' } : report
            );
            
            set({
              reports: updatedReports,
              selectedReport: selectedReport?.id === id ? { ...selectedReport, status: 'draft' } : selectedReport,
              loading: false,
            });
            get().calculateStats();
          } else {
            set({ error: response.error || 'Failed to restore report', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to restore report', loading: false });
        }
      },

      // Templates
      fetchTemplates: async () => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.get(API_ENDPOINTS.REPORTS.TEMPLATES);
          
          if (response.success) {
            // Handle templates data
            set({ loading: false });
          } else {
            set({ error: response.error || 'Failed to fetch templates', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to fetch templates', loading: false });
        }
      },

      createTemplate: async (template) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiService.post(API_ENDPOINTS.REPORTS.TEMPLATES, template);
          
          if (response.success) {
            set({ loading: false });
          } else {
            set({ error: response.error || 'Failed to create template', loading: false });
          }
        } catch (error) {
          set({ error: 'Failed to create template', loading: false });
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),
      
      resetFilters: () => set({ filters: {} }),
      
      addReport: (report) => {
        const { reports } = get();
        set({ reports: [...reports, report] });
        get().calculateStats();
      },
      
      removeReport: (id: string) => {
        const { reports, selectedReport } = get();
        const filteredReports = reports.filter(report => report.id !== id);
        
        set({
          reports: filteredReports,
          selectedReport: selectedReport?.id === id ? null : selectedReport,
        });
        get().calculateStats();
      },
      
      updateReportInList: (id: string, updates) => {
        const { reports, selectedReport } = get();
        const updatedReports = reports.map(report =>
          report.id === id ? { ...report, ...updates } : report
        );
        
        set({
          reports: updatedReports,
          selectedReport: selectedReport?.id === id ? { ...selectedReport, ...updates } : selectedReport,
        });
        get().calculateStats();
      },

      calculateStats: () => {
        const { reports } = get();
        
        const stats = {
          total: reports.length,
          draft: reports.filter(r => r.status === 'draft').length,
          inProgress: reports.filter(r => r.status === 'in_progress').length,
          completed: reports.filter(r => r.status === 'completed').length,
          archived: reports.filter(r => r.status === 'archived').length,
          executive: reports.filter(r => r.type === 'executive').length,
          technical: reports.filter(r => r.type === 'technical').length,
          compliance: reports.filter(r => r.type === 'compliance').length,
          custom: reports.filter(r => r.type === 'custom').length,
        };
        
        set({ stats });
      },
    }),
    {
      name: 'report-store',
      partialize: (state) => ({
        reports: state.reports,
        filters: state.filters,
        pagination: state.pagination,
        stats: state.stats,
      }),
    }
  )
);

// Selectors for better performance
export const reportSelectors = {
  getReportById: (id: string) => (state: ReportStore) =>
    state.reports.find(report => report.id === id),
  
  getReportsByType: (type: string) => (state: ReportStore) =>
    state.reports.filter(report => report.type === type),
  
  getReportsByStatus: (status: string) => (state: ReportStore) =>
    state.reports.filter(report => report.status === status),
  
  getReportsByTarget: (targetId: string) => (state: ReportStore) =>
    state.reports.filter(report => report.target === targetId),
  
  getReportsByAuthor: (author: string) => (state: ReportStore) =>
    state.reports.filter(report => report.author === author),
  
  getCompletedReports: (state: ReportStore) =>
    state.reports.filter(report => report.status === 'completed'),
  
  getDraftReports: (state: ReportStore) =>
    state.reports.filter(report => report.status === 'draft'),
  
  getReportsByTag: (tag: string) => (state: ReportStore) =>
    state.reports.filter(report => report.tags.includes(tag)),
  
  getFilteredReports: (state: ReportStore) => {
    const { reports, filters } = state;
    let filtered = reports;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(search) ||
        report.targetName.toLowerCase().includes(search) ||
        report.description?.toLowerCase().includes(search) ||
        report.author.toLowerCase().includes(search)
      );
    }

    if (filters.type) {
      filtered = filtered.filter(report => report.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    if (filters.target) {
      filtered = filtered.filter(report => report.target === filters.target);
    }

    if (filters.author) {
      filtered = filtered.filter(report => report.author === filters.author);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(report => report.createdAt >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(report => report.createdAt <= filters.dateTo!);
    }

    return filtered;
  },
};

export default useReportStore; 