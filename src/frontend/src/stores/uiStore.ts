import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  
  // Header state
  headerHeight: number;
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
  
  // Modal state
  modals: Array<{
    id: string;
    component: string;
    props: Record<string, any>;
    zIndex: number;
  }>;
  
  // Toast state
  toasts: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message?: string;
    duration: number;
    timestamp: number;
  }>;
  
  // Loading state
  loadingStates: Record<string, boolean>;
  globalLoading: boolean;
  
  // Theme state
  theme: 'light' | 'dark' | 'auto';
  colorScheme: 'blue' | 'green' | 'purple' | 'red' | 'orange';
  
  // Layout state
  layout: 'default' | 'compact' | 'wide';
  sidebarPosition: 'left' | 'right';
  
  // Responsive state
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  // Navigation state
  currentRoute: string;
  previousRoute: string;
  navigationHistory: string[];
  
  // Form state
  formErrors: Record<string, string[]>;
  formDirty: Record<string, boolean>;
  
  // Table state
  tableStates: Record<string, {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    pageSize: number;
    filters: Record<string, any>;
    selectedRows: string[];
  }>;
  
  // Search state
  searchQuery: string;
  searchHistory: string[];
  
  // Notification state
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message?: string;
    read: boolean;
    timestamp: number;
  }>;
  
  // Tooltip state
  tooltips: Record<string, {
    visible: boolean;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right';
  }>;
  
  // Context menu state
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    items: Array<{
      label: string;
      action: () => void;
      disabled?: boolean;
      icon?: string;
    }>;
  };
  
  // Keyboard shortcuts state
  keyboardShortcuts: Record<string, {
    key: string;
    description: string;
    action: () => void;
    enabled: boolean;
  }>;
  
  // Accessibility state
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
    screenReader: boolean;
  };
}

export interface UIActions {
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;
  
  // Header actions
  setHeaderHeight: (height: number) => void;
  setBreadcrumbs: (breadcrumbs: UIState['breadcrumbs']) => void;
  addBreadcrumb: (breadcrumb: UIState['breadcrumbs'][0]) => void;
  removeBreadcrumb: (index: number) => void;
  
  // Modal actions
  openModal: (id: string, component: string, props?: Record<string, any>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModal: (id: string, updates: Partial<UIState['modals'][0]>) => void;
  
  // Toast actions
  showToast: (toast: Omit<UIState['toasts'][0], 'id' | 'timestamp'>) => void;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
  
  // Loading actions
  setLoading: (key: string, loading: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  clearLoading: (key: string) => void;
  clearAllLoading: () => void;
  
  // Theme actions
  setTheme: (theme: UIState['theme']) => void;
  setColorScheme: (colorScheme: UIState['colorScheme']) => void;
  toggleTheme: () => void;
  
  // Layout actions
  setLayout: (layout: UIState['layout']) => void;
  setSidebarPosition: (position: UIState['sidebarPosition']) => void;
  
  // Responsive actions
  setScreenSize: (size: UIState['screenSize']) => void;
  setDeviceType: (isMobile: boolean, isTablet: boolean, isDesktop: boolean) => void;
  
  // Navigation actions
  setCurrentRoute: (route: string) => void;
  addToHistory: (route: string) => void;
  clearHistory: () => void;
  goBack: () => void;
  
  // Form actions
  setFormErrors: (formId: string, errors: string[]) => void;
  clearFormErrors: (formId: string) => void;
  setFormDirty: (formId: string, dirty: boolean) => void;
  clearFormDirty: (formId: string) => void;
  
  // Table actions
  setTableState: (tableId: string, state: Partial<UIState['tableStates'][string]>) => void;
  resetTableState: (tableId: string) => void;
  setTableSort: (tableId: string, sortBy: string, sortOrder: 'asc' | 'desc') => void;
  setTablePage: (tableId: string, page: number) => void;
  setTablePageSize: (tableId: string, pageSize: number) => void;
  setTableFilters: (tableId: string, filters: Record<string, any>) => void;
  setTableSelectedRows: (tableId: string, selectedRows: string[]) => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  // Notification actions
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Tooltip actions
  showTooltip: (id: string, content: string, position?: UIState['tooltips'][string]['position']) => void;
  hideTooltip: (id: string) => void;
  hideAllTooltips: () => void;
  
  // Context menu actions
  showContextMenu: (x: number, y: number, items: UIState['contextMenu']['items']) => void;
  hideContextMenu: () => void;
  
  // Keyboard shortcuts actions
  registerShortcut: (id: string, shortcut: UIState['keyboardShortcuts'][string]) => void;
  unregisterShortcut: (id: string) => void;
  toggleShortcut: (id: string, enabled: boolean) => void;
  
  // Accessibility actions
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setFontSize: (size: UIState['accessibility']['fontSize']) => void;
  setScreenReader: (enabled: boolean) => void;
  
  // Utility actions
  reset: () => void;
  resetToDefaults: () => void;
}

export type UIStore = UIState & UIActions;

const initialState: UIState = {
  // Sidebar
  sidebarCollapsed: false,
  sidebarWidth: 280,
  
  // Header
  headerHeight: 64,
  breadcrumbs: [],
  
  // Modals
  modals: [],
  
  // Toasts
  toasts: [],
  
  // Loading
  loadingStates: {},
  globalLoading: false,
  
  // Theme
  theme: 'auto',
  colorScheme: 'blue',
  
  // Layout
  layout: 'default',
  sidebarPosition: 'left',
  
  // Responsive
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  screenSize: 'lg',
  
  // Navigation
  currentRoute: '/',
  previousRoute: '',
  navigationHistory: [],
  
  // Form
  formErrors: {},
  formDirty: {},
  
  // Table
  tableStates: {},
  
  // Search
  searchQuery: '',
  searchHistory: [],
  
  // Notifications
  notifications: [],
  
  // Tooltips
  tooltips: {},
  
  // Context menu
  contextMenu: {
    visible: false,
    x: 0,
    y: 0,
    items: [],
  },
  
  // Keyboard shortcuts
  keyboardShortcuts: {},
  
  // Accessibility
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    screenReader: false,
  },
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Sidebar actions
      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSidebarWidth: (width) => set({ sidebarWidth: width }),

      // Header actions
      setHeaderHeight: (height) => set({ headerHeight: height }),
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
      addBreadcrumb: (breadcrumb) => set(state => ({ 
        breadcrumbs: [...state.breadcrumbs, breadcrumb] 
      })),
      removeBreadcrumb: (index) => set(state => ({
        breadcrumbs: state.breadcrumbs.filter((_, i) => i !== index)
      })),

      // Modal actions
      openModal: (id, component, props = {}) => set(state => {
        const zIndex = Math.max(...state.modals.map(m => m.zIndex), 1000) + 1;
        return {
          modals: [...state.modals, { id, component, props, zIndex }]
        };
      }),
      closeModal: (id) => set(state => ({
        modals: state.modals.filter(m => m.id !== id)
      })),
      closeAllModals: () => set({ modals: [] }),
      updateModal: (id, updates) => set(state => ({
        modals: state.modals.map(m => m.id === id ? { ...m, ...updates } : m)
      })),

      // Toast actions
      showToast: (toast) => set(state => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast = { ...toast, id, timestamp: Date.now() };
        return { toasts: [...state.toasts, newToast] };
      }),
      hideToast: (id) => set(state => ({
        toasts: state.toasts.filter(t => t.id !== id)
      })),
      hideAllToasts: () => set({ toasts: [] }),

      // Loading actions
      setLoading: (key, loading) => set(state => ({
        loadingStates: { ...state.loadingStates, [key]: loading }
      })),
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
      clearLoading: (key) => set(state => {
        const newLoadingStates = { ...state.loadingStates };
        delete newLoadingStates[key];
        return { loadingStates: newLoadingStates };
      }),
      clearAllLoading: () => set({ loadingStates: {}, globalLoading: false }),

      // Theme actions
      setTheme: (theme) => set({ theme }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
      toggleTheme: () => set(state => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),

      // Layout actions
      setLayout: (layout) => set({ layout }),
      setSidebarPosition: (position) => set({ sidebarPosition: position }),

      // Responsive actions
      setScreenSize: (screenSize) => set({ screenSize }),
      setDeviceType: (isMobile, isTablet, isDesktop) => set({ isMobile, isTablet, isDesktop }),

      // Navigation actions
      setCurrentRoute: (route) => set(state => ({
        previousRoute: state.currentRoute,
        currentRoute: route
      })),
      addToHistory: (route) => set(state => ({
        navigationHistory: [...state.navigationHistory, route]
      })),
      clearHistory: () => set({ navigationHistory: [] }),
      goBack: () => set(state => {
        const history = [...state.navigationHistory];
        const previousRoute = history.pop() || '/';
        return {
          navigationHistory: history,
          currentRoute: previousRoute
        };
      }),

      // Form actions
      setFormErrors: (formId, errors) => set(state => ({
        formErrors: { ...state.formErrors, [formId]: errors }
      })),
      clearFormErrors: (formId) => set(state => {
        const newFormErrors = { ...state.formErrors };
        delete newFormErrors[formId];
        return { formErrors: newFormErrors };
      }),
      setFormDirty: (formId, dirty) => set(state => ({
        formDirty: { ...state.formDirty, [formId]: dirty }
      })),
      clearFormDirty: (formId) => set(state => {
        const newFormDirty = { ...state.formDirty };
        delete newFormDirty[formId];
        return { formDirty: newFormDirty };
      }),

      // Table actions
      setTableState: (tableId, state) => set(uiState => ({
        tableStates: {
          ...uiState.tableStates,
          [tableId]: { ...uiState.tableStates[tableId], ...state }
        }
      })),
      resetTableState: (tableId) => set(state => {
        const newTableStates = { ...state.tableStates };
        delete newTableStates[tableId];
        return { tableStates: newTableStates };
      }),
      setTableSort: (tableId, sortBy, sortOrder) => get().setTableState(tableId, { sortBy, sortOrder }),
      setTablePage: (tableId, page) => get().setTableState(tableId, { page }),
      setTablePageSize: (tableId, pageSize) => get().setTableState(tableId, { pageSize }),
      setTableFilters: (tableId, filters) => get().setTableState(tableId, { filters }),
      setTableSelectedRows: (tableId, selectedRows) => get().setTableState(tableId, { selectedRows }),

      // Search actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      addSearchHistory: (query) => set(state => ({
        searchHistory: [query, ...state.searchHistory.filter(h => h !== query)].slice(0, 10)
      })),
      clearSearchHistory: () => set({ searchHistory: [] }),

      // Notification actions
      addNotification: (notification) => set(state => {
        const id = `notification-${Date.now()}-${Math.random()}`;
        const newNotification = { ...notification, id, timestamp: Date.now() };
        return { notifications: [...state.notifications, newNotification] };
      }),
      markNotificationAsRead: (id) => set(state => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),
      markAllNotificationsAsRead: () => set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      removeNotification: (id) => set(state => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      clearNotifications: () => set({ notifications: [] }),

      // Tooltip actions
      showTooltip: (id, content, position = 'top') => set(state => ({
        tooltips: { ...state.tooltips, [id]: { visible: true, content, position } }
      })),
      hideTooltip: (id) => set(state => {
        const newTooltips = { ...state.tooltips };
        delete newTooltips[id];
        return { tooltips: newTooltips };
      }),
      hideAllTooltips: () => set({ tooltips: {} }),

      // Context menu actions
      showContextMenu: (x, y, items) => set({
        contextMenu: { visible: true, x, y, items }
      }),
      hideContextMenu: () => set({
        contextMenu: { visible: false, x: 0, y: 0, items: [] }
      }),

      // Keyboard shortcuts actions
      registerShortcut: (id, shortcut) => set(state => ({
        keyboardShortcuts: { ...state.keyboardShortcuts, [id]: shortcut }
      })),
      unregisterShortcut: (id) => set(state => {
        const newShortcuts = { ...state.keyboardShortcuts };
        delete newShortcuts[id];
        return { keyboardShortcuts: newShortcuts };
      }),
      toggleShortcut: (id, enabled) => set(state => ({
        keyboardShortcuts: {
          ...state.keyboardShortcuts,
          [id]: { ...state.keyboardShortcuts[id], enabled }
        }
      })),

      // Accessibility actions
      setHighContrast: (enabled) => set(state => ({
        accessibility: { ...state.accessibility, highContrast: enabled }
      })),
      setReducedMotion: (enabled) => set(state => ({
        accessibility: { ...state.accessibility, reducedMotion: enabled }
      })),
      setFontSize: (size) => set(state => ({
        accessibility: { ...state.accessibility, fontSize: size }
      })),
      setScreenReader: (enabled) => set(state => ({
        accessibility: { ...state.accessibility, screenReader: enabled }
      })),

      // Utility actions
      reset: () => set(initialState),
      resetToDefaults: () => set(initialState),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        colorScheme: state.colorScheme,
        layout: state.layout,
        sidebarPosition: state.sidebarPosition,
        sidebarCollapsed: state.sidebarCollapsed,
        accessibility: state.accessibility,
        searchHistory: state.searchHistory,
      }),
    }
  )
);

export default useUIStore; 