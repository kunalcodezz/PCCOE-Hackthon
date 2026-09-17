import React from 'react';
import {
  Recycle,
  Sparkles,
  Layers,
  Lock,
  QrCode,
  ShieldCheck,
  TrendingUp,
  FileText,
  Truck,
  ArrowRight,
} from 'lucide-react';

interface Props {
  navigate: (route: string) => void;
}

export const HowItWorks: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Architecture &amp; Whitepaper Brief
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How CircuTrace Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          A full-stack, transparent, and auditable operating system for industrial and municipal circular
          waste streams.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Step 1</span>
            <h2 className="text-lg font-bold text-slate-900">AI Material Identification &amp; Grading</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When a generator uploads a photo of their waste stream, computer vision classifies the
              specific polymer or scrap grade (e.g. PET Plastic, OCC Cardboard, PCB E-Waste, UBC
              Aluminum). It evaluates physical condition, contamination risk, and suggests optimal
              processing routes (mechanical, chemical, or smelting).
            </p>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 font-mono">
              Scientific Guardrail: 2D imagery reliably classifies visual material structure. Net weight
              must always be entered manually to guarantee weighbridge accuracy.
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Step 2</span>
            <h2 className="text-lg font-bold text-slate-900">Multi-Factor Matching Engine</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Traditional recycling brokers rely on telephone calls and slow manual quotes. CircuTrace
              evaluates local recyclers using a composite mathematical scoring index:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                <span className="font-bold text-blue-900 block">40% Material Match</span>
                <span className="text-slate-500 text-[11px]">Material stream compatibility</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                <span className="font-bold text-blue-900 block">25% Haul Distance</span>
                <span className="text-slate-500 text-[11px]">Carbon footprint penalty</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                <span className="font-bold text-blue-900 block">20% Capacity</span>
                <span className="text-slate-500 text-[11px]">Facility intake headroom</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                <span className="font-bold text-blue-900 block">15% Demand Surge</span>
                <span className="text-slate-500 text-[11px]">High market demand multiplier</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Step 3</span>
            <h2 className="text-lg font-bold text-slate-900">Cryptographic Ledger of Custody (SHA-256)</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every lifecycle transition creates an immutable block linking to the previous block&apos;s
              hash. This cryptographic Merkle chain ensures that if an actor attempts to tamper with the
              recorded weight, date, or recycler name, the whole chain fails checksum verification
              instantly.
            </p>
            <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-xs font-mono text-purple-950">
              Genesis Hash (WST-PUN-00124) → Pickup Sealed → Transit Telemetry → Inbound Weighbridge →
              Recycled Pellets.
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Step 4</span>
            <h2 className="text-lg font-bold text-slate-900">The Digital Waste Passport</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every waste batch receives a Digital Passport with a public QR code. Anyone—from factory
              managers, municipal regulators, to consumers buying goods made with recycled plastic—can
              scan the QR and see the complete journey from initial dumpster pickup to pelletization.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Step 5</span>
            <h2 className="text-lg font-bold text-slate-900">Anti-Fraud Radar &amp; Discrepancy Auditing</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our automated Fraud Radar continuously audits weighbridge discrepancies, anomalous weight loss,
              and duplicate claims in real time to guarantee integrity and eliminate greenwashing across the
              circular supply chain.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => navigate('/list-waste')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition cursor-pointer"
        >
          <span>Try the Interactive Demo Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
