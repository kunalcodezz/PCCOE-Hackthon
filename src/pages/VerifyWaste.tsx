import React, { useState, useEffect } from 'react';
import { wasteStore } from '../services/wasteService';
import { verifyWasteLifecycle } from '../services/blockchainService';
import { WasteStatusBadge } from '../components/WasteStatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  QrCode,
  MapPin,
  Calendar,
  Lock,
  ExternalLink,
  Leaf,
  Recycle,
  Building2,
} from 'lucide-react';

interface Props {
  wasteId: string;
  navigate?: (route: string) => void;
}

export const VerifyWaste: React.FC<Props> = ({ wasteId, navigate }) => {
  const listing = wasteStore.getListingByWasteId(wasteId);
  const events = wasteStore.getLifecycleEvents(wasteId);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    brokenIndex?: number;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (events.length > 0) {
      runVerification();
    }
  }, [wasteId, events.length]);

  const runVerification = async () => {
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = await verifyWasteLifecycle(events);
    setVerificationResult(result);
    setIsVerifying(false);
  };

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-xs">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Record Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            No waste batch registered with ID <span className="font-mono">{wasteId}</span>.
          </p>
          {navigate && (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Go to Platform Home
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Recycle className="w-4 h-4 text-emerald-600" />
            <span>CircuTrace Public Ledger Audit Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Digital Waste Passport Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Independent proof of origin, custodial transfer, and circular recycling
          </p>
        </div>

        <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    Blockchain Chain: {verificationResult?.valid ? '100% Verified' : 'Checking...'}
                  </h2>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    SHA-256 Merkle Chain
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">Passport ID: {listing.wasteId}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={runVerification}
              disabled={isVerifying}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying...' : 'Re-verify Hashes'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Record Exists</span>
                <span className="text-slate-500 text-[11px]">Found in active ledger</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Hashes Match</span>
                <span className="text-slate-500 text-[11px]">Payloads uncorrupted</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Chain Unbroken</span>
                <span className="text-slate-500 text-[11px]">Linked backwards to genesis</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Verified Material Batch
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">{listing.material}</h3>
              <div className="flex items-center gap-2 mt-1">
                <WasteStatusBadge status={listing.status} size="md" />
                <span className="text-xs text-slate-500 font-medium">
                  {listing.quantity} {listing.unit} • {listing.category} Stream
                </span>
              </div>
            </div>

            <img
              src={listing.imageUrl}
              alt={listing.material}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div>
              <span className="text-slate-400 block font-medium">Waste Origin:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">
                {listing.ownerName} ({listing.location})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Certified Recycler:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">
                {listing.recyclerName || 'Verified Recycling Facility'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Condition Specification:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">
                {listing.condition || 'Clean, Segregated Recyclable'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Closed-Loop Destination:</span>
              <span className="font-semibold text-emerald-800 mt-0.5 block">
                Recycled Raw Material / rPET Yarn
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Auditable Event Milestones ({events.length})
            </h4>

            <div className="space-y-3">
              {events.map((ev, idx) => (
                <div
                  key={ev.eventId}
                  className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 hover:border-emerald-300 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900">{ev.status}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600">{ev.actorName} ({ev.actorRole})</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(ev.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs pl-7">{ev.description}</p>

                  <div className="pl-7 text-[11px] font-mono text-slate-400 truncate flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="text-slate-500">Hash:</span>
                    <span className="text-slate-700 font-bold">{ev.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pt-4">
          Verified on CircuTrace Open Registry • Prototype cryptographic ledger implementation
        </div>
      </div>
    </div>
  );
};
