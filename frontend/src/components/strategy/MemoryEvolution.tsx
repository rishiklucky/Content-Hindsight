import React, { useState } from 'react';
import { Sparkles, Brain, ArrowRight, ShieldAlert, CheckCircle2, TrendingUp, BookOpen, Layers } from 'lucide-react';

interface MemoryEvolutionProps {
  onTryPrompt?: (prompt: string) => void;
}

export const MemoryEvolution: React.FC<MemoryEvolutionProps> = ({ onTryPrompt }) => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'before' | 'after'>('side-by-side');

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0f1523] p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Core Product Demonstration
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Memory Evolution: Before vs After Hindsight
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            See how standard AI produces bland, generic platitudes, while ContentHindsight recalls your historical data, voice, and learned audience feedback to generate high-impact strategy.
          </p>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('side-by-side')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'side-by-side' ? 'bg-blue-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Side by Side
          </button>
          <button
            onClick={() => setActiveTab('before')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'before' ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Without Memory
          </button>
          <button
            onClick={() => setActiveTab('after')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'after' ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            With Hindsight
          </button>
        </div>
      </div>

      {/* Side by side comparison grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* BEFORE MEMORY */}
        {(activeTab === 'side-by-side' || activeTab === 'before') && (
          <div className="rounded-xl border border-rose-900/30 bg-rose-950/10 p-5 space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <ShieldAlert className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-rose-200 uppercase tracking-wider">
                    Without Memory (Generic AI)
                  </h3>
                  <p className="text-[11px] text-slate-400">Zero context, repeats mistakes, bland advice</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Stateless
              </span>
            </div>

            <div className="bg-slate-900/80 rounded-lg p-3.5 border border-slate-800 space-y-2">
              <p className="text-xs font-semibold text-slate-300">Prompt:</p>
              <p className="text-xs text-slate-400 italic">
                "I want to plan next week's LinkedIn content for developers interested in AI agents."
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Generic AI Output:
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <span className="text-rose-400 font-semibold mr-1.5">✕ Day 1:</span>
                  "The Future of AI is Unstoppable" — broad opinion post on how AI will transform business.
                  <span className="block text-[11px] text-slate-400 mt-1 italic">
                    Problem: Ignores that your audience dislikes generic hype (-65% engagement).
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <span className="text-rose-400 font-semibold mr-1.5">✕ Day 2:</span>
                  "Top 7 Prompt Hacks for Beginners" — quick listicle.
                  <span className="block text-[11px] text-slate-400 mt-1 italic">
                    Problem: Violates brand voice (developers find basic listicles superficial).
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <span className="text-rose-400 font-semibold mr-1.5">✕ Day 3:</span>
                  "Why Every Company Needs AI" — generic executive think-piece.
                  <span className="block text-[11px] text-slate-400 mt-1 italic">
                    Problem: Doesn't provide code, diagrams, or address the agent memory gap.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Personalization: 0%</span>
              <span className="text-rose-400 font-medium">Predicted Avg Score: ~35/100</span>
            </div>
          </div>
        )}

        {/* AFTER MEMORY */}
        {(activeTab === 'side-by-side' || activeTab === 'after') && (
          <div className="rounded-xl border border-blue-500/40 bg-blue-950/15 p-5 space-y-4 relative shadow-lg shadow-blue-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                    With Hindsight Memory
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Persistent
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Recalls voice, historical metrics & audience feedback</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Context-Aware
              </span>
            </div>

            {/* Recalled Memory Pills */}
            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-400 flex items-center gap-1.5">
                  <Brain className="h-3.5 w-3.5" />
                  Hindsight Memories Recalled:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">4 relevant rules</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
                  ✓ Technical tutorials drive 3.8x saves
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium">
                  ✓ Audience loves architecture diagrams
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium">
                  ✓ Agent memory is an under-covered gap
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
                  ✓ Brand voice is direct & code-first
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                Hindsight-Guided Plan:
              </p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-900/70 border border-blue-500/30">
                  <span className="text-blue-400 font-semibold mr-1.5">✓ Monday:</span>
                  "Building Reliable AI Agents with Persistent Context (With Architecture Diagram)"
                  <span className="block text-[11px] text-slate-400 mt-1">
                    Grounded: Directly targets the agent memory gap with concrete TypeScript code.
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/70 border border-blue-500/30">
                  <span className="text-blue-400 font-semibold mr-1.5">✓ Wednesday:</span>
                  "How We Reduced Multi-Agent P99 Latency by 40% (Profiling Breakdown)"
                  <span className="block text-[11px] text-slate-400 mt-1">
                    Grounded: Quantified metrics in headline drive 3x senior developer engagement.
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/70 border border-blue-500/30">
                  <span className="text-blue-400 font-semibold mr-1.5">✓ Friday:</span>
                  "5 Anti-Patterns Developers Make in Agent Memory Topologies"
                  <span className="block text-[11px] text-slate-400 mt-1">
                    Grounded: Uses mistake/anti-pattern framework to trigger high comment discussion.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Personalization: 96%</span>
              <span className="text-emerald-400 font-semibold">Predicted Avg Score: 94/100 (+168%)</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Try Button */}
      {onTryPrompt && (
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Ready to test this live in the AI Strategist workspace?
          </div>
          <button
            onClick={() => onTryPrompt('I want to plan next week\'s LinkedIn content for developers interested in AI agents.')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <span>Launch Hackathon Demo Story in AI Strategist</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
