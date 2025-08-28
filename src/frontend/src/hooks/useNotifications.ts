import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
  read?: boolean;
  dismissed?: boolean;
}

export interface NotificationOptions {
  type?: Notification['type'];
  duration?: number;
  persistent?: boolean;
  action?: Notification['action'];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
  autoDismiss?: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  hasNotifications: boolean;
}

export interface NotificationActions {
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  clearReadNotifications: () => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
}

export interface NotificationInfo {
  totalCount: number;
  unreadCount: number;
  readCount: number;
  dismissedCount: number;
  byType: Record<Notification['type'], number>;
}

export function useNotifications(options: NotificationOptions = {}): [
  NotificationState,
  NotificationActions,
  NotificationInfo
] {
  const {
    position = 'top-right',
    maxNotifications = 10,
    autoDismiss = true,
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dismissTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Calculate state
  const state = useMemo((): NotificationState => {
    const unreadCount = notifications.filter(n => !n.read && !n.dismissed).length;
    
    return {
      notifications: notifications.filter(n => !n.dismissed),
      unreadCount,
      hasNotifications: notifications.length > 0,
    };
  }, [notifications]);

  // Calculate info
  const info = useMemo((): NotificationInfo => {
    const byType = {
      info: 0,
      success: 0,
      warning: 0,
      error: 0,
    };

    notifications.forEach(notification => {
      byType[notification.type]++;
    });

    return {
      totalCount: notifications.length,
      unreadCount: notifications.filter(n => !n.read).length,
      readCount: notifications.filter(n => n.read).length,
      dismissedCount: notifications.filter(n => n.dismissed).length,
      byType,
    };
  }, [notifications]);

  // Generate unique ID
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Actions
  const actions = useMemo((): NotificationActions => ({
    addNotification: (notification) => {
      const id = generateId();
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: new Date(),
        duration: notification.duration ?? (notification.persistent ? undefined : 5000),
        persistent: notification.persistent ?? false,
      };

      setNotifications(prev => {
        const updated = [newNotification, ...prev];
        
        // Limit number of notifications
        if (updated.length > maxNotifications) {
          return updated.slice(0, maxNotifications);
        }
        
        return updated;
      });

      // Auto dismiss if not persistent and autoDismiss is enabled
      if (autoDismiss && newNotification.duration && !newNotification.persistent) {
        const timeout = setTimeout(() => {
          actions.dismissNotification(id);
        }, newNotification.duration);

        dismissTimeouts.current.set(id, timeout);
      }

      return id;
    },

    removeNotification: (id: string) => {
      // Clear timeout if exists
      const timeout = dismissTimeouts.current.get(id);
      if (timeout) {
        clearTimeout(timeout);
        dismissTimeouts.current.delete(id);
      }

      setNotifications(prev => prev.filter(n => n.id !== id));
    },

    dismissNotification: (id: string) => {
      // Clear timeout if exists
      const timeout = dismissTimeouts.current.get(id);
      if (timeout) {
        clearTimeout(timeout);
        dismissTimeouts.current.delete(id);
      }

      setNotifications(prev => 
        prev.map(n => 
          n.id === id ? { ...n, dismissed: true } : n
        )
      );
    },

    markAsRead: (id: string) => {
      setNotifications(prev => 
        prev.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      );
    },

    markAllAsRead: () => {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    },

    clearNotifications: () => {
      // Clear all timeouts
      dismissTimeouts.current.forEach(timeout => clearTimeout(timeout));
      dismissTimeouts.current.clear();

      setNotifications([]);
    },

    clearReadNotifications: () => {
      setNotifications(prev => prev.filter(n => !n.read));
    },

    updateNotification: (id: string, updates: Partial<Notification>) => {
      setNotifications(prev => 
        prev.map(n => 
          n.id === id ? { ...n, ...updates } : n
        )
      );
    },
  }), [generateId, maxNotifications, autoDismiss]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      dismissTimeouts.current.forEach(timeout => clearTimeout(timeout));
      dismissTimeouts.current.clear();
    };
  }, []);

  return [state, actions, info];
}

// Hook for toast notifications
export function useToastNotifications(options: NotificationOptions = {}): [
  NotificationState,
  {
    showInfo: (title: string, message?: string, options?: Partial<NotificationOptions>) => string;
    showSuccess: (title: string, message?: string, options?: Partial<NotificationOptions>) => string;
    showWarning: (title: string, message?: string, options?: Partial<NotificationOptions>) => string;
    showError: (title: string, message?: string, options?: Partial<NotificationOptions>) => string;
    dismiss: (id: string) => void;
    clearAll: () => void;
  }
] {
  const [state, actions, info] = useNotifications(options);

  const toastActions = {
    showInfo: (title: string, message?: string, toastOptions?: Partial<NotificationOptions>) => {
      return actions.addNotification({
        type: 'info',
        title,
        message,
        ...toastOptions,
      });
    },

    showSuccess: (title: string, message?: string, toastOptions?: Partial<NotificationOptions>) => {
      return actions.addNotification({
        type: 'success',
        title,
        message,
        ...toastOptions,
      });
    },

    showWarning: (title: string, message?: string, toastOptions?: Partial<NotificationOptions>) => {
      return actions.addNotification({
        type: 'warning',
        title,
        message,
        ...toastOptions,
      });
    },

    showError: (title: string, message?: string, toastOptions?: Partial<NotificationOptions>) => {
      return actions.addNotification({
        type: 'error',
        title,
        message,
        persistent: true, // Errors are persistent by default
        ...toastOptions,
      });
    },

    dismiss: actions.dismissNotification,
    clearAll: actions.clearNotifications,
  };

  return [state, toastActions];
}

// Hook for notification center
export function useNotificationCenter(options: NotificationOptions = {}): [
  NotificationState,
  NotificationActions,
  NotificationInfo,
  {
    markAllAsRead: () => void;
    clearRead: () => void;
    getNotificationsByType: (type: Notification['type']) => Notification[];
    getUnreadNotifications: () => Notification[];
  }
] {
  const [state, actions, info] = useNotifications(options);

  const centerActions = {
    ...actions,
    markAllAsRead: actions.markAllAsRead,
    clearRead: actions.clearReadNotifications,
    getNotificationsByType: (type: Notification['type']) => {
      return state.notifications.filter(n => n.type === type);
    },
    getUnreadNotifications: () => {
      return state.notifications.filter(n => !n.read);
    },
  };

  return [state, centerActions, info, centerActions];
}

// Hook for notification badges
export function useNotificationBadge(options: NotificationOptions = {}): [
  {
    count: number;
    hasNotifications: boolean;
    unreadCount: number;
  },
  {
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
  }
] {
  const [state, actions] = useNotifications(options);

  const badgeState = {
    count: state.notifications.length,
    hasNotifications: state.hasNotifications,
    unreadCount: state.unreadCount,
  };

  const badgeActions = {
    markAsRead: actions.markAsRead,
    markAllAsRead: actions.markAllAsRead,
    clearAll: actions.clearNotifications,
  };

  return [badgeState, badgeActions];
}

// Hook for notification preferences
export interface NotificationPreferences {
  enabled: boolean;
  types: {
    info: boolean;
    success: boolean;
    warning: boolean;
    error: boolean;
  };
  sound: boolean;
  desktop: boolean;
  email: boolean;
  duration: number;
}

export function useNotificationPreferences(
  initialPreferences?: Partial<NotificationPreferences>
): [
  NotificationPreferences,
  {
    updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
    toggleType: (type: keyof NotificationPreferences['types']) => void;
    toggleEnabled: () => void;
    resetPreferences: () => void;
  }
] {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    types: {
      info: true,
      success: true,
      warning: true,
      error: true,
    },
    sound: true,
    desktop: true,
    email: false,
    duration: 5000,
    ...initialPreferences,
  });

  const actions = {
    updatePreferences: (newPreferences: Partial<NotificationPreferences>) => {
      setPreferences(prev => ({ ...prev, ...newPreferences }));
    },

    toggleType: (type: keyof NotificationPreferences['types']) => {
      setPreferences(prev => ({
        ...prev,
        types: {
          ...prev.types,
          [type]: !prev.types[type],
        },
      }));
    },

    toggleEnabled: () => {
      setPreferences(prev => ({ ...prev, enabled: !prev.enabled }));
    },

    resetPreferences: () => {
      setPreferences({
        enabled: true,
        types: {
          info: true,
          success: true,
          warning: true,
          error: true,
        },
        sound: true,
        desktop: true,
        email: false,
        duration: 5000,
      });
    },
  };

  return [preferences, actions];
}

export default useNotifications; 