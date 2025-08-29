// Centralized configuration

export const config = {
  app: {
    name: 'Securet Flow SSC',
    version: '1.0.0',
    description: 'Security Scanning and Compliance Platform',
  },
  
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    timeout: 10000,
    retries: 3,
  },
  
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiry: 3600, // 1 hour
  },
  
  ui: {
    theme: {
      default: 'light',
      storageKey: 'theme',
    },
    sidebar: {
      defaultOpen: false,
      storageKey: 'sidebar_open',
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [10, 25, 50, 100],
    },
  },
  
  features: {
    notifications: true,
    realTimeUpdates: true,
    fileUpload: true,
    export: true,
  },
  
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxUploadFiles: 5,
    maxSearchResults: 1000,
  },
} as const;

export default config; 