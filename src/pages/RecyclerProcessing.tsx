import React, { useState } from 'react';
import { User, WasteLifecycleStatus, WasteListing } from '../types';
import { wasteStore } from '../services/wasteService';
import { WasteStatusBadge } from '../components/WasteStatusBadge';
import confetti from 'canvas-confetti';
import {
  Factory,
  CheckCircle2,
  Truck,
  RotateCw,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentUser: User;
  navigate: (route: string) => void;
}

export const RecyclerProcessing: React.FC<Props> = ({ currentUser, navigate }) => {
  const listings = wasteStore.getListings();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeBatches = listings.filter((l) =>
    ['MATCHED', 'COLLECTED', 'TRANSPORTED', 'RECEIVED', 'PROCESSED', 'RECYCLED'].includes(l.status)
  );

  const handleAdvance = async (
    wasteId: string,
    currentStatus: WasteLifecycleStatus,
    targetStatus: WasteLifecycleStatus
  ) => {
    setProcessingId(wasteId);
    try {
      const descMap: Record<WasteLifecycleStatus, string> = {
        GENERATED: 'Batch cataloged.',
        MATCHED: 'Recycler accepted dispatch logistics.',
        COLLECTED: 'On-site weight certified and sealed in transport container.',
        TRANSPORTED: 'In transit to recycling facility with GPS lock.',
        RECEIVED: 'Inbound weighbridge verified; contaminants < 2%.',
        PROCESSED: 'Mechanical shredding, optical sort, caustic washing complete.',
        RECYCLED: 'Extruded into high-grade certified secondary raw materials.',
        REUSED: 'Dispatched to manufacturing plant for closed-loop packaging.',
      };

      await wasteStore.advanceLifecycle(
        wasteId,
        targetStatus,
        {
          id: currentUser.uid,
          name: currentUser.companyName || 'EcoPlast Processing Hub',
          role: 'Authorized Recycler Facility',
          location: currentUser.location || 'Bhosari MIDC, Pune',
        },
        descMap[targetStatus]
      );

      if (targetStatus === 'RECYCLED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#3b82f6', '#8b5cf6'],
        });
      }

      setStatusMessage(`Batch ${wasteId} advanced to ${targetStatus}! Cryptographic SHA-256 block sealed.`);
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setErrorMessage('Unable to advance stage. Please retry.');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Factory className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Facility Inbound &amp; Processing Queue</h1>
              <p className="text-xs text-slate-500">
                Execute custody handoffs, verify incoming weights, and mint certified secondary materials
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/recycler/marketplace')}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
        >
          Procure More Feedstock
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-900 flex items-center gap-2 animate-in fade-in">
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      <div className="space-y-4">
        {activeBatches.map((batch) => {
          const isBusy = processingId === batch.wasteId;

          return (
            <div
              key={batch.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-purple-200 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={batch.imageUrl}
                  alt={batch.material}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-emerald-800 font-bold text-sm">
                      {batch.wasteId}
                    </span>
                    <WasteStatusBadge status={batch.status} size="sm" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{batch.material}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{batch.quantity} {batch.unit}</span>
                    <span>•</span>
                    <span>{batch.location}</span>
                    <span>•</span>
                    <span>Origin: {batch.ownerName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap lg:justify-end">
                {batch.status === 'MATCHED' && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleAdvance(batch.wasteId, 'MATCHED', 'COLLECTED')}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition cursor-pointer disabled:opacity-50"
                  >
                    {isBusy ? 'Hashing...' : '1. Mark Collected (On-Site Weigh)'}
                  </button>
                )}

                {batch.status === 'COLLECTED' && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleAdvance(batch.wasteId, 'COLLECTED', 'TRANSPORTED')}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition cursor-pointer disabled:opacity-50"
                  >
                    {isBusy ? 'Hashing...' : '2. Mark Transported (Dispatch)'}
                  </button>
                )}

                {batch.status === 'TRANSPORTED' && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleAdvance(batch.wasteId, 'TRANSPORTED', 'RECEIVED')}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition cursor-pointer disabled:opacity-50"
                  >
                    {isBusy ? 'Hashing...' : '3. Mark Received (Weighbridge In)'}
                  </button>
                )}

                {batch.status === 'RECEIVED' && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleAdvance(batch.wasteId, 'RECEIVED', 'PROCESSED')}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition cursor-pointer disabled:opacity-50"
                  >
                    {isBusy ? 'Hashing...' : '4. Mark Processed (Shred & Wash)'}
                  </button>
                )}

                {batch.status === 'PROCESSED' && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleAdvance(batch.wasteId, 'PROCESSED', 'RECYCLED')}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isBusy ? 'Minting...' : '5. Mark Recycled (Extrude Pellets)'}
                  </button>
                )}

                {batch.status === 'RECYCLED' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Closed-Loop Recycled ✓</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate(`/track/${batch.wasteId}`)}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Track
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/passport/${batch.wasteId}`)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition cursor-pointer"
                >
                  Passport &amp; QR
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
