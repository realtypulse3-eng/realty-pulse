import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, DollarSign, FileSpreadsheet, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { db } from '../../lib/db';
import { Deal, DealStatus } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { EmptyState } from '../common/EmptyState';

interface DealsPipelineProps {
  onRunAgent: (agentType: string, prompt: string, entityId?: string) => void;
}

export const DealsPipeline: React.FC<DealsPipelineProps> = ({ onRunAgent }) => {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    loadDeals();
    window.addEventListener('realtypulse_db_change', loadDeals);
    return () => window.removeEventListener('realtypulse_db_change', loadDeals);
  }, []);

  const loadDeals = async () => {
    const list = await db.getDeals();
    setDeals(list);
  };

  const handleStatusChange = async (dealId: string, newStatus: DealStatus) => {
    await db.updateDeal(dealId, {
      status: newStatus,
      closing_date: newStatus === 'closed_won' ? executionDate() : undefined,
    });
    loadDeals();
  };

  function executionDate() {
    return new Date().toISOString();
  }

  const handleAddDeal = async () => {
    const properties = await db.getProperties();
    if (properties.length === 0) {
      alert('Please add a property first before creating a deal record.');
      return;
    }

    const prop = properties[0];
    const dealValueStr = prompt('Enter Deal Total Value (USD):', String(prop.price));
    if (!dealValueStr) return;

    const val = Number(dealValueStr);
    const commission = Math.round(val * 0.025); // 2.5% standard broker commission

    await db.addDeal({
      organization_id: 'org_default',
      property_id: prop.id,
      agent_id: 'usr_default',
      deal_value: val,
      commission,
      status: 'negotiation',
      payment_status: 'pending',
      property_title: prop.title,
      client_name: 'VIP Qualified Client',
    });

    loadDeals();
  };

  const stages: { id: DealStatus; label: string; color: string }[] = [
    { id: 'new', label: 'New Opportunity', color: 'border-blue-500/40 text-blue-400' },
    { id: 'negotiation', label: 'Negotiation', color: 'border-violet-500/40 text-violet-400' },
    { id: 'pending', label: 'Pending Closing', color: 'border-amber-500/40 text-amber-400' },
    { id: 'closed_won', label: 'Closed Won', color: 'border-emerald-500/40 text-emerald-400' },
    { id: 'closed_lost', label: 'Closed Lost', color: 'border-slate-800 text-slate-500' },
  ];

  const totalValue = deals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
  const totalCommission = deals.reduce((sum, d) => sum + (d.commission || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-violet-400" />
            Deals Financial Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Pipeline Volume: ${totalValue.toLocaleString()} | Potential Commission: ${totalCommission.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onRunAgent('excel', 'Export closed deals and commission spreadsheet to Excel')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel
          </button>

          <button
            onClick={handleAddDeal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-slate-950 font-semibold text-xs shadow-lg shadow-violet-500/20"
          >
            <Plus className="w-4 h-4" /> Create Deal
          </button>
        </div>
      </div>

      {/* Visual Pipeline Board */}
      {deals.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="0 Deals in Pipeline"
          description="There are currently 0 deal records in the database. Click 'Create Deal' or seed development sample data in Settings."
          actionLabel="Create First Deal"
          onAction={handleAddDeal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.status === stage.id);
            const stageValue = stageDeals.reduce((sum, d) => sum + (d.deal_value || 0), 0);

            return (
              <div key={stage.id} className="min-w-[240px] flex flex-col space-y-3">
                <div className={`p-3 rounded-xl bg-slate-900/80 border ${stage.color} flex items-center justify-between`}>
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider block font-mono">{stage.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">${stageValue.toLocaleString()} ({stageDeals.length})</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 min-h-[300px] p-2 rounded-2xl bg-slate-950/40 border border-slate-800/60">
                  {stageDeals.length === 0 ? (
                    <p className="text-[11px] text-slate-600 text-center py-10 font-mono">Stage empty</p>
                  ) : (
                    stageDeals.map(deal => (
                      <GlassCard key={deal.id} className="p-4 space-y-2.5" glow>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs text-slate-100 line-clamp-1">
                            {deal.property_title || deal.id}
                          </h4>
                        </div>

                        <div className="text-xs space-y-1 font-mono">
                          <div className="text-emerald-400 font-bold">${deal.deal_value.toLocaleString()}</div>
                          <div className="text-slate-400 text-[10px]">Comm: ${deal.commission.toLocaleString()}</div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                          {deal.status !== 'closed_won' && (
                            <button
                              onClick={() => handleStatusChange(deal.id, 'closed_won')}
                              className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30"
                            >
                              Mark Closed
                            </button>
                          )}
                          <button
                            onClick={() => onRunAgent('revenue_analytics', `Analyze deal financial viability for "${deal.property_title || deal.id}"`, deal.id)}
                            className="p-1 rounded text-cyan-400 hover:text-cyan-300"
                            title="AI Financial Analysis"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </GlassCard>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
