import React, { useState, useMemo } from 'react';
import { User, WasteListing, MatchScoreResult } from '../types';
import { wasteStore } from '../services/wasteService';
import { findMatches } from '../services/matchingService';
import { MatchCard } from '../components/MatchCard';
import { WasteStatusBadge } from '../components/WasteStatusBadge';
import {
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter,
  Package,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  RotateCcw,
  X,
  Calendar,
  Weight,
  ExternalLink,
} from 'lucide-react';

interface Props {
  currentUser: User;
  navigate: (route: string) => void;
}

type SortOption = 'score' | 'distance' | 'capacity' | 'rating';

export const Matches: React.FC<Props> = ({ currentUser, navigate }) => {
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Read fresh store state when refreshCounter changes
  const listings = useMemo(() => {
    return wasteStore.getListings();
  }, [refreshCounter]);

  const recyclers = useMemo(() => {
    return wasteStore.getRecyclers();
  }, [refreshCounter]);

  const [selectedListingId, setSelectedListingId] = useState<string>(
    listings[0]?.wasteId || 'WST-PUN-00124'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState<string>('ALL');
  const [distanceFilter, setDistanceFilter] = useState<string>('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('score');

  const [requestingRecyclerId, setRequestingRecyclerId] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const currentListing = useMemo(() => {
    return listings.find((l) => l.wasteId === selectedListingId) || listings[0];
  }, [listings, selectedListingId]);

  const allMatches = useMemo(() => {
    if (!currentListing) return [];
    return findMatches(currentListing, recyclers);
  }, [currentListing, recyclers]);

  const filteredMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = allMatches.filter((item) => {
      const { recycler, score, distanceKm } = item;

      const matchesSearch =
        !q ||
        recycler.name.toLowerCase().includes(q) ||
        recycler.location.toLowerCase().includes(q) ||
        recycler.materialsAccepted.some((m) => m.toLowerCase().includes(q));

      const matchesScore =
        minScoreFilter === 'ALL' ||
        (minScoreFilter === '90' && score >= 90) ||
        (minScoreFilter === '80' && score >= 80) ||
        (minScoreFilter === '70' && score >= 70);

      const matchesDist =
        distanceFilter === 'ALL' ||
        (distanceFilter === '10' && distanceKm <= 10) ||
        (distanceFilter === '25' && distanceKm <= 25) ||
        (distanceFilter === '50' && distanceKm <= 50);

      const matchesVerified = !verifiedOnly || recycler.verified;

      return matchesSearch && matchesScore && matchesDist && matchesVerified;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === 'capacity') {
        return b.recycler.availableCapacity - a.recycler.availableCapacity;
      }
      if (sortBy === 'rating') {
        return b.recycler.rating - a.recycler.rating;
      }
      return b.score - a.score;
    });

    return filtered;
  }, [allMatches, searchQuery, minScoreFilter, distanceFilter, verifiedOnly, sortBy]);

  const handleRequestPickup = async (matchItem: MatchScoreResult) => {
    if (!currentListing) return;
    setRequestingRecyclerId(matchItem.recycler.recyclerId);
    setRequestError(null);
    try {
      await wasteStore.requestPickup(currentListing.wasteId, matchItem.recycler);
      setRefreshCounter((prev) => prev + 1);
      setRequestSuccess(
        `Pickup request successfully dispatched to ${matchItem.recycler.name}! Status updated to MATCHED.`
      );
      setTimeout(() => setRequestSuccess(null), 8000);
    } catch (err) {
      console.error(err);
      setRequestError('Unable to assign recycler. Please try again.');
      setTimeout(() => setRequestError(null), 6000);
    } finally {
      setRequestingRecyclerId(null);
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    minScoreFilter !== 'ALL' ||
    distanceFilter !== 'ALL' ||
    verifiedOnly ||
    sortBy !== 'score';

  const resetFilters = () => {
    setSearchQuery('');
    setMinScoreFilter('ALL');
    setDistanceFilter('ALL');
    setVerifiedOnly(false);
    setSortBy('score');
  };

  if (!currentListing) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Package className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">No Waste Listings Available</h3>
        <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
          Create and catalog your first waste batch to find verified recyclers and automated dispatch matches.
        </p>
        <button
          type="button"
          onClick={() => navigate('/list-waste')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition"
        >
          <span>List Waste Batch</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold tracking-wide uppercase">
              <Layers className="w-3 h-3 text-emerald-600" />
              <span>Algorithmic Logistics</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Smart Recycler Matching
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Pair cataloged batches with qualified recycling facilities ranked by material compatibility, logistics radius, available headroom, and demand.
            </p>
          </div>

          {/* Active Listing Switcher Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap pl-1">
              Matching Batch:
            </span>
            <select
              value={selectedListingId}
              onChange={(e) => setSelectedListingId(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold font-mono rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer max-w-xs truncate"
            >
              {listings.map((l) => (
                <option key={l.wasteId} value={l.wasteId}>
                  {l.wasteId} • {l.material.slice(0, 20)} ({l.quantity} {l.unit})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dispatch Success Alert */}
      {requestSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium leading-snug">{requestSuccess}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/track/${currentListing.wasteId}`)}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              Track Dispatch Lifecycle →
            </button>
            <button
              type="button"
              onClick={() => setRequestSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Selected Batch Context Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 border border-slate-800">
        <div className="flex items-center gap-4 min-w-0">
          <img
            src={currentListing.imageUrl}
            alt={currentListing.material}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-700/80 shrink-0 bg-slate-800"
          />
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-emerald-400 font-bold text-xs sm:text-sm bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                {currentListing.wasteId}
              </span>
              <WasteStatusBadge status={currentListing.status} size="sm" />
              <span className="text-[10px] uppercase font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                {currentListing.category}
              </span>
            </div>

            <div className="text-sm sm:text-base font-bold text-slate-100 truncate">
              {currentListing.material}
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
              <span className="font-semibold text-slate-200">
                {currentListing.quantity.toLocaleString()} {currentListing.unit}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{currentListing.location}</span>
              </span>
              {currentListing.preferredPickupDate && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Pickup: {currentListing.preferredPickupDate}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status & Quick Actions */}
        <div className="flex sm:items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t border-slate-800 lg:border-t-0">
          <div className="text-left lg:text-right">
            <div className="text-[11px] text-slate-400 font-medium">Assigned Facility Partner</div>
            <div className="text-xs font-semibold text-emerald-400 mt-0.5">
              {currentListing.recyclerName ? `✓ ${currentListing.recyclerName}` : 'Pending assignment'}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate(`/passport/${currentListing.wasteId}`)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              Passport &amp; QR
            </button>
            <button
              type="button"
              onClick={() => navigate(`/track/${currentListing.wasteId}`)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              Track
            </button>
          </div>
        </div>
      </div>

      {requestSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{requestSuccess}</span>
        </div>
      )}

      {requestError && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-900 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-semibold">{requestError}</span>
        </div>
      )}

      {/* Matching Filters & Sorting Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter facilities by name, location, or accepted stream..."
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
            {/* Match Score Threshold */}
            <select
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="ALL">All Match Scores</option>
              <option value="90">90%+ Compatibility</option>
              <option value="80">80%+ Compatibility</option>
              <option value="70">70%+ Compatibility</option>
            </select>

            {/* Distance Filter */}
            <select
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="ALL">Any Distance</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="score">Sort: Compatibility Index</option>
              <option value="distance">Sort: Nearest Distance</option>
              <option value="capacity">Sort: Available Capacity</option>
              <option value="rating">Sort: Facility Rating</option>
            </select>

            {/* Verified Only Toggle */}
            <button
              type="button"
              onClick={() => setVerifiedOnly((prev) => !prev)}
              className={`px-3 py-2 text-xs rounded-xl border transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                verifiedOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Only</span>
            </button>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{filteredMatches.length}</strong> of{' '}
              <strong className="text-slate-800">{allMatches.length}</strong> qualified facilities
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

      {/* Matches Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Nearby Qualified Recyclers ({filteredMatches.length})
            </h3>
            <p className="text-xs text-slate-500">
              Ranked descending by algorithm compatibility index for stream: {currentListing.category}
            </p>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {sortBy === 'score'
                ? 'Sorted by Compatibility'
                : sortBy === 'distance'
                ? 'Sorted by Distance'
                : sortBy === 'capacity'
                ? 'Sorted by Headroom'
                : 'Sorted by Rating'}
            </span>
          </div>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Filter className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Facilities Match Filter Criteria</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
              Try adjusting your distance threshold or minimum compatibility score to discover more available partners.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filter Criteria</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMatches.map((item) => (
              <MatchCard
                key={item.recycler.recyclerId}
                match={item}
                isSelected={currentListing.recyclerId === item.recycler.recyclerId}
                isRequesting={requestingRecyclerId === item.recycler.recyclerId}
                activeCategory={currentListing.category}
                onSelect={() => {}}
                onRequestPickup={() => handleRequestPickup(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

