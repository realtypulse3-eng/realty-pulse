import React, { useEffect, useState } from 'react';
import {
  Bot,
  Building2,
  UserCheck,
  Sparkles,
  Headphones,
  Clock,
  Calendar,
  TrendingUp,
  Megaphone,
  FileText,
  FileSpreadsheet,
  DollarSign,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { AGENT_DEFINITIONS } from '../../data/agentDefinitions';
import { AgentInfo, AgentType, AgentTask } from '../../types';
import { db } from '../../lib/db';
import { GlassCard } from '../common/GlassCard';

interface AgentsDashboardProps {
  onSelectAgent: (agentType: AgentType) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Building2,
  UserCheck,
  Sparkles,
  Headphones,
  Clock,
  Calendar,
  TrendingUp,
  Megaphone,
  FileText,
  FileSpreadsheet,
  DollarSign,
  Cpu,
};

export const AgentsDashboard: React.FC<AgentsDashboardProps> = ({ onSelectAgent }) => {
  const [tasks, setTasks] = useState<AgentTask[]>([]);

  useEffect(() => {
    loadTasks();
    window.addEventListener('realtypulse_db_change', loadTasks);
    return () => window.removeEventListener('realtypulse_db_change', loadTasks);
  }, []);

  const loadTasks = async () => {
    const list = await db.getAgentTasks();
    setTasks(list);
  };

  const agentList = Object.values(AGENT_DEFINITIONS);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-violet-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30">
            DIGITAL WORKFORCE
          </span>
          <span className="text-xs text-slate-400 font-mono">12 Specialized AI Employees</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 font-display">
          RealtyPulse AI Agent Swarm
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Interconnected domain-specific AI agents operating on live Supabase records. Each agent executes structured tools, logs task metrics, and enforces human approval safeguards.
        </p>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentList.map(agent => {
          const Icon = ICON_MAP[agent.iconName] || Bot;
          const completedCount = tasks.filter(t => t.agent_type === agent.id && t.status === 'completed').length;

          return (
            <GlassCard
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className="p-6 flex flex-col justify-between group"
              glow
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-slate-950 text-cyan-400 border border-slate-800">
                    {agent.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {agent.name}
                </h3>
                <span className="text-[11px] text-cyan-400/80 font-mono block mb-2">{agent.role}</span>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{agent.description}</p>

                <div className="space-y-1 text-[11px] text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                  <span className="font-semibold text-slate-400 block mb-1 font-mono uppercase text-[10px]">Key Capabilities:</span>
                  {agent.capabilities.slice(0, 2).map((cap, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="truncate">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  {completedCount === 0 ? 'No tasks yet' : `${completedCount} Tasks Completed`}
                </span>
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
