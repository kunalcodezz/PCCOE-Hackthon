import React from 'react';
import { MatchScoreResult } from '../types';
import {
  MapPin,
  ShieldCheck,
  Star,
  Check,
  TrendingUp,
  Weight,
  ArrowRight,
} from 'lucide-react';

interface Props {
  match: MatchScoreResult;
  onSelect: () => void;
  onRequestPickup: () => void;
  isSelected?: boolean;
  isRequesting?: boolean;
}

export const MatchCard: React.FC<Props> = ({
  match,
  onSelect,
  onRequestPickup,
  isSelected,
  isRequesting,
}) => {
  const { recycler, score, breakdown, distanceKm } = match;

  const getScoreBadge = (sc: number) => {
    if (sc >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200';
    if (sc >= 75) return 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-200';
    return 'bg-amber-50 text-amber-700 border-amber-300';
  };

  return (
    <div
      onClick={onSelect}
      className={`relative bg-white border rounded-2xl p-5 shadow-xs transition cursor-pointer ${
        isSelected
          ? 'border-emerald-600 ring-2 ring-emerald-100 bg-emerald-50/20'
          : 'border-slate-200 hover:border-emerald-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="font-semibold text-slate-900 text-base">{recycler.name}</h4>
            {recycler.verified && (
              <span className="inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 mr-0.5" />
                Verified
              </span>
            )}
            {recycler.demandHigh && (
              <span className="inline-flex items-center text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                High Demand
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {recycler.location} ({distanceKm} km away)
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-0.5 text-amber-600 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {recycler.rating}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <div className={`px-2.5 py-1 rounded-xl border text-sm font-bold ${getScoreBadge(score)}`}>
            {score}% Match
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Algorithm Index</span>
        </div>
      </div>

      <div className="mb-3">
        <span className="text-[11px] text-slate-500 font-medium block mb-1">Accepted Streams:</span>
        <div className="flex flex-wrap gap-1">
          {recycler.materialsAccepted.map((mat) => (
            <span
              key={mat}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
            >
              {mat}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
        <div>
          <span className="text-slate-400 text-[11px] block">Available Headroom</span>
          <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
            <Weight className="w-3.5 h-3.5 text-emerald-600" />
            <span>{recycler.availableCapacity.toLocaleString()} KG</span>
          </div>
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">Compatibility Breakdown</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
            <span>Mat: {breakdown.materialMatch}pt</span>
            <span>•</span>
            <span>Dist: {breakdown.distanceScore}pt</span>
            <span>•</span>
            <span>Cap: {breakdown.capacityScore}pt</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          Ready for scheduled dispatch
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRequestPickup();
          }}
          disabled={isRequesting}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isRequesting ? (
            'Assigning...'
          ) : (
            <>
              <span>Request Pickup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
