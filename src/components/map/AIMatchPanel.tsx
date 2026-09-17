import React from 'react';
import { X, Star, ShieldCheck, Recycle, Sparkles, ArrowRight } from 'lucide-react';
import type { MapWasteSource, MapRecycler } from '../../data/mapData';
import { calculateDistanceKm } from '../../services/matchingService';

interface MatchResult {
  recycler: MapRecycler;
  score: number;
  distanceKm: number;
}

interface Props {
  selectedWaste: MapWasteSource;
  recyclers: MapRecycler[];
  onSelectRecycler: (recycler: MapRecycler) => void;
  onClose: () => void;
}

/**
 * Calculates mock AI match score between a waste source and a recycler.
 * Uses material compatibility, distance, and capacity.
 */
function computeMockMatch(waste: MapWasteSource, recycler: MapRecycler): MatchResult {
  const dist = calculateDistanceKm(
    { lat: waste.latitude, lng: waste.longitude },
    { lat: recycler.latitude, lng: recycler.longitude }
  );

  // Material compatibility: 40 pts
  const materialMatch = recycler.materialsAccepted.some(
    (m) => m.toLowerCase() === waste.wasteType.toLowerCase()
  ) ? 40 : 5;

  // Distance score: up to 25 pts
  let distanceScore = 25;
  if (dist > 40) distanceScore = 5;
  else if (dist > 20) distanceScore = 12;
  else if (dist > 10) distanceScore = 18;
  else if (dist > 5) distanceScore = 22;

  // Capacity score: up to 20 pts
  let capacityScore = 10;
  const qtyKg = waste.unit === 'tons' ? waste.quantity * 1000 : waste.quantity;
  if (recycler.processingCapacity >= qtyKg * 2) capacityScore = 20;
  else if (recycler.processingCapacity >= qtyKg) capacityScore = 16;
  else capacityScore = 4;

  // Bonus: rating + verified
  let bonus = 0;
  if (recycler.verified) bonus += 4;
  bonus += Math.min(4, Math.round((recycler.rating / 5) * 4));
  if (recycler.rating >= 4.5) bonus += 3;

  const totalScore = Math.min(99, Math.max(20, materialMatch + distanceScore + capacityScore + bonus));

  return { recycler, score: totalScore, distanceKm: dist };
}

export const AIMatchPanel: React.FC<Props> = ({
  selectedWaste,
  recyclers,
  onSelectRecycler,
  onClose,
}) => {
  // Compute scores and sort descending
  const matches: MatchResult[] = recyclers
    .map((r) => computeMockMatch(selectedWaste, r))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-[#D9DDD5] shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#12372A] to-[#238B57]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#53B978]" />
          <span className="text-xs font-bold font-mono text-white tracking-wide uppercase">
            AI Recommended Recyclers
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Source Info */}
      <div className="px-4 py-2.5 bg-[#F6F5EF] border-b border-[#D9DDD5]">
        <div className="text-[10px] font-mono font-bold text-[#7D9187] uppercase">Source</div>
        <div className="text-xs font-semibold text-[#12372A]">{selectedWaste.name}</div>
        <div className="text-[11px] text-[#556960]">
          {selectedWaste.wasteType} • {selectedWaste.quantity} {selectedWaste.unit}
        </div>
      </div>

      {/* Match Results */}
      <div className="divide-y divide-[#D9DDD5]">
        {matches.map((match, i) => {
          const materialMatches = match.recycler.materialsAccepted.some(
            (m) => m.toLowerCase() === selectedWaste.wasteType.toLowerCase()
          );

          return (
            <div key={match.recycler.id} className="px-4 py-3 hover:bg-[#F6F5EF]/60 transition">
              {/* Rank badge */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    i === 0
                      ? 'bg-[#238B57] text-white'
                      : 'bg-[#E5EFE8] text-[#12372A]'
                  }`}>
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-[#12372A]">{match.recycler.name}</div>
                    <div className="text-[11px] text-[#7D9187]">{match.recycler.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-[#238B57]">{match.score}%</div>
                  <div className="text-[10px] font-mono text-[#7D9187]">MATCH</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-[11px] mb-2.5">
                <div className="bg-[#F6F5EF] rounded-lg px-2 py-1.5 text-center">
                  <div className="text-[#7D9187] font-mono text-[10px]">Distance</div>
                  <div className="font-bold text-[#12372A]">{match.distanceKm} km</div>
                </div>
                <div className="bg-[#F6F5EF] rounded-lg px-2 py-1.5 text-center">
                  <div className="text-[#7D9187] font-mono text-[10px]">Capacity</div>
                  <div className="font-bold text-[#12372A]">{match.recycler.processingCapacity} {match.recycler.capacityUnit}</div>
                </div>
                <div className="bg-[#F6F5EF] rounded-lg px-2 py-1.5 text-center">
                  <div className="text-[#7D9187] font-mono text-[10px]">Material</div>
                  <div className={`font-bold ${materialMatches ? 'text-[#238B57]' : 'text-[#C2413B]'}`}>
                    {materialMatches ? '✓ Match' : '✗ No'}
                  </div>
                </div>
              </div>

              {/* Extras row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-amber-600">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {match.recycler.rating}
                  </span>
                  {match.recycler.verified && (
                    <span className="flex items-center gap-1 text-[#238B57]">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onSelectRecycler(match.recycler)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#12372A] hover:bg-[#238B57] text-white text-[11px] font-bold rounded-lg transition cursor-pointer"
                >
                  Select
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
