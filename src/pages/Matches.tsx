import React, { useState, useMemo } from 'react';
import { User, WasteListing } from '../types';
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
} from 'lucide-react';

interface Props {
  currentUser: User;
  navigate: (route: string) => void;
}

export const Matches: React.FC<Props> = ({ currentUser, navigate }) => {
  const listings = wasteStore.getListings();
  const recyclers = wasteStore.getRecyclers();

  // Select active listing to find matches for
  const [selectedListingId, setSelectedListingId] = useState<string>(
    listings[0]?.wasteId || 'WST-PUN-00124'
  );

  const [requestingRecyclerId, setRequestingRecyclerId] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  const currentListing = useMemo(() => {
    return listings.find((l) => l.wasteId === selectedListingId) || listings[0];
  }, [listings, selectedListingId]);

  // Compute matches for the current listing
  const matches = useMemo(() => {
    if (!currentListing) return [];
    return findMatches(currentListing, recyclers);
  }, [currentListing, recyclers]);

  const handleRequestPickup = async (matchItem: typeof matches[0]) => {
    if (!currentListing) return;
    setRequestingRecyclerId(matchItem.recycler.recyclerId);
    try {
      await wasteStore.requestPickup(currentListing.wasteId, matchItem.recycler);
      setRequestSuccess(
        `Pickup request successfully sent to ${matchItem.recycler.name}! Status updated to MATCHED.`
      );
      setTimeout(() => setRequestSuccess(null), 6000);
    } catch (err) {
      console.error(err);
      alert('Unable to assign recycler. Please try again.');
    } finally {
      setRequestingRecyclerId(null);
    }
  };

  if (!currentListing) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-base">No Waste Listings Available</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Create your first waste batch to find verified recyclers.
        </p>
        <button
          type="button"
          onClick={() => navigate('/list-waste')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          List Waste Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Smart Recycler Matching Engine</h1>
              <p className="text-xs text-slate-500">
                Algorithmically ranked by material affinity, logistics distance, capacity, and demand
              </p>
            </div>
          </div>
        </div>

        {/* Waste Batch Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Matching For:</span>
          <select
            value={selectedListingId}
            onChange={(e) => setSelectedListingId(e.target.value)}
            className="px-3 py-2 text-xs font-bold font-mono rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {listings.map((l) => (
              <option key={l.wasteId} value={l.wasteId}>
                {l.wasteId} - {l.material.slice(0, 24)}... ({l.quantity} {l.unit})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Success Alert Banner */}
      {requestSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{requestSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/track/${currentListing.wasteId}`)}
            className="text-xs font-bold text-emerald-800 underline ml-4 hover:text-emerald-950"
          >
            Track Dispatch →
          </button>
        </div>
      )}

      {/* Selected Waste Batch Detail Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentListing.imageUrl}
            alt={currentListing.material}
            className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-emerald-400 font-bold text-sm">
                {currentListing.wasteId}
              </span>
              <WasteStatusBadge status={currentListing.status} size="sm" />
            </div>
            <div className="text-sm font-semibold text-slate-100">{currentListing.material}</div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Category: {currentListing.category}</span>
              <span>•</span>
              <span>
                Volume: {currentListing.quantity} {currentListing.unit}
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {currentListing.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400">Assigned Partner</div>
            <div className="text-xs font-semibold text-emerald-300">
              {currentListing.recyclerName || 'Not yet matched'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/passport/${currentListing.wasteId}`)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            View Passport
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Nearby Qualified Recyclers ({matches.length})
            </h3>
            <p className="text-xs text-slate-500">
              Ranked descending by algorithm compatibility index
            </p>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Sorted by Match Index</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((item) => (
            <MatchCard
              key={item.recycler.recyclerId}
              match={item}
              isSelected={currentListing.recyclerId === item.recycler.recyclerId}
              isRequesting={requestingRecyclerId === item.recycler.recyclerId}
              onSelect={() => {}}
              onRequestPickup={() => handleRequestPickup(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
