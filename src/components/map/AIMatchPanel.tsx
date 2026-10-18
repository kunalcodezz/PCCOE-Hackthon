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

function computeMockMatch(waste: MapWasteSource, recycler: MapRecycler): MatchResult {
  const dist = calculateDistanceKm(
    { lat: waste.latitude, lng: waste.longitude },
    { lat: recycler.latitude, lng: recycler.longitude }
  );

  const materialMatch = recycler.materialsAccepted.some(
    (m) => m.toLowerCase() === waste.wasteType.toLowerCase()
  ) ? 40 : 5;

  let distanceScore = 25;
  if (dist > 40) distanceScore = 5;
  else if (dist > 20) distanceScore = 12;
  else if (dist > 10) distanceScore = 18;
  else if (dist > 5) distanceScore = 22;

  let capacityScore = 10;
  const qtyKg = waste.unit === 'tons' ? waste.quantity * 1000 : waste.quantity;
  if (recycler.processingCapacity >= qtyKg * 2) capacityScore = 20;
  else if (recycler.processingCapacity >= qtyKg) capacityScore = 16;
  else capacityScore = 4;

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
  const matches: MatchResult[] = recyclers
    .map((r) => computeMockMatch(selectedWaste, r))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-[#D9DDD5] shadow-lg overflow-hidden">
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

      <div className="px-4 py-2.5 bg-[#F6F5EF] border-b border-[#D9DDD5]">
        <div className="text-[10px] font-mono font-bold text-[#7D9187] uppercase">Source</div>
        <div className="text-xs font-semibold text-[#12372A]">{selectedWaste.name}</div>
        <div className="text-[11px] text-[#556960]">
          {selectedWaste.wasteType} • {selectedWaste.quantity} {selectedWaste.unit}
        </div>
      </div>

      <div className="p-3 space-y-3 bg-slate-50/50">
        {matches.map((match, i) => {
          return (
            <div key={match.recycler.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#E5EFE8] text-[#235841]">
                  Match #{i + 1} · {match.recycler.verified ? 'Verified facility' : 'Demo facility'}
                </span>
              </div>

              <div className="divide-y divide-slate-100 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600">Company Name</span>
                  <span className="font-bold text-[#1B6A4B] text-right truncate max-w-[160px]">
                    {match.recycler.name}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600">Location</span>
                  <span className="font-bold text-[#1B6A4B] text-right">
                    {match.recycler.location} <span className="text-[10px] font-semibold text-slate-500">({match.distanceKm} km)</span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600">Percentage match</span>
                  <span className="font-bold text-[#1B6A4B] text-right">{match.score}%</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600">Quantity</span>
                  <span className="font-bold text-[#1B6A4B] text-right">
                    {selectedWaste.quantity} {selectedWaste.unit}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 mb-3">
                <span className="font-medium text-slate-700">Why:</span> accepts {selectedWaste.wasteType}, capacity {match.recycler.processingCapacity} {match.recycler.capacityUnit}, {match.distanceKm} km away.
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onSelectRecycler(match.recycler)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B6A4B] hover:bg-[#15533A] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  <span>Select Recycler</span>
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
