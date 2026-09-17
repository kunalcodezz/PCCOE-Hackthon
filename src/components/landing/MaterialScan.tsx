import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Crosshair, Check, Scan, Activity, Eye, ShieldCheck } from 'lucide-react';

interface Props {
  onCreateListing: () => void;
}

export const MaterialScan: React.FC<Props> = ({ onCreateListing }) => {
  const [scanProgress, setScanProgress] = useState(96);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-20 sm:py-28 bg-[#FFFFFF] border-b border-[#D9DDD5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#D9DDD5] gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#238B57] font-semibold mb-2">
              03 / SPECTRAL IDENTIFICATION
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#12372A] tracking-tight">
              KNOW WHAT YOU HAVE.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#32483E] font-medium max-w-md">
            A photo becomes the starting point for a material journey.
            <span className="block text-sm text-[#556960] mt-1 font-normal">
              Computer vision and near-infrared spectrometry classify resin grade, contamination index, and clean recovery yield before loading.
            </span>
          </p>
        </div>

        <div className="bg-[#14221D] border border-[#32483E] rounded-sm p-6 sm:p-10 shadow-lg text-[#F6F5EF] relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-stone pointer-events-none opacity-5" />

          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-8 border-b border-[#32483E] font-mono text-xs text-[#A8C5B2]">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-[#53B978] animate-ping" />
              <span className="font-bold text-[#F6F5EF]">SCANNER ARRAY: SPECTRO-NIR v4.2</span>
              <span className="text-[#7D9187] hidden sm:inline">• CALIBRATED 2026-03-14</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>RESOL: 4096×2160</span>
              <span>BAND: 900–1700nm</span>
              <span className="text-[#53B978] font-bold">STATUS: LOCKED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div
              className="lg:col-span-7 bg-[#12372A] border border-[#32483E] rounded-xs relative overflow-hidden min-h-[340px] sm:min-h-[420px] flex flex-col justify-between p-4 group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#12372A] via-[#1A4334] to-[#0D241C] flex items-center justify-center opacity-90">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full object-cover opacity-35"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="balePattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="14" fill="none" stroke="#53B978" strokeWidth="1.5" />
                      <circle cx="20" cy="20" r="4" fill="#238B57" />
                      <path d="M 0 20 Q 20 5 40 20" stroke="#74A982" fill="none" strokeWidth="1" />
                      <path d="M 0 20 Q 20 35 40 20" stroke="#74A982" fill="none" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="400" height="300" fill="url(#balePattern)" />
                  <rect
                    x="50"
                    y="40"
                    width="300"
                    height="220"
                    fill="none"
                    stroke="#53B978"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                </svg>
              </div>

              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#53B978] to-transparent shadow-[0_0_12px_#53B978] animate-pulse"
                style={{ top: '48%' }}
              />

              <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-[#53B978]">
                <div className="flex items-center gap-2 bg-[#14221D]/80 backdrop-blur-sm px-2.5 py-1 border border-[#32483E] rounded-xs">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>ROI: PRIMARY BALE [X: 142, Y: 88, W: 820, H: 610]</span>
                </div>
                <div className="bg-[#14221D]/80 backdrop-blur-sm px-2.5 py-1 border border-[#32483E] rounded-xs text-[#A8C5B2]">
                  EXPOSURE: 1/250s • GAIN: +3dB
                </div>
              </div>

              <div className="relative z-10 self-center my-auto w-64 sm:w-80 border border-[#53B978]/60 bg-[#12372A]/40 backdrop-blur-xs p-4 rounded-xs text-center font-mono">
                <div className="text-[10px] text-[#A8C5B2] uppercase tracking-wider mb-1">
                  DETECTION LOCK
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#F6F5EF] tracking-tight">
                  POLYETHYLENE TEREPHTHALATE
                </div>
                <div className="text-xs text-[#53B978] font-semibold mt-1">
                  MOLECULAR FORMULA: (C₁₀H₈O₄)ₙ
                </div>
              </div>

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-[#A8C5B2]">
                <div className="flex items-center gap-2 bg-[#14221D]/90 px-3 py-1.5 border border-[#32483E] rounded-xs">
                  <Activity className="w-3.5 h-3.5 text-[#53B978]" />
                  <span>SURFACE CONTAMINATION: 1.4% (PASS)</span>
                </div>
                <div className="bg-[#14221D]/90 px-3 py-1.5 border border-[#32483E] rounded-xs text-[#53B978] font-bold">
                  COLOR SORT: TRANSPARENT CLEAR
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#238B57]/20 border border-[#238B57] text-[#53B978] text-xs font-mono font-bold uppercase tracking-wider mb-4 rounded-xs">
                  <Check className="w-3.5 h-3.5" />
                  <span>MATERIAL IDENTIFIED</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#F6F5EF] tracking-tight mb-2">
                  PET PLASTIC
                </h3>

                <div className="bg-[#12372A] border border-[#32483E] p-3 rounded-xs mb-6">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-[#A8C5B2]">CONFIDENCE SCORE</span>
                    <span className="text-[#53B978] font-bold text-sm">96.4% CONFIDENCE</span>
                  </div>
                  <div className="w-full bg-[#14221D] h-2 rounded-full overflow-hidden border border-[#32483E]">
                    <div className="bg-gradient-to-r from-[#238B57] to-[#53B978] h-full rounded-full" style={{ width: '96.4%' }} />
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs border-t border-[#32483E] pt-4">
                  <div className="flex justify-between py-1.5 border-b border-[#32483E]/60">
                    <span className="text-[#7D9187]">CATEGORY:</span>
                    <span className="font-bold text-[#F6F5EF]">PLASTIC (THERMOPLASTIC)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#32483E]/60">
                    <span className="text-[#7D9187]">RESIN CODE:</span>
                    <span className="font-bold text-[#53B978]">♳ #1 PETE</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#32483E]/60">
                    <span className="text-[#7D9187]">CONDITION:</span>
                    <span className="font-bold text-[#F6F5EF]">RECYCLABLE (BALED FLAKES)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#32483E]/60">
                    <span className="text-[#7D9187]">SUGGESTED PROCESS:</span>
                    <span className="font-bold text-[#53B978]">MECHANICAL RECYCLING</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#32483E]/60">
                    <span className="text-[#7D9187]">MARKET DEMAND:</span>
                    <span className="font-bold text-[#F6F5EF]">HIGH (4 RECYCLERS ACTIVE)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onCreateListing}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-mono font-bold rounded-xs bg-[#53B978] hover:bg-[#238B57] text-[#12372A] hover:text-[#F6F5EF] transition-colors duration-200 cursor-pointer shadow-md group"
                >
                  <span>CREATE LISTING</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <div className="text-center text-[11px] font-mono text-[#7D9187] mt-2">
                  Auto-populates verified specifications to the regional marketplace.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
