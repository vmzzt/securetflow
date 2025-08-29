// Essential constants

export const APP_CONFIG = {
  name: 'Securet Flow SSC',
  version: '1.0.0',
  description: 'Security Scanning and Compliance Platform',
} as const;

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
} as const;

export const ROUTES = {
  dashboard: '/dashboard',
  analytics: '/analytics',
  monitoring: '/monitoring',
  targets: '/targets',
  scans: '/scans',
  vulnerabilities: '/vulnerabilities',
  reports: '/reports',
  aiAnalysis: '/ai-analysis',
  results: '/results',
  tools: '/tools',
  integrations: '/integrations',
  workflows: '/workflows',
  plugins: '/plugins',
  pipelines: '/pipelines',
  compliance: '/compliance',
  shiftLeft: '/shift-left',
  profile: '/profile',
  settings: '/settings',
  terminal: '/terminal',
  login: '/login',
} as const;

export const SEVERITY_LEVELS = {
  critical: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
} as const;

export const SCAN_STATUS = {
  pending: 'pending',
  running: 'running',
  completed: 'completed',
  failed: 'failed',
} as const;

export const TARGET_TYPES = {
  web: 'web',
  network: 'network',
  api: 'api',
  mobile: 'mobile',
} as const;

export const THEMES = {
  light: 'light',
  dark: 'dark',
} as const; 