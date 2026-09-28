export type Platform = 'LinkedIn' | 'Blog' | 'X' | 'YouTube';

export type ContentType = 
  | 'Technical Tutorial'
  | 'Case Study'
  | 'Architecture Breakdown'
  | 'Opinion'
  | 'Educational'
  | 'Product Story';

export type PerformanceCategory = 'High' | 'Average' | 'Underperforming';

export interface ContentItem {
  id: string;
  title: string;
  platform: Platform;
  contentType: ContentType;
  publishedAt: string;
  topics: string[];
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementScore: number;
  performanceCategory: PerformanceCategory;
  url?: string;
  summary: string;
  aiAnalysis: {
    hookStrength: number;
    audienceResonance: string;
    whyItWorkedOrFailed: string;
    keyTakeaway: string;
    learnedPattern: string;
  };
}

export type MemoryCategory = 
  | 'brand_voice'
  | 'audience_preference'
  | 'successful_pattern'
  | 'underperforming_pattern'
  | 'content_gap'
  | 'learned_insight';

export interface HindsightMemory {
  id: string;
  category: MemoryCategory;
  statement: string;
  context?: string;
  confidence: number;
  relevanceScore?: number;
  learnedAt: string;
  source: 'content_history' | 'user_feedback' | 'agent_reflection' | 'manual';
  recallCount: number;
  lastRecalledAt?: string;
  tags: string[];
}

export interface DayPlanItem {
  day: string;
  platform: Platform;
  contentType: ContentType;
  topicTitle: string;
  hook: string;
  outline: string[];
  whyRecommended: string;
  memoryInfluence: string;
}

export interface StrategyResult {
  strategicDirection: string;
  contentPillars: {
    name: string;
    description: string;
    frequency: string;
  }[];
  recommendedTopics: {
    title: string;
    type: ContentType;
    platform: Platform;
    rationale: string;
    expectedEngagement: 'High' | 'Very High' | 'Exceptional';
  }[];
  contentGaps: string[];
  audienceInsights: string[];
  sevenDayPlan: DayPlanItem[];
  whyTheseRecommendations: string[];
  memoriesUsed: HindsightMemory[];
  newLearningsExtracted: {
    statement: string;
    category: MemoryCategory;
    confidence: number;
  }[];
  executionMode: 'with_memory' | 'without_memory';
  generatedAt: string;
}

export interface StrategyRequest {
  goal: string;
  targetAudience?: string;
  platform?: Platform | 'All';
  timeframe?: string;
  userLearningsFeedback?: string;
  useMemory?: boolean;
}

export interface DashboardMetrics {
  totalContentAnalyzed: number;
  averageEngagementRate: number;
  topPerformingPlatform: Platform;
  contentGapsIdentified: number;
  memoriesStored: number;
  totalMemoryRecalls: number;
  topicPerformance: {
    topic: string;
    avgEngagement: number;
    postCount: number;
    status: 'High' | 'Average' | 'Low';
  }[];
  performanceOverTime: {
    date: string;
    avgEngagement: number;
    postsCount: number;
  }[];
  recentActivity: {
    id: string;
    timestamp: string;
    type: 'recalled' | 'learned' | 'detected_gap' | 'strategy_generated';
    description: string;
    meta?: string;
  }[];
  recentContent: ContentItem[];
  urgentGaps: string[];
  activeBrandVoice: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
  meta?: {
    hindsightConnected: boolean;
    groqConnected: boolean;
    timestamp: string;
  };
}
