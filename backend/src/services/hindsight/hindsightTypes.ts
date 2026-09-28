import { HindsightMemory, MemoryCategory, RecallResult } from '../../types';

export interface RetainMemoryInput {
  statement: string;
  category?: MemoryCategory;
  context?: string;
  confidence?: number;
  tags?: string[];
  source?: 'content_history' | 'user_feedback' | 'agent_reflection' | 'manual';
}

export interface RecallQueryOptions {
  query?: string;
  limit?: number;
  minRelevance?: number;
  categories?: MemoryCategory[];
}

export interface HindsightServiceStatus {
  isConfigured: boolean;
  provider: 'hindsight_cloud' | 'hindsight_embedded' | 'degraded';
  bankId: string;
  totalMemories: number;
  lastRecalledAt?: string;
}

export interface HindsightExternalConfig {
  apiKey?: string;
  apiUrl?: string;
  bankId?: string;
}
