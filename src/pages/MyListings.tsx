import React, { useState, useMemo } from 'react';
import { User, WasteCategory, WasteLifecycleStatus, WasteListing } from '../types';
import { wasteStore } from '../services/wasteService';
import { WasteStatusBadge } from '../components/WasteStatusBadge';
import {
  Package,
  Search,
  PlusCircle,
  Filter,
  Layers,
  QrCode,
  MapPin,
  Calendar,
  LayoutGrid,
  List,
  ShieldCheck,
  Factory,
  ArrowUpDown,
  X,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

interface Props {
  currentUser: User;
  navigate: (route: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'quantity-desc' | 'quantity-asc';

export const MyListings: React.FC<Props> = ({ currentUser, navigate }) => {
  const listings = wasteStore.getListings();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  // Quick status filter helper
  const quickStatusGroups = [
    { label: 'All Batches', value: 'ALL' },
    { label: 'Generated', value: 'GENERATED' },
    { label: 'Matched', value: 'MATCHED' },
    { label: 'In Transit', value: 'TRANSPORTED' },
    { label: 'Recycled', value: 'RECYCLED' },
  ];

  const filteredListings = useMemo(() => {
    const result = listings.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.wasteId.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.recyclerName && item.recyclerName.toLowerCase().includes(q));

      const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;

      let matchesStatus = true;
      if (statusFilter === 'TRANSPORTED') {
        matchesStatus =
          item.status === 'COLLECTED' ||
          item.status === 'TRANSPORTED' ||
          item.status === 'RECEIVED';
      } else if (statusFilter !== 'ALL') {
        matchesStatus = item.status === statusFilter;
      }

      return matchesSearch && matchesCat && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      const qtyA = a.unit === 'Tons' ? a.quantity * 1000 : a.quantity;
      const qtyB = b.unit === 'Tons' ? b.quantity * 1000 : b.quantity;
      if (sortBy === 'quantity-desc') {
        return qtyB - qtyA;
      }
      if (sortBy === 'quantity-asc') {
        return qtyA - qtyB;
      }
      return 0;
    });

    return result;
  }, [listings, searchQuery, categoryFilter, statusFilter, sortBy]);

  // Aggregate stats using existing data
  const stats = useMemo(() => {
    const total = listings.length;
    const active = listings.filter(
      (l) => l.status !== 'RECYCLED' && l.status !== 'REUSED'
    ).length;
    const recycled = listings.filter(
      (l) => l.status === 'RECYCLED' || l.status === 'REUSED'
    ).length;
    const totalKg = listings.reduce((sum, item) => {
      return sum + (item.unit === 'Tons' ? item.quantity * 1000 : item.quantity);
    }, 0);

    return { total, active, recycled, totalKg };
  }, [listings]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    sortBy !== 'newest';

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold tracking-wide uppercase">
              <Package className="w-3 h-3 text-emerald-600" />
              <span>Inventory &amp; Custody</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              My Waste Listings
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Manage cataloged batches, monitor custody handoffs across the lifecycle, and inspect tamper-proof digital passports.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/list-waste')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Listing</span>
            </button>
          </div>
        </div>

        {/* Minimalist Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-500 block">Total Cataloged</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {stats.total} <span className="text-xs font-normal text-slate-500">batches</span>
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-500 block">In Pipeline</span>
            <span className="text-base font-bold text-amber-700 mt-0.5 block">
              {stats.active} <span className="text-xs font-normal text-slate-500">active</span>
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-500 block">Completed</span>
            <span className="text-base font-bold text-emerald-700 mt-0.5 block">
              {stats.recycled} <span className="text-xs font-normal text-slate-500">recycled</span>
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-500 block">Total Volume</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {stats.totalKg >= 1000
                ? `${(stats.totalKg / 1000).toFixed(1)} Tons`
                : `${stats.totalKg.toLocaleString()} KG`}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Quick status tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {quickStatusGroups.map((tab) => {
            const isActive = statusFilter === tab.value;
            let count = listings.length;
            if (tab.value === 'TRANSPORTED') {
              count = listings.filter(
                (l) =>
                  l.status === 'COLLECTED' ||
                  l.status === 'TRANSPORTED' ||
                  l.status === 'RECEIVED'
              ).length;
            } else if (tab.value !== 'ALL') {
              count = listings.filter((l) => l.status === tab.value).length;
            }

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-emerald-200/70 text-emerald-900 font-bold'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and dropdown controls */}
        <div className="flex flex-col md:flex-row items-center gap-2.5 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Waste ID (WST-...), Material, Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Lifecycle Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="ALL">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="quantity-desc">Sort: Volume High → Low</option>
              <option value="quantity-asc">Sort: Volume Low → High</option>
            </select>

            {/* Grid / List layout switcher */}
            <div className="hidden sm:flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Grid View"
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="List View"
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter results status indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{filteredListings.length}</strong> of{' '}
              <strong className="text-slate-800">{listings.length}</strong> listings
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Listings Content */}
      {filteredListings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {listings.length === 0 ? 'No waste batches listed yet' : 'No listings match your filters'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
            {listings.length === 0
              ? 'Catalog and list your first commercial or domestic waste batch to start circular recovery.'
              : 'Try clearing your search query or loosening your category and lifecycle status filters.'}
          </p>
          {listings.length === 0 ? (
            <button
              type="button"
              onClick={() => navigate('/list-waste')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Listing</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Search &amp; Filters</span>
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-300 hover:shadow-sm transition flex flex-col justify-between group"
            >
              <div>
                {/* Image & Header Overlay */}
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.material}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-2.5 right-2.5">
                    <WasteStatusBadge status={item.status} size="sm" />
                  </div>

                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-white/90 text-slate-800 backdrop-blur-xs border border-white/40">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-slate-900/85 text-emerald-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs border border-slate-800">
                      {item.wasteId}
                    </span>
                    {item.verificationHash && (
                      <span
                        title="Cryptographically Verified Genesis Event"
                        className="bg-slate-900/85 text-emerald-300 p-1 rounded-md backdrop-blur-xs border border-slate-800"
                      >
                        <ShieldCheck className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {item.material}
                      </h3>
                      <span className="font-bold text-slate-900 text-xs shrink-0">
                        {item.quantity.toLocaleString()} {item.unit}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Metadata Attributes */}
                  <div className="space-y-1.5 text-xs text-slate-500 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {item.preferredPickupDate
                            ? `Pickup: ${item.preferredPickupDate}`
                            : `Listed: ${new Date(item.createdAt).toLocaleDateString()}`}
                        </span>
                      </div>

                      {item.expectedPrice && (
                        <span className="text-emerald-700 font-semibold shrink-0">
                          ₹{item.expectedPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {item.recyclerName && (
                      <div className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100 text-[11px] font-medium truncate">
                        <Factory className="w-3 h-3 shrink-0 text-purple-600" />
                        <span className="truncate">Partner: {item.recyclerName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
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

                {item.status === 'GENERATED' && (
                  <button
                    type="button"
                    onClick={() => navigate('/matches')}
                    title="Find Matching Recyclers"
                    className="py-1.5 px-2 text-center text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer shrink-0"
                  >
                    Match
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List / Table View Layout */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Waste Batch</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Location &amp; Schedule</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Partner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredListings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.material}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{item.material}</div>
                          <div className="font-mono text-[11px] text-emerald-700 font-medium">
                            {item.wasteId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">
                        {item.quantity.toLocaleString()} {item.unit}
                      </span>
                      {item.expectedPrice && (
                        <span className="block text-[11px] text-emerald-700 font-medium">
                          ₹{item.expectedPrice.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 line-clamp-1">{item.location}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.preferredPickupDate || new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <WasteStatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      {item.recyclerName ? (
                        <span className="text-[11px] font-medium text-purple-800 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md">
                          {item.recyclerName}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate(`/track/${item.wasteId}`)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-[11px] transition cursor-pointer"
                        >
                          Track
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/passport/${item.wasteId}`)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition cursor-pointer"
                        >
                          Passport
                        </button>
                        {item.status === 'GENERATED' && (
                          <button
                            type="button"
                            onClick={() => navigate('/matches')}
                            className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-[11px] transition cursor-pointer"
                          >
                            Match
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

