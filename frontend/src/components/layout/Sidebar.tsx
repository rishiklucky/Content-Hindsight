import React from 'react';
import {
  LayoutDashboard,
  BrainCircuit,
  Sparkles,
  Library,
  Database,
  Settings,
  Flame,
  ChevronLeft,
  ChevronRight,
  Zap,
  Globe
} from 'lucide-react';

export type NavItem = 'dashboard' | 'strategist' | 'content' | 'memory' | 'settings' | 'landing';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  memoryCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  memoryCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavItem,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'strategist' as NavItem,
      label: 'AI Strategist',
      icon: Sparkles,
      badge: 'Core Demo',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    },
    {
      id: 'content' as NavItem,
      label: 'Content Library',
      icon: Library,
      badge: null
    },
    {
      id: 'memory' as NavItem,
      label: 'Memory Center',
      icon: Database,
      badge: `${memoryCount}`,
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    },
    {
      id: 'landing' as NavItem,
      label: 'Demo Overview',
      icon: Globe,
      badge: null
    },
    {
      id: 'settings' as NavItem,
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-800 bg-[#0d121f] transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20 memory-active-glow">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white text-base flex items-center gap-1.5">
                Content<span className="text-blue-400">Hindsight</span>
              </span>
              <span className="text-[11px] font-medium text-slate-400 tracking-wide truncate">
                Strategy that remembers
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {!collapsed ? 'Agent Navigation' : '•'}
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!collapsed && (
                <span className="truncate text-left flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Memory Status Badge Bottom Card */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Hindsight Engine
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Online
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Persistent context bank retaining learnings & recall tokens.
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/70">
            <span>Memories active</span>
            <span className="font-semibold text-slate-200">{memoryCount}</span>
          </div>
        </div>
      ) : (
        <div className="p-3 flex justify-center border-t border-slate-800">
          <div className="h-2 w-2 rounded-full bg-emerald-500" title="Hindsight Memory Active" />
        </div>
      )}
    </aside>
  );
};
