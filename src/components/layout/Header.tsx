import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, User as UserIcon, Check, X, Building2, Users, Briefcase, LogOut, ChevronDown, Settings } from 'lucide-react';
import { db } from '../../lib/db';
import { NotificationItem, Property, Lead, Deal, User } from '../../types';

interface HeaderProps {
  onOpenAgent: (agentType?: string) => void;
  onNavigateToRecord?: (type: 'property' | 'lead' | 'deal', id: string) => void;
  currentUser?: User | null;
  onLogout?: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAgent, onNavigateToRecord, currentUser, onLogout, onNavigateTab }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    properties: Property[];
    leads: Lead[];
    deals: Deal[];
  }>({ properties: [], leads: [], deals: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadNotifications();
    window.addEventListener('realtypulse_db_change', loadNotifications);
    return () => window.removeEventListener('realtypulse_db_change', loadNotifications);
  }, []);

  const loadNotifications = async () => {
    const list = await db.getNotifications();
    setNotifications(list);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults({ properties: [], leads: [], deals: [] });
      return;
    }

    setIsSearching(true);
    const q = query.toLowerCase();
    const [properties, leads, deals] = await Promise.all([
      db.getProperties(),
      db.getLeads(),
      db.getDeals(),
    ]);

    setSearchResults({
      properties: properties.filter(p => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)),
      leads: leads.filter(l => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)),
      deals: deals.filter(d => (d.property_title && d.property_title.toLowerCase().includes(q)) || (d.client_name && d.client_name.toLowerCase().includes(q))),
    });
  };

  const handleMarkRead = async (id: string) => {
    await db.markNotificationRead(id);
    loadNotifications();
  };

  return (
    <header className="glass-strong h-16 border-b border-white/5 px-6 flex items-center justify-between z-20 shrink-0">
      {/* Search Input Bar */}
      <div className="relative w-72 md:w-96">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-[#71717A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search properties, leads, deals..."
            className="glass-soft w-full rounded-full pl-10 pr-4 py-2 text-sm text-[#EDEDF0] placeholder-[#71717A] focus:outline-none focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 text-[#71717A] hover:text-[#E4E4E7]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {isSearching && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl shadow-2xl p-3 z-50 backdrop-blur-2xl max-h-96 overflow-y-auto">
            {searchResults.properties.length === 0 && searchResults.leads.length === 0 && searchResults.deals.length === 0 ? (
              <p className="text-xs text-[#71717A] text-center py-4">No matching records found.</p>
            ) : (
              <div className="space-y-3">
                {searchResults.properties.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#71717A] font-semibold px-2">Properties ({searchResults.properties.length})</span>
                    <div className="mt-1 space-y-1">
                      {searchResults.properties.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (onNavigateToRecord) onNavigateToRecord('property', p.id);
                            setIsSearching(false);
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#1D1D21] cursor-pointer text-xs text-[#E4E4E7]"
                        >
                          <Building2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                          <span className="truncate flex-1 font-medium">{p.title}</span>
                          <span className="text-[#A1A1AA] font-mono">${p.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.leads.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#71717A] font-semibold px-2">Leads ({searchResults.leads.length})</span>
                    <div className="mt-1 space-y-1">
                      {searchResults.leads.map(l => (
                        <div
                          key={l.id}
                          onClick={() => {
                            if (onNavigateToRecord) onNavigateToRecord('lead', l.id);
                            setIsSearching(false);
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#1D1D21] cursor-pointer text-xs text-[#E4E4E7]"
                        >
                          <Users className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                          <span className="truncate flex-1 font-medium">{l.name}</span>
                          <span className="text-[#A1A1AA] font-mono">{l.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.deals.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#71717A] font-semibold px-2">Deals ({searchResults.deals.length})</span>
                    <div className="mt-1 space-y-1">
                      {searchResults.deals.map(d => (
                        <div
                          key={d.id}
                          onClick={() => {
                            if (onNavigateToRecord) onNavigateToRecord('deal', d.id);
                            setIsSearching(false);
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#1D1D21] cursor-pointer text-xs text-[#E4E4E7]"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate flex-1 font-medium">{d.property_title || d.id}</span>
                          <span className="text-[#A1A1AA] font-mono">${d.deal_value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Action Icons & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Command Agent Button */}
        <button
          onClick={() => onOpenAgent('command')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#8b5cf6] hover:to-[#7c3aed] text-white text-xs font-semibold glow-accent transition-all hover:scale-[1.03]"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">AI Command Agent</span>
        </button>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-[#71717A] hover:text-[#E4E4E7] hover:bg-[#18181B] transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8B5CF6] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-strong rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272A] mb-2">
                <span className="font-semibold text-xs text-[#E4E4E7]">System Notifications</span>
                <span className="text-[10px] text-[#71717A] font-mono">{unreadCount} unread</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#71717A] text-center py-6">No recent notifications.</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs transition-colors ${
                        n.read
                          ? 'bg-[#0F0F12] border-[#27272A] text-[#A1A1AA]'
                          : 'bg-[#1D1D21] border-[#8B5CF6]/40 text-[#E4E4E7]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-semibold text-[#E4E4E7]">{n.title}</span>
                        {!n.read && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            className="text-[#8B5CF6] hover:text-[#A78BFA]"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[#A1A1AA] text-[11px] leading-relaxed">{n.message}</p>
                      <span className="text-[9px] text-[#71717A] font-mono mt-1 block">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative pl-2 border-l border-[#27272A]">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#161618] transition-colors cursor-pointer"
          >
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
              alt={currentUser?.name || "User Avatar"}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-[#8B5CF6]/50"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#E4E4E7] leading-tight">
                {currentUser?.name || "Alex Vance"}
              </span>
              <span className="text-[10px] text-[#71717A] font-mono capitalize">
                {currentUser?.role ? `${currentUser.role} Broker` : 'Managing Broker'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A] hidden sm:block" />
          </button>

          {/* User Profile Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 glass-strong rounded-2xl shadow-2xl p-3 z-50 backdrop-blur-2xl space-y-2">
              <div className="p-2 bg-[#0F0F12] rounded-xl border border-[#27272A]">
                <div className="font-semibold text-xs text-[#E4E4E7]">{currentUser?.name}</div>
                <div className="text-[11px] text-[#71717A] font-mono truncate">{currentUser?.email}</div>
                <div className="mt-1 inline-block px-2 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 text-[9px] rounded font-mono uppercase">
                  {currentUser?.role || 'Agent'} Account
                </div>
              </div>

              {onNavigateTab && (
                <button
                  onClick={() => {
                    onNavigateTab('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#A1A1AA] hover:text-[#E4E4E7] hover:bg-[#1D1D21] transition-colors text-left font-medium"
                >
                  <Settings className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Account Settings</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left font-semibold border border-transparent hover:border-red-500/20"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Sign Out / Switch Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
