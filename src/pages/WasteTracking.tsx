import React, { useState } from 'react';
import { User, WasteLifecycleStatus } from '../types';
import { wasteStore } from '../services/wasteService';
import { LifecycleTimeline } from '../components/LifecycleTimeline';
import { WasteStatusBadge } from '../components/WasteStatusBadge';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  QrCode,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  PackageCheck,
  Truck,
  Factory,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface Props {
  wasteId: string;
  currentUser: User;
  navigate: (route: string) => void;
}

export const WasteTracking: React.FC<Props> = ({ wasteId, currentUser, navigate }) => {
  const listing = wasteStore.getListingByWasteId(wasteId);
  const events = wasteStore.getLifecycleEvents(wasteId);

  const [isAdvancing, setIsAdvancing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!listing) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Waste Batch Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          No record found for ID <span className="font-mono">{wasteId}</span>.
        </p>
        <button
          type="button"
          onClick={() => navigate('/my-listings')}
          className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
        >
          Return to Listings
        </button>
      </div>
    );
  }

  const getNextStatus = (current: WasteLifecycleStatus): WasteLifecycleStatus | null => {
    switch (current) {
      case 'GENERATED':
        return 'MATCHED';
      case 'MATCHED':
        return 'COLLECTED';
      case 'COLLECTED':
        return 'TRANSPORTED';
      case 'TRANSPORTED':
        return 'RECEIVED';
      case 'RECEIVED':
        return 'PROCESSED';
      case 'PROCESSED':
        return 'RECYCLED';
      case 'RECYCLED':
        return 'REUSED';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(listing.status);

  const handleAdvanceStatus = async () => {
    if (!nextStatus) return;
    setIsAdvancing(true);

    try {
      const actorRole =
        currentUser.role === 'recycler'
          ? 'Authorized Recycler Facility'
          : 'Logistics Custodian';

      const descMap: Record<WasteLifecycleStatus, string> = {
        GENERATED: 'Batch cataloged and listed.',
        MATCHED: `Assigned to ${listing.recyclerName || 'GreenCycle Facility'}. Pickup confirmed.`,
        COLLECTED: 'On-site weight verified, sealed with tamper tags, and loaded.',
        TRANSPORTED: 'Telemetry corridor transit active. Route deviation: 0%.',
        RECEIVED: 'Inbound facility weighbridge verified and accepted.',
        PROCESSED: 'Mechanical shredding, optical color separation, and hot caustic washing completed.',
        RECYCLED: `Processed into high-purity recycled raw materials (${listing.material}).`,
        REUSED: 'Integrated into secondary manufacturing and closed-loop consumer goods.',
      };

      await wasteStore.advanceLifecycle(
        listing.wasteId,
        nextStatus,
        {
          id: currentUser.uid,
          name: currentUser.companyName || currentUser.name,
          role: actorRole,
          location: currentUser.location || listing.location,
        },
        descMap[nextStatus]
      );

      if (nextStatus === 'RECYCLED') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#38bdf8', '#fbbf24'],
        });
      }

      setSuccessMessage(`Lifecycle advanced to ${nextStatus}! Cryptographic block SHA-256 appended.`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
      alert('Unable to advance lifecycle status. Check connection and retry.');
    } finally {
      setIsAdvancing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-base font-bold text-emerald-800">
              {listing.wasteId}
            </span>
            <WasteStatusBadge status={listing.status} size="md" />
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {events.length} Milestones
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">{listing.material}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Listed by {listing.ownerName} • {listing.location}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => navigate(`/passport/${listing.wasteId}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Digital Passport &amp; QR</span>
          </button>

          <a
            href={`/verify/${listing.wasteId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
          >
            <span>Public Verify</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
              Demo Story Accelerator
            </span>
            <span className="text-xs text-slate-300">
              {currentUser.role === 'recycler'
                ? 'Recycler Facility Controls'
                : 'Interactive Lifecycle Simulator'}
            </span>
          </div>
          <div className="text-sm font-bold text-slate-100 mt-1">
            Current Stage: <span className="text-emerald-400">{listing.status}</span>
            {nextStatus ? (
              <span className="text-slate-400 text-xs font-normal">
                {' '}
                → Next Milestone: <span className="text-slate-200 font-semibold">{nextStatus}</span>
              </span>
            ) : (
              <span className="text-emerald-300 text-xs font-normal">
                {' '}
                — Circular Loop Completely Closed ✓
              </span>
            )}
          </div>
        </div>

        {nextStatus && (
          <button
            type="button"
            onClick={handleAdvanceStatus}
            disabled={isAdvancing}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer shadow-md disabled:opacity-50 shrink-0"
          >
            {isAdvancing ? (
              <span>Minting SHA-256 Hash...</span>
            ) : (
              <>
                <span>Advance to {nextStatus}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="h-44 bg-slate-100 rounded-xl overflow-hidden border">
              <img
                src={listing.imageUrl}
                alt={listing.material}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Material Category</span>
                <span className="font-semibold text-slate-900">{listing.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Batch Quantity</span>
                <span className="font-bold text-emerald-800 text-sm">
                  {listing.quantity} {listing.unit}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Recycler Partner</span>
                <span className="font-semibold text-slate-900">
                  {listing.recyclerName || 'Matching in progress'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">AI Confidence</span>
                <span className="font-semibold text-emerald-700">
                  {listing.aiConfidence || 96.4}%
                </span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 block mb-1">Recommended Processing</span>
                <p className="text-slate-700 bg-slate-50 p-2 rounded-lg text-[11px] border border-slate-100">
                  {listing.suggestedProcessing ||
                    'Mechanical separation, flake washing, and decontamination.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Cryptographic Ledger Integrity
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every card on the right represents an immutable event block. Click &ldquo;Verify Hash&rdquo; to
              recalculate SHA-256 against canonical JSON payload.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Chain of Custody Timeline</h2>
              <p className="text-xs text-slate-500">
                Cryptographically linked chronological milestones
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Merkle Chain Active
            </span>
          </div>

          <LifecycleTimeline events={events} />
        </div>
      </div>
    </div>
  );
};
