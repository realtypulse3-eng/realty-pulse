import React, { useState } from 'react';
import { X, Building2, Plus, DollarSign, MapPin } from 'lucide-react';
import { Property, PropertyType, PropertyStatus } from '../../types';
import { db } from '../../lib/db';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyAdded: () => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onPropertyAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('condo');
  const [status, setStatus] = useState<PropertyStatus>('active');
  const [price, setPrice] = useState(1200000);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [area, setArea] = useState(2400);
  const [furnishing, setFurnishing] = useState<'unfurnished' | 'semi-furnished' | 'fully-furnished'>('fully-furnished');
  const [amenitiesInput, setAmenitiesInput] = useState('Infinity Pool, Gym, 24/7 Security, EV Charger');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address || !city) return;

    setIsSubmitting(true);
    const amenities = amenitiesInput.split(',').map(a => a.trim()).filter(Boolean);

    await db.addProperty({
      organization_id: 'org_default',
      title,
      description,
      property_type: propertyType,
      status,
      price: Number(price),
      currency: 'USD',
      address,
      city,
      state,
      country: 'USA',
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      furnishing,
      amenities,
      listing_date: new Date().toISOString(),
      images: [{ id: 'img_' + Date.now(), property_id: '', url: imageUrl, sort_order: 1 }],
    });

    setIsSubmitting(false);
    onPropertyAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Add Property Listing</h3>
              <p className="text-xs text-slate-400">Stores listing directly into database</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Property Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. The Apex Skyline Residence"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Type</label>
              <select
                value={propertyType}
                onChange={e => setPropertyType(e.target.value as PropertyType)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100"
              >
                <option value="condo">Condo / Apartment</option>
                <option value="villa">Luxury Villa</option>
                <option value="house">Single Family House</option>
                <option value="commercial">Commercial Space</option>
                <option value="land">Land Estate</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as PropertyStatus)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100"
              >
                <option value="active">Active Listing</option>
                <option value="pending">Pending Sale</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Price (USD) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="100 Ocean Drive"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Miami"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">State / Region</label>
              <input
                type="text"
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="FL"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Bedrooms</label>
              <input
                type="number"
                value={bedrooms}
                onChange={e => setBedrooms(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Bathrooms</label>
              <input
                type="number"
                value={bathrooms}
                onChange={e => setBathrooms(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Area (Sq Ft)</label>
              <input
                type="number"
                value={area}
                onChange={e => setArea(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Amenities (comma separated)</label>
            <input
              type="text"
              value={amenitiesInput}
              onChange={e => setAmenitiesInput(e.target.value)}
              placeholder="Pool, Concierge, Dock"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Property Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the property features..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20"
            >
              {isSubmitting ? 'Saving...' : 'Add Property to DB'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
