import {
  ApiResponse,
  ContentItem,
  DashboardMetrics,
  HindsightMemory,
  StrategyRequest,
  StrategyResult
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errData = await response.json();
      if (errData?.error?.message) {
        errorMsg = errData.error.message;
      }
    } catch {}
    throw new Error(errorMsg);
  }

  const data: ApiResponse<T> = await response.json();
  if (!data.success && data.error) {
    throw new Error(data.error.message);
  }
  return data.data as T;
}

export const api = {
  // Dashboard
  getDashboard: () => fetchJson<DashboardMetrics>('/dashboard'),

  // Content
  getContentList: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return fetchJson<ContentItem[]>(`/content${query}`);
  },
  getContentById: (id: string) => fetchJson<ContentItem>(`/content/${id}`),
  createContent: (item: Partial<ContentItem>) =>
    fetchJson<ContentItem>('/content', {
      method: 'POST',
      body: JSON.stringify(item)
    }),

  // Strategy
  generateStrategy: (req: StrategyRequest) =>
    fetchJson<StrategyResult>('/strategy', {
      method: 'POST',
      body: JSON.stringify(req)
    }),

  // Memory
  getMemories: () =>
    fetchJson<{ memories: HindsightMemory[]; status: any }>('/memory'),
  recallMemories: (query: string, limit?: number) =>
    fetchJson<{ recalledMemories: HindsightMemory[]; summary: string; relevanceExplanation: string[] }>(
      '/memory/recall',
      {
        method: 'POST',
        body: JSON.stringify({ query, limit })
      }
    ),
  retainMemory: (payload: { statement: string; category?: string; context?: string; tags?: string[] }) =>
    fetchJson<HindsightMemory>('/memory/retain', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  deleteMemory: (id: string) =>
    fetchJson<{ deleted: boolean }>(`/memory/${id}`, {
      method: 'DELETE'
    }),
  resetMemories: () =>
    fetchJson<{ memories: HindsightMemory[]; message: string }>('/memory/reset', {
      method: 'POST'
    }),

  // Health
  getHealth: () => fetchJson<any>('/health')
};
