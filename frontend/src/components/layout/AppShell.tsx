import React, { useState, useEffect } from 'react';
import { Sidebar, NavItem } from './Sidebar';
import { Navbar } from './Navbar';
import { DashboardPage } from '../../pages/DashboardPage';
import { AIStrategistPage } from '../../pages/AIStrategistPage';
import { ContentLibraryPage } from '../../pages/ContentLibraryPage';
import { MemoryCenterPage } from '../../pages/MemoryCenterPage';
import { LandingPage } from '../../pages/LandingPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { api } from '../../services/api';

export const AppShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavItem>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [memoryCount, setMemoryCount] = useState<number>(7);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Strategist preset goal when launched from Dashboard or Landing
  const [initialStrategistGoal, setInitialStrategistGoal] = useState<string | undefined>(undefined);

  const fetchMemoryStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.getMemories();
      if (res && res.memories) {
        setMemoryCount(res.memories.length);
      }
    } catch (err) {
      console.warn('Error fetching memory stats:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMemoryStats();
  }, []);

  const handleLaunchStrategist = (presetGoal?: string) => {
    if (presetGoal) {
      setInitialStrategistGoal(presetGoal);
    }
    setCurrentTab('strategist');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f19] text-slate-100 font-sans">
      {/* Desktop / Collapsible Sidebar */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={tab => setCurrentTab(tab)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          memoryCount={memoryCount}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fadeIn"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 md:hidden transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          currentTab={currentTab}
          onSelectTab={tab => {
            setCurrentTab(tab);
            setMobileMenuOpen(false);
          }}
          collapsed={false}
          onToggleCollapse={() => setMobileMenuOpen(false)}
          memoryCount={memoryCount}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          currentTab={currentTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onPlanStrategy={() => handleLaunchStrategist()}
          memoryCount={memoryCount}
          onRefreshData={fetchMemoryStats}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          {currentTab === 'dashboard' && (
            <DashboardPage
              onNavigateToStrategist={handleLaunchStrategist}
              onNavigateToMemory={() => setCurrentTab('memory')}
              onNavigateToContent={() => setCurrentTab('content')}
            />
          )}

          {currentTab === 'strategist' && (
            <AIStrategistPage onMemoryUpdated={fetchMemoryStats} />
          )}

          {currentTab === 'content' && (
            <ContentLibraryPage onMemoryRetained={fetchMemoryStats} />
          )}

          {currentTab === 'memory' && (
            <MemoryCenterPage onMemoryChanged={fetchMemoryStats} />
          )}

          {currentTab === 'landing' && (
            <LandingPage
              onStartStrategy={() => handleLaunchStrategist()}
              onExploreMemory={() => setCurrentTab('memory')}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage onMemoryReset={fetchMemoryStats} />
          )}
        </main>
      </div>
    </div>
  );
};
