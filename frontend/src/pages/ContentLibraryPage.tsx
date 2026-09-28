import React, { useState, useEffect } from 'react';
import {
  Library,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Brain,
  CheckCircle2,
  X,
  PlusCircle,
  ExternalLink,
  Sparkles,
  BarChart2,
  Tag
} from 'lucide-react';
import { ContentItem, Platform, ContentType, PerformanceCategory } from '../types';
import { api } from '../services/api';

interface ContentLibraryPageProps {
  onMemoryRetained?: () => void;
}

export const ContentLibraryPage: React.FC<ContentLibraryPageProps> = ({ onMemoryRetained }) => {
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [search, setSearch] = useState<string>('');
  const [platform, setPlatform] = useState<Platform | 'All'>('All');
  const [contentType, setContentType] = useState<ContentType | 'All'>('All');
  const [performanceCategory, setPerformanceCategory] = useState<PerformanceCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'publishedAt' | 'engagementScore' | 'views' | 'saves'>('engagementScore');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [retainedNotice, setRetainedNotice] = useState<string | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        sortBy,
        sortOrder: 'desc'
      };
      if (search) params.search = search;
      if (platform !== 'All') params.platform = platform;
      if (contentType !== 'All') params.contentType = contentType;
      if (performanceCategory !== 'All') params.performanceCategory = performanceCategory;

      const items = await api.getContentList(params);
      setContentList(items);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch content library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [search, platform, contentType, performanceCategory, sortBy]);

  const handleRetainLearnedPattern = async (item: ContentItem) => {
    try {
      await api.retainMemory({
        statement: item.aiAnalysis.learnedPattern,
        category: item.performanceCategory === 'High' ? 'successful_pattern' : 'underperforming_pattern',
        context: `Extracted from post: "${item.title}" (${item.platform})`,
        tags: item.topics
      });
      setRetainedNotice(`Retained in Hindsight: "${item.aiAnalysis.learnedPattern}"`);
      if (onMemoryRetained) onMemoryRetained();
    } catch (err: any) {
      alert('Failed to retain: ' + (err?.message || 'Unknown error'));
    }
  };

  const getPerformanceBadge = (cat: PerformanceCategory) => {
    switch (cat) {
      case 'High':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Average':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Underperforming':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Library className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Historical Library
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Content Library
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Inspect historical posts, audience resonance metrics, and what the agent learned from each.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="p-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center text-xs font-medium">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'cards' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search title, summary, or topics..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Platform */}
          <select
            value={platform}
            onChange={e => setPlatform(e.target.value as any)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Platforms</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Blog">Technical Blog</option>
            <option value="X">X (Twitter)</option>
            <option value="YouTube">YouTube</option>
          </select>

          {/* Category */}
          <select
            value={performanceCategory}
            onChange={e => setPerformanceCategory(e.target.value as any)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Performance</option>
            <option value="High">High Performing</option>
            <option value="Average">Average</option>
            <option value="Underperforming">Underperforming</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="engagementScore">Sort by Engagement</option>
            <option value="publishedAt">Sort by Date</option>
            <option value="views">Sort by Views</option>
            <option value="saves">Sort by Saves / Bookmarks</option>
          </select>
        </div>
      </div>

      {/* Retained Alert Notice */}
      {retainedNotice && (
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="font-semibold">{retainedNotice}</span>
          </div>
          <button
            onClick={() => setRetainedNotice(null)}
            className="text-slate-400 hover:text-white font-mono text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Content Display: Cards vs Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 space-y-2">
          <Library className="h-6 w-6 animate-spin mx-auto text-blue-400" />
          <p>Querying content historical performance records...</p>
        </div>
      ) : contentList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          No content matches the selected filters.
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {contentList.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0d1322] p-5 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group"
            >
              <div className="space-y-3">
                {/* Meta header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-400">{item.platform}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getPerformanceBadge(
                      item.performanceCategory
                    )}`}
                  >
                    Score: {item.engagementScore}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-1">
                  {item.topics.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                  {item.topics.length > 3 && (
                    <span className="text-[10px] px-1 text-slate-500">
                      +{item.topics.length - 3}
                    </span>
                  )}
                </div>

                {/* Agent Learned Snippet */}
                <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-200">
                  <span className="font-bold text-purple-400 block mb-0.5 flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    WHAT THE AGENT LEARNED:
                  </span>
                  <p className="italic leading-snug">{item.aiAnalysis.learnedPattern}</p>
                </div>
              </div>

              {/* Metrics footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {item.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {item.likes.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Bookmark className="h-3.5 w-3.5" />
                  {item.saves.toLocaleString()}
                </span>
                <span className="text-blue-400 group-hover:underline text-[11px] font-sans">
                  Inspect →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-slate-800 overflow-x-auto bg-[#0d1322]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Engagement</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Saves</th>
                <th className="px-4 py-3">Learned Pattern</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {contentList.map(item => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  onClick={() => setSelectedItem(item)}
                >
                  <td className="px-4 py-3 font-semibold text-white max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 text-blue-400 font-medium">{item.platform}</td>
                  <td className="px-4 py-3 text-slate-400">{item.contentType}</td>
                  <td className="px-4 py-3 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPerformanceBadge(
                        item.performanceCategory
                      )}`}
                    >
                      {item.engagementScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">{item.views.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono">{item.saves.toLocaleString()}</td>
                  <td className="px-4 py-3 max-w-sm truncate text-purple-300 italic">
                    {item.aiAnalysis.learnedPattern}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Content Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-[#0f1523] p-6 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-400">
                    {selectedItem.platform}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400">{selectedItem.contentType}</span>
                  <span className="text-slate-500">•</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getPerformanceBadge(
                      selectedItem.performanceCategory
                    )}`}
                  >
                    Engagement Score: {selectedItem.engagementScore} ({selectedItem.performanceCategory})
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {selectedItem.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Performance Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Views</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {selectedItem.views.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Likes</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {selectedItem.likes.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Comments</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {selectedItem.comments.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Shares</span>
                <div className="text-base font-bold text-white mt-0.5">
                  {selectedItem.shares.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Saves</span>
                <div className="text-base font-bold text-purple-400 mt-0.5">
                  {selectedItem.saves.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Summary</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                {selectedItem.summary}
              </p>
            </div>

            {/* AI Analysis Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                AI Performance Analysis
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="font-semibold text-slate-400 block">Audience Resonance:</span>
                  <p className="text-slate-200">{selectedItem.aiAnalysis.audienceResonance}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="font-semibold text-slate-400 block">Why It Worked or Failed:</span>
                  <p className="text-slate-200">{selectedItem.aiAnalysis.whyItWorkedOrFailed}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1 md:col-span-2">
                  <span className="font-semibold text-slate-400 block">Key Takeaway:</span>
                  <p className="text-slate-200">{selectedItem.aiAnalysis.keyTakeaway}</p>
                </div>
              </div>
            </div>

            {/* WHAT THE AGENT LEARNED & Retain in Hindsight Action */}
            <div className="p-4 rounded-xl border border-purple-500/40 bg-purple-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="h-4 w-4 text-purple-400" />
                  What the Agent Learned
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded font-mono">
                  Hindsight Candidate
                </span>
              </div>
              <p className="text-xs text-purple-100 font-medium leading-relaxed italic">
                "{selectedItem.aiAnalysis.learnedPattern}"
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleRetainLearnedPattern(selectedItem)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Retain into Hindsight Memory</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
