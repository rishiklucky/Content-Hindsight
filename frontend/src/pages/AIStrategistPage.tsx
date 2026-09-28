import React, { useState } from 'react';
import {
  Sparkles,
  Brain,
  Send,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  BookmarkCheck,
  Flame,
  Layers,
  Cpu,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { StrategyRequest, StrategyResult } from '../types';
import { api } from '../services/api';
import { MemoryUsedPanel } from '../components/strategy/MemoryUsedPanel';
import { SevenDayPlanView } from '../components/strategy/SevenDayPlanView';
import { MemoryEvolution } from '../components/strategy/MemoryEvolution';

interface AIStrategistPageProps {
  onMemoryUpdated?: () => void;
}

export const AIStrategistPage: React.FC<AIStrategistPageProps> = ({ onMemoryUpdated }) => {
  // Input form state
  const [goal, setGoal] = useState<string>(
    "I want to plan next week's LinkedIn content for developers interested in AI agents."
  );
  const [targetAudience, setTargetAudience] = useState<string>('Developers interested in AI agents');
  const [platform, setPlatform] = useState<string>('LinkedIn');
  const [useMemory, setUseMemory] = useState<boolean>(true);

  // New feedback / learning state
  const [userLearningsFeedback, setUserLearningsFeedback] = useState<string>('');
  const [isRetainingMemory, setIsRetainingMemory] = useState<boolean>(false);
  const [lastRetainedNotice, setLastRetainedNotice] = useState<string | null>(null);

  // Execution states
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick preset demo scenarios
  const DEMO_PRESETS = [
    {
      label: 'Demo Step 1: Developer AI Agents',
      query: "I want to plan next week's LinkedIn content for developers interested in AI agents.",
      audience: 'Developers interested in AI agents',
      platform: 'LinkedIn'
    },
    {
      label: 'Demo Step 2: Architecture Feedback',
      feedback: 'Our audience responds especially well to architecture breakdowns.',
      query: "Give me content topics focusing on agent architecture and latency.",
      audience: 'Senior AI Systems Engineers',
      platform: 'LinkedIn'
    },
    {
      label: 'Multi-Agent Latency Case Study',
      query: 'Plan technical content to address our latency optimization benchmarks in multi-agent workflows.',
      audience: 'Backend & ML Engineers',
      platform: 'Blog'
    }
  ];

  const handleGenerateStrategy = async (overrideGoal?: string, overrideFeedback?: string) => {
    const activeGoal = overrideGoal || goal;
    if (!activeGoal.trim()) return;

    setError(null);
    try {
      // Step sequence visualization
      setLoadingStep('Recalling brand memory from Hindsight...');
      await new Promise(r => setTimeout(r, 400));

      setLoadingStep('Analyzing historical content performance...');
      await new Promise(r => setTimeout(r, 400));

      setLoadingStep('Groq synthesizing memory-guided content strategy...');

      const req: StrategyRequest = {
        goal: activeGoal,
        targetAudience,
        platform: platform as any,
        timeframe: 'Next 7 Days',
        userLearningsFeedback: overrideFeedback || userLearningsFeedback || undefined,
        useMemory
      };

      const result = await api.generateStrategy(req);
      setStrategyResult(result);
      setLoadingStep(null);

      // If user had provided feedback, acknowledge retention
      if (req.userLearningsFeedback) {
        setLastRetainedNotice(`Memory updated: "${req.userLearningsFeedback}" retained in Hindsight.`);
        setUserLearningsFeedback('');
        if (onMemoryUpdated) onMemoryUpdated();
      }
    } catch (err: any) {
      console.error('Failed to generate strategy:', err);
      setError(err?.message || 'Failed to generate strategy. Please verify your backend server.');
      setLoadingStep(null);
    }
  };

  const handleRetainStandaloneLearning = async () => {
    if (!userLearningsFeedback.trim()) return;
    setIsRetainingMemory(true);
    try {
      await api.retainMemory({
        statement: userLearningsFeedback.trim(),
        category: 'audience_preference',
        context: 'Direct user feedback provided in AI Strategist workspace.'
      });
      setLastRetainedNotice(`Memory updated: "${userLearningsFeedback}" is now stored in Hindsight!`);
      setUserLearningsFeedback('');
      if (onMemoryUpdated) onMemoryUpdated();
    } catch (err: any) {
      setError('Failed to store memory: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsRetainingMemory(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Strategy Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Strategist
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Build a content strategy using everything your brand has learned.
          </p>
        </div>

        {/* Memory Toggle */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2 rounded-xl self-start md:self-auto">
          <div className="flex items-center gap-2 text-xs">
            <Brain className={`h-4 w-4 ${useMemory ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="font-semibold text-slate-200">Hindsight Memory</span>
          </div>
          <button
            type="button"
            onClick={() => setUseMemory(!useMemory)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              useMemory
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {useMemory ? 'Enabled (Context Aware)' : 'Disabled (Generic AI)'}
          </button>
        </div>
      </div>

      {/* Preset Demo Buttons Bar */}
      <div className="rounded-xl border border-slate-800/90 bg-[#0d1322] p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            Hackathon Demo Flow Shortcuts:
          </span>
          <span className="text-[11px] text-slate-400">One-click to test the prompt sequence</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setGoal(preset.query);
                if (preset.audience) setTargetAudience(preset.audience);
                if (preset.platform) setPlatform(preset.platform);
                if (preset.feedback) setUserLearningsFeedback(preset.feedback);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-blue-500/60 hover:bg-slate-800 transition-all font-medium text-left"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Strategy Input Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f1523] p-5 sm:p-6 shadow-xl space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>What are you trying to achieve?</span>
            <span className="text-slate-400 font-normal lowercase">
              e.g. platform, objective, target developer segment
            </span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="I want to plan next week's LinkedIn content for developers interested in AI agents."
              className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Target Audience & Platform Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              placeholder="e.g. Developers interested in AI agents"
              className="w-full rounded-lg bg-slate-900/90 border border-slate-700/80 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Platform</label>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="w-full rounded-lg bg-slate-900/90 border border-slate-700/80 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="LinkedIn">LinkedIn (Primary)</option>
              <option value="Blog">Technical Blog</option>
              <option value="X">X (Twitter)</option>
              <option value="YouTube">YouTube</option>
              <option value="All">All Platforms</option>
            </select>
          </div>
        </div>

        {/* Generate Button & Progress State */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            {useMemory ? (
              <span className="flex items-center gap-1.5 text-purple-300 font-medium">
                <Brain className="h-3.5 w-3.5 text-purple-400" />
                Hindsight memory will recall brand voice, content gaps, and past metrics.
              </span>
            ) : (
              <span className="text-slate-400">
                Memory disabled: Generating baseline generic social strategy.
              </span>
            )}
          </div>

          <button
            onClick={() => handleGenerateStrategy()}
            disabled={Boolean(loadingStep)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {loadingStep ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>{loadingStep}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Strategy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications / Error */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {lastRetainedNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="font-semibold">{lastRetainedNotice}</span>
          </div>
          <button
            onClick={() => setLastRetainedNotice(null)}
            className="text-slate-400 hover:text-white text-xs font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* Strategy Result Container */}
      {strategyResult && (
        <div className="space-y-8 animate-fadeIn">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0f172a] border border-blue-500/30">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Content Strategy Generated
                </h3>
                <p className="text-[11px] text-slate-400">
                  Mode: <span className="font-mono text-blue-300">{strategyResult.executionMode}</span> • Recalled {strategyResult.memoriesUsed.length} memories
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-slate-400">
              {new Date(strategyResult.generatedAt).toLocaleTimeString()}
            </span>
          </div>

          {/* 1. Recalled Memory Panel */}
          {strategyResult.executionMode === 'with_memory' && (
            <MemoryUsedPanel
              memories={strategyResult.memoriesUsed}
              whyTheseRecommendations={strategyResult.whyTheseRecommendations}
            />
          )}

          {/* 2. Strategic Direction Card */}
          <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Strategic Direction
              </h3>
            </div>
            <p className="text-sm text-slate-200 font-medium leading-relaxed bg-slate-900/60 p-4 rounded-lg border border-slate-800/80">
              {strategyResult.strategicDirection}
            </p>
          </div>

          {/* 3. Content Pillars & Audience Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillars */}
            <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-400" />
                Content Pillars
              </h3>
              <div className="space-y-2.5">
                {strategyResult.contentPillars.map((pillar, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{pillar.name}</span>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                        {pillar.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience Insights & Content Gaps */}
            <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Audience Insights Grounded in Memory
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {strategyResult.audienceInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-900/50 p-2 rounded border border-slate-800/60">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Flame className="h-3.5 w-3.5" />
                  Targeted Content Gaps
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {strategyResult.contentGaps.map((gap, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium"
                    >
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Recommended Topics */}
          <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4 text-blue-400" />
              Recommended High-Impact Topics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {strategyResult.recommendedTopics.map((topic, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-blue-500/40 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-blue-400">{topic.type}</span>
                      <span className="font-mono text-emerald-400">{topic.expectedEngagement}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{topic.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                    Rationale: {topic.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. 7-Day Content Plan */}
          <SevenDayPlanView plan={strategyResult.sevenDayPlan} />

          {/* 6. TEACH AGENT NEW LEARNING (Feedback Loop Step 7 - 9) */}
          <div className="rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-br from-[#12192c] via-[#0f1424] to-[#18122c] p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-500/20">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 memory-active-glow">
                  <Brain className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    Teach Agent New Learning
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Step 7-9 of Demo Story
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Provide new audience feedback or performance findings to store permanently in Hindsight.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>New Brand Learning / Audience Preference:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setUserLearningsFeedback(
                        'Our audience responds especially well to architecture breakdowns.'
                      )
                    }
                    className="text-[11px] text-purple-400 hover:text-purple-300 underline font-medium cursor-pointer"
                  >
                    Paste Hackathon Demo Text: "Our audience responds especially well to architecture breakdowns."
                  </button>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={userLearningsFeedback}
                    onChange={e => setUserLearningsFeedback(e.target.value)}
                    placeholder="e.g. Our audience responds especially well to architecture breakdowns."
                    className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRetainStandaloneLearning}
                      disabled={!userLearningsFeedback.trim() || isRetainingMemory}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>{isRetainingMemory ? 'Retaining...' : 'Store in Hindsight'}</span>
                    </button>

                    <button
                      onClick={() => handleGenerateStrategy(undefined, userLearningsFeedback)}
                      disabled={!userLearningsFeedback.trim() || Boolean(loadingStep)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Retain & Regenerate Strategy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Before vs After Memory Evolution Comparison Component */}
      <div className="pt-4">
        <MemoryEvolution
          onTryPrompt={demoPrompt => {
            setGoal(demoPrompt);
            setUseMemory(true);
            handleGenerateStrategy(demoPrompt);
          }}
        />
      </div>
    </div>
  );
};
