import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, MapPin, Gauge, Shield, Truck, Zap } from 'lucide-react';

interface Props {
  onViewMarketplace: () => void;
}

export const MatchingNetwork: React.FC<Props> = ({ onViewMarketplace }) => {
  const [selectedMatch, setSelectedMatch] = useState<'greenloop' | 'renew'>('greenloop');

  return (
    <section id="market" className="py-20 sm:py-28 bg-[#F6F5EF] border-b border-[#D9DDD5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#D9DDD5] gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#238B57] font-semibold mb-2">
              04 / MULTI-FACTOR ROUTING ENGINE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#12372A] tracking-tight">
              FIND ITS NEXT DESTINATION.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#32483E] font-medium max-w-md">
            Algorithmic logistics matching waste generators with optimal verified processors.
            <span className="block text-sm text-[#556960] mt-1 font-normal">
              Balancing material compatibility, transport emissions, capacity, and live spot processing rates.
            </span>
          </p>
        </div>

        {/* Logistics Network Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Origin Waste Batch Card */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border-2 border-[#12372A] p-6 sm:p-8 rounded-sm shadow-md relative">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#D9DDD5] font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-pulse" />
                <span className="font-bold text-[#12372A]">ORIGIN LOT READY</span>
              </div>
              <span className="bg-[#E5EFE8] text-[#12372A] px-2 py-0.5 rounded-xs font-bold">
                WST-PUN-00124
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono text-[#7D9187] uppercase tracking-wider">
                  MATERIAL TYPE
                </div>
                <div className="text-2xl font-extrabold text-[#12372A]">PET PLASTIC</div>
                <div className="text-xs font-mono text-[#556960] mt-0.5">
                  Baled Clean Flakes • Clear Stream
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#D9DDD5] font-mono text-xs">
                <div>
                  <div className="text-[#7D9187]">BATCH WEIGHT</div>
                  <div className="text-lg font-bold text-[#12372A]">500 KG</div>
                </div>
                <div>
                  <div className="text-[#7D9187]">LOCATION</div>
                  <div className="text-lg font-bold text-[#12372A] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#238B57]" />
                    <span>PUNE</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D9DDD5] bg-[#F6F5EF] p-3 rounded-xs font-mono text-xs">
                <div className="flex justify-between text-[#556960] mb-1">
                  <span>ROUTING WEIGHTS</span>
                  <span>4 PARAMETERS</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-bold text-[#12372A]">
                  <div className="bg-[#FFFFFF] p-1 border border-[#D9DDD5]">MAT: 40%</div>
                  <div className="bg-[#FFFFFF] p-1 border border-[#D9DDD5]">DIST: 25%</div>
                  <div className="bg-[#FFFFFF] p-1 border border-[#D9DDD5]">CAP: 20%</div>
                  <div className="bg-[#FFFFFF] p-1 border border-[#D9DDD5]">SPOT: 15%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Schematic Connecting Flow Indicators */}
          <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center space-y-4 font-mono text-xs text-[#556960]">
            <div className="w-full border-t-2 border-dashed border-[#238B57] relative">
              <div className="absolute right-0 -top-1.5 w-3 h-3 border-t-2 border-r-2 border-[#238B57] rotate-45" />
            </div>
            <div className="bg-[#12372A] text-[#F6F5EF] px-2.5 py-1 rounded-xs text-[10px] font-bold tracking-wider">
              MULTI-MATCH
            </div>
            <div className="w-full border-t-2 border-dashed border-[#D9DDD5] relative">
              <div className="absolute right-0 -top-1.5 w-3 h-3 border-t-2 border-r-2 border-[#D9DDD5] rotate-45" />
            </div>
          </div>

          {/* Right: Matched Recycler Candidates */}
          <div className="lg:col-span-5 space-y-4">
            {/* Candidate 1: GreenLoop (Prime Match) */}
            <div
              onClick={() => setSelectedMatch('greenloop')}
              className={`p-6 rounded-sm border-2 transition-all duration-200 cursor-pointer ${
                selectedMatch === 'greenloop'
                  ? 'bg-[#FFFFFF] border-[#238B57] shadow-md ring-2 ring-[#238B57]/20'
                  : 'bg-[#FFFFFF]/70 border-[#D9DDD5] hover:border-[#74A982]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D9DDD5]">
                <div>
                  <div className="text-xs font-mono font-bold text-[#238B57] uppercase tracking-wider">
                    RECOMMENDED DISPATCH
                  </div>
                  <h4 className="text-xl font-extrabold text-[#12372A]">GREENLOOP</h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#238B57] font-mono">96%</div>
                  <div className="text-[10px] font-mono text-[#7D9187]">MATCH SCORE</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs mb-4 text-[#32483E]">
                <div className="bg-[#F6F5EF] p-2 rounded-xs">
                  <div className="text-[10px] text-[#7D9187]">DISTANCE</div>
                  <div className="font-bold text-[#12372A]">4.2 KM</div>
                </div>
                <div className="bg-[#F6F5EF] p-2 rounded-xs">
                  <div className="text-[10px] text-[#7D9187]">CAPACITY</div>
                  <div className="font-bold text-[#12372A]">500–1000 KG</div>
                </div>
                <div className="bg-[#F6F5EF] p-2 rounded-xs">
                  <div className="text-[10px] text-[#7D9187]">STATUS</div>
                  <div className="font-bold text-[#238B57]">AVAILABLE</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#238B57]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PET ✓
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 500–1000 KG ✓
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AVAILABLE ✓
                </span>
              </div>
            </div>

            {/* Candidate 2: Renew Materials Co. */}
            <div
              onClick={() => setSelectedMatch('renew')}
              className={`p-6 rounded-sm border transition-all duration-200 cursor-pointer ${
                selectedMatch === 'renew'
                  ? 'bg-[#FFFFFF] border-[#12372A] shadow-md ring-2 ring-[#12372A]/10'
                  : 'bg-[#FFFFFF]/70 border-[#D9DDD5] hover:border-[#74A982]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D9DDD5]">
                <div>
                  <div className="text-xs font-mono text-[#7D9187] uppercase tracking-wider">
                    SECONDARY CANDIDATE
                  </div>
                  <h4 className="text-xl font-bold text-[#12372A]">RENEW MATERIALS</h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#556960] font-mono">82%</div>
                  <div className="text-[10px] font-mono text-[#7D9187]">MATCH SCORE</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs mb-3 text-[#32483E]">
                <div className="bg-[#F6F5EF] p-2 rounded-xs">
                  <div className="text-[10px] text-[#7D9187]">DISTANCE</div>
                  <div className="font-bold text-[#12372A]">8.7 KM</div>
                </div>
                <div className="bg-[#F6F5EF] p-2 rounded-xs">
                  <div className="text-[10px] text-[#7D9187]">CAPACITY</div>
                  <div className="font-bold text-[#12372A]">1,000–5,000 KG</div>
                </div>
                <div className="bg-[#F6F5EF] p-2 rounded-xs">
                  <div className="text-[10px] text-[#7D9187]">QUEUE</div>
                  <div className="font-bold text-[#D97706]">2.5 HRS</div>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-[#556960]">
                <span>Process: Chemical Depolymerization</span>
                <span>•</span>
                <span>Min Batch: 1,000 KG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
