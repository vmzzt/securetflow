import { create } from 'zustand';

export interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  
  // Theme state
  theme: 'light' | 'dark';
  
  // Loading state
  globalLoading: boolean;
  
  // Responsive state
  isMobile: boolean;
  
  // Navigation state
  currentRoute: string;
}

export interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setGlobalLoading: (loading: boolean) => void;
  setCurrentRoute: (route: string) => void;
  setMobile: (isMobile: boolean) => void;
}

export type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  sidebarOpen: false,
  theme: 'light',
  globalLoading: false,
  isMobile: false,
  currentRoute: '/dashboard',

  // Actions
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (theme) => set({ theme }),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  setCurrentRoute: (route) => set({ currentRoute: route }),
  setMobile: (isMobile) => set({ isMobile }),
})); 