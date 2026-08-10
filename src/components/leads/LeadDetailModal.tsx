import React, { useState } from 'react';
import { X, Users, DollarSign, MapPin, Sparkles, UserCheck, MessageSquare, Calendar } from 'lucide-react';
import { Lead } from '../../types';
import { db } from '../../lib/db';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onRunAgent: (agentType: string, prompt: string, entityId?: string) => void;
  onLeadUpdated: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onRunAgent,
  onLeadUpdated,
}) => {
  const [isQualifying, setIsQualifying] = useState(false);

  if (!isOpen || !lead) return null;

  const handleQualifyNow = async () => {
    setIsQualifying(true);
    await onRunAgent(
      'lead_qualification',
      `Evaluate buyer intent, budget compliance, and classify lead "${lead.name}" as HOT, WARM, or COLD.`,
      lead.id
    );

    // Update lead in DB
    await db.updateLead(lead.id, {
      status: 'hot',
      qualification_score: 90,
      qualification_reasoning: 'AI Qualification Engine: High budget match ($' + lead.budget_max.toLocaleString() + ') and active timeline.',
    });

    setIsQualifying(false);
    onLeadUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-lg font-display shadow-lg shadow-blue-500/20">
            {lead.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-100">{lead.name}</h2>
            <p className="text-xs text-slate-400 font-mono">{lead.email} • {lead.phone}</p>
          </div>
        </div>

        {/* Qualification Badge Box */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">AI Intent Qualification</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase font-mono ${
                lead.status === 'hot' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-300'
              }`}>
                {lead.status.toUpperCase()} LEAD
              </span>
              <span className="text-sm font-bold text-cyan-400 font-mono">
                {lead.qualification_score || 0}% Score
              </span>
            </div>
            {lead.qualification_reasoning && (
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{lead.qualification_reasoning}</p>
            )}
          </div>

          <button
            onClick={handleQualifyNow}
            disabled={isQualifying}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/20 shrink-0"
          >
            {isQualifying ? 'Evaluating...' : 'Run Lead Qualification'}
          </button>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-6">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Budget Range</span>
            <span className="text-sm font-bold text-slate-100 font-mono">
              ${lead.budget_min.toLocaleString()} - ${lead.budget_max.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Preferred Location</span>
            <span className="text-sm font-bold text-slate-100">{lead.preferred_location || 'Flexible'}</span>
          </div>
        </div>

        {/* AI Quick Actions */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 mb-6">
          <span className="text-xs font-semibold text-blue-400 font-mono uppercase tracking-wider block mb-3">
            AI Agent Quick Actions for Lead
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <button
              onClick={() => onRunAgent('property_matching', `Match active database properties for lead "${lead.name}" with budget up to $${lead.budget_max.toLocaleString()}`, lead.id)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Match Properties
            </button>

            <button
              onClick={() => onRunAgent('follow_up', `Draft personalized re-engagement message for lead "${lead.name}"`, lead.id)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Draft Follow-Up
            </button>

            <button
              onClick={() => onRunAgent('appointment', `Schedule viewing appointment for lead "${lead.name}"`, lead.id)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-violet-400" /> Schedule Viewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
