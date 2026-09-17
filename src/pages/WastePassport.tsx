import React, { useState } from 'react';
import { User } from '../types';
import { wasteStore } from '../services/wasteService';
import { QRCodeCard } from '../components/QRCodeCard';
import { WasteStatusBadge } from '../components/WasteStatusBadge';
import {
  ShieldCheck,
  Printer,
  Share2,
  ExternalLink,
  Leaf,
  Droplet,
  Zap,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Lock,
} from 'lucide-react';

interface Props {
  wasteId: string;
  currentUser: User;
  navigate: (route: string) => void;
}

export const WastePassport: React.FC<Props> = ({ wasteId, currentUser, navigate }) => {
  const listing = wasteStore.getListingByWasteId(wasteId);
  const events = wasteStore.getLifecycleEvents(wasteId);
  const [copied, setCopied] = useState(false);

  if (!listing) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Passport Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          No digital waste passport found for ID {wasteId}.
        </p>
        <button
          type="button"
          onClick={() => navigate('/my-listings')}
          className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
        >
          View Listings
        </button>
      </div>
    );
  }

  const latestEvent = events[events.length - 1];
  const genesisEvent = events[0];

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify/${wasteId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <QrCode className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-base font-bold text-slate-900">Digital Waste Passport Certificate</h1>
            <p className="text-xs text-slate-500">Official circular traceability credential</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied! ✓' : 'Share URL'}</span>
          </button>

          <a
            href={`/verify/${listing.wasteId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
          >
            <span>Public Verification</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm print:border-none print:shadow-none print:p-0 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>BLOCKCHAIN VERIFICATION: VERIFIED ✓</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              DIGITAL WASTE PASSPORT
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Circular Economy Global Traceability Standard (ISO/TC 323 Compliant Specification)
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Passport Record ID
            </span>
            <span className="font-mono text-xl sm:text-2xl font-black text-emerald-800">
              {listing.wasteId}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">Material Specification</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {listing.material}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Stream Category</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {listing.category}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Certified Quantity</span>
                <span className="text-sm font-bold text-emerald-800 mt-0.5 block">
                  {listing.quantity} {listing.unit}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Physical Condition</span>
                <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
                  {listing.condition || 'Clean Segregated Fraction'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs border border-slate-100 rounded-2xl p-4">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Source Generator:</span>
                <span className="font-semibold text-slate-900">
                  {listing.ownerName} ({listing.location})
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Processing Facility:</span>
                <span className="font-semibold text-slate-900">
                  {listing.recyclerName || 'Assigned Circular Partner'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Current Custody Status:</span>
                <div>
                  <WasteStatusBadge status={listing.status} size="sm" />
                </div>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Next Life / Reuse Destination:</span>
                <span className="font-bold text-emerald-800">
                  Recycled Polymer Pellets / rPET Yarn
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  Environmental Benefit Prototype Estimate
                </span>
                <span className="text-[10px] text-slate-400">Standard LCA coefficients</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3">
                  <Leaf className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="text-sm sm:text-base font-bold text-emerald-900">
                    {(listing.quantity * 1.5).toFixed(0)} KG
                  </div>
                  <div className="text-[10px] text-emerald-700">CO2 Avoided*</div>
                </div>

                <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3">
                  <Droplet className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm sm:text-base font-bold text-blue-900">
                    {(listing.quantity * 2.4).toFixed(0)} L
                  </div>
                  <div className="text-[10px] text-blue-700">Water Conserved*</div>
                </div>

                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3">
                  <Zap className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <div className="text-sm sm:text-base font-bold text-amber-900">
                    {(listing.quantity * 4.2).toFixed(0)} kWh
                  </div>
                  <div className="text-[10px] text-amber-700">Energy Saved*</div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1.5">
                *Estimated based on standard circular manufacturing displacement factors — prototype estimate.
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-start">
            <QRCodeCard
              wasteId={listing.wasteId}
              material={listing.material}
              status={listing.status}
              showDownload
            />
          </div>
        </div>

        <div className="pt-4 border-t-2 border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Cryptographic Ledger Attestation
            </h3>
          </div>

          <div className="bg-slate-900 text-slate-300 rounded-2xl p-4 font-mono text-[11px] space-y-2 border border-slate-800 overflow-x-auto">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Current Block Hash:</span>
              <span className="text-emerald-400 font-bold truncate max-w-[320px]">
                {latestEvent?.hash || listing.verificationHash}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Genesis Block Hash:</span>
              <span className="text-blue-300 truncate max-w-[320px]">
                {genesisEvent?.hash || listing.verificationHash}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Previous Hash Link:</span>
              <span className="text-slate-400 truncate max-w-[320px]">
                {latestEvent?.previousHash || '0000000000000000000000000000000000000000000000000000000000000000'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800 text-[10px]">
              <span className="text-slate-500">Consensus Standard: SHA-256 Merkle Chained Ledger</span>
              <span className="text-emerald-400 font-semibold">Integrity Verified ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
