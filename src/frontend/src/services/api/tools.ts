import { apiService, API_ENDPOINTS } from './client';

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

export interface CreateToolData {
  name: string;
  category: Tool['category'];
  description: string;
  command?: string;
  parameters?: string[];
  tags?: string[];
}

export interface UpdateToolData {
  name?: string;
  description?: string;
  command?: string;
  parameters?: string[];
  tags?: string[];
}

export interface ToolFilters {
  search?: string;
  category?: string;
  status?: string;
  tags?: string[];
  isCustom?: boolean;
}

export interface ToolStats {
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
}

class ToolsService {
  // Get all tools
  async getTools(filters?: ToolFilters, pagination?: { page: number; limit: number }): Promise<{
    tools: Tool[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const params = { ...filters, ...pagination };
    const response = await apiService.get<{ tools: Tool[]; pagination: any }>(
      API_ENDPOINTS.TOOLS.LIST,
      params
    );
    
    return {
      tools: response.data.tools || response.data,
      pagination: response.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
    };
  }

  // Get tool by ID
  async getTool(id: string): Promise<Tool> {
    const response = await apiService.get<Tool>(API_ENDPOINTS.TOOLS.GET(id));
    return response.data;
  }

  // Create new tool
  async createTool(data: CreateToolData): Promise<Tool> {
    const response = await apiService.post<Tool>(API_ENDPOINTS.TOOLS.CREATE, data);
    return response.data;
  }

  // Update tool
  async updateTool(id: string, data: UpdateToolData): Promise<Tool> {
    const response = await apiService.put<Tool>(API_ENDPOINTS.TOOLS.UPDATE(id), data);
    return response.data;
  }

  // Delete tool
  async deleteTool(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.TOOLS.DELETE(id));
  }

  // Execute tool
  async executeTool(id: string, parameters?: Record<string, any>): Promise<{
    executionId: string;
    status: string;
    message: string;
  }> {
    const response = await apiService.post(API_ENDPOINTS.TOOLS.EXECUTE(id), { parameters });
    return response.data;
  }

  // Stop tool execution
  async stopTool(id: string): Promise<{ status: string; message: string }> {
    const response = await apiService.post(API_ENDPOINTS.TOOLS.STOP(id));
    return response.data;
  }

  // Get tool configuration
  async getToolConfig(id: string): Promise<{
    config: Record<string, any>;
    parameters: Array<{
      name: string;
      type: string;
      required: boolean;
      default?: any;
      description: string;
    }>;
  }> {
    const response = await apiService.get(API_ENDPOINTS.TOOLS.CONFIG(id));
    return response.data;
  }

  // Update tool configuration
  async updateToolConfig(id: string, config: Record<string, any>): Promise<void> {
    await apiService.put(API_ENDPOINTS.TOOLS.CONFIG(id), config);
  }

  // Get tool execution status
  async getToolExecutionStatus(executionId: string): Promise<{
    status: 'running' | 'completed' | 'failed' | 'stopped';
    progress: number;
    output?: string;
    error?: string;
    startTime: string;
    endTime?: string;
  }> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/execution/${executionId}`);
    return response.data;
  }

  // Get tool execution logs
  async getToolExecutionLogs(executionId: string): Promise<Array<{
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'debug';
    message: string;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/execution/${executionId}/logs`);
    return response.data;
  }

  // Get tool statistics
  async getToolStats(): Promise<ToolStats> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/stats`);
    return response.data;
  }

  // Get tools by category
  async getToolsByCategory(category: string): Promise<Tool[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/by-category/${category}`);
    return response.data;
  }

  // Get tools by status
  async getToolsByStatus(status: string): Promise<Tool[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/by-status/${status}`);
    return response.data;
  }

  // Get tools by tag
  async getToolsByTag(tag: string): Promise<Tool[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/by-tag/${tag}`);
    return response.data;
  }

  // Get custom tools
  async getCustomTools(): Promise<Tool[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/custom`);
    return response.data;
  }

  // Get built-in tools
  async getBuiltInTools(): Promise<Tool[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/built-in`);
    return response.data;
  }

  // Search tools
  async searchTools(query: string, filters?: ToolFilters): Promise<Tool[]> {
    const params = { q: query, ...filters };
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/search`, params);
    return response.data;
  }

  // Get tool categories
  async getToolCategories(): Promise<Array<{
    value: string;
    label: string;
    description: string;
    count: number;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/categories`);
    return response.data;
  }

  // Get tool tags
  async getToolTags(): Promise<string[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/tags`);
    return response.data;
  }

  // Get tool usage history
  async getToolUsageHistory(id: string): Promise<Array<{
    executionId: string;
    startTime: string;
    endTime?: string;
    status: string;
    duration?: number;
    parameters?: Record<string, any>;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.GET(id)}/usage-history`);
    return response.data;
  }

  // Get tool performance metrics
  async getToolPerformanceMetrics(id: string): Promise<{
    avgExecutionTime: number;
    successRate: number;
    totalExecutions: number;
    lastExecution?: string;
    peakUsage: number;
  }> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.GET(id)}/performance`);
    return response.data;
  }

  // Validate tool configuration
  async validateToolConfig(config: Record<string, any>): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.TOOLS.LIST}/validate-config`, config);
    return response.data;
  }

  // Test tool connection
  async testToolConnection(id: string): Promise<{
    connected: boolean;
    message: string;
    details?: any;
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.TOOLS.GET(id)}/test-connection`);
    return response.data;
  }

  // Get tool dependencies
  async getToolDependencies(id: string): Promise<Array<{
    name: string;
    version: string;
    installed: boolean;
    required: boolean;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.GET(id)}/dependencies`);
    return response.data;
  }

  // Install tool dependencies
  async installToolDependencies(id: string): Promise<{
    installed: number;
    failed: number;
    errors: string[];
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.TOOLS.GET(id)}/install-dependencies`);
    return response.data;
  }

  // Get tool documentation
  async getToolDocumentation(id: string): Promise<{
    description: string;
    usage: string;
    examples: Array<{
      title: string;
      command: string;
      description: string;
    }>;
    parameters: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
      example: string;
    }>;
  }> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.GET(id)}/documentation`);
    return response.data;
  }

  // Get tool templates
  async getToolTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    config: Record<string, any>;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/templates`);
    return response.data;
  }

  // Create tool from template
  async createToolFromTemplate(templateId: string, data: {
    name: string;
    description?: string;
    config?: Record<string, any>;
  }): Promise<Tool> {
    const response = await apiService.post(`${API_ENDPOINTS.TOOLS.LIST}/from-template`, {
      templateId,
      ...data,
    });
    return response.data;
  }

  // Get running tools
  async getRunningTools(): Promise<Tool[]> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/running`);
    return response.data;
  }

  // Stop all running tools
  async stopAllRunningTools(): Promise<{
    stopped: number;
    failed: number;
    errors: string[];
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.TOOLS.LIST}/stop-all`);
    return response.data;
  }

  // Get tool metrics
  async getToolMetrics(): Promise<{
    totalTools: number;
    averageExecutionTime: number;
    mostUsedTool: string;
    mostUsedCategory: string;
    topTools: Array<{ tool: string; usage: number }>;
    topCategories: Array<{ category: string; count: number }>;
  }> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/metrics`);
    return response.data;
  }

  // Get tool trends
  async getToolTrends(period: 'day' | 'week' | 'month' | 'year'): Promise<Array<{
    date: string;
    executions: number;
    tools: number;
    avgExecutionTime: number;
  }>> {
    const response = await apiService.get(`${API_ENDPOINTS.TOOLS.LIST}/trends`, { period });
    return response.data;
  }

  // Bulk operations
  async bulkUpdateTools(ids: string[], updates: UpdateToolData): Promise<{
    updated: number;
    failed: number;
    errors: string[];
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.TOOLS.LIST}/bulk-update`, {
      ids,
      updates,
    });
    return response.data;
  }

  async bulkDeleteTools(ids: string[]): Promise<{
    deleted: number;
    failed: number;
    errors: string[];
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.TOOLS.LIST}/bulk-delete`, { ids });
    return response.data;
  }

  async bulkExecuteTools(ids: string[], parameters?: Record<string, any>): Promise<{
    executions: Array<{ toolId: string; executionId: string; status: string }>;
    failed: number;
    errors: string[];
  }> {
    const response = await apiService.post(`${API_ENDPOINTS.TOOLS.LIST}/bulk-execute`, {
      ids,
      parameters,
    });
    return response.data;
  }
}

// Create singleton instance
export const toolsService = new ToolsService();

export default toolsService; 