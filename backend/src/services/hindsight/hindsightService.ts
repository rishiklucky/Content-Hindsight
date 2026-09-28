import fs from 'fs';
import path from 'path';
import { HindsightMemory, MemoryCategory, RecallResult } from '../../types';
import { SEED_MEMORIES } from '../../data/seedMemories';
import { RetainMemoryInput, RecallQueryOptions, HindsightServiceStatus } from './hindsightTypes';

export class HindsightService {
  private memories: HindsightMemory[] = [];
  private readonly storageFilePath: string;
  private readonly apiKey: string | undefined;
  private readonly apiUrl: string;
  private readonly bankId: string;
  private lastRecalledTimestamp?: string;

  constructor() {
    this.apiKey = process.env.HINDSIGHT_API_KEY;
    this.apiUrl = process.env.HINDSIGHT_API_URL || 'https://api.hindsight.vectorize.io/v1';
    this.bankId = process.env.HINDSIGHT_BANK_ID || 'content-hindsight-prod';
    
    // Persistent JSON storage path for resilient embedded memory
    const dataDir = path.resolve(__dirname, '../../../data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.warn('Could not create data directory, using memory only', err);
      }
    }
    this.storageFilePath = path.join(dataDir, 'memories.json');
    this.loadInitialMemories();
  }

  private loadInitialMemories(): void {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const raw = fs.readFileSync(this.storageFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.memories = parsed;
          return;
        }
      }
    } catch (err) {
      console.warn('Error reading stored memories, falling back to seed:', err);
    }

    // Default to seed memories if file doesn't exist or is empty
    this.memories = JSON.parse(JSON.stringify(SEED_MEMORIES));
    this.persistMemories();
  }

  private persistMemories(): void {
    try {
      fs.writeFileSync(this.storageFilePath, JSON.stringify(this.memories, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to persist memories to file:', err);
    }
  }

  /**
   * Recall memories relevant to a query/prompt using semantic token matching and Hindsight API if configured
   */
  async recallMemories(query: string, options?: RecallQueryOptions): Promise<RecallResult> {
    try {
      // If external Hindsight API key is present, attempt cloud call first with graceful fallback
      if (this.apiKey) {
        try {
          const externalResult = await this.callHindsightCloudRecall(query, options);
          if (externalResult && externalResult.recalledMemories.length > 0) {
            return externalResult;
          }
        } catch (apiErr) {
          console.warn('Hindsight Cloud Recall error, falling back to embedded memory engine:', apiErr);
        }
      }

      // Embedded Semantic Memory Recall
      const recalled = this.computeSemanticRecall(query, options);
      const now = new Date().toISOString();
      this.lastRecalledTimestamp = now;

      // Update recall stats on the matched memories
      for (const item of recalled) {
        const mem = this.memories.find(m => m.id === item.id);
        if (mem) {
          mem.recallCount = (mem.recallCount || 0) + 1;
          mem.lastRecalledAt = now;
        }
      }
      this.persistMemories();

      const summary = `Recalled ${recalled.length} memories relating to brand voice, content gaps, and audience performance.`;
      const relevanceExplanation = recalled.map(m => 
        `[${m.category.toUpperCase()}] ${m.statement.slice(0, 80)}... (relevance: ${Math.round((m.relevanceScore || 0.8) * 100)}%)`
      );

      return {
        query,
        recalledMemories: recalled,
        summary,
        relevanceExplanation
      };
    } catch (error: any) {
      console.error('Error during recallMemories:', error);
      // Fallback: never crash the strategy pipeline
      return {
        query,
        recalledMemories: this.memories.slice(0, 3).map(m => ({ ...m, relevanceScore: 0.85 })),
        summary: 'Memory temporarily degraded, using core brand baseline.',
        relevanceExplanation: ['Core baseline memory loaded.']
      };
    }
  }

  /**
   * Retain a new memory statement into Hindsight
   */
  async retainMemory(input: RetainMemoryInput): Promise<HindsightMemory> {
    const category = input.category || this.inferCategory(input.statement);
    const newMemory: HindsightMemory = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      statement: input.statement.trim(),
      category,
      context: input.context || 'Retained from strategist feedback loop.',
      confidence: input.confidence ?? 0.95,
      learnedAt: new Date().toISOString(),
      source: input.source || 'user_feedback',
      recallCount: 0,
      tags: input.tags || this.extractTags(input.statement)
    };

    // If external Hindsight API configured, attempt remote sync
    if (this.apiKey) {
      try {
        await this.callHindsightCloudRetain(newMemory);
      } catch (err) {
        console.warn('Failed to sync retain to Hindsight Cloud, saved to embedded bank:', err);
      }
    }

    // Unshift to top of memories
    this.memories.unshift(newMemory);
    this.persistMemories();
    return newMemory;
  }

  /**
   * Get all stored memories
   */
  async getAllMemories(): Promise<HindsightMemory[]> {
    return [...this.memories];
  }

  /**
   * Get relevant memories by list of tags or topic keywords
   */
  async getRelevantMemories(topicsOrTags: string[]): Promise<HindsightMemory[]> {
    const query = topicsOrTags.join(' ');
    const res = await this.recallMemories(query, { limit: 5 });
    return res.recalledMemories;
  }

  /**
   * Delete a specific memory
   */
  async deleteMemory(id: string): Promise<boolean> {
    const initialLen = this.memories.length;
    this.memories = this.memories.filter(m => m.id !== id);
    if (this.memories.length !== initialLen) {
      this.persistMemories();
      return true;
    }
    return false;
  }

  /**
   * Reset memories to initial seed set
   */
  async resetMemoriesToDefault(): Promise<void> {
    this.memories = JSON.parse(JSON.stringify(SEED_MEMORIES));
    this.persistMemories();
  }

  /**
   * Get service operational status
   */
  getStatus(): HindsightServiceStatus {
    return {
      isConfigured: Boolean(this.apiKey),
      provider: this.apiKey ? 'hindsight_cloud' : 'hindsight_embedded',
      bankId: this.bankId,
      totalMemories: this.memories.length,
      lastRecalledAt: this.lastRecalledTimestamp
    };
  }

  // --- Internal Helper Algorithms ---

  private computeSemanticRecall(query: string, options?: RecallQueryOptions): HindsightMemory[] {
    const limit = options?.limit ?? 4;
    const qLower = query.toLowerCase();
    const queryTokens = qLower.split(/[\s,.-]+/).filter(t => t.length > 2);

    const scored = this.memories.map(mem => {
      let score = 0.5; // baseline prior
      const text = `${mem.statement} ${mem.context || ''} ${mem.tags.join(' ')} ${mem.category}`.toLowerCase();

      // Brand voice always carries baseline relevance
      if (mem.category === 'brand_voice') {
        score += 0.25;
      }

      // Keyword token matching
      for (const token of queryTokens) {
        if (text.includes(token)) {
          score += 0.18;
        }
      }

      // Specific thematic boosts
      if (qLower.includes('developer') || qLower.includes('engineer') || qLower.includes('tech')) {
        if (text.includes('technical') || text.includes('code') || text.includes('developer')) {
          score += 0.2;
        }
      }

      if (qLower.includes('agent') || qLower.includes('ai') || qLower.includes('llm')) {
        if (text.includes('agent') || text.includes('infrastructure') || text.includes('memory')) {
          score += 0.25;
        }
      }

      if (qLower.includes('linkedin') && (text.includes('tutorial') || text.includes('architecture'))) {
        score += 0.15;
      }

      // If user mentioned architecture or breakdown
      if (qLower.includes('architecture') && text.includes('architecture')) {
        score += 0.35;
      }

      // Normalize score between 0.65 and 0.99
      const normalizedScore = Math.min(0.99, Math.max(0.65, Number(score.toFixed(2))));

      return {
        ...mem,
        relevanceScore: normalizedScore
      };
    });

    // Sort by relevance score descending
    scored.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    // Filter by category if requested
    let filtered = scored;
    if (options?.categories && options.categories.length > 0) {
      filtered = scored.filter(m => options.categories!.includes(m.category));
    }

    return filtered.slice(0, limit);
  }

  private inferCategory(statement: string): MemoryCategory {
    const s = statement.toLowerCase();
    if (s.includes('voice') || s.includes('tone') || s.includes('style')) return 'brand_voice';
    if (s.includes('audience') || s.includes('prefer') || s.includes('response')) return 'audience_preference';
    if (s.includes('gap') || s.includes('missing') || s.includes('under-covered')) return 'content_gap';
    if (s.includes('underperform') || s.includes('poor') || s.includes('fail') || s.includes('mistake')) return 'underperforming_pattern';
    if (s.includes('perform') || s.includes('high') || s.includes('save') || s.includes('viral')) return 'successful_pattern';
    return 'learned_insight';
  }

  private extractTags(statement: string): string[] {
    const words = statement.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    const interesting = words.filter(w => w.length > 4 && !['about', 'their', 'which', 'there', 'should', 'would', 'could', 'because'].includes(w));
    return Array.from(new Set(interesting)).slice(0, 5);
  }

  private async callHindsightCloudRecall(query: string, options?: RecallQueryOptions): Promise<RecallResult | null> {
    if (!this.apiKey) return null;
    const resp = await fetch(`${this.apiUrl}/banks/${this.bankId}/recall`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        query,
        limit: options?.limit || 4
      })
    });
    if (!resp.ok) {
      throw new Error(`Hindsight API responded with status ${resp.status}`);
    }
    const data = await resp.json() as any;
    if (data && Array.isArray(data.memories)) {
      return {
        query,
        recalledMemories: data.memories,
        summary: data.summary || `Recalled ${data.memories.length} memories from Hindsight Cloud`,
        relevanceExplanation: data.explanations || []
      };
    }
    return null;
  }

  private async callHindsightCloudRetain(memory: HindsightMemory): Promise<void> {
    if (!this.apiKey) return;
    await fetch(`${this.apiUrl}/banks/${this.bankId}/retain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        statement: memory.statement,
        category: memory.category,
        context: memory.context,
        tags: memory.tags
      })
    });
  }
}

export const hindsightService = new HindsightService();
