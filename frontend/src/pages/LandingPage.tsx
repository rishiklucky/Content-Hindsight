import React from 'react';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  TrendingUp,
  History,
  ShieldCheck,
  Zap,
  Repeat
} from 'lucide-react';

interface LandingPageProps {
  onStartStrategy: () => void;
  onExploreMemory: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartStrategy,
  onExploreMemory
}) => {
  return (
    <div className="space-y-16 max-w-6xl mx-auto pb-20 pt-4">
      {/* Hero Section */}
      <div className="relative text-center space-y-6 pt-8 pb-12 overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Brain className="h-4 w-4 text-blue-400 animate-pulse" />
          ContentHindsight • Hackathon Project
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Your content strategy{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            remembers.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An AI strategist that learns your brand, remembers what you've published, understands what performs, and continuously improves with persistent Hindsight memory.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartStrategy}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Start Building Strategy</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onExploreMemory}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-all cursor-pointer"
          >
            <Database className="h-4 w-4 text-purple-400" />
            <span>See How Memory Works</span>
          </button>
        </div>
      </div>

      {/* Product Architecture Loop Diagram */}
      <div className="rounded-3xl border border-slate-800 bg-[#0d1322] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            System Architecture
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            The Persistent Memory Loop
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            How Hindsight eliminates agent amnesia and translates performance history into compounding strategy intelligence.
          </p>
        </div>

        {/* Interactive Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center">
          {/* Node 1 */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="h-10 w-10 mx-auto rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase">1. Content History</h4>
            <p className="text-[11px] text-slate-400">Past posts, metrics, saves & resonance</p>
          </div>

          <div className="hidden md:flex justify-center text-purple-400">
            <ArrowRight className="h-5 w-5" />
          </div>

          {/* Node 2 */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900/90 border-2 border-purple-500/40 space-y-2 memory-active-glow">
            <div className="h-10 w-10 mx-auto rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-purple-300 uppercase">2. Hindsight Memory</h4>
            <p className="text-[11px] text-slate-300">Retain beliefs, voice, gaps & recall tokens</p>
          </div>

          <div className="hidden md:flex justify-center text-blue-400">
            <ArrowRight className="h-5 w-5" />
          </div>

          {/* Node 3 */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="h-10 w-10 mx-auto rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase">3. Groq Strategist</h4>
            <p className="text-[11px] text-slate-400">Synthesizes contextual 7-day roadmaps</p>
          </div>
        </div>

        {/* Feedback Return Arrow */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-purple-400 shrink-0" />
            <span>
              <strong className="text-slate-200">The Compounding Loop:</strong> User feedback or new engagement metrics auto-extract into Hindsight for subsequent requests.
            </span>
          </div>
          <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20">
            Zero Context Degradation
          </span>
        </div>
      </div>

      {/* 3 Pillars Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-3">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Brain className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">REMEMBER</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every interaction, postmortem, and audience feedback statement becomes part of your strategy memory instead of vanishing with the chat session.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-3">
          <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">UNDERSTAND</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Discover what content formats actually drive saves and shares (technical tutorials, architecture breakdowns) versus what dilutes brand authority.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">IMPROVE</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Recommendations become more personalized as the agent accumulates memory. Compare Before vs After memory to see the compounding difference.
          </p>
        </div>
      </div>
    </div>
  );
};
