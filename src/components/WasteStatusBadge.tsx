import React from 'react';
import { WasteLifecycleStatus } from '../types';
import {
  Sparkles,
  CheckCircle2,
  Truck,
  RotateCw,
  Factory,
  PackageCheck,
  Repeat,
  Layers,
} from 'lucide-react';

interface Props {
  status: WasteLifecycleStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const WasteStatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const config: Record<
    WasteLifecycleStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    GENERATED: {
      label: 'Generated',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    MATCHED: {
      label: 'Matched',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    COLLECTED: {
      label: 'Collected',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <PackageCheck className="w-3.5 h-3.5" />,
    },
    TRANSPORTED: {
      label: 'In Transit',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    RECEIVED: {
      label: 'Facility Inbound',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <Factory className="w-3.5 h-3.5" />,
    },
    PROCESSED: {
      label: 'Processing',
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      icon: <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />,
    },
    RECYCLED: {
      label: 'Recycled',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    REUSED: {
      label: 'Circular Reuse',
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-300',
      icon: <Repeat className="w-3.5 h-3.5" />,
    },
  };

  const item = config[status] || config.GENERATED;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-medium px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${item.bg} ${item.text} ${item.border} ${sizeClasses} whitespace-nowrap`}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
};
