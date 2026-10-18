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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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

          <div className="lg:col-span-5 space-y-4">
            {/* Card 1: GreenLoop */}
            <div
              onClick={() => setSelectedMatch('greenloop')}
              className={`bg-white rounded-3xl p-6 sm:p-7 border shadow-xs transition-all duration-200 cursor-pointer ${
                selectedMatch === 'greenloop'
                  ? 'border-[#238B57] ring-2 ring-[#238B57]/15'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="mb-4">
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-[#E5EFE8] text-[#235841]">
                  Sample match · demo data
                </span>
              </div>

              <div className="divide-y divide-slate-100 border-t border-slate-100">
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base text-slate-700 font-normal">
                    Company Name
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right">
                    GREENLOOP
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base text-slate-700 font-normal">
                    Location
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right">
                    Bhosari MIDC, Pune <span className="text-xs font-semibold text-slate-500">(4.2 km)</span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base text-slate-700 font-normal">
                    Percentage match
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right">
                    96%
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base text-slate-700 font-normal">
                    Quantity
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right">
                    500 kg
                  </span>
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-700">Why:</span> accepts PET plastic, verified facility, closest to the pickup point (4.2 km).
              </div>
            </div>

            {/* Card 2: Renew Materials */}
            <div
              onClick={() => setSelectedMatch('renew')}
              className={`bg-white rounded-3xl p-6 sm:p-7 border shadow-xs transition-all duration-200 cursor-pointer ${
                selectedMatch === 'renew'
                  ? 'border-[#12372A] ring-2 ring-[#12372A]/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="mb-4">
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-[#E5EFE8] text-[#235841]">
                  Sample match · demo data
                </span>
              </div>

              <div className="divide-y divide-slate-100 border-t border-slate-100">
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base text-slate-700 font-normal">
                    Company Name
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right">
                    RENEW MATERIALS
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base text-slate-700 font-normal">
                    Location
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right">
                    Chakan Industrial Area, Pune <span className="text-xs font-semibold text-slate-500">(8.7 km)</span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base text-slate-700 font-normal">
                    Percentage match
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right">
                    82%
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm sm:text-base text-slate-700 font-normal">
                    Quantity
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#1B6A4B] text-right">
                    1,000 kg
                  </span>
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-700">Why:</span> chemical depolymerization capability, high batch capacity, regional corridor.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
