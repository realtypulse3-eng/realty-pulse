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
  isSupabaseConnected = true,
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
        relative flex flex-col justify-between
        bg-[#0F0F12] backdrop-blur-2xl
        border-r border-[#27272A] text-[#A1A1AA]
        transition-all duration-300 z-30 shrink-0
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Top Branding Section */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-[#27272A] h-16">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center text-white shadow-lg shadow-[#8B5CF6]/25 shrink-0 font-bold text-lg">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-semibold text-[#E4E4E7] text-base tracking-tight font-display">
                  REALTY <span className="text-[#8B5CF6]">PULSE</span>
                </span>
                <span className="text-[10px] text-[#71717A] tracking-widest font-mono uppercase">
                  AI Real Estate OS
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#E4E4E7] hover:bg-[#18181B] transition-colors"
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
                  w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-200 group relative
                  ${
                    isActive
                      ? 'bg-[#1D1D21] text-[#E4E4E7] border border-[#8B5CF6]/40 shadow-sm'
                      : 'text-[#A1A1AA] hover:text-[#E4E4E7] hover:bg-[#161618]'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-[#8B5CF6]' : 'text-[#71717A] group-hover:text-[#A1A1AA]'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#8B5CF6] shadow-sm shadow-[#8B5CF6]/50" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Database Status */}
      <div className="p-3 border-t border-[#27272A]">
        <div
          className={`
            flex items-center gap-2.5 p-2.5 rounded-xl bg-[#161618] border border-[#27272A] text-xs
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              isSupabaseConnected ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/80' : 'bg-amber-400'
            }`}
          />
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-[#E4E4E7] font-medium truncate">
                {isSupabaseConnected ? 'Supabase Live' : 'Database Ready'}
              </span>
              <span className="text-[10px] text-[#71717A] truncate font-mono">
                {isSupabaseConnected ? 'PostgreSQL Connected' : 'Local / Supabase Mode'}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
