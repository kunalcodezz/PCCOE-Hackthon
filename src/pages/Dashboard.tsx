import React, { useState } from 'react';
import { User, WasteListing } from '../types';
import { wasteStore } from '../services/wasteService';
import { StatCard } from '../components/StatCard';
import { WasteStatusBadge } from '../components/WasteStatusBadge';
import {
  Package,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

interface Props {
  currentUser: User;
  navigate: (route: string) => void;
}

export const Dashboard: React.FC<Props> = ({ currentUser, navigate }) => {
  const listings = wasteStore.getListings();
  const allEvents = wasteStore.getLifecycleEvents('WST-PUN-00124');
  const stats = wasteStore.getPlatformStats();

  // Filter listings based on role (or show all for demo richness)
  const userListings = listings.filter(
    (l) => l.ownerId === currentUser.uid || currentUser.role === 'admin'
  );
  const displayListings = userListings.length > 0 ? userListings : listings;

  // Chart data: Categories
  const categoryCountMap: Record<string, number> = {};
  for (const l of displayListings) {
    const kg = l.unit === 'Tons' ? l.quantity * 1000 : l.quantity;
    categoryCountMap[l.category] = (categoryCountMap[l.category] || 0) + kg;
  }
  const categoryChartData = Object.entries(categoryCountMap).map(([name, value]) => ({
    name,
    weightKg: value,
  }));

  // Chart data: Monthly recycling recovery trend
  const monthlyData = [
    { month: 'May', listed: 420, recycled: 280, diverted: 320 },
    { month: 'Jun', listed: 650, recycled: 490, diverted: 540 },
    { month: 'Jul', listed: 890, recycled: 670, diverted: 780 },
    { month: 'Aug', listed: 1120, recycled: 840, diverted: 980 },
    { month: 'Sep', listed: 1480, recycled: 1120, diverted: 1350 },
  ];

  // Colors for charts
  const PIE_COLORS = ['#059669', '#0284c7', '#8b5cf6', '#f59e0b', '#10b981', '#64748b'];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Welcome back, {currentUser.name}
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
              {currentUser.role}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {currentUser.companyName ? `${currentUser.companyName} • ` : ''}
            {currentUser.location} • Real-time Circular Resource Dashboard
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => navigate('/list-waste')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Waste (AI Scan)</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Waste Listed"
          value={`${(stats.totalWasteKg).toLocaleString()} KG`}
          subtitle="Registered batches"
          badge="+18% MoM"
          icon={<Package className="w-4 h-4" />}
        />
        <StatCard
          title="Waste Recycled"
          value={`${stats.recycledKg.toLocaleString()} KG`}
          subtitle="Closed-loop verified"
          badge="Verified ✓"
          badgeType="success"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
        <StatCard
          title="Diverted from Landfill"
          value={`${stats.divertedKg.toLocaleString()} KG`}
          subtitle="Avoided methane emissions"
          badge="78% Rate"
          badgeType="info"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          title="Active Batches"
          value={displayListings.length.toString()}
          subtitle="Cataloged in ledger"
          badge="Live"
          badgeType="info"
          icon={<Package className="w-4 h-4" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Recovery Trend */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Recycling &amp; Diversion Trends</h3>
              <p className="text-xs text-slate-500">KG recovery over previous 5 months (Sample prototype data)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                Diverted
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                Recycled
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDiverted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRecycled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="diverted" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorDiverted)" />
                <Area type="monotone" dataKey="recycled" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorRecycled)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Material Distribution Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Material Stream Share</h3>
            <p className="text-xs text-slate-500 mb-4">Volume breakdown across registered categories</p>
          </div>

          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="weightKg"
                >
                  {categoryChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} KG`, 'Volume']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-slate-700">Total</span>
              <span className="text-[11px] text-slate-400">KG Net</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
            {categoryChartData.slice(0, 4).map((c, idx) => (
              <div key={c.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                <span className="truncate font-medium">{c.name}</span>
                <span className="text-slate-400 text-[11px]">({c.weightKg}k)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Waste Listings Table & Quick Links */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Tracked Waste Batches</h3>
            <p className="text-xs text-slate-500">Live custody and verifiable status</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/my-listings')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({displayListings.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Waste ID</th>
                <th className="py-3 px-4">Material &amp; Category</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Recycler Partner</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Passport Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">
                    {listing.wasteId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900">{listing.material}</div>
                    <div className="text-[11px] text-slate-500">{listing.category}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {listing.quantity} {listing.unit}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {listing.recyclerName || <span className="text-amber-600 font-medium">Pending match</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    <WasteStatusBadge status={listing.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/track/${listing.wasteId}`)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Track
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/passport/${listing.wasteId}`)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer font-medium"
                    >
                      Passport
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
