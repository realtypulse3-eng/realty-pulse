import React, { useEffect, useState } from 'react';
import { Building2, Plus, Search, Filter, MapPin, Bed, Bath, Maximize2, Sparkles, FileSpreadsheet } from 'lucide-react';
import { db } from '../../lib/db';
import { Property, PropertyType, PropertyStatus } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { EmptyState } from '../common/EmptyState';
import { AddPropertyModal } from './AddPropertyModal';
import { PropertyDetailModal } from './PropertyDetailModal';

interface PropertiesListProps {
  onRunAgent: (agentType: string, prompt: string, entityId?: string) => void;
}

export const PropertiesList: React.FC<PropertiesListProps> = ({ onRunAgent }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    loadProperties();
    window.addEventListener('realtypulse_db_change', loadProperties);
    return () => window.removeEventListener('realtypulse_db_change', loadProperties);
  }, []);

  const loadProperties = async () => {
    const list = await db.getProperties();
    setProperties(list);
  };

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.property_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-cyan-400" />
            Property Inventory
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {properties.length} Total Properties stored in database
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onRunAgent('excel', 'Export all active property listings to Excel workbook')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, city, or address..."
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
          >
            <option value="all">All Types</option>
            <option value="condo">Condo / Apartment</option>
            <option value="villa">Luxury Villa</option>
            <option value="house">House</option>
            <option value="commercial">Commercial</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="0 Properties in Database"
          description={
            properties.length === 0
              ? 'Your property portfolio database is currently empty. Click "Add Property" or seed development sample data in Settings.'
              : 'No properties matched your current search filters.'
          }
          actionLabel={properties.length === 0 ? 'Add First Property' : undefined}
          onAction={properties.length === 0 ? () => setIsAddOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => {
            const defaultImg = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200';
            const imgUrl = p.images && p.images.length > 0 ? p.images[0].url : defaultImg;

            return (
              <GlassCard
                key={p.id}
                onClick={() => setSelectedProperty(p)}
                className="group flex flex-col justify-between"
                glow
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-slate-800">
                      {p.property_type}
                    </span>
                    <span
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase ${
                        p.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {p.address}, {p.city}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-300 mt-4 pt-3 border-t border-slate-800/80">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-500" /> {p.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-slate-500" /> {p.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-500" /> {p.area.toLocaleString()} sqft
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2 pt-3">
                  <span className="text-lg font-bold font-display text-cyan-400">
                    ${p.price.toLocaleString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRunAgent('property_intelligence', `Analyze property quality for "${p.title}"`, p.id);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-medium border border-cyan-500/30 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> AI Analyze
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddPropertyModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onPropertyAdded={loadProperties}
      />

      <PropertyDetailModal
        property={selectedProperty}
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
        onRunAgent={onRunAgent}
      />
    </div>
  );
};
