import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Cpu,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

interface SettingsPageProps {
  onMemoryReset?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onMemoryReset }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await api.getHealth();
      setHealthData(res);
    } catch (err: any) {
      console.warn('Error fetching health status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleResetBaseline = async () => {
    if (!window.confirm('Reset all agent memories to the curated Hackathon seed bank?')) return;
    try {
      await api.resetMemories();
      setMessage('Hindsight memory bank reset to default seed state.');
      fetchHealth();
      if (onMemoryReset) onMemoryReset();
    } catch (err: any) {
      alert('Failed to reset: ' + err?.message);
    }
  };

  const handleExportMemories = async () => {
    try {
      const res = await api.getMemories();
      const blob = new Blob([JSON.stringify(res.memories, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contenthindsight-memories-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Export failed: ' + err?.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Settings className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings & Integrations
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage Hindsight memory bank connectivity, Groq API configurations, and data backups.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <span className="font-semibold">{message}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hindsight Status Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Database className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Hindsight Memory Engine
                </h3>
                <p className="text-[11px] text-slate-400">Persistent long-term agent memory</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Provider:</span>
              <span className="font-mono text-purple-300">
                {healthData?.hindsight?.provider || 'hindsight_embedded'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bank ID:</span>
              <span className="font-mono text-slate-200">
                {healthData?.hindsight?.bankId || 'content-hindsight-prod'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Memories:</span>
              <span className="font-bold text-white">
                {healthData?.hindsight?.totalMemories ?? '7'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Hindsight retains beliefs, brand voice, content gaps, and recall counts. Works both with external Hindsight API keys and internal resilient semantic memory storage.
          </p>
        </div>

        {/* Groq AI Status Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Cpu className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Groq LLM Engine
                </h3>
                <p className="text-[11px] text-slate-400">Ultra-fast inference & strategy generation</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              {healthData?.groqConfigured ? 'Live Groq API' : 'Reasoning Engine'}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Model:</span>
              <span className="font-mono text-blue-300">llama-3.3-70b-versatile</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mode:</span>
              <span className="text-slate-200">
                {healthData?.groqConfigured ? 'Direct API Key' : 'Built-in Reasoning Engine'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Response Format:</span>
              <span className="font-mono text-emerald-400">JSON Object</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Groq receives full contextual knowledge from Hindsight and historical metrics to generate structured 7-day content roadmaps.
          </p>
        </div>
      </div>

      {/* Memory Maintenance Section */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Memory Bank Maintenance
        </h3>
        <p className="text-xs text-slate-400">
          Export your brand memories for archiving or reset back to default seed patterns.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportMemories}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Memories (JSON)</span>
          </button>

          <button
            onClick={handleResetBaseline}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset to Baseline Seed Memories</span>
          </button>
        </div>
      </div>
    </div>
  );
};
