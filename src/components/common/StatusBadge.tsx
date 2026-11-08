import React from 'react';
import { ApplicationStatus, JobType, VerificationStatus } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, ShieldAlert, Building2 } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Verified':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>شركة موثقة رسمياً</span>
        </span>
      );
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
          <Clock className="w-3.5 h-3.5" />
          <span>قيد التوثيق الإداري</span>
        </span>
      );
    case 'Rejected':
    case 'Suspended':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>غير معتمدة</span>
        </span>
      );
    default:
      return null;
  }
};

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
  const styles: Record<ApplicationStatus, string> = {
    'Submitted': 'text-blue-400 bg-blue-950/50 border-blue-800/40',
    'Under Review': 'text-amber-400 bg-amber-950/50 border-amber-800/40',
    'Shortlisted': 'text-purple-400 bg-purple-950/50 border-purple-800/40',
    'Interview': 'text-cyan-400 bg-cyan-950/50 border-cyan-800/40',
    'Accepted': 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40',
    'Rejected': 'text-rose-400 bg-rose-950/50 border-rose-800/40',
    'Withdrawn': 'text-slate-400 bg-slate-900 border-slate-700',
  };

  const labels: Record<ApplicationStatus, string> = {
    'Submitted': 'تم الإرسال',
    'Under Review': 'قيد المراجعة',
    'Shortlisted': 'في القائمة القصيرة',
    'Interview': 'مقابلة عمل',
    'Accepted': 'مقبول للعمل 🎉',
    'Rejected': 'غير موفق',
    'Withdrawn': 'مسترد',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border ${styles[status]}`}>
      <span>{labels[status]}</span>
    </span>
  );
};

interface JobTypeBadgeProps {
  type: JobType;
}

export const JobTypeBadge: React.FC<JobTypeBadgeProps> = ({ type }) => {
  const isGov = type === 'Government';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded ${
      isGov
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        : 'bg-slate-800 text-slate-300 border border-slate-700'
    }`}>
      {isGov && <Building2 className="w-3 h-3 text-emerald-400" />}
      <span>{type === 'Government' ? 'وظيفة حكومية' : type === 'Full-Time' ? 'دوام كامل' : type === 'Part-Time' ? 'دوام جزئي' : type === 'Internship' ? 'تدريب' : 'عمل حر'}</span>
    </span>
  );
};
