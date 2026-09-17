import React from 'react';
import type { MapWasteSource, MapRecycler, MapIndustry, MapMarkerData } from '../../data/mapData';
import { MapPin, Recycle, Factory, Star, ShieldCheck } from 'lucide-react';

interface Props {
  marker: MapMarkerData;
  onFindRecycler?: (waste: MapWasteSource) => void;
  onViewRecycler?: (recycler: MapRecycler) => void;
  onViewIndustry?: (industry: MapIndustry) => void;
  matchScore?: number;
}

const statusColors: Record<string, string> = {
  Available: 'bg-[#238B57]/10 text-[#238B57] border-[#238B57]/20',
  Scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  Collected: 'bg-slate-100 text-slate-500 border-slate-200',
};

export const LocationPopup: React.FC<Props> = ({
  marker,
  onFindRecycler,
  onViewRecycler,
  onViewIndustry,
  matchScore,
}) => {
  if (marker.type === 'waste') {
    const waste = marker as MapWasteSource;
    return (
      <div className="min-w-[220px] font-sans">
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin className="w-3.5 h-3.5 text-[#E67E22]" />
          <span className="text-[10px] font-bold font-mono text-[#E67E22] uppercase tracking-wider">
            Waste Available
          </span>
        </div>
        <div className="text-sm font-bold text-[#12372A] mb-1.5">{waste.name}</div>
        <div className="space-y-1 text-xs text-[#556960] mb-3">
          <div className="flex justify-between">
            <span>Type</span>
            <span className="font-semibold text-[#12372A]">{waste.wasteType}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantity</span>
            <span className="font-semibold text-[#12372A]">{waste.quantity} {waste.unit}</span>
          </div>
          <div className="flex justify-between">
            <span>Location</span>
            <span className="font-semibold text-[#12372A]">{waste.location}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Status</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[waste.status] || ''}`}>
              {waste.status}
            </span>
          </div>
        </div>
        {onFindRecycler && (
          <button
            type="button"
            onClick={() => onFindRecycler(waste)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#12372A] hover:bg-[#238B57] text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            <Recycle className="w-3.5 h-3.5" />
            Find Recycler
          </button>
        )}
      </div>
    );
  }

  if (marker.type === 'recycler') {
    const recycler = marker as MapRecycler;
    return (
      <div className="min-w-[220px] font-sans">
        <div className="flex items-center gap-1.5 mb-2">
          <Recycle className="w-3.5 h-3.5 text-[#238B57]" />
          <span className="text-[10px] font-bold font-mono text-[#238B57] uppercase tracking-wider">
            Recycler
          </span>
        </div>
        <div className="text-sm font-bold text-[#12372A] mb-1.5">{recycler.name}</div>
        <div className="space-y-1 text-xs text-[#556960] mb-2">
          <div className="flex justify-between">
            <span>Materials</span>
            <span className="font-semibold text-[#12372A]">{recycler.materialsAccepted.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span>Capacity</span>
            <span className="font-semibold text-[#12372A]">{recycler.processingCapacity} {recycler.capacityUnit}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Rating</span>
            <span className="flex items-center gap-1 font-semibold text-[#12372A]">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {recycler.rating}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Verified</span>
            {recycler.verified ? (
              <span className="flex items-center gap-1 text-[#238B57] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Yes
              </span>
            ) : (
              <span className="text-[#7D9187]">Pending</span>
            )}
          </div>
        </div>
        {matchScore !== undefined && (
          <div className="flex items-center gap-1.5 mb-2 px-2 py-1.5 bg-[#E5EFE8] rounded-lg">
            <span className="text-[10px] font-bold font-mono text-[#238B57]">AI MATCH</span>
            <span className="text-sm font-extrabold text-[#12372A]">{matchScore}%</span>
          </div>
        )}
        {onViewRecycler && (
          <button
            type="button"
            onClick={() => onViewRecycler(recycler)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#238B57] hover:bg-[#12372A] text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            View Recycler
          </button>
        )}
      </div>
    );
  }

  if (marker.type === 'industry') {
    const industry = marker as MapIndustry;
    return (
      <div className="min-w-[220px] font-sans">
        <div className="flex items-center gap-1.5 mb-2">
          <Factory className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span className="text-[10px] font-bold font-mono text-[#3B82F6] uppercase tracking-wider">
            Industry / Buyer
          </span>
        </div>
        <div className="text-sm font-bold text-[#12372A] mb-1.5">{industry.name}</div>
        <div className="space-y-1 text-xs text-[#556960] mb-3">
          <div className="flex justify-between">
            <span>Needs</span>
            <span className="font-semibold text-[#12372A]">{industry.requiredMaterial}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantity</span>
            <span className="font-semibold text-[#12372A]">{industry.requiredQuantity} {industry.quantityUnit}</span>
          </div>
          <div className="flex justify-between">
            <span>Location</span>
            <span className="font-semibold text-[#12372A]">{industry.location}</span>
          </div>
        </div>
        {onViewIndustry && (
          <button
            type="button"
            onClick={() => onViewIndustry(industry)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            View Requirement
          </button>
        )}
      </div>
    );
  }

  return null;
};
