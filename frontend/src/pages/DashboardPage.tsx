import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  TrendingUp,
  Flame,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  BarChart3,
  Bookmark,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { DashboardMetrics, ContentItem } from '../types';
import { api } from '../services/api';
import { MemoryEvolution } from '../components/strategy/MemoryEvolution';

interface DashboardPageProps {
  onNavigateToStrategist: (presetGoal?: string) => void;
  onNavigateToMemory: () => void;
  onNavigateToContent: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToStrategist,
  onNavigateToMemory,
  onNavigateToContent
}) => {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good morning.
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here's what your content memory knows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToStrategist()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Strategy</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-400" />
          <p className="text-xs text-slate-400 font-medium">Assembling live brand memory metrics...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : data ? (
        <>
          {/* Top 4 Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-5 hover:border-slate-700 transition-all space-y-1">
              <span className="text-xs font-semibold text-slate-400">Content Analyzed</span>
              <div className="text-3xl font-extrabold text-white">{data.totalContentAnalyzed}</div>
              <p className="text-[11px] text-slate-400">Across LinkedIn, Blog, X & YT</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-5 hover:border-slate-700 transition-all space-y-1">
              <span className="text-xs font-semibold text-slate-400">Average Engagement</span>
              <div className="text-3xl font-extrabold text-blue-400">{data.averageEngagementRate}%</div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>+24% on memory-grounded posts</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-5 hover:border-slate-700 transition-all space-y-1">
              <span className="text-xs font-semibold text-slate-400">Content Gaps Identified</span>
              <div className="text-3xl font-extrabold text-amber-400">{data.contentGapsIdentified}</div>
              <p className="text-[11px] text-amber-300/80">Persistent memory & latency benchmarks</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-5 hover:border-slate-700 transition-all space-y-1">
              <span className="text-xs font-semibold text-slate-400">Memories Stored</span>
              <div className="text-3xl font-extrabold text-purple-400">{data.memoriesStored}</div>
              <p className="text-[11px] text-purple-300/80 font-mono">
                {data.totalMemoryRecalls} lifetime recall hits
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Over Time Chart */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    Content Performance Over Time
                  </h3>
                  <p className="text-xs text-slate-400">
                    Engagement score per published technical asset
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                  Engagement Score (0-100)
                </span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.performanceOverTime}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#f8fafc'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avgEngagement"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#scoreGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Topic Performance Bar Chart */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                    Topic Engagement Performance
                  </h3>
                  <p className="text-xs text-slate-400">
                    Empirical score by topic cluster
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                  Avg Engagement %
                </span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topicPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <YAxis
                      dataKey="topic"
                      type="category"
                      stroke="#94a3b8"
                      fontSize={11}
                      width={110}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#f8fafc'
                      }}
                    />
                    <Bar dataKey="avgEngagement" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Memory Evolution Component */}
          <MemoryEvolution
            onTryPrompt={demoPrompt => onNavigateToStrategist(demoPrompt)}
          />

          {/* Bottom Grid: Recent Activity & Urgent Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Memory Activity Log */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-400" />
                  Recent Memory Activity
                </h3>
                <button
                  onClick={onNavigateToMemory}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>Memory Center</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {data.recentActivity.map(act => (
                  <div
                    key={act.id}
                    className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-start gap-3"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 text-xs shrink-0 mt-0.5">
                      •
                    </span>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-200 capitalize">
                          {act.type.replace('_', ' ')}
                        </span>
                        <span className="text-slate-400 font-mono">{act.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-400">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Targeted Gaps & Active Brand Voice */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-5 space-y-5">
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Flame className="h-4 w-4" />
                  Urgent Content Gaps to Capitalize
                </h3>
                <div className="space-y-2">
                  {data.urgentGaps.map((gap, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-medium flex items-center justify-between"
                    >
                      <span>{gap}</span>
                      <button
                        onClick={() =>
                          onNavigateToStrategist(`Plan a strategy addressing the content gap: ${gap}`)
                        }
                        className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
                      >
                        Target Gap →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Active Brand Voice Rules
                </h3>
                <div className="space-y-1.5">
                  {data.activeBrandVoice.map((voice, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 italic"
                    >
                      "{voice}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Content Showcase */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  Recent High-Performing Content
                </h3>
                <p className="text-xs text-slate-400">
                  Learnings from these posts inform the Hindsight memory engine
                </p>
              </div>
              <button
                onClick={onNavigateToContent}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>View All Content</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.recentContent.map(item => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-400">{item.platform}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Score: {item.engagementScore} ({item.performanceCategory})
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80 text-[11px] text-purple-300 italic">
                    Agent Learned: {item.aiAnalysis.learnedPattern}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
