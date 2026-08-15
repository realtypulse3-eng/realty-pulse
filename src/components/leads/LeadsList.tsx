import React, { useEffect, useState } from 'react';
import { Users, Plus, Search, Sparkles, UserCheck, FileSpreadsheet, Phone, Mail, DollarSign } from 'lucide-react';
import { db } from '../../lib/db';
import { Lead } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { EmptyState } from '../common/EmptyState';
import { LeadDetailModal } from './LeadDetailModal';

interface LeadsListProps {
  onRunAgent: (agentType: string, prompt: string, entityId?: string) => void;
}

export const LeadsList: React.FC<LeadsListProps> = ({ onRunAgent }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadLeads();
    window.addEventListener('realtypulse_db_change', loadLeads);
    return () => window.removeEventListener('realtypulse_db_change', loadLeads);
  }, []);

  const loadLeads = async () => {
    const list = await db.getLeads();
    setLeads(list);
  };

  const filtered = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNewLead = async () => {
    const name = prompt('Enter Lead Full Name:');
    if (!name) return;
    const email = prompt('Enter Lead Email:', `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`);
    const budgetStr = prompt('Enter Maximum Budget (USD):', '2500000');

    await db.addLead({
      organization_id: 'org_default',
      name,
      email: email || '',
      phone: '+1 (555) 019-2831',
      budget_min: Number(budgetStr) ? Number(budgetStr) * 0.7 : 1000000,
      budget_max: Number(budgetStr) || 2500000,
      preferred_location: 'Downtown Metropolitan',
      preferred_property_type: 'condo',
      bedrooms: 3,
      requirements: 'Seeking luxury unit with parking & security',
      source: 'Direct Portal',
      status: 'new',
    });

    loadLeads();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-400" />
            CRM Leads Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {leads.length} Total Registered Leads in CRM
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onRunAgent('excel', 'Export CRM leads database to Excel spreadsheet')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel
          </button>

          <button
            onClick={handleCreateNewLead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-zinc-950 font-semibold text-xs shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads by name or email..."
            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
        >
          <option value="all">All Qualification Statuses</option>
          <option value="hot">Hot Leads</option>
          <option value="warm">Warm Leads</option>
          <option value="qualifying">Qualifying</option>
          <option value="new">New</option>
        </select>
      </div>

      {/* Leads Table / Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="0 Leads in CRM"
          description={
            leads.length === 0
              ? 'Your CRM lead database is empty. Click "Add Lead" or seed development sample data in Settings.'
              : 'No leads matched your current search filters.'
          }
          actionLabel={leads.length === 0 ? 'Add First Lead' : undefined}
          onAction={leads.length === 0 ? handleCreateNewLead : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(lead => (
            <GlassCard
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="p-5 flex flex-col justify-between"
              glow
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-zinc-950 font-bold text-sm font-display shadow-md">
                      {lead.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-100 text-sm line-clamp-1">{lead.name}</h3>
                      <span className="text-[11px] text-zinc-400 font-mono block">{lead.source}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                    lead.status === 'hot'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {lead.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-300 my-4 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Budget Max:</span>
                    <span className="font-bold font-mono text-cyan-400">${lead.budget_max.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Location:</span>
                    <span className="truncate max-w-[140px] font-medium">{lead.preferred_location || 'Flexible'}</span>
                  </div>
                  {lead.qualification_score && (
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                      <span className="text-zinc-400">AI Score:</span>
                      <span className="font-bold text-emerald-400 font-mono">{lead.qualification_score}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 font-mono">
                  Added {new Date(lead.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRunAgent('property_matching', `Find properties for lead "${lead.name}"`, lead.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[11px] font-medium border border-blue-500/30 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> AI Match
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onRunAgent={onRunAgent}
        onLeadUpdated={loadLeads}
      />
    </div>
  );
};
