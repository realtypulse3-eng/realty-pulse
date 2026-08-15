import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  Briefcase,
  Calendar,
  MessageSquare,
  Bot,
  BarChart3,
  FileText,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'properties'
  | 'leads'
  | 'clients'
  | 'deals'
  | 'appointments'
  | 'communications'
  | 'agents'
  | 'reports'
  | 'documents'
  | 'marketing'
  | 'settings';

interface SidebarProps {
  currentTab?: NavTab;
  activeTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onTabChange?: (tab: NavTab) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isSupabaseConnected?: boolean;
  onOpenAgent?: (agentType?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab: propCurrentTab,
  activeTab,
  onSelectTab,
  onTabChange,
  collapsed: propCollapsed,
  onToggleCollapse: propOnToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const collapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const onToggleCollapse = propOnToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const activeTabName = propCurrentTab || activeTab || 'dashboard';

  const handleSelectTab = (tab: NavTab) => {
    if (onSelectTab) onSelectTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'leads', label: 'CRM Leads', icon: Users },
    { id: 'clients', label: 'Clients', icon: UserCheck },
    { id: 'deals', label: 'Deals Pipeline', icon: Briefcase },
    { id: 'appointments', label: 'Calendar Viewings', icon: Calendar },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'agents', label: '12 AI Agents', icon: Bot },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'settings', label: 'Account & Settings', icon: Settings },
  ];

  return (
    <aside
      className={`
        glass-strong relative flex flex-col justify-between
        border-r border-white/5 text-[#A1A1AA]
        transition-all duration-300 z-30 shrink-0
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Top Branding Section */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-white/5 h-16">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#6d28d9] flex items-center justify-center text-white shadow-lg shadow-[#8B5CF6]/30 shrink-0">
              <span className="absolute inset-0 rounded-2xl bg-white/10 blur-[2px]" />
              <Zap className="relative w-5 h-5 fill-current" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-semibold text-[#EDEDF0] text-base tracking-tight font-display">
                  REALTY <span className="text-[#a78bfa]">PULSE</span>
                </span>
                <span className="text-[10px] text-[#71717A] tracking-[0.2em] uppercase">
                  AI Real Estate OS
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#EDEDF0] hover:bg-white/5 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Item List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTabName === item.id;
            return (
              <button
                key={item.id}
                id={`nav_btn_${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`
                  w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl font-medium text-sm
                  transition-all duration-300 group relative overflow-hidden
                  ${
                    isActive
                      ? 'glass-soft text-[#EDEDF0] border-white/10'
                      : 'text-[#A1A1AA] border border-transparent hover:text-[#EDEDF0] hover:bg-white/[0.04]'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-[#a78bfa]' : 'text-[#71717A] group-hover:text-[#A1A1AA]'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-[#a78bfa] to-[#7c3aed] shadow-[0_0_12px_rgba(139,92,246,0.6)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status */}
      <div className="p-3 border-t border-white/5">
        <div
          className={`
            glass-soft flex items-center gap-2.5 p-2.5 rounded-2xl text-xs
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/70" />
          </span>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-[#EDEDF0] font-medium truncate">All systems ready</span>
              <span className="text-[10px] text-[#71717A] truncate">Realty Pulse workspace</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
