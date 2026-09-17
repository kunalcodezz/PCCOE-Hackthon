import React, { useState } from 'react';
import { User, WasteCategory } from '../types';
import { wasteStore } from '../services/wasteService';
import { WasteStatusBadge } from '../components/WasteStatusBadge';
import {
  Factory,
  Search,
  MapPin,
  Calendar,
  CheckCircle2,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface Props {
  currentUser: User;
  navigate: (route: string) => void;
}

export const RecyclerMarketplace: React.FC<Props> = ({ currentUser, navigate }) => {
  const listings = wasteStore.getListings();
  const recyclers = wasteStore.getRecyclers();
  const activeRecycler = recyclers[0];

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [acceptedSuccess, setAcceptedSuccess] = useState<string | null>(null);

  const openListings = listings.filter((l) => {
    const matchesCategory = categoryFilter === 'ALL' || l.category === categoryFilter;
    return matchesCategory;
  });

  const handleAcceptPickup = async (wasteId: string) => {
    try {
      await wasteStore.requestPickup(wasteId, activeRecycler);
      setAcceptedSuccess(`Batch ${wasteId} accepted for pickup dispatch! Status changed to MATCHED.`);
      setTimeout(() => setAcceptedSuccess(null), 5000);
    } catch (err) {
      console.error(err);
      alert('Unable to accept batch. Please retry.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Factory className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Recycler Procurement Marketplace</h1>
              <p className="text-xs text-slate-500">
                Browse, accept, and secure recyclable feedstock from verified local generators
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/recycler/processing')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-xs cursor-pointer"
          >
            <span>Open Processing Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {acceptedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{acceptedSuccess}</span>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'Plastic', 'E-Waste', 'Metal', 'Cardboard', 'Construction'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              categoryFilter === cat
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {openListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-purple-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="h-40 bg-slate-100 relative">
                <img src={listing.imageUrl} alt={listing.material} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 right-2.5">
                  <WasteStatusBadge status={listing.status} size="sm" />
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-emerald-400 font-mono text-xs font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {listing.wasteId}
                </div>
              </div>

              <div className="p-4 space-y-2.5 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{listing.material}</h3>
                  <div className="text-slate-500 font-medium">Category: {listing.category}</div>
                </div>

                <div className="flex items-center justify-between py-1.5 px-2.5 bg-purple-50/50 rounded-xl border border-purple-100">
                  <span className="text-purple-800 font-bold">Volume: {listing.quantity} {listing.unit}</span>
                  <span className="text-slate-600 font-semibold">
                    {listing.expectedPrice ? `₹${listing.expectedPrice.toLocaleString()}` : 'Free Dispatch'}
                  </span>
                </div>

                <div className="space-y-1 text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{listing.location} (approx. 4.2 km)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Ready: {listing.preferredPickupDate || 'Immediate'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => navigate(`/track/${listing.wasteId}`)}
                className="py-1.5 px-3 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
              >
                Inspect Ledger
              </button>

              {listing.status === 'GENERATED' ? (
                <button
                  type="button"
                  onClick={() => handleAcceptPickup(listing.wasteId)}
                  className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-2xs"
                >
                  Accept Pickup
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/recycler/processing')}
                  className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
                >
                  In Queue →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
