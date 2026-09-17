import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, CheckCircle2, ArrowRight, FileCheck, Lock, ExternalLink } from 'lucide-react';

interface Props {
  onVerifyPassport: () => void;
}

export const DigitalWastePassport: React.FC<Props> = ({ onVerifyPassport }) => {
  const passportId = 'WST-PUN-00124';
  const qrTargetUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${passportId}`
    : `https://reloop.registry/verify/${passportId}`;

  const lifecycleStages = [
    { name: 'GENERATED', date: '2026-03-14 09:15 IST', actor: 'ABC Industries Fabrication', note: 'Calibrated load-cell weight: 500.0 KG', completed: true },
    { name: 'COLLECTED', date: '2026-03-14 11:42 IST', actor: 'CleanFleet EV #14 Logistics', note: 'Tamper-evident NFC seal #89021', completed: true },
    { name: 'TRANSPORTED', date: '2026-03-14 13:05 IST', actor: 'NH-48 Corridor Geofence', note: 'Continuous weighbridge delta: 0.0%', completed: true },
    { name: 'PROCESSED', date: '2026-03-14 16:30 IST', actor: 'GreenCycle Chakan MIDC Facility', note: 'Shredded & hot-washed (99.4% purity)', completed: true },
    { name: 'RECYCLED', date: '2026-03-15 10:20 IST', actor: 'GreenCycle Extrusion Line #2', note: '482 KG rPET circular pellets produced', completed: true },
  ];

  return (
    <section id="passport" className="py-20 sm:py-32 bg-[#FFFFFF] border-b border-[#D9DDD5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#E5EFE8] border border-[#D9DDD5] text-[#12372A] text-xs font-mono font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#238B57]" />
            <span>05 / SIGNATURE PRODUCT PASSPORT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#12372A] tracking-tight mb-4">
            EVERY MATERIAL GETS AN IDENTITY.
          </h2>
          <p className="text-base sm:text-xl text-[#32483E] font-medium">
            One batch. One journey. Verifiable proof.
          </p>
        </div>

        {/* Signature Digital Waste Passport - Physical Manifest / Cryptographic Certificate Hybrid */}
        <div className="max-w-4xl mx-auto bg-[#F6F5EF] border-2 border-[#12372A] rounded-sm shadow-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          {/* Subtle Guilloché / Grid Pattern on Document */}
          <div className="absolute inset-0 bg-grid-stone pointer-events-none opacity-40" />

          {/* Official Document Top Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b-2 border-[#12372A] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#238B57] inline-block" />
                <span className="font-mono text-xs font-black tracking-widest text-[#12372A] uppercase">
                  OFFICIAL DIGITAL WASTE PASSPORT
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#12372A] tracking-tight font-mono mt-1">
                {passportId}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="inline-flex items-center gap-1 bg-[#E5EFE8] border border-[#238B57] text-[#238B57] px-2.5 py-1 font-bold rounded-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED TRACEABILITY ✓
              </span>
              <span className="bg-[#FFFFFF] border border-[#D9DDD5] text-[#556960] px-2.5 py-1 rounded-xs">
                ISO/TC 323 ALIGNED
              </span>
            </div>
          </div>

          {/* Core Material Specification Row */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#FFFFFF] border border-[#D9DDD5] rounded-xs mb-8 font-mono text-xs">
            <div>
              <div className="text-[#7D9187] uppercase text-[10px]">CLASSIFICATION</div>
              <div className="text-base font-bold text-[#12372A] mt-0.5">PET PLASTIC</div>
              <div className="text-[#556960] text-[11px]">Resin #1 (PETE) • High Grade</div>
            </div>
            <div>
              <div className="text-[#7D9187] uppercase text-[10px]">NET INTAKE WEIGHT</div>
              <div className="text-base font-bold text-[#12372A] mt-0.5">500.0 KG</div>
              <div className="text-[#556960] text-[11px]">Gross 508.5 KG • Tare 8.5 KG</div>
            </div>
            <div>
              <div className="text-[#7D9187] uppercase text-[10px]">CURRENT LEDGER STATE</div>
              <div className="text-base font-bold text-[#238B57] mt-0.5">CLOSED-LOOP COMPLETE</div>
              <div className="text-[#556960] text-[11px]">Block Height: #84,219</div>
            </div>
          </div>

          {/* Parties Involved Row */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 font-mono text-xs">
            <div className="p-4 bg-[#FFFFFF] border border-[#D9DDD5] rounded-xs">
              <div className="text-[#7D9187] uppercase text-[10px] flex items-center gap-1 mb-1">
                <span>[01] SOURCE OF ORIGIN</span>
              </div>
              <div className="text-sm font-bold text-[#12372A]">ABC INDUSTRIES</div>
              <div className="text-[#556960] text-[11px] mt-0.5">
                Automotive Fabrication Plant 4, Bhosari MIDC, Pune
              </div>
            </div>

            <div className="p-4 bg-[#FFFFFF] border border-[#D9DDD5] rounded-xs">
              <div className="text-[#7D9187] uppercase text-[10px] flex items-center gap-1 mb-1">
                <span>[02] DESTINATION RECYCLER</span>
              </div>
              <div className="text-sm font-bold text-[#12372A]">GREENCYCLE RECYCLING</div>
              <div className="text-[#556960] text-[11px] mt-0.5">
                Advanced Polymer Recovery Yard, Chakan Phase II, Pune
              </div>
            </div>
          </div>

          {/* Sequential Cryptographic Chain of Custody Checklist */}
          <div className="relative z-10 mb-8">
            <div className="text-xs font-mono font-bold text-[#12372A] uppercase tracking-wider mb-3">
              CRYPTOGRAPHIC CHAIN OF CUSTODY
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {lifecycleStages.map((stage, idx) => (
                <div
                  key={stage.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#FFFFFF] border border-[#D9DDD5] rounded-xs hover:border-[#238B57] transition-colors gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#238B57] text-[#F6F5EF] flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <div>
                      <span className="font-bold text-[#12372A] tracking-wider mr-2">
                        {stage.name}
                      </span>
                      <span className="text-[#556960] text-[11px]">{stage.actor}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-[11px] text-[#7D9187] sm:pl-4">
                    <span className="text-[#238B57] font-semibold">{stage.note}</span>
                    <span className="block text-[10px]">{stage.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Cryptographic Verification Strip (QR + Hash) */}
          <div className="relative z-10 p-5 bg-[#12372A] text-[#F6F5EF] rounded-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Live QR Code representation */}
              <div className="bg-[#FFFFFF] p-2 rounded-xs shrink-0 shadow-sm">
                <QRCodeSVG
                  value={qrTargetUrl}
                  size={84}
                  bgColor="#FFFFFF"
                  fgColor="#12372A"
                  level="M"
                />
              </div>

              <div>
                <div className="text-[10px] font-mono text-[#53B978] font-bold uppercase tracking-widest mb-1">
                  SHA-256 IMMUTABLE LEDGER HASH
                </div>
                <div className="font-mono text-xs sm:text-sm text-[#F6F5EF] font-semibold break-all selection:bg-[#53B978]">
                  8f72c3d19e048a17d83b62f8a19213ef791ac
                </div>
                <div className="text-[11px] font-mono text-[#A8C5B2] mt-1">
                  Merkle Root: 4b2e8a9102c34a9f • Consensus: Public Node Witness
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onVerifyPassport}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xs bg-[#238B57] hover:bg-[#53B978] text-[#F6F5EF] hover:text-[#12372A] font-mono text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              <span>AUDIT PASSPORT</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
