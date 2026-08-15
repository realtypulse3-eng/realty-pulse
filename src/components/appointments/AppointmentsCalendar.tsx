import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Building2, User, CheckCircle2, Sparkles } from 'lucide-react';
import { db } from '../../lib/db';
import { Appointment } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { EmptyState } from '../common/EmptyState';

interface AppointmentsCalendarProps {
  onRunAgent: (agentType: string, prompt: string, entityId?: string) => void;
}

export const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({ onRunAgent }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadAppointments();
    window.addEventListener('realtypulse_db_change', loadAppointments);
    return () => window.removeEventListener('realtypulse_db_change', loadAppointments);
  }, []);

  const loadAppointments = async () => {
    const list = await db.getAppointments();
    setAppointments(list);
  };

  const handleAddAppointment = async () => {
    const properties = await db.getProperties();
    if (properties.length === 0) {
      alert('Please add a property first before scheduling a viewing appointment.');
      return;
    }

    const prop = properties[0];
    const notes = prompt('Enter viewing notes / client name:', 'VIP Private Walkthrough with Qualified Lead');
    if (!notes) return;

    const start = new Date(Date.now() + 24 * 3600 * 1000).toISOString(); // Tomorrow
    const end = new Date(Date.now() + 25 * 3600 * 1000).toISOString();

    await db.addAppointment({
      organization_id: 'org_default',
      property_id: prop.id,
      assigned_agent: 'usr_default',
      start_time: start,
      end_time: end,
      status: 'scheduled',
      notes,
      property_title: prop.title,
      client_name: 'Dr. Evelyn Carter',
    });

    loadAppointments();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-cyan-400" />
            Calendar & Property Viewings
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {appointments.length} Total Scheduled Property Walkthroughs
          </p>
        </div>

        <button
          onClick={handleAddAppointment}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-semibold text-xs shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Schedule Viewing
        </button>
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title="0 Appointments in Calendar"
          description="No property viewing appointments exist in the database. Click 'Schedule Viewing' or seed development sample data in Settings."
          actionLabel="Schedule First Viewing"
          onAction={handleAddAppointment}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {appointments.map(appt => (
            <GlassCard key={appt.id} className="p-5 space-y-3" glow>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Scheduled Viewing</span>
                  <h3 className="font-bold text-zinc-100 text-sm">{appt.property_title || appt.property_id}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {appt.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs space-y-2">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono">
                    {new Date(appt.start_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                {appt.client_name && (
                  <div className="flex items-center gap-2 text-zinc-300">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>{appt.client_name}</span>
                  </div>
                )}
                {appt.notes && (
                  <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800 leading-relaxed">{appt.notes}</p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onRunAgent('appointment', `Confirm viewing details for appointment at "${appt.property_title}"`, appt.id)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-medium border border-cyan-500/30 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> AI Confirm
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
