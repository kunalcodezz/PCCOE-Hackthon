import React, { useState } from 'react';
import { User, Recycler } from '../types';
import { wasteStore } from '../services/wasteService';
import { printESGReport, generateESGReportData } from '../services/reportService';
import { StatCard } from '../components/StatCard';
import {
  ShieldAlert,
  Users,
  Building2,
  Factory,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  Lock,
  RefreshCw,
} from 'lucide-react';

interface Props {
  currentUser: User;
  navigate: (route: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ currentUser, navigate }) => {
  const [recyclers, setRecyclers] = useState<Recycler[]>(wasteStore.getRecyclers());
  const listings = wasteStore.getListings();
  const allEvents = wasteStore.getLifecycleEvents('WST-PUN-00124');

  const [alerts, setAlerts] = useState([
    {
      id: 'alt-1',
      type: 'weight_mismatch',
      severity: 'high',
      wasteId: 'WST-PUN-00125',
      title: 'Weight Variance Anomaly Detected',
      detail:
        'Reported generator weight: 500 KG. Inbound facility weighbridge logged: 320 KG. Variance: 180 KG (-36%). Possible diversion.',
      resolved: false,
    },
    {
      id: 'alt-2',
      type: 'velocity_jump',
      severity: 'medium',
      wasteId: 'WST-PUN-00127',
      title: 'Transport Corridor Anomaly',
      detail:
        'Transit milestone logged between Bhosari and Chakan in 3 minutes (implied speed > 180 km/h). Telemetry sensor review advised.',
      resolved: false,
    },
  ]);

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  const handleToggleRecyclerVerification = (recyclerId: string) => {
    setRecyclers((prev) =>
      prev.map((r) =>
        r.recyclerId === recyclerId ? { ...r, verified: !r.verified } : r
      )
    );
  };

  const handleExportESG = () => {
    const data = generateESGReportData(listings, allEvents, 'Metropolitan Waste Management Authority');
    printESGReport(data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Platform Governance &amp; Fraud Radar</h1>
              <p className="text-xs text-slate-500">
                Auditing chain of custody checksums, weighbridge telemetry, and recycler permits
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportESG}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Regional ESG Audit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users Registered"
          value="1,420"
          subtitle="480 Businesses • 940 Citizens"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Verified Recyclers"
          value={`${recyclers.filter((r) => r.verified).length} / ${recyclers.length}`}
          subtitle="Authorized Processing Centers"
          badge="CPCB Licensed"
          badgeType="success"
          icon={<Factory className="w-4 h-4" />}
        />
        <StatCard
          title="Total Tracked Volume"
          value="12.4 Tons"
          subtitle="All municipal streams"
          badge="126 Blocks"
          badgeType="info"
          icon={<Building2 className="w-4 h-4" />}
        />
        <StatCard
          title="Anomaly / Fraud Alerts"
          value={`${alerts.filter((a) => !a.resolved).length} Active`}
          subtitle="Telemetry & Weight Discrepancies"
          badge="Inspection Required"
          badgeType="warning"
          icon={<ShieldAlert className="w-4 h-4" />}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Real-Time Waste Traceability Fraud Radar</h2>
          </div>
          <span className="text-xs text-slate-400">Automated Cross-Verification Protocol</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                alert.resolved
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-amber-50/50 border-amber-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold ${
                      alert.resolved ? 'text-slate-700 line-through' : 'text-amber-950'
                    }`}
                  >
                    {alert.title}
                  </span>
                  <span className="font-mono text-[11px] text-emerald-800 bg-white px-1.5 py-0.5 rounded border">
                    {alert.wasteId}
                  </span>
                  {alert.resolved && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      RESOLVED ✓
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">{alert.detail}</p>
              </div>

              {!alert.resolved && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(`/track/${alert.wasteId}`)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Audit Chain
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolveAlert(alert.id)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-2xs cursor-pointer"
                  >
                    Resolve Alert
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Accredited Recycler Registry</h3>
          <p className="text-xs text-slate-500">
            Verify CPCB licensing, materials authorization, and processing capacities
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Facility Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Accepted Streams</th>
                <th className="py-3 px-4">Available Capacity</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recyclers.map((r) => (
                <tr key={r.recyclerId} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{r.name}</td>
                  <td className="py-3.5 px-4">{r.location}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {r.materialsAccepted.map((m) => (
                        <span key={m} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{r.availableCapacity.toLocaleString()} KG</td>
                  <td className="py-3.5 px-4">
                    {r.verified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Partner
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-[11px] font-medium">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleRecyclerVerification(r.recyclerId)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        r.verified
                          ? 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {r.verified ? 'Revoke' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
