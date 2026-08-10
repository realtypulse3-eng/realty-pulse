import React, { useEffect, useState } from 'react';
import {
  Building2,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
  Activity,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { db } from '../../lib/db';
import { DashboardMetrics, AgentActivity, Property, Lead, Deal } from '../../types';
import { GlassCard } from '../common/GlassCard';

interface DashboardProps {
  onOpenAgent: (agentType?: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenAgent, onNavigateTab }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    loadDashboardData();
    window.addEventListener('realtypulse_db_change', loadDashboardData);
    return () => window.removeEventListener('realtypulse_db_change', loadDashboardData);
  }, []);

  const loadDashboardData = async () => {
    const [m, act, props, lds, dls] = await Promise.all([
      db.getDashboardMetrics(),
      db.getAgentActivities(),
      db.getProperties(),
      db.getLeads(),
      db.getDeals(),
    ]);

    setMetrics(m);
    setActivities(act);
    setProperties(props);
    setLeads(lds);
    setDeals(dls);
  };

  if (!metrics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-cyan-400 font-mono text-sm">
          <Activity className="w-5 h-5 animate-spin" />
          <span>Computing Real-Time Database Metrics...</span>
        </div>
      </div>
    );
  }

  // Generate dynamic chart data based on actual database records
  const revenueChartData = deals
    .filter(d => d.status === 'closed_won' && d.closing_date)
    .sort((a, b) => new Date(a.closing_date!).getTime() - new Date(b.closing_date!).getTime())
    .map(d => ({
      date: new Date(d.closing_date!).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      revenue: d.deal_value,
      commission: d.commission,
    }));

  const leadPipelineData = [
    { name: 'Hot', count: leads.filter(l => l.status === 'hot').length, fill: '#06b6d4' },
    { name: 'Warm', count: leads.filter(l => l.status === 'warm').length, fill: '#3b82f6' },
    { name: 'Qualifying', count: leads.filter(l => l.status === 'qualifying').length, fill: '#8b5cf6' },
    { name: 'New/Cold', count: leads.filter(l => l.status === 'new' || l.status === 'cold' || l.status === 'contacted').length, fill: '#64748b' },
  ];

  const propertyTypeDistribution = Object.entries(
    properties.reduce((acc, p) => {
      acc[p.property_type] = (acc[p.property_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, value]) => ({
    name: type.toUpperCase(),
    value,
  }));

  const PIE_COLORS = ['#8b5cf6', '#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161618] p-6 rounded-2xl border border-[#27272A] shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#1D1D21] text-[#8B5CF6] border border-[#8B5CF6]/40">
              COMMAND CENTER
            </span>
            <span className="text-xs text-[#71717A] font-mono">Real-Time Database Sync</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-[#E4E4E7] tracking-tight">
            Enterprise Operating Dashboard
          </h1>
          <p className="text-sm text-[#71717A] mt-1">
            Live database analytics, deal pipeline velocity, and AI multi-agent orchestration.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenAgent('command')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] hover:opacity-90 text-white font-semibold text-sm shadow-lg shadow-[#8B5CF6]/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            Launch Command Agent
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard onClick={() => onNavigateTab('properties')} className="p-5" glow>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#71717A] uppercase tracking-widest font-mono">Properties Portfolio</span>
            <div className="p-2.5 rounded-xl bg-[#1D1D21] border border-[#27272A] text-[#8B5CF6]">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-light text-[#E4E4E7]">
            {metrics.totalProperties}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#27272A]">
            <span className="text-[#71717A]">{metrics.activeListings} Active Listings</span>
            <span className="text-[#8B5CF6] font-medium flex items-center gap-0.5">
              View <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </GlassCard>

        <GlassCard onClick={() => onNavigateTab('leads')} className="p-5" glow>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#71717A] uppercase tracking-widest font-mono">CRM Leads</span>
            <div className="p-2.5 rounded-xl bg-[#1D1D21] border border-[#27272A] text-[#6366F1]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-light text-[#E4E4E7]">
            {metrics.totalLeads}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#27272A]">
            <span className="text-[#6366F1] font-semibold">{metrics.qualifiedLeads} Qualified Hot Leads</span>
            <span className="text-[#71717A] font-medium flex items-center gap-0.5">
              CRM <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </GlassCard>

        <GlassCard onClick={() => onNavigateTab('deals')} className="p-5" glow>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#71717A] uppercase tracking-widest font-mono">Active Deals Pipeline</span>
            <div className="p-2.5 rounded-xl bg-[#1D1D21] border border-[#27272A] text-[#8B5CF6]">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-light text-[#E4E4E7]">
            {metrics.activeDeals}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#27272A]">
            <span className="text-[#71717A]">{metrics.closedDeals} Closed Won</span>
            <span className="text-[#8B5CF6] font-medium flex items-center gap-0.5">
              Pipeline <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </GlassCard>

        <GlassCard onClick={() => onNavigateTab('reports')} className="p-5" glow>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#71717A] uppercase tracking-widest font-mono">Closed Revenue</span>
            <div className="p-2.5 rounded-xl bg-[#1D1D21] border border-[#27272A] text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-light text-[#E4E4E7]">
            ${metrics.totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#27272A]">
            <span className="text-emerald-400 font-semibold">${metrics.totalCommission.toLocaleString()} Commission</span>
            <span className="text-[#71717A] font-medium flex items-center gap-0.5">
              Financials <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Real Database Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-medium text-[#E4E4E7]">Closed Revenue Over Time</h3>
              <p className="text-xs text-[#71717A]">Computed directly from closed_won deals in database</p>
            </div>
            <button
              onClick={() => onOpenAgent('revenue_analytics')}
              className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-medium flex items-center gap-1"
            >
              Analyze with AI <Sparkles className="w-3 h-3" />
            </button>
          </div>

          <div className="h-64">
            {revenueChartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#71717A] text-xs text-center border border-dashed border-[#27272A] rounded-xl p-4">
                <DollarSign className="w-8 h-8 mb-2 text-[#3F3F46]" />
                <p className="font-semibold text-[#A1A1AA]">No closed deal revenue recorded yet.</p>
                <p className="mt-1">Close your first deal in the Deals section to begin tracking revenue trends.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#161618', borderColor: '#27272A', borderRadius: '12px', fontSize: '12px', color: '#E4E4E7' }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Lead Qualification Pipeline Bar Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-medium text-[#E4E4E7]">Lead Pipeline</h3>
              <p className="text-xs text-[#71717A]">Status counts from CRM records</p>
            </div>
            <button
              onClick={() => onOpenAgent('lead_qualification')}
              className="text-xs text-[#6366F1] hover:text-[#818CF8] font-medium flex items-center gap-1"
            >
              Qualify Leads <Sparkles className="w-3 h-3" />
            </button>
          </div>

          <div className="h-64">
            {leads.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#71717A] text-xs text-center border border-dashed border-[#27272A] rounded-xl p-4">
                <Users className="w-8 h-8 mb-2 text-[#3F3F46]" />
                <p className="font-semibold text-[#A1A1AA]">No leads in CRM database.</p>
                <p className="mt-1">Add a new lead in the Leads tab or seed sample data.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadPipelineData}>
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#161618', borderColor: '#27272A', borderRadius: '12px', fontSize: '12px', color: '#E4E4E7' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {leadPipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Property Type Distribution & Recent AI Agent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Type Pie Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-medium text-[#E4E4E7]">Property Distribution</h3>
              <p className="text-xs text-[#71717A]">Breakdown by listing category</p>
            </div>
          </div>

          <div className="h-56">
            {properties.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#71717A] text-center border border-dashed border-[#27272A] rounded-xl">
                0 properties in database
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={propertyTypeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                    {propertyTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#161618', borderColor: '#27272A', borderRadius: '12px', fontSize: '12px', color: '#E4E4E7' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Live AI Agent Execution Log */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#8B5CF6]" />
              <div>
                <h3 className="text-base font-medium text-[#E4E4E7]">Live AI Agent Activity Stream</h3>
                <p className="text-xs text-[#71717A]">Logged actions from the 12 RealtyPulse agents</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('agents')}
              className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-medium"
            >
              View All 12 Agents →
            </button>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <p className="text-xs text-[#71717A] text-center py-8 border border-dashed border-[#27272A] rounded-xl">
                No AI activity logged yet. Launch any AI Agent to begin executing intelligence tasks.
              </p>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#1D1D21] border border-[#27272A] text-xs"
                >
                  <div className="p-1.5 rounded-lg bg-[#27272A] border border-[#3F3F46] text-[#8B5CF6] shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#E4E4E7] capitalize font-mono">
                        {act.agent_type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-[#71717A] font-mono">
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[#A1A1AA] mt-1 truncate">{act.action}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
