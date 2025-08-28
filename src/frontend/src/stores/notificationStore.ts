import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp: number;
  read: boolean;
  dismissed: boolean;
  persistent: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  type?: string;
  read?: boolean;
  dismissed?: boolean;
  search?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
  filters: NotificationFilters;
  settings: {
    maxNotifications: number;
    autoDismiss: boolean;
    autoDismissDelay: number;
    soundEnabled: boolean;
    desktopEnabled: boolean;
    emailEnabled: boolean;
  };
}

export interface NotificationActions {
  // State management
  setNotifications: (notifications: Notification[]) => void;
  setFilters: (filters: NotificationFilters) => void;
  setSettings: (settings: Partial<NotificationState['settings']>) => void;
  
  // CRUD operations
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => string;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  removeNotification: (id: string) => void;
  
  // Notification actions
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  markAsUnread: (id: string) => void;
  dismissNotification: (id: string) => void;
  dismissAllNotifications: () => void;
  clearNotifications: () => void;
  clearReadNotifications: () => void;
  clearDismissedNotifications: () => void;
  
  // Utility actions
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: string) => Notification[];
  getFilteredNotifications: () => Notification[];
  clearError: () => void;
  resetFilters: () => void;
}

export type NotificationStore = NotificationState & NotificationActions;

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  totalCount: 0,
  filters: {},
  settings: {
    maxNotifications: 100,
    autoDismiss: true,
    autoDismissDelay: 5000,
    soundEnabled: true,
    desktopEnabled: true,
    emailEnabled: false,
  },
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // State management
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.read && !n.dismissed).length;
        set({
          notifications,
          unreadCount,
          totalCount: notifications.length,
        });
      },

      setFilters: (filters) => set({ filters }),

      setSettings: (settings) => set(state => ({
        settings: { ...state.settings, ...settings }
      })),

      // CRUD operations
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: Date.now(),
          read: false,
          dismissed: false,
        };

        set(state => {
          const updatedNotifications = [newNotification, ...state.notifications];
          
          // Limit notifications based on settings
          const limitedNotifications = updatedNotifications.slice(0, state.settings.maxNotifications);
          
          const unreadCount = limitedNotifications.filter(n => !n.read && !n.dismissed).length;
          
          return {
            notifications: limitedNotifications,
            unreadCount,
            totalCount: limitedNotifications.length,
          };
        });

        return id;
      },

      updateNotification: (id, updates) => {
        set(state => {
          const updatedNotifications = state.notifications.map(n =>
            n.id === id ? { ...n, ...updates } : n
          );
          
          const unreadCount = updatedNotifications.filter(n => !n.read && !n.dismissed).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
            totalCount: updatedNotifications.length,
          };
        });
      },

      removeNotification: (id) => {
        set(state => {
          const updatedNotifications = state.notifications.filter(n => n.id !== id);
          const unreadCount = updatedNotifications.filter(n => !n.read && !n.dismissed).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
            totalCount: updatedNotifications.length,
          };
        });
      },

      // Notification actions
      markAsRead: (id) => {
        set(state => {
          const updatedNotifications = state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          );
          
          const unreadCount = updatedNotifications.filter(n => !n.read && !n.dismissed).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },

      markAllAsRead: () => {
        set(state => {
          const updatedNotifications = state.notifications.map(n => ({ ...n, read: true }));
          
          return {
            notifications: updatedNotifications,
            unreadCount: 0,
          };
        });
      },

      markAsUnread: (id) => {
        set(state => {
          const updatedNotifications = state.notifications.map(n =>
            n.id === id ? { ...n, read: false } : n
          );
          
          const unreadCount = updatedNotifications.filter(n => !n.read && !n.dismissed).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },

      dismissNotification: (id) => {
        set(state => {
          const updatedNotifications = state.notifications.map(n =>
            n.id === id ? { ...n, dismissed: true } : n
          );
          
          const unreadCount = updatedNotifications.filter(n => !n.read && !n.dismissed).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },

      dismissAllNotifications: () => {
        set(state => {
          const updatedNotifications = state.notifications.map(n => ({ ...n, dismissed: true }));
          
          return {
            notifications: updatedNotifications,
            unreadCount: 0,
          };
        });
      },

      clearNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
          totalCount: 0,
        });
      },

      clearReadNotifications: () => {
        set(state => {
          const updatedNotifications = state.notifications.filter(n => !n.read);
          const unreadCount = updatedNotifications.filter(n => !n.dismissed).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
            totalCount: updatedNotifications.length,
          };
        });
      },

      clearDismissedNotifications: () => {
        set(state => {
          const updatedNotifications = state.notifications.filter(n => !n.dismissed);
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
            totalCount: updatedNotifications.length,
          };
        });
      },

      // Utility actions
      getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter(n => !n.read && !n.dismissed);
      },

      getNotificationsByType: (type) => {
        const { notifications } = get();
        return notifications.filter(n => n.type === type);
      },

      getFilteredNotifications: () => {
        const { notifications, filters } = get();
        let filtered = notifications;

        if (filters.type) {
          filtered = filtered.filter(n => n.type === filters.type);
        }

        if (filters.read !== undefined) {
          filtered = filtered.filter(n => n.read === filters.read);
        }

        if (filters.dismissed !== undefined) {
          filtered = filtered.filter(n => n.dismissed === filters.dismissed);
        }

        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(n =>
            n.title.toLowerCase().includes(search) ||
            (n.message && n.message.toLowerCase().includes(search))
          );
        }

        return filtered;
      },

      clearError: () => {
        // Clear any error state if needed
      },

      resetFilters: () => {
        set({ filters: {} });
      },
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        notifications: state.notifications,
        settings: state.settings,
      }),
    }
  )
);

// Selectors for better performance
export const notificationSelectors = {
  getNotificationById: (id: string) => (state: NotificationStore) =>
    state.notifications.find(notification => notification.id === id),
  
  getNotificationsByType: (type: string) => (state: NotificationStore) =>
    state.notifications.filter(notification => notification.type === type),
  
  getUnreadNotifications: (state: NotificationStore) =>
    state.notifications.filter(notification => !notification.read && !notification.dismissed),
  
  getReadNotifications: (state: NotificationStore) =>
    state.notifications.filter(notification => notification.read && !notification.dismissed),
  
  getDismissedNotifications: (state: NotificationStore) =>
    state.notifications.filter(notification => notification.dismissed),
  
  getActiveNotifications: (state: NotificationStore) =>
    state.notifications.filter(notification => !notification.dismissed),
  
  getNotificationStats: (state: NotificationStore) => {
    const notifications = state.notifications;
    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.read && !n.dismissed).length,
      read: notifications.filter(n => n.read && !n.dismissed).length,
      dismissed: notifications.filter(n => n.dismissed).length,
      byType: {
        info: notifications.filter(n => n.type === 'info').length,
        success: notifications.filter(n => n.type === 'success').length,
        warning: notifications.filter(n => n.type === 'warning').length,
        error: notifications.filter(n => n.type === 'error').length,
      },
    };
  },
};

export default useNotificationStore; 