import React from 'react';
import { RefreshCw } from 'lucide-react';

interface Props {
  navigate: (route: string) => void;
}

export const Footer: React.FC<Props> = ({ navigate }) => {
  return (
    <footer className="bg-[#14221D] text-[#A8C5B2] border-t border-[#32483E] py-12 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#32483E]">
          {/* Logo & Description */}
          <div className="max-w-sm">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <span className="w-5 h-5 rounded-full border-2 border-[#53B978] border-t-transparent animate-spin duration-1000 inline-block" />
              <span className="font-extrabold text-lg tracking-tight text-[#F6F5EF] font-sans">
                RE:LOOP
              </span>
            </button>
            <p className="text-xs text-[#7D9187] mt-2 font-sans">
              Digital infrastructure for a circular economy.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-bold text-[#F6F5EF]">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('flow');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/how-it-works');
              }}
              className="hover:text-[#53B978] transition-colors cursor-pointer"
            >
              FLOW
            </button>
            <button
              type="button"
              onClick={() => navigate('/matches')}
              className="hover:text-[#53B978] transition-colors cursor-pointer"
            >
              MARKET
            </button>
            <button
              type="button"
              onClick={() => navigate('/verify/WST-PUN-00124')}
              className="hover:text-[#53B978] transition-colors cursor-pointer"
            >
              PASSPORT
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('impact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/impact');
              }}
              className="hover:text-[#53B978] transition-colors cursor-pointer"
            >
              IMPACT
            </button>
            <a
              href="mailto:contact@reloop.network"
              className="hover:text-[#53B978] transition-colors"
            >
              SOCIAL / CONTACT
            </a>
          </div>
        </div>

        {/* Bottom Subtext */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7D9187]">
          <div>
            <span>© 2026 RE:LOOP Platform. All rights reserved.</span>
            <span className="mx-2">•</span>
            <span>ISO/TC 323 &amp; GHG Protocol Scope 3 Ready</span>
          </div>

          <div className="font-bold text-[#53B978]">
            From Waste to Value.
          </div>
        </div>
      </div>
    </footer>
  );
};
