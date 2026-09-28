import React from 'react';
import { Menu, Sparkles, Brain, Database, RefreshCw } from 'lucide-react';
import { NavItem } from './Sidebar';

interface NavbarProps {
  currentTab: NavItem;
  onOpenMobileMenu: () => void;
  onPlanStrategy: () => void;
  memoryCount: number;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenMobileMenu,
  onPlanStrategy,
  memoryCount,
  onRefreshData,
  isRefreshing
}) => {
  const getTabDetails = (tab: NavItem) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard', desc: 'Real-time performance and strategy memory overview' };
      case 'strategist':
        return { title: 'AI Strategist', desc: 'Strategy workspace with Hindsight recall and learning loop' };
      case 'content':
        return { title: 'Content Library', desc: 'Historical content performance, topics & postmortems' };
      case 'memory':
        return { title: 'Memory Center', desc: 'Active brand knowledge, learned patterns & content gaps' };
      case 'landing':
        return { title: 'Product Architecture', desc: 'How Hindsight powers the persistent content feedback loop' };
      case 'settings':
        return { title: 'Settings', desc: 'API connectivity, Hindsight bank status & developer tools' };
    }
  };

  const { title, desc } = getTabDetails(currentTab);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-400 font-medium">
            {desc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors disabled:opacity-50"
            title="Refresh active state"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span>Sync</span>
          </button>
        )}

        {/* Hindsight Status Indicator Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
          <Database className="h-3.5 w-3.5 text-purple-400" />
          <span>Hindsight:</span>
          <span className="text-purple-300 font-semibold">{memoryCount} memories</span>
        </div>

        {/* Quick Launch Button */}
        {currentTab !== 'strategist' && (
          <button
            onClick={onPlanStrategy}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Open Strategist</span>
          </button>
        )}
      </div>
    </header>
  );
};
