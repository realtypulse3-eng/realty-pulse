import React from 'react';
import { X, Building2, MapPin, Bed, Bath, Maximize2, DollarSign, Sparkles, FileText, Megaphone, Users, Calendar } from 'lucide-react';
import { Property } from '../../types';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onRunAgent: (agentType: string, prompt: string, entityId?: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onRunAgent,
}) => {
  if (!isOpen || !property) return null;

  const defaultImg = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200';
  const displayImage = property.images && property.images.length > 0 ? property.images[0].url : defaultImg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image & Headline */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6 group">
          <img
            src={displayImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2 inline-block">
                {property.property_type} • {property.status}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-white">{property.title}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                {property.address}, {property.city}, {property.state}
              </p>
            </div>
            <div className="text-2xl md:text-3xl font-bold font-display text-cyan-400">
              ${property.price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <Bed className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-xs text-slate-400 block">Bedrooms</span>
              <span className="font-semibold text-sm">{property.bedrooms} Beds</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <Bath className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-xs text-slate-400 block">Bathrooms</span>
              <span className="font-semibold text-sm">{property.bathrooms} Baths</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <Maximize2 className="w-5 h-5 text-violet-400" />
            <div>
              <span className="text-xs text-slate-400 block">Area</span>
              <span className="font-semibold text-sm">{property.area.toLocaleString()} sq ft</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs text-slate-400 block">Furnishing</span>
              <span className="font-semibold text-sm capitalize">{property.furnishing}</span>
            </div>
          </div>
        </div>

        {/* AI Action Triggers Bar */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 mb-6">
          <span className="text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider block mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Instant AI Agent Actions for this Property:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <button
              onClick={() => onRunAgent('property_intelligence', `Analyze property quality, identify missing fields, and score record for Property #${property.id}`, property.id)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium flex items-center gap-2 transition-all hover:border-cyan-500/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Analyze Quality
            </button>

            <button
              onClick={() => onRunAgent('document', `Generate official PDF dossier report for Property "${property.title}"`, property.id)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium flex items-center gap-2 transition-all hover:border-blue-500/50"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" /> Generate PDF
            </button>

            <button
              onClick={() => onRunAgent('marketing', `Generate multi-channel marketing campaign and social media copy for Property "${property.title}"`, property.id)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium flex items-center gap-2 transition-all hover:border-violet-500/50"
            >
              <Megaphone className="w-3.5 h-3.5 text-violet-400" /> Create Campaign
            </button>

            <button
              onClick={() => onRunAgent('property_matching', `Find best matching buyer leads in CRM database for Property "${property.title}" ($${property.price.toLocaleString()})`, property.id)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium flex items-center gap-2 transition-all hover:border-emerald-500/50"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Match Leads
            </button>
          </div>
        </div>

        {/* Description & Amenities */}
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Property Description</h4>
            <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
              {property.description || 'No detailed description recorded.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-2">Amenities & Highlights</h4>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-medium"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
