import React from 'react';
import { Brain, CheckCircle2, Tag, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { HindsightMemory } from '../../types';

interface MemoryUsedPanelProps {
  memories: HindsightMemory[];
  whyTheseRecommendations?: string[];
  isRecalling?: boolean;
}

export const MemoryUsedPanel: React.FC<MemoryUsedPanelProps> = ({
  memories,
  whyTheseRecommendations,
  isRecalling
}) => {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'brand_voice':
        return { label: 'Brand Voice', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'audience_preference':
        return { label: 'Audience Preference', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'successful_pattern':
        return { label: 'Successful Pattern', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'content_gap':
        return { label: 'Content Gap', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'underperforming_pattern':
        return { label: 'Anti-Pattern', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      default:
        return { label: 'Learned Insight', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
    }
  };

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-b from-[#131b2e] to-[#0f1523] p-5 shadow-lg relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Hindsight Memory Used
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold lowercase">
                memory recalled
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Active beliefs and past learnings influencing this strategy
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
          {memories.length} memories activated
        </span>
      </div>

      {/* Recalled items list */}
      <div className="mt-4 space-y-3">
        {isRecalling ? (
          <div className="py-8 text-center space-y-2">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p className="text-xs text-slate-400 font-medium animate-pulse">
              Recalling brand memories from Hindsight bank...
            </p>
          </div>
        ) : memories.length === 0 ? (
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            No memories were recalled for this query, or memory mode was disabled.
          </div>
        ) : (
          memories.map((mem, idx) => {
            const badge = getCategoryBadge(mem.category);
            return (
              <div
                key={mem.id || idx}
                className="rounded-lg bg-slate-900/80 border border-slate-800/90 p-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                        {mem.relevanceScore && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            relevance: {Math.round(mem.relevanceScore * 100)}%
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          confidence: {Math.round(mem.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        {mem.statement}
                      </p>
                      {mem.context && (
                        <p className="text-[11px] text-slate-400 mt-1 italic">
                          Grounding: {mem.context}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Why these recommendations summary */}
      {whyTheseRecommendations && whyTheseRecommendations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/90">
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Why These Recommendations:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {whyTheseRecommendations.map((reason, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-400 font-bold shrink-0">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
