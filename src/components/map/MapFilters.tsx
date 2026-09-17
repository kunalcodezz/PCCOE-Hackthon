import React from 'react';
import {
  Layers,
  Trash2,
  Recycle,
  Factory,
  MapPin,
  Loader2,
} from 'lucide-react';

export type CategoryFilter = 'all' | 'waste' | 'recycler' | 'industry';

const WASTE_TYPES = ['Plastic', 'E-Waste', 'Construction', 'Paper', 'Metal'] as const;

interface Props {
  activeCategory: CategoryFilter;
  onCategoryChange: (cat: CategoryFilter) => void;
  activeWasteTypes: string[];
  onWasteTypeToggle: (type: string) => void;
  onUseMyLocation: () => void;
  locationLoading: boolean;
  locationError: string | null;
}

const CATEGORY_ITEMS: { key: CategoryFilter; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <Layers className="w-3.5 h-3.5" /> },
  { key: 'waste', label: 'Waste Sources', icon: <Trash2 className="w-3.5 h-3.5" /> },
  { key: 'recycler', label: 'Recyclers', icon: <Recycle className="w-3.5 h-3.5" /> },
  { key: 'industry', label: 'Industries', icon: <Factory className="w-3.5 h-3.5" /> },
];

export const MapFilters: React.FC<Props> = ({
  activeCategory,
  onCategoryChange,
  activeWasteTypes,
  onWasteTypeToggle,
  onUseMyLocation,
  locationLoading,
  locationError,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-[#D9DDD5] p-3 shadow-xs">
        <div className="text-[10px] font-bold font-mono text-[#7D9187] uppercase tracking-wider mb-2.5 px-1">
          Categories
        </div>
        <div className="space-y-1">
          {CATEGORY_ITEMS.map((item) => {
            const active = activeCategory === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onCategoryChange(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                  active
                    ? 'bg-[#E5EFE8] text-[#12372A] font-semibold border border-[#238B57]/20'
                    : 'text-[#556960] hover:text-[#12372A] hover:bg-[#F6F5EF]'
                }`}
              >
                <span className={active ? 'text-[#238B57]' : 'text-[#7D9187]'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#D9DDD5] p-3 shadow-xs">
        <div className="text-[10px] font-bold font-mono text-[#7D9187] uppercase tracking-wider mb-2.5 px-1">
          Waste Type
        </div>
        <div className="space-y-1">
          {WASTE_TYPES.map((wt) => {
            const active = activeWasteTypes.includes(wt);
            return (
              <button
                key={wt}
                type="button"
                onClick={() => onWasteTypeToggle(wt)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                  active
                    ? 'bg-[#E5EFE8] text-[#12372A] font-semibold border border-[#238B57]/20'
                    : 'text-[#556960] hover:text-[#12372A] hover:bg-[#F6F5EF]'
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center shrink-0 transition ${
                    active ? 'bg-[#238B57] border-[#238B57]' : 'border-[#D9DDD5]'
                  }`}
                >
                  {active && (
                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span>{wt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onUseMyLocation}
        disabled={locationLoading}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#12372A] hover:bg-[#238B57] text-white text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-60 shadow-xs"
      >
        {locationLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <MapPin className="w-3.5 h-3.5" />
        )}
        <span>Use My Location</span>
      </button>

      {locationError && (
        <div className="text-[11px] text-[#C2413B] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {locationError}
        </div>
      )}
    </div>
  );
};
