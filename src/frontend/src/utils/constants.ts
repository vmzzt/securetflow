// API Constants
export const API_BASE_URL = process.env.VITE_API_BASE_URL || '/api';
export const WS_BASE_URL = process.env.VITE_WS_BASE_URL || 'ws://localhost:8000';

// App Constants
export const APP_NAME = 'Securet Flow SSC';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Plataforma de Segurança e Análise de Vulnerabilidades';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date Formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm:ss';

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/csv',
  'application/json',
  'text/plain',
];

// Validation
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URL_REGEX = /^https?:\/\/.+/;

// Severity Levels
export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
} as const;

export const SEVERITY_COLORS = {
  [SEVERITY_LEVELS.CRITICAL]: '#dc2626',
  [SEVERITY_LEVELS.HIGH]: '#ea580c',
  [SEVERITY_LEVELS.MEDIUM]: '#d97706',
  [SEVERITY_LEVELS.LOW]: '#2563eb',
  [SEVERITY_LEVELS.INFO]: '#6b7280',
} as const;

export const SEVERITY_LABELS = {
  [SEVERITY_LEVELS.CRITICAL]: 'Crítico',
  [SEVERITY_LEVELS.HIGH]: 'Alto',
  [SEVERITY_LEVELS.MEDIUM]: 'Médio',
  [SEVERITY_LEVELS.LOW]: 'Baixo',
  [SEVERITY_LEVELS.INFO]: 'Info',
} as const;

// Status Types
export const STATUS_TYPES = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  FALSE_POSITIVE: 'false_positive',
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PAUSED: 'paused',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ERROR: 'error',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
} as const;

export const STATUS_COLORS = {
  [STATUS_TYPES.OPEN]: '#dc2626',
  [STATUS_TYPES.IN_PROGRESS]: '#ea580c',
  [STATUS_TYPES.RESOLVED]: '#16a34a',
  [STATUS_TYPES.FALSE_POSITIVE]: '#6b7280',
  [STATUS_TYPES.PENDING]: '#6b7280',
  [STATUS_TYPES.RUNNING]: '#2563eb',
  [STATUS_TYPES.COMPLETED]: '#16a34a',
  [STATUS_TYPES.FAILED]: '#dc2626',
  [STATUS_TYPES.PAUSED]: '#d97706',
  [STATUS_TYPES.ACTIVE]: '#16a34a',
  [STATUS_TYPES.INACTIVE]: '#6b7280',
  [STATUS_TYPES.ERROR]: '#dc2626',
  [STATUS_TYPES.DRAFT]: '#6b7280',
  [STATUS_TYPES.ARCHIVED]: '#6b7280',
} as const;

export const STATUS_LABELS = {
  [STATUS_TYPES.OPEN]: 'Aberto',
  [STATUS_TYPES.IN_PROGRESS]: 'Em Progresso',
  [STATUS_TYPES.RESOLVED]: 'Resolvido',
  [STATUS_TYPES.FALSE_POSITIVE]: 'Falso Positivo',
  [STATUS_TYPES.PENDING]: 'Pendente',
  [STATUS_TYPES.RUNNING]: 'Executando',
  [STATUS_TYPES.COMPLETED]: 'Concluído',
  [STATUS_TYPES.FAILED]: 'Falhou',
  [STATUS_TYPES.PAUSED]: 'Pausado',
  [STATUS_TYPES.ACTIVE]: 'Ativo',
  [STATUS_TYPES.INACTIVE]: 'Inativo',
  [STATUS_TYPES.ERROR]: 'Erro',
  [STATUS_TYPES.DRAFT]: 'Rascunho',
  [STATUS_TYPES.ARCHIVED]: 'Arquivado',
} as const;

// Target Types
export const TARGET_TYPES = {
  WEB: 'web',
  API: 'api',
  NETWORK: 'network',
  MOBILE: 'mobile',
} as const;

export const TARGET_TYPE_LABELS = {
  [TARGET_TYPES.WEB]: 'Web',
  [TARGET_TYPES.API]: 'API',
  [TARGET_TYPES.NETWORK]: 'Rede',
  [TARGET_TYPES.MOBILE]: 'Mobile',
} as const;

// Scan Types
export const SCAN_TYPES = {
  VULNERABILITY: 'vulnerability',
  PORT: 'port',
  WEB: 'web',
  API: 'api',
  CUSTOM: 'custom',
} as const;

export const SCAN_TYPE_LABELS = {
  [SCAN_TYPES.VULNERABILITY]: 'Vulnerabilidade',
  [SCAN_TYPES.PORT]: 'Porta',
  [SCAN_TYPES.WEB]: 'Web',
  [SCAN_TYPES.API]: 'API',
  [SCAN_TYPES.CUSTOM]: 'Customizado',
} as const;

// Report Types
export const REPORT_TYPES = {
  EXECUTIVE: 'executive',
  TECHNICAL: 'technical',
  COMPLIANCE: 'compliance',
  CUSTOM: 'custom',
} as const;

export const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.EXECUTIVE]: 'Executivo',
  [REPORT_TYPES.TECHNICAL]: 'Técnico',
  [REPORT_TYPES.COMPLIANCE]: 'Compliance',
  [REPORT_TYPES.CUSTOM]: 'Customizado',
} as const;

// Tool Categories
export const TOOL_CATEGORIES = {
  NETWORK: 'network',
  WEB: 'web',
  VULNERABILITY: 'vulnerability',
  EXPLOITATION: 'exploitation',
  FORENSICS: 'forensics',
  CUSTOM: 'custom',
} as const;

export const TOOL_CATEGORY_LABELS = {
  [TOOL_CATEGORIES.NETWORK]: 'Rede',
  [TOOL_CATEGORIES.WEB]: 'Web',
  [TOOL_CATEGORIES.VULNERABILITY]: 'Vulnerabilidade',
  [TOOL_CATEGORIES.EXPLOITATION]: 'Exploitation',
  [TOOL_CATEGORIES.FORENSICS]: 'Forensics',
  [TOOL_CATEGORIES.CUSTOM]: 'Customizado',
} as const;

// Integration Types
export const INTEGRATION_TYPES = {
  CHAT: 'chat',
  GIT: 'git',
  CI_CD: 'ci_cd',
  MONITORING: 'monitoring',
  TICKETING: 'ticketing',
  CUSTOM: 'custom',
} as const;

export const INTEGRATION_TYPE_LABELS = {
  [INTEGRATION_TYPES.CHAT]: 'Chat',
  [INTEGRATION_TYPES.GIT]: 'Git',
  [INTEGRATION_TYPES.CI_CD]: 'CI/CD',
  [INTEGRATION_TYPES.MONITORING]: 'Monitoring',
  [INTEGRATION_TYPES.TICKETING]: 'Ticketing',
  [INTEGRATION_TYPES.CUSTOM]: 'Custom',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer',
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.USER]: 'Usuário',
  [USER_ROLES.VIEWER]: 'Visualizador',
} as const;

// Permissions
export const PERMISSIONS = {
  // Targets
  TARGET_READ: 'target:read',
  TARGET_CREATE: 'target:create',
  TARGET_UPDATE: 'target:update',
  TARGET_DELETE: 'target:delete',
  
  // Scans
  SCAN_READ: 'scan:read',
  SCAN_CREATE: 'scan:create',
  SCAN_UPDATE: 'scan:update',
  SCAN_DELETE: 'scan:delete',
  SCAN_START: 'scan:start',
  SCAN_STOP: 'scan:stop',
  
  // Vulnerabilities
  VULNERABILITY_READ: 'vulnerability:read',
  VULNERABILITY_CREATE: 'vulnerability:create',
  VULNERABILITY_UPDATE: 'vulnerability:update',
  VULNERABILITY_DELETE: 'vulnerability:delete',
  
  // Reports
  REPORT_READ: 'report:read',
  REPORT_CREATE: 'report:create',
  REPORT_UPDATE: 'report:update',
  REPORT_DELETE: 'report:delete',
  REPORT_EXPORT: 'report:export',
  
  // Tools
  TOOL_READ: 'tool:read',
  TOOL_CREATE: 'tool:create',
  TOOL_UPDATE: 'tool:update',
  TOOL_DELETE: 'tool:delete',
  TOOL_EXECUTE: 'tool:execute',
  
  // Integrations
  INTEGRATION_READ: 'integration:read',
  INTEGRATION_CREATE: 'integration:create',
  INTEGRATION_UPDATE: 'integration:update',
  INTEGRATION_DELETE: 'integration:delete',
  
  // Users
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // System
  SYSTEM_READ: 'system:read',
  SYSTEM_UPDATE: 'system:update',
  SYSTEM_ADMIN: 'system:admin',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  AUTH_USER: 'auth_user',
  REMEMBER_ME: 'remember_me',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  TABLE_PREFERENCES: 'table_preferences',
} as const;

// Theme
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Languages
export const LANGUAGES = {
  PT_BR: 'pt-BR',
  EN_US: 'en-US',
  ES: 'es',
} as const;

export const LANGUAGE_LABELS = {
  [LANGUAGES.PT_BR]: 'Português',
  [LANGUAGES.EN_US]: 'English',
  [LANGUAGES.ES]: 'Español',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Não autorizado. Faça login novamente.',
  FORBIDDEN: 'Acesso negado. Você não tem permissão.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  SERVER_ERROR: 'Erro interno do servidor.',
  TIMEOUT_ERROR: 'Tempo limite excedido.',
  UNKNOWN_ERROR: 'Erro desconhecido.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Criado com sucesso!',
  UPDATED: 'Atualizado com sucesso!',
  DELETED: 'Excluído com sucesso!',
  SAVED: 'Salvo com sucesso!',
  EXPORTED: 'Exportado com sucesso!',
  IMPORTED: 'Importado com sucesso!',
  SCAN_STARTED: 'Scan iniciado com sucesso!',
  SCAN_STOPPED: 'Scan parado com sucesso!',
} as const;

// Warning Messages
export const WARNING_MESSAGES = {
  UNSAVED_CHANGES: 'Você tem alterações não salvas. Deseja sair mesmo assim?',
  DELETE_CONFIRMATION: 'Tem certeza que deseja excluir este item?',
  BULK_DELETE_CONFIRMATION: 'Tem certeza que deseja excluir os itens selecionados?',
  SCAN_STOP_CONFIRMATION: 'Tem certeza que deseja parar este scan?',
} as const;

// Info Messages
export const INFO_MESSAGES = {
  NO_DATA: 'Nenhum dado encontrado.',
  LOADING: 'Carregando...',
  PROCESSING: 'Processando...',
  SAVING: 'Salvando...',
  EXPORTING: 'Exportando...',
  IMPORTING: 'Importando...',
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#6b7280',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  LIGHT: '#f3f4f6',
  DARK: '#1f2937',
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Z-Index Levels
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;

export default {
  API_BASE_URL,
  WS_BASE_URL,
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  EMAIL_REGEX,
  URL_REGEX,
  SEVERITY_LEVELS,
  SEVERITY_COLORS,
  SEVERITY_LABELS,
  STATUS_TYPES,
  STATUS_COLORS,
  STATUS_LABELS,
  TARGET_TYPES,
  TARGET_TYPE_LABELS,
  SCAN_TYPES,
  SCAN_TYPE_LABELS,
  REPORT_TYPES,
  REPORT_TYPE_LABELS,
  TOOL_CATEGORIES,
  TOOL_CATEGORY_LABELS,
  INTEGRATION_TYPES,
  INTEGRATION_TYPE_LABELS,
  USER_ROLES,
  USER_ROLE_LABELS,
  PERMISSIONS,
  STORAGE_KEYS,
  THEMES,
  LANGUAGES,
  LANGUAGE_LABELS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  WARNING_MESSAGES,
  INFO_MESSAGES,
  CHART_COLORS,
  ANIMATION_DURATIONS,
  BREAKPOINTS,
  Z_INDEX,
}; 