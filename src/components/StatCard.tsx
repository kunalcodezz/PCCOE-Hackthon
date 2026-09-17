import React from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeType?: 'success' | 'info' | 'warning';
}

export const StatCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  icon,
  badge,
  badgeType = 'success',
}) => {
  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
  }[badgeType];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-medium text-slate-500">{title}</span>
        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {badge && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${badgeStyles}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
