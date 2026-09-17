import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Layers,
  Search,
  QrCode,
  Factory,
  ShieldAlert,
  Repeat,
  MapPin,
} from 'lucide-react';

interface Props {
  currentRoute: string;
  navigate: (route: string) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<Props> = ({ currentRoute, navigate, userRole }) => {
  const commonItems = [
    { label: 'Dashboard', route: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'List Waste', route: '/list-waste', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'My Listings', route: '/my-listings', icon: <Package className="w-4 h-4" /> },
    { label: 'Smart Matches', route: '/matches', icon: <Layers className="w-4 h-4" /> },
    { label: 'Waste Map', route: '/map', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Track Waste', route: '/track/WST-PUN-00124', icon: <Search className="w-4 h-4" /> },
    { label: 'Digital Passport', route: '/passport/WST-PUN-00124', icon: <QrCode className="w-4 h-4" /> },
  ];

  const recyclerItems = [
    { label: 'Marketplace', route: '/recycler/marketplace', icon: <Repeat className="w-4 h-4" /> },
    { label: 'Processing Queue', route: '/recycler/processing', icon: <Factory className="w-4 h-4" /> },
  ];

  const adminItems = [
    { label: 'Admin & Fraud Radar', route: '/admin/dashboard', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Generator Portal
          </div>
          <nav className="space-y-1">
            {commonItems.map((item) => {
              const active = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className={active ? 'text-emerald-600' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Recycler Operations Navigation */}
        {(userRole === 'recycler' || userRole === 'admin') && (
          <div>
            <div className="px-3 text-[11px] font-semibold text-purple-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Recycler Hub</span>
              <span className="text-[10px] bg-purple-50 border border-purple-200 text-purple-700 px-1.5 py-0.2 rounded">
                OPS
              </span>
            </div>
            <nav className="space-y-1">
              {recyclerItems.map((item) => {
                const active = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => navigate(item.route)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                      active
                        ? 'bg-purple-50 text-purple-800 font-semibold border border-purple-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className={active ? 'text-purple-600' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Admin Navigation */}
        {userRole === 'admin' && (
          <div>
            <div className="px-3 text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Governance</span>
              <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.2 rounded">
                ADMIN
              </span>
            </div>
            <nav className="space-y-1">
              {adminItems.map((item) => {
                const active = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => navigate(item.route)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                      active
                        ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className={active ? 'text-amber-600' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Sidebar Footer Info */}
      <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-slate-500 font-medium">
          <span>Ledger Protocol</span>
          <span className="text-emerald-700">SHA-256 Merkle</span>
        </div>
        <div>Active Network: Hackathon Demo</div>
      </div>
    </aside>
  );
};
