import React from 'react';
import { MatchScoreResult } from '../types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  match: MatchScoreResult;
  onSelect: () => void;
  onRequestPickup: () => void;
  isSelected?: boolean;
  isRequesting?: boolean;
  activeCategory?: string;
  batchQuantity?: number;
  batchUnit?: string;
}

export const MatchCard: React.FC<Props> = ({
  match,
  onSelect,
  onRequestPickup,
  isSelected,
  isRequesting,
  activeCategory,
  batchQuantity,
  batchUnit = 'kg',
}) => {
  const { recycler, score, distanceKm } = match;

  const displayQuantity = batchQuantity
    ? `${batchQuantity.toLocaleString()} ${batchUnit.toLowerCase()}`
    : `${recycler.availableCapacity.toLocaleString()} kg`;

  return (
    <div
      onClick={onSelect}
      className={`bg-white border rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'border-[#238B57] ring-2 ring-[#238B57]/15'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Top Pill Badge matching screenshot */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-[#E5EFE8] text-[#235841]">
            {recycler.verified ? 'Verified match · certified recycler' : 'Sample match · demo data'}
          </span>
        </div>

        {/* Clean key-value rows */}
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {/* 1. Name of the company */}
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm sm:text-base text-slate-700 font-normal">
              Company Name
            </span>
            <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right truncate max-w-[220px]">
              {recycler.name}
            </span>
          </div>

          {/* 2. Location */}
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm sm:text-base text-slate-700 font-normal">
              Location
            </span>
            <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right">
              {recycler.location} <span className="text-xs font-semibold text-slate-500">({distanceKm} km)</span>
            </span>
          </div>

          {/* 3. Percentage match */}
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm sm:text-base text-slate-700 font-normal">
              Percentage match
            </span>
            <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right">
              {score}%
            </span>
          </div>

          {/* 4. Quantity */}
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm sm:text-base text-slate-700 font-normal">
              Quantity
            </span>
            <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right">
              {displayQuantity}
            </span>
          </div>
        </div>

        {/* Reason footer matching screenshot */}
        <div className="pt-3.5 border-t border-slate-100 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-700">Why:</span> accepts{' '}
          {activeCategory || recycler.materialsAccepted[0] || 'recyclable stream'},{' '}
          {recycler.verified ? 'verified facility, ' : ''}closest to the pickup point ({distanceKm} km).
        </div>
      </div>

      {/* Action button */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        {isSelected ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B6A4B]">
            <CheckCircle2 className="w-4 h-4 text-[#1B6A4B]" />
            <span>Assigned Partner</span>
          </span>
        ) : (
          <span className="text-xs text-slate-400">
            Available for immediate dispatch
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRequestPickup();
          }}
          disabled={isRequesting}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50 ${
            isSelected
              ? 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              : 'bg-[#1B6A4B] hover:bg-[#15533A] text-white shadow-xs'
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
