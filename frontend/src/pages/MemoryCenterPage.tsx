import React, { useState, useEffect } from 'react';
import {
  Database,
  Brain,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  Sparkles,
  Flame,
  Layers,
  ShieldCheck,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { HindsightMemory, MemoryCategory } from '../types';
import { api } from '../services/api';

interface MemoryCenterPageProps {
  onMemoryChanged?: () => void;
}

export const MemoryCenterPage: React.FC<MemoryCenterPageProps> = ({ onMemoryChanged }) => {
  const [memories, setMemories] = useState<HindsightMemory[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<MemoryCategory | 'ALL'>('ALL');

  // New Memory Modal / Input Form
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newStatement, setNewStatement] = useState<string>('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('audience_preference');
  const [newContext, setNewContext] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchMemories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMemories();
      setMemories(res.memories);
      setStatus(res.status);
    } catch (err: any) {
      setError(err?.message || 'Memory temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim()) return;

    setIsSubmitting(true);
    try {
      await api.retainMemory({
        statement: newStatement.trim(),
        category: newCategory,
        context: newContext.trim() || undefined
      });
      setNewStatement('');
      setNewContext('');
      setShowAddForm(false);
      await fetchMemories();
      if (onMemoryChanged) onMemoryChanged();
    } catch (err: any) {
      alert('Failed to retain memory: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    if (!window.confirm('Are you sure you want to forget this memory from Hindsight?')) return;
    try {
      await api.deleteMemory(id);
      await fetchMemories();
      if (onMemoryChanged) onMemoryChanged();
    } catch (err: any) {
      alert('Failed to delete memory: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleResetToBaseline = async () => {
    if (!window.confirm('Reset all memories to the curated Hackathon seed bank?')) return;
    setLoading(true);
    try {
      await api.resetMemories();
      await fetchMemories();
      if (onMemoryChanged) onMemoryChanged();
    } catch (err: any) {
      alert('Failed to reset memories: ' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Groupings for structured overview
  const brandVoiceMemories = memories.filter(m => m.category === 'brand_voice');
  const audiencePreferences = memories.filter(m => m.category === 'audience_preference');
  const successfulPatterns = memories.filter(m => m.category === 'successful_pattern');
  const underperformingPatterns = memories.filter(m => m.category === 'underperforming_pattern');
  const contentGaps = memories.filter(m => m.category === 'content_gap');
  const learnedInsights = memories.filter(m => m.category === 'learned_insight');

  // Filtered list
  const filteredMemories = memories.filter(m => {
    const matchesSearch =
      m.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.context && m.context.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const getCategoryMeta = (cat: MemoryCategory) => {
    switch (cat) {
      case 'brand_voice':
        return { label: 'Brand Voice', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'audience_preference':
        return { label: 'Audience Preference', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'successful_pattern':
        return { label: 'Successful Pattern', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'underperforming_pattern':
        return { label: 'Underperforming Anti-Pattern', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      case 'content_gap':
        return { label: 'Content Gap', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      default:
        return { label: 'Learned Insight', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <Database className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Hindsight Persistent Store
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Memory Center
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Everything ContentHindsight has learned about your brand, audience & performance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleResetToBaseline}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset to default seed bank"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Baseline</span>
          </button>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Retain New Memory</span>
          </button>
        </div>
      </div>

      {/* Memory Status & Quick Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-4">
          <div className="text-xs font-semibold text-slate-400">Total Memories</div>
          <div className="text-2xl font-bold text-white mt-1">{memories.length}</div>
          <div className="text-[11px] text-purple-400 mt-1 font-mono">Hindsight persistent</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-4">
          <div className="text-xs font-semibold text-slate-400">Brand Voice Rules</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{brandVoiceMemories.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Tone & directness</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-4">
          <div className="text-xs font-semibold text-slate-400">Identified Gaps</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{contentGaps.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Under-covered areas</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-4">
          <div className="text-xs font-semibold text-slate-400">Active Learned Rules</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {successfulPatterns.length + audiencePreferences.length + underperformingPatterns.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Patterns & feedback</div>
        </div>
      </div>

      {/* Structured Category Highlights (Visual Cards as requested in Phase 10) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Brand Voice Tile */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Brand Voice Memory
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-mono">
              Core Tone
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-emerald-500/30 text-emerald-200 font-semibold">
              Technical
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-emerald-500/30 text-emerald-200 font-semibold">
              Practical
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-emerald-500/30 text-emerald-200 font-semibold">
              Developer-focused
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-emerald-500/30 text-emerald-200 font-semibold">
              Direct & Code-First
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed italic pt-1">
            "Never use generic thought-leadership platitudes. Always anchor recommendations in verifiable code or architecture."
          </p>
        </div>

        {/* Learned Patterns Tile */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              Learned Patterns
            </h3>
            <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded font-mono">
              Empirical
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-200 font-medium">Technical tutorials</span>
              <span className="text-emerald-400 font-bold">→ High engagement (94%)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-200 font-medium">Architecture breakdowns</span>
              <span className="text-blue-400 font-bold">→ 3.8x saves & bookmarks</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-200 font-medium">Generic AI posts</span>
              <span className="text-rose-400 font-bold">→ -65% engagement drop</span>
            </div>
          </div>
        </div>

        {/* Content Gaps Tile */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="h-4 w-4" />
              Targeted Content Gaps
            </h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-mono">
              High Opportunity
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="p-2 rounded bg-slate-900/80 border border-amber-500/30 text-xs text-amber-200 font-medium">
              • Persistent AI Agent Memory & Hindsight Integration
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-amber-500/30 text-xs text-amber-200 font-medium">
              • Multi-Agent Latency Benchmarking & Profiling
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-amber-500/30 text-xs text-amber-200 font-medium">
              • Production State Machines vs Prompt Chaining
            </div>
          </div>
        </div>
      </div>

      {/* Add Memory Modal / Accordion */}
      {showAddForm && (
        <form
          onSubmit={handleAddMemory}
          className="rounded-2xl border-2 border-purple-500/50 bg-[#101627] p-5 sm:p-6 shadow-2xl space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="h-4 w-4 text-purple-400" />
              Retain New Belief in Hindsight Memory
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Memory Statement / Finding <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              required
              value={newStatement}
              onChange={e => setNewStatement(e.target.value)}
              placeholder="e.g. Our audience responds especially well to architecture breakdowns."
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="audience_preference">Audience Preference</option>
                <option value="successful_pattern">Successful Pattern</option>
                <option value="content_gap">Content Gap</option>
                <option value="brand_voice">Brand Voice</option>
                <option value="underperforming_pattern">Underperforming Pattern</option>
                <option value="learned_insight">Learned Insight</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Evidence / Context</label>
              <input
                type="text"
                value={newContext}
                onChange={e => setNewContext(e.target.value)}
                placeholder="e.g. Save rate was 3.8x higher on system diagram posts."
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !newStatement.trim()}
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Retaining...' : 'Retain to Hindsight'}
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0d1322] p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search recalled memories, tags, or context..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="brand_voice">Brand Voice</option>
            <option value="audience_preference">Audience Preference</option>
            <option value="successful_pattern">Successful Pattern</option>
            <option value="content_gap">Content Gap</option>
            <option value="underperforming_pattern">Underperforming Pattern</option>
            <option value="learned_insight">Learned Insight</option>
          </select>
        </div>
      </div>

      {/* Memories List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
          <span>Active Memories ({filteredMemories.length})</span>
          <span>Click a memory to inspect its learned context</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <RefreshCw className="h-5 w-5 animate-spin mx-auto text-purple-400" />
            <p>Loading Hindsight memories...</p>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            No memories match your search filter.
          </div>
        ) : (
          filteredMemories.map(mem => {
            const meta = getCategoryMeta(mem.category);
            return (
              <div
                key={mem.id}
                className="rounded-xl border border-slate-800/90 bg-[#0d1322] p-4 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 mt-0.5">
                      <Brain className="h-4 w-4" />
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.color}`}>
                          {meta.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Confidence: {Math.round(mem.confidence * 100)}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Recalls: {mem.recallCount || 0}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Learned: {new Date(mem.learnedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-sm text-slate-100 font-medium leading-relaxed">
                        {mem.statement}
                      </p>

                      {mem.context && (
                        <p className="text-xs text-slate-400 italic">
                          Grounding: {mem.context}
                        </p>
                      )}

                      {mem.tags && mem.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                          {mem.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMemory(mem.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Delete this memory"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
