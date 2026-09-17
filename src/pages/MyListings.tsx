import React, { useState, useMemo } from 'react';
import { User, WasteCategory, WasteLifecycleStatus } from '../types';
import { wasteStore } from '../services/wasteService';
import { WasteStatusBadge } from '../components/WasteStatusBadge';
import {
  Package,
  Search,
  PlusCircle,
  Filter,
  Layers,
  QrCode,
  ArrowRight,
  MapPin,
  Calendar,
} from 'lucide-react';

interface Props {
  currentUser: User;
  navigate: (route: string) => void;
}

export const MyListings: React.FC<Props> = ({ currentUser, navigate }) => {
  const listings = wasteStore.getListings();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch =
        item.wasteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [listings, searchQuery, categoryFilter, statusFilter]);

  const categories: WasteCategory[] = [
    'Plastic',
    'E-Waste',
    'Construction',
    'Metal',
    'Glass',
    'Paper',
    'Cardboard',
  ];

  const statuses: WasteLifecycleStatus[] = [
    'GENERATED',
    'MATCHED',
    'COLLECTED',
    'TRANSPORTED',
    'RECEIVED',
    'PROCESSED',
    'RECYCLED',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Waste Listings &amp; Inventory</h1>
          <p className="text-xs text-slate-500">
            Manage cataloged batches, monitor custody handoffs, and open digital passports
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/list-waste')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List New Batch</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Waste ID (WST-...), Material, or Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-auto"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-auto"
          >
            <option value="ALL">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Listing Cards / Grid */}
      {filteredListings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No waste listings match your filters.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="mt-3 text-xs text-emerald-700 underline font-medium cursor-pointer"
          >
            Clear Search &amp; Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-300 transition flex flex-col justify-between"
            >
              <div>
                {/* Card Image Banner */}
                <div className="h-40 bg-slate-100 relative">
                  <img src={item.imageUrl} alt={item.material} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 right-2.5">
                    <WasteStatusBadge status={item.status} size="sm" />
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-emerald-400 font-mono text-xs font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {item.wasteId}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.material}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-700">{item.quantity} {item.unit}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Scheduled: {item.preferredPickupDate || 'Immediate'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/track/${item.wasteId}`)}
                  className="flex-1 py-1.5 px-2 text-center text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  Track Lifecycle
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/passport/${item.wasteId}`)}
                  className="flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer shadow-2xs"
                >
                  Passport &amp; QR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
