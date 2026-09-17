import React, { useState } from 'react';
import { WasteLifecycleEvent } from '../types';
import { verifyTransaction } from '../services/blockchainService';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  User,
  Key,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WasteStatusBadge } from './WasteStatusBadge';

interface Props {
  events: WasteLifecycleEvent[];
}

export const LifecycleTimeline: React.FC<Props> = ({ events }) => {
  const [expandedHashes, setExpandedHashes] = useState<Record<string, boolean>>({});
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});

  const toggleHash = (id: string) => {
    setExpandedHashes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVerify = async (event: WasteLifecycleEvent) => {
    setVerifyingId(event.eventId);
    try {
      const isValid = await verifyTransaction(event);
      setVerifiedMap((prev) => ({ ...prev, [event.eventId]: isValid }));
    } catch {
      setVerifiedMap((prev) => ({ ...prev, [event.eventId]: false }));
    } finally {
      setVerifyingId(null);
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        No lifecycle events recorded for this waste batch yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
      {events.map((event, idx) => {
        const isVerified = verifiedMap[event.eventId] ?? event.verified;
        const isExpanded = expandedHashes[event.eventId] || false;
        const isLast = idx === events.length - 1;

        return (
          <div key={event.eventId} className="relative group">
            <div
              className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                isLast
                  ? 'bg-emerald-600 border-emerald-300 text-white ring-4 ring-emerald-100'
                  : 'bg-white border-emerald-500 text-emerald-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs transition hover:border-emerald-300">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <WasteStatusBadge status={event.status} size="sm" />
                  <span className="text-xs font-mono text-slate-500">#{event.eventId}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {new Date(event.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-800 mb-3">{event.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 mb-3 border border-slate-100">
                <div className="flex items-center gap-1.5 truncate">
                  <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-700">{event.actorName}</span>
                  <span className="text-slate-400">({event.actorRole})</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleHash(event.eventId)}
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 transition"
                  >
                    <Key className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono">
                      {event.hash ? `${event.hash.slice(0, 14)}...${event.hash.slice(-8)}` : 'Generating hash...'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleVerify(event)}
                        disabled={verifyingId === event.eventId}
                        className="text-xs text-emerald-700 hover:underline cursor-pointer"
                      >
                        {verifyingId === event.eventId ? 'Verifying...' : 'Verify Hash'}
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2.5 p-2.5 bg-slate-900 rounded-lg text-slate-200 text-xs font-mono space-y-1.5 overflow-x-auto">
                    <div>
                      <span className="text-emerald-400">Current Block SHA-256:</span>
                      <p className="break-all select-all text-slate-300 text-[11px]">{event.hash}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Previous Linked Hash:</span>
                      <p className="break-all select-all text-slate-400 text-[11px]">{event.previousHash}</p>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between">
                      <span>Ledger Protocol: SHA-256 Merkle Link</span>
                      <span className="text-emerald-400">Status: IMMUTABLE</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
