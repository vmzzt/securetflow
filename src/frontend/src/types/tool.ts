/**
 * Tool Types
 * TypeScript interfaces and types for tool management
 */

/**
 * Tool status enumeration
 */
export enum ToolStatus {
  AVAILABLE = 'available',
  RUNNING = 'running',
  ERROR = 'error',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  UPDATING = 'updating'
}

/**
 * Tool category enumeration
 */
export enum ToolCategory {
  NETWORK = 'network',
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  CONTAINER = 'container',
  CLOUD = 'cloud',
  CODE = 'code',
  DEPENDENCY = 'dependency',
  INFRASTRUCTURE = 'infrastructure',
  COMPLIANCE = 'compliance',
  FORENSICS = 'forensics',
  MALWARE = 'malware',
  OTHER = 'other'
}

/**
 * Tool type enumeration
 */
export enum ToolType {
  SCANNER = 'scanner',
  EXPLOIT = 'exploit',
  MONITOR = 'monitor',
  ANALYZER = 'analyzer',
  GENERATOR = 'generator',
  VALIDATOR = 'validator',
  CONVERTER = 'converter',
  UTILITY = 'utility'
}

/**
 * Tool license enumeration
 */
export enum ToolLicense {
  OPEN_SOURCE = 'open_source',
  COMMERCIAL = 'commercial',
  FREEWARE = 'freeware',
  TRIAL = 'trial',
  CUSTOM = 'custom'
}

/**
 * Tool configuration interface
 */
export interface ToolConfig {
  parameters: ToolParameter[];
  options: ToolOption[];
  dependencies: string[];
  requirements: ToolRequirement;
  limits: ToolLimits;
  customFields?: Record<string, any>;
}

/**
 * Tool parameter interface
 */
export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'file';
  required: boolean;
  default?: any;
  description: string;
  validation?: ToolParameterValidation;
  options?: any[];
}

/**
 * Tool parameter validation interface
 */
export interface ToolParameterValidation {
  min?: number;
  max?: number;
  pattern?: string;
  enum?: any[];
  custom?: (value: any) => boolean;
  message?: string;
}

/**
 * Tool option interface
 */
export interface ToolOption {
  name: string;
  type: 'flag' | 'value' | 'file' | 'directory';
  short?: string;
  long: string;
  description: string;
  required: boolean;
  default?: any;
  validation?: ToolParameterValidation;
}

/**
 * Tool requirement interface
 */
export interface ToolRequirement {
  os: string[];
  architecture: string[];
  memory: number; // MB
  disk: number; // MB
  cpu: number; // cores
  network: boolean;
  dependencies: string[];
  permissions: string[];
}

/**
 * Tool limits interface
 */
export interface ToolLimits {
  maxExecutionTime: number; // seconds
  maxMemoryUsage: number; // MB
  maxDiskUsage: number; // MB
  maxConcurrentExecutions: number;
  rateLimit?: number; // requests per minute
}

/**
 * Tool execution interface
 */
export interface ToolExecution {
  id: string;
  toolId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  parameters: Record<string, any>;
  progress: number; // 0-100
  startTime?: Date;
  endTime?: Date;
  duration?: number; // seconds
  output?: ToolOutput;
  error?: string;
  logs: ToolLog[];
  metadata?: Record<string, any>;
}

/**
 * Tool output interface
 */
export interface ToolOutput {
  stdout?: string;
  stderr?: string;
  files: ToolOutputFile[];
  data?: any;
  format: 'json' | 'xml' | 'csv' | 'text' | 'binary';
}

/**
 * Tool output file interface
 */
export interface ToolOutputFile {
  name: string;
  path: string;
  size: number;
  type: string;
  url?: string;
  description?: string;
}

/**
 * Tool log interface
 */
export interface ToolLog {
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  data?: any;
}

/**
 * Tool statistics interface
 */
export interface ToolStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  totalExecutionTime: number;
  lastExecution?: Date;
  popularity: number; // 0-100
  reliability: number; // 0-100
}

/**
 * Tool interface
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  version: string;
  category: ToolCategory;
  type: ToolType;
  status: ToolStatus;
  license: ToolLicense;
  config: ToolConfig;
  stats: ToolStats;
  author: string;
  website?: string;
  documentation?: string;
  repository?: string;
  tags: string[];
  icon?: string;
  screenshot?: string;
  isDefault: boolean;
  isPublic: boolean;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

/**
 * Tool creation request interface
 */
export interface CreateToolRequest {
  name: string;
  description: string;
  version: string;
  category: ToolCategory;
  type: ToolType;
  license: ToolLicense;
  config: ToolConfig;
  author: string;
  website?: string;
  documentation?: string;
  repository?: string;
  tags?: string[];
  icon?: string;
  screenshot?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  isEnabled?: boolean;
}

/**
 * Tool update request interface
 */
export interface UpdateToolRequest {
  name?: string;
  description?: string;
  version?: string;
  category?: ToolCategory;
  type?: ToolType;
  status?: ToolStatus;
  license?: ToolLicense;
  config?: Partial<ToolConfig>;
  author?: string;
  website?: string;
  documentation?: string;
  repository?: string;
  tags?: string[];
  icon?: string;
  screenshot?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  isEnabled?: boolean;
}

/**
 * Tool filter interface
 */
export interface ToolFilter {
  status?: ToolStatus[];
  category?: ToolCategory[];
  type?: ToolType[];
  license?: ToolLicense[];
  author?: string[];
  tags?: string[];
  isDefault?: boolean;
  isPublic?: boolean;
  isEnabled?: boolean;
  search?: string;
}

/**
 * Tool sort options interface
 */
export interface ToolSort {
  field: keyof Tool;
  direction: 'asc' | 'desc';
}

/**
 * Tool list response interface
 */
export interface ToolListResponse {
  tools: Tool[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Tool bulk operation interface
 */
export interface ToolBulkOperation {
  toolIds: string[];
  operation: 'enable' | 'disable' | 'update' | 'delete' | 'install' | 'uninstall';
  data?: Partial<UpdateToolRequest>;
}

/**
 * Tool installation interface
 */
export interface ToolInstallation {
  id: string;
  toolId: string;
  status: 'pending' | 'installing' | 'completed' | 'failed' | 'uninstalling';
  version: string;
  path: string;
  installedAt?: Date;
  uninstalledAt?: Date;
  error?: string;
  logs: ToolLog[];
}

/**
 * Tool update interface
 */
export interface ToolUpdate {
  id: string;
  toolId: string;
  currentVersion: string;
  newVersion: string;
  status: 'available' | 'downloading' | 'installing' | 'completed' | 'failed';
  changelog?: string;
  releaseDate?: Date;
  downloadUrl?: string;
  size?: number;
  checksum?: string;
  autoUpdate: boolean;
}

/**
 * Tool marketplace interface
 */
export interface ToolMarketplace {
  id: string;
  name: string;
  description: string;
  version: string;
  category: ToolCategory;
  type: ToolType;
  license: ToolLicense;
  author: string;
  website?: string;
  documentation?: string;
  repository?: string;
  tags: string[];
  icon?: string;
  screenshot?: string;
  rating: number;
  downloads: number;
  reviews: number;
  price?: number;
  currency?: string;
  isInstalled: boolean;
  isUpdateAvailable: boolean;
  currentVersion?: string;
  newVersion?: string;
}

/**
 * Tool execution request interface
 */
export interface ToolExecutionRequest {
  toolId: string;
  parameters: Record<string, any>;
  timeout?: number;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

/**
 * Tool execution response interface
 */
export interface ToolExecutionResponse {
  execution: ToolExecution;
  message: string;
}

/**
 * Tool API response types
 */
export namespace ToolAPI {
  export interface CreateResponse {
    tool: Tool;
    message: string;
  }

  export interface UpdateResponse {
    tool: Tool;
    message: string;
  }

  export interface DeleteResponse {
    message: string;
    deletedCount: number;
  }

  export interface BulkResponse {
    success: string[];
    failed: Array<{
      id: string;
      error: string;
    }>;
    message: string;
  }

  export interface InstallResponse {
    installation: ToolInstallation;
    message: string;
  }

  export interface UninstallResponse {
    installation: ToolInstallation;
    message: string;
  }

  export interface UpdateResponse {
    update: ToolUpdate;
    message: string;
  }

  export interface MarketplaceResponse {
    tools: ToolMarketplace[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }

  export interface ExecuteResponse {
    execution: ToolExecution;
    message: string;
  }

  export interface ExecutionStatusResponse {
    execution: ToolExecution;
  }

  export interface ExecutionOutputResponse {
    output: ToolOutput;
  }

  export interface ExecutionLogsResponse {
    logs: ToolLog[];
  }

  export interface StatisticsResponse {
    stats: ToolStats;
  }
} 