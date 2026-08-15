import React, { useEffect, useState } from 'react';
import { BarChart3, FileText, FileSpreadsheet, DollarSign, TrendingUp, Sparkles, Download } from 'lucide-react';
import { db } from '../../lib/db';
import { DashboardMetrics, Deal, Lead } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { generateExecutiveReportPDF } from '../../lib/pdf';
import { generateDealsExcel, generateLeadsExcel, generatePropertiesExcel } from '../../lib/excel';

export const ReportsView: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    loadData();
    window.addEventListener('realtypulse_db_change', loadData);
    return () => window.removeEventListener('realtypulse_db_change', loadData);
  }, []);

  const loadData = async () => {
    const [m, dls, lds] = await Promise.all([
      db.getDashboardMetrics(),
      db.getDeals(),
      db.getLeads(),
    ]);
    setMetrics(m);
    setDeals(dls);
    setLeads(lds);
  };

  const handleExportPDF = () => {
    if (!metrics) return;
    generateExecutiveReportPDF(metrics, deals, leads);
  };

  if (!metrics) return null;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          Enterprise Analytics & Reports Engine
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-mono">
          Synthesize database records into styled PDF dossiers and financial Excel spreadsheets
        </p>
      </div>

      {/* Quick Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard className="p-5 flex flex-col justify-between" glow>
          <div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-100 text-sm">Executive PDF Report</h3>
            <p className="text-xs text-zinc-400 mt-1">Full business performance summary with deal tables & metrics</p>
          </div>
          <button
            onClick={handleExportPDF}
            className="mt-4 w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold text-xs border border-cyan-500/30 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between" glow>
          <div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-100 text-sm">Financial Deals Excel</h3>
            <p className="text-xs text-zinc-400 mt-1">Export closed revenue, commissions, and deal velocity</p>
          </div>
          <button
            onClick={() => generateDealsExcel(deals)}
            className="mt-4 w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download .xlsx
          </button>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between" glow>
          <div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 w-fit mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-100 text-sm">CRM Leads Excel</h3>
            <p className="text-xs text-zinc-400 mt-1">Export lead contact records and qualification scores</p>
          </div>
          <button
            onClick={() => generateLeadsExcel(leads)}
            className="mt-4 w-full py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold text-xs border border-blue-500/30 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download .xlsx
          </button>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between" glow>
          <div>
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 w-fit mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-100 text-sm">Property Inventory Excel</h3>
            <p className="text-xs text-zinc-400 mt-1">Export full property specs, amenities, and address list</p>
          </div>
          <button
            onClick={async () => generatePropertiesExcel(await db.getProperties())}
            className="mt-4 w-full py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 font-semibold text-xs border border-violet-500/30 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download .xlsx
          </button>
        </GlassCard>
      </div>

      {/* Financial Metrics Overview */}
      <GlassCard className="p-6">
        <h3 className="text-base font-bold text-zinc-100 mb-4 font-display">Calculated Financial Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <span className="text-zinc-400 block mb-1">Closed Revenue</span>
            <span className="text-lg font-bold text-cyan-400">${metrics.totalRevenue.toLocaleString()}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <span className="text-zinc-400 block mb-1">Earned Commission</span>
            <span className="text-lg font-bold text-emerald-400">${metrics.totalCommission.toLocaleString()}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <span className="text-zinc-400 block mb-1">Lead Conversion Rate</span>
            <span className="text-lg font-bold text-blue-400">{metrics.conversionRate.toFixed(1)}%</span>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <span className="text-zinc-400 block mb-1">Qualified Hot Leads</span>
            <span className="text-lg font-bold text-violet-400">{metrics.qualifiedLeads}</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
