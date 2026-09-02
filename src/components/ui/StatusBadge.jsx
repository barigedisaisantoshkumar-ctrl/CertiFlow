import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, PlayCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

export function StatusBadge({ status, type = 'internship' }) {
  if (!status) return null;

  const normalized = status.toUpperCase();

  const configs = {
    // Internship statuses
    UPCOMING: {
      label: 'Upcoming',
      icon: Clock,
      style: 'bg-amber-50 text-amber-700 border-amber-200/60',
    },
    ACTIVE: {
      label: 'Active',
      icon: PlayCircle,
      style: 'bg-sky-50 text-brand-600 border-sky-200/80',
    },
    COMPLETED: {
      label: 'Completed',
      icon: CheckCircle2,
      style: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    // Certificate statuses
    VALID: {
      label: 'Valid Certificate',
      icon: ShieldCheck,
      style: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    },
    REVOKED: {
      label: 'Revoked Certificate',
      icon: ShieldAlert,
      style: 'bg-rose-50 text-rose-700 border-rose-300',
    },
  };

  const config = configs[normalized] || {
    label: status,
    icon: AlertTriangle,
    style: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const Icon = config.icon;

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-2xs',
      config.style
    )}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
