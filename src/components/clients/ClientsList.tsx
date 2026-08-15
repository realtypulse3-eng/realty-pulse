import React, { useEffect, useState } from 'react';
import { UserCheck, Plus, Search, Mail, Phone, DollarSign } from 'lucide-react';
import { db } from '../../lib/db';
import { Client } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { EmptyState } from '../common/EmptyState';

export const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadClients();
    window.addEventListener('realtypulse_db_change', loadClients);
    return () => window.removeEventListener('realtypulse_db_change', loadClients);
  }, []);

  const loadClients = async () => {
    const list = await db.getClients();
    setClients(list);
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClient = async () => {
    const name = prompt('Client Full Name:');
    if (!name) return;
    const email = prompt('Client Email:', `${name.toLowerCase().replace(/\s+/g, '.')}@client.com`);
    const budget = Number(prompt('Client Purchasing Power / Budget (USD):', '3500000')) || 3500000;

    await db.addClient({
      organization_id: 'org_default',
      name,
      email: email || '',
      phone: '+1 (555) 304-9910',
      budget,
      preferences: 'High Net-Worth Portfolio Buyer',
      notes: 'Active VIP Client added to database',
    });

    loadClients();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            Client Directory
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {clients.length} Active Verified Clients
          </p>
        </div>

        <button
          onClick={handleAddClient}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-semibold text-xs shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Add New Client
        </button>
      </div>

      <div className="relative max-w-md bg-zinc-900/60 p-2 rounded-2xl border border-zinc-800">
        <Search className="w-4 h-4 absolute left-5 top-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-100"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="0 Clients in Database"
          description={
            clients.length === 0
              ? 'Your client database is empty. Click "Add New Client" or seed development sample data in Settings.'
              : 'No clients matched your search.'
          }
          actionLabel={clients.length === 0 ? 'Add First Client' : undefined}
          onAction={clients.length === 0 ? handleAddClient : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(client => (
            <GlassCard key={client.id} className="p-5 space-y-3" glow>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-zinc-950 font-bold text-sm font-display shadow-md">
                  {client.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100 text-sm">{client.name}</h3>
                  <span className="text-[11px] text-zinc-400 font-mono">{client.email}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Buying Budget:</span>
                  <span className="font-bold text-emerald-400 font-mono">${client.budget.toLocaleString()}</span>
                </div>
                {client.preferences && (
                  <p className="text-zinc-300 text-[11px] pt-1 leading-relaxed">{client.preferences}</p>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
