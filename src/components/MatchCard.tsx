import React, { useState } from 'react';
import { MatchScoreResult } from '../types';
import {
  MapPin,
  ShieldCheck,
  Star,
  Check,
  TrendingUp,
  Weight,
  ArrowRight,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  match: MatchScoreResult;
  onSelect: () => void;
  onRequestPickup: () => void;
  isSelected?: boolean;
  isRequesting?: boolean;
  activeCategory?: string;
}

export const MatchCard: React.FC<Props> = ({
  match,
  onSelect,
  onRequestPickup,
  isSelected,
  isRequesting,
  activeCategory,
}) => {
  const { recycler, score, breakdown, distanceKm } = match;
  const [showDetails, setShowDetails] = useState(false);

  const getScoreBadge = (sc: number) => {
    if (sc >= 90) return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-200/60';
    if (sc >= 75) return 'bg-blue-50 text-blue-800 border-blue-300 ring-1 ring-blue-200/60';
    return 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-200/60';
  };

  return (
    <div
      onClick={onSelect}
      className={`relative bg-white border rounded-2xl p-5 shadow-xs transition cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'border-emerald-600 ring-2 ring-emerald-100 bg-emerald-50/15'
          : 'border-slate-200 hover:border-emerald-300 hover:shadow-sm'
      }`}
    >
      <div>
        {/* Header: Title, badges, and Match Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {recycler.name}
              </h4>
              {recycler.verified && (
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 mr-0.5" />
                  Verified
                </span>
              )}
              {recycler.demandHigh && (
                <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                  High Demand
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{recycler.location}</span>
                <span className="font-semibold text-slate-700">({distanceKm} km)</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-0.5 text-amber-700 font-medium">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{recycler.rating.toFixed(1)}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className={`px-2.5 py-1 rounded-xl border text-xs sm:text-sm font-bold ${getScoreBadge(score)}`}>
              {score}% Match
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Compatibility Index</span>
          </div>
        </div>

        {/* Accepted Streams */}
        <div className="mb-3.5">
          <span className="text-[11px] text-slate-400 font-medium block mb-1">
            Accepted Material Streams:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {recycler.materialsAccepted.map((mat) => {
              const isCurrent = activeCategory && mat.toLowerCase() === activeCategory.toLowerCase();
              return (
                <span
                  key={mat}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {isCurrent ? `✓ ${mat}` : mat}
                </span>
              );
            })}
          </div>
        </div>

        {/* Capacity & Compatibility Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100">
          <div>
            <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider block">
              Available Headroom
            </span>
            <div className="flex items-center gap-1 font-bold text-slate-900 mt-0.5">
              <Weight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{recycler.availableCapacity.toLocaleString()} KG</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider block">
              Logistics Radius
            </span>
            <div className="flex items-center gap-1 font-bold text-slate-900 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{distanceKm} km to facility</span>
            </div>
          </div>
        </div>

        {/* Algorithmic Score Breakdown - Supported by existing Matching Engine */}
        <div className="mb-3 bg-white border border-slate-200/80 rounded-xl p-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails((prev) => !prev);
            }}
            className="w-full flex items-center justify-between text-[11px] text-slate-500 font-medium hover:text-slate-800 transition cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              <span>Engine Score Composition</span>
            </span>
            <span className="flex items-center gap-0.5 text-emerald-700 font-semibold">
              <span>{showDetails ? 'Collapse' : 'Inspect'}</span>
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </span>
          </button>

          {showDetails ? (
            <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-2 text-[11px]">
              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Material Compatibility</span>
                  <span className="font-bold text-slate-800">{breakdown.materialMatch}/40 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1 rounded-full"
                    style={{ width: `${(breakdown.materialMatch / 40) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Logistics Proximity</span>
                  <span className="font-bold text-slate-800">{breakdown.distanceScore}/25 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-1 rounded-full"
                    style={{ width: `${(breakdown.distanceScore / 25) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Capacity Headroom</span>
                  <span className="font-bold text-slate-800">{breakdown.capacityScore}/20 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-1 rounded-full"
                    style={{ width: `${(breakdown.capacityScore / 20) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Trust, Rating &amp; Demand</span>
                  <span className="font-bold text-slate-800">{breakdown.demandBonus}/15 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-1 rounded-full"
                    style={{ width: `${(breakdown.demandBonus / 15) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Mat: <strong>{breakdown.materialMatch}pt</strong></span>
              <span>•</span>
              <span>Dist: <strong>{breakdown.distanceScore}pt</strong></span>
              <span>•</span>
              <span>Cap: <strong>{breakdown.capacityScore}pt</strong></span>
              <span>•</span>
              <span>Trust: <strong>{breakdown.demandBonus}pt</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Status & Actions */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div>
          {isSelected ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Assigned Partner</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">
              Verified for instant dispatch
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRequestPickup();
          }}
          disabled={isRequesting}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50 ${
            isSelected
              ? 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isRequesting ? (
            'Dispatching...'
          ) : isSelected ? (
            'Re-dispatch'
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

