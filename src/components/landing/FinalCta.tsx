import React from 'react';
import { ArrowUpRight, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  onListWaste: () => void;
  onJoinNetwork: () => void;
}

export const FinalCta: React.FC<Props> = ({ onListWaste, onJoinNetwork }) => {
  return (
    <section className="py-24 sm:py-36 bg-[#12372A] text-[#F6F5EF] relative overflow-hidden border-b border-[#32483E]">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <svg viewBox="0 0 1000 1000" className="w-[800px] sm:w-[1200px] h-auto" xmlns="http://www.w3.org/2000/svg">
          <circle cx="500" cy="500" r="180" fill="none" stroke="#53B978" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="500" cy="500" r="320" fill="none" stroke="#238B57" strokeWidth="1.5" strokeDasharray="4 12" />
          <circle cx="500" cy="500" r="460" fill="none" stroke="#A8C5B2" strokeWidth="0.75" strokeDasharray="2 16" />
          <line x1="500" y1="20" x2="500" y2="980" stroke="#238B57" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="20" y1="500" x2="980" y2="500" stroke="#238B57" strokeWidth="0.5" strokeDasharray="4 8" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#14221D] border border-[#32483E] rounded-xs text-[#53B978] font-mono text-xs font-bold uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-[#53B978]" />
          <span>JOIN THE CIRCULAR INDUSTRIAL NETWORK</span>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F6F5EF] leading-[1.05] mb-6">
          DON'T THROW IT AWAY. <br />
          <span className="text-[#53B978]">MOVE IT FORWARD.</span>
        </h2>

        <p className="text-lg sm:text-xl text-[#A8C5B2] font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          Give materials a destination. Give waste another life.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={onListWaste}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#53B978] hover:bg-[#238B57] text-[#12372A] hover:text-[#F6F5EF] font-mono text-sm font-bold rounded-xs transition-colors duration-200 cursor-pointer shadow-md group"
          >
            <span>LIST YOUR WASTE</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            type="button"
            onClick={onJoinNetwork}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-[#A8C5B2]/40 hover:bg-[#14221D] hover:border-[#53B978] text-[#F6F5EF] font-mono text-sm font-bold rounded-xs transition-colors duration-200 cursor-pointer"
          >
            <span>JOIN THE NETWORK</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-14 pt-8 border-t border-[#32483E]/80 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-[#7D9187]">
          <span>VERIFIED PROCESSORS ONLY</span>
          <span>•</span>
          <span>CRYPTOGRAPHIC MANIFEST AUDITS</span>
          <span>•</span>
          <span>ZERO LANDFILL COMPLIANCE</span>
        </div>
      </div>
    </section>
  );
};
