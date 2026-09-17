import React from 'react';
import { ArrowUpRight, BarChart3, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ImpactSection: React.FC = () => {
  return (
    <section id="impact" className="py-20 sm:py-28 bg-[#FFFFFF] border-b border-[#D9DDD5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#D9DDD5] gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#238B57] font-semibold mb-2">
              07 / EMPIRICAL AUDIT METRICS
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#12372A] tracking-tight">
              THE IMPACT WE CAN PROVE.
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E5EFE8] text-[#12372A] font-mono text-[11px] font-bold rounded-xs border border-[#D9DDD5]">
              <span className="w-2 h-2 rounded-full bg-[#238B57]" />
              DEMO DATA — PROTOYPE SYSTEM TELEMETRY
            </span>
            <p className="text-xs text-[#7D9187] font-mono mt-1">
              All figures grounded in load-cell weighbridge event receipts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D9DDD5] pb-8 lg:pb-0 lg:pr-10">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#7D9187] mb-2">
                TOTAL PHYSICAL DISPLACEMENT
              </div>
              <div className="text-7xl sm:text-8xl lg:text-9xl font-black text-[#12372A] tracking-tight leading-none font-mono">
                9.8<span className="text-4xl sm:text-6xl text-[#238B57] ml-1">T</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#12372A] mt-4">
                WASTE DIVERTED FROM MUNICIPAL LANDFILLS
              </div>
              <p className="text-sm text-[#556960] mt-3 leading-relaxed">
                Directly authenticated across 4 regional sorting yards. Every metric unit links to
                cryptographic weighbridge ingress tickets with 0.0% variance tolerance.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#D9DDD5] font-mono text-xs">
              <div className="text-[11px] text-[#7D9187] uppercase mb-2">
                VERIFIED MATERIAL COMPOSITION BREAKDOWN
              </div>
              <div className="w-full h-4 bg-[#F6F5EF] flex rounded-xs overflow-hidden border border-[#D9DDD5] mb-2">
                <div style={{ width: '48%' }} className="bg-[#12372A]" title="PET Plastic: 48%" />
                <div style={{ width: '26%' }} className="bg-[#238B57]" title="Ferrous Scrap: 26%" />
                <div style={{ width: '16%' }} className="bg-[#53B978]" title="Cardboard: 16%" />
                <div style={{ width: '10%' }} className="bg-[#A8C5B2]" title="E-Waste: 10%" />
              </div>
              <div className="flex flex-wrap items-center justify-between text-[11px] text-[#556960]">
                <span>■ 48% PET PLASTIC</span>
                <span>■ 26% FERROUS</span>
                <span>■ 16% CARDBOARD</span>
                <span>■ 10% E-SCRAP</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-mono">
              <div className="border-b sm:border-b-0 sm:border-r border-[#D9DDD5] pb-6 sm:pb-0 sm:pr-6">
                <div className="text-xs text-[#7D9187] uppercase">PROCESSED & EXTRUDED</div>
                <div className="text-4xl sm:text-5xl font-black text-[#12372A] mt-2">
                  8.7<span className="text-2xl text-[#238B57] ml-1">T</span>
                </div>
                <div className="text-xs font-bold text-[#238B57] mt-1">RECYCLED INTO FEEDSTOCK</div>
                <p className="text-[11px] text-[#556960] font-sans mt-2">
                  Converted into verified secondary circular pellets and packaging raw stock.
                </p>
              </div>

              <div>
                <div className="text-xs text-[#7D9187] uppercase">HASH RECORD LEDGERS</div>
                <div className="text-4xl sm:text-5xl font-black text-[#12372A] mt-2">
                  126
                </div>
                <div className="text-xs font-bold text-[#12372A] mt-1">VERIFIED EVENTS</div>
                <p className="text-[11px] text-[#556960] font-sans mt-2">
                  Tamper-sealed chain of custody transactions verified on public witness nodes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-[#D9DDD5] font-mono">
              <div className="border-b sm:border-b-0 sm:border-r border-[#D9DDD5] pb-6 sm:pb-0 sm:pr-6">
                <div className="text-xs text-[#7D9187] uppercase">ACTIVE PROCESSORS</div>
                <div className="text-4xl sm:text-5xl font-black text-[#12372A] mt-2">
                  48
                </div>
                <div className="text-xs font-bold text-[#12372A] mt-1">RECYCLING PARTNERS</div>
                <p className="text-[11px] text-[#556960] font-sans mt-2">
                  Licensed industrial polymer, ferrous, and fiber reclamation plants.
                </p>
              </div>

              <div>
                <div className="text-xs text-[#7D9187] uppercase">CARBON DISPLACEMENT</div>
                <div className="text-4xl sm:text-5xl font-black text-[#238B57] mt-2">
                  14.2<span className="text-2xl text-[#12372A] ml-1">T</span>
                </div>
                <div className="text-xs font-bold text-[#238B57] mt-1">CO₂e AVERTED</div>
                <p className="text-[11px] text-[#556960] font-sans mt-2">
                  Calculated against virgin resin extraction emission coefficients (ISO 14044).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
