import { HindsightMemory } from '../types';

export const SEED_MEMORIES: HindsightMemory[] = [
  {
    id: 'mem-1',
    category: 'brand_voice',
    statement: 'Brand voice is technical, direct, and developer-focused. Avoid hype buzzwords or generic thought-leadership platitudes.',
    context: 'Established through analyzing top performing posts vs underperforming essays.',
    confidence: 0.98,
    learnedAt: '2026-01-15T12:00:00Z',
    source: 'content_history',
    recallCount: 14,
    tags: ['voice', 'tone', 'style', 'developer-first']
  },
  {
    id: 'mem-2',
    category: 'successful_pattern',
    statement: 'Technical tutorials and step-by-step code walkthroughs perform consistently well with >90 engagement score and high bookmark rates.',
    context: 'Posts with concrete code snippets and realistic error handling average 48k+ impressions and 900+ saves.',
    confidence: 0.95,
    learnedAt: '2026-01-20T15:30:00Z',
    source: 'content_history',
    recallCount: 22,
    tags: ['tutorials', 'code', 'engagement', 'saves']
  },
  {
    id: 'mem-3',
    category: 'audience_preference',
    statement: 'Audience prefers practical implementation details over high-level conceptual summaries. They love code snippets and architectural diagrams.',
    context: 'Audience comments frequently ask for repo links, latency metrics, and production gotchas.',
    confidence: 0.96,
    learnedAt: '2026-01-28T18:00:00Z',
    source: 'user_feedback',
    recallCount: 19,
    tags: ['audience', 'practical', 'architecture', 'diagrams']
  },
  {
    id: 'mem-4',
    category: 'content_gap',
    statement: 'AI infrastructure and persistent agent memory are critically under-covered topics despite massive audience interest.',
    context: 'Only 2 posts cover persistent agent memory, but both achieved >94 engagement scores.',
    confidence: 0.92,
    learnedAt: '2026-02-01T10:00:00Z',
    source: 'agent_reflection',
    recallCount: 16,
    tags: ['content-gap', 'agent-memory', 'ai-infrastructure', 'hindsight']
  },
  {
    id: 'mem-5',
    category: 'underperforming_pattern',
    statement: 'Broad speculative AI opinion essays and generic tool roundups perform 60-70% below baseline and dilute brand authority.',
    context: 'Posts without technical grounding averaged less than 40 engagement and generated negative audience sentiment.',
    confidence: 0.94,
    learnedAt: '2026-01-16T09:00:00Z',
    source: 'content_history',
    recallCount: 11,
    tags: ['anti-pattern', 'opinion', 'listicles', 'low-engagement']
  },
  {
    id: 'mem-6',
    category: 'successful_pattern',
    statement: 'Architecture breakdown posts comparing two real paradigms (e.g. State Machines vs Prompt Chaining, Vector vs Graph) generate the highest comment debate.',
    context: 'Comparison posts drive 2x comments and direct sharing in engineering Slack groups.',
    confidence: 0.93,
    learnedAt: '2026-02-05T14:00:00Z',
    source: 'content_history',
    recallCount: 17,
    tags: ['architecture', 'comparisons', 'comments', 'viral']
  },
  {
    id: 'mem-7',
    category: 'learned_insight',
    statement: 'Quantified benchmark headlines (e.g., "Reduced Latency by 40%") generate 3x higher click-through on technical deep dives.',
    context: 'Data backed metrics build immediate trust with senior engineering leaders.',
    confidence: 0.89,
    learnedAt: '2026-02-06T11:20:00Z',
    source: 'agent_reflection',
    recallCount: 8,
    tags: ['benchmarks', 'metrics', 'headlines']
  }
];
