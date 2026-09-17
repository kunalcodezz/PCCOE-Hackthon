import React, { useState, useEffect } from 'react';
import { X, MapPin, Recycle, Clock, Truck, CheckCircle2, Package, FlaskConical } from 'lucide-react';
import type { MapWasteSource, MapRecycler } from '../../data/mapData';

interface Props {
  waste: MapWasteSource;
  recycler: MapRecycler;
  distanceKm: number;
  onClose: () => void;
}

const TIMELINE_STEPS = [
  { label: 'Waste Generated', icon: Package, desc: 'Source identified & listed' },
  { label: 'Recycler Matched', icon: Recycle, desc: 'AI-powered matching complete' },
  { label: 'Pickup Scheduled', icon: Clock, desc: 'Collection window confirmed' },
  { label: 'Waste Collected', icon: Truck, desc: 'Material picked up from source' },
  { label: 'Recycling / Upcycling', icon: FlaskConical, desc: 'Processing at recycler facility' },
  { label: 'Material Recovered', icon: CheckCircle2, desc: 'Ready for industry reuse' },
];

export const TraceabilityTimeline: React.FC<Props> = ({
  waste,
  recycler,
  distanceKm,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const estimatedTime = Math.max(5, Math.round(distanceKm * 5));

  useEffect(() => {
    if (activeStep < TIMELINE_STEPS.length - 1) {
      const timer = setTimeout(() => setActiveStep((s) => s + 1), 800);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  return (
    <div className="bg-white rounded-xl border border-[#D9DDD5] shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#12372A] to-[#238B57]">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#53B978]" />
          <span className="text-xs font-bold font-mono text-white tracking-wide uppercase">
            Waste Traceability
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white/80 uppercase">
            Prototype Demo
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 py-3 bg-[#F6F5EF] border-b border-[#D9DDD5]">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
            <span className="font-semibold text-[#12372A] truncate">{waste.name}</span>
          </div>
          <div className="flex flex-col items-center shrink-0 px-2">
            <span className="text-[10px] font-mono text-[#7D9187]">{distanceKm} km</span>
            <div className="w-12 h-px bg-[#D9DDD5] my-0.5 relative">
              <div className="absolute -right-1 -top-1 w-0 h-0 border-l-4 border-l-[#238B57] border-y-2 border-y-transparent" />
            </div>
            <span className="text-[10px] font-mono text-[#7D9187]">~{estimatedTime} min</span>
          </div>
          <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
            <span className="font-semibold text-[#12372A] truncate text-right">{recycler.name}</span>
            <Recycle className="w-3.5 h-3.5 text-[#238B57] shrink-0" />
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="space-y-0">
          {TIMELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            const completed = i <= activeStep;
            const isCurrent = i === activeStep;

            return (
              <div key={step.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                      completed
                        ? 'bg-[#238B57] text-white shadow-sm shadow-[#238B57]/30'
                        : 'bg-[#D9DDD5] text-[#7D9187]'
                    } ${isCurrent ? 'ring-2 ring-[#238B57]/30 ring-offset-1' : ''}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div
                      className={`w-0.5 h-6 transition-all duration-500 ${
                        i < activeStep ? 'bg-[#238B57]' : 'bg-[#D9DDD5]'
                      }`}
                    />
                  )}
                </div>

                <div className="pb-4 pt-0.5">
                  <div className={`text-xs font-semibold transition-colors duration-300 ${
                    completed ? 'text-[#12372A]' : 'text-[#7D9187]'
                  }`}>
                    {step.label}
                  </div>
                  <div className="text-[11px] text-[#7D9187]">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
