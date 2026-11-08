import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VerificationBadge } from '../common/StatusBadge';
import { VerificationStatus } from '../../types';
import {
  ShieldCheck,
  Building2,
  Users,
  Briefcase,
  FileText,
  Activity,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    companies,
    updateCompanyVerification,
    jobs,
    updateJobStatus,
    applications,
    auditLogs,
    aiTokensUsed,
  } = useApp();

  const [activeAdminSubtab, setActiveAdminSubtab] = useState<'verifications' | 'jobs' | 'audit' | 'ai'>('verifications');

  const pendingCompanies = companies.filter(c => c.verificationStatus === 'Pending');
  const activeJobsCount = jobs.filter(j => j.status === 'Active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      
      {/* Super Admin Title & KPI Cards */}
      <div className="p-8 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>لوحة الإدارة العليا وإدارة النظام - Super Admin Console</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">System Integrity: 100% OK</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          مراقبة المنصة، التوثيق الرسمي للشركات، والسجلات الأمنية
        </h1>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-1">الشركات بانتظار التوثيق:</span>
            <span className="text-2xl font-black text-amber-400">{pendingCompanies.length}</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-1">إعلانات الوظائف النشطة:</span>
            <span className="text-2xl font-black text-emerald-400">{activeJobsCount}</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-1">طلبات التقديم المنجزة:</span>
            <span className="text-2xl font-black text-cyan-400">{applications.length}</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-1">استهلاك رمُوز AI (Tokens):</span>
            <span className="text-2xl font-black text-purple-400">{aiTokensUsed.toLocaleString('ar-IQ')}</span>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-xl p-1 max-w-xl">
        <button
          onClick={() => setActiveAdminSubtab('verifications')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeAdminSubtab === 'verifications' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          توثيق الشركات ({pendingCompanies.length})
        </button>

        <button
          onClick={() => setActiveAdminSubtab('jobs')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeAdminSubtab === 'jobs' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          إدارة الوظائف ({jobs.length})
        </button>

        <button
          onClick={() => setActiveAdminSubtab('audit')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeAdminSubtab === 'audit' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          سجلات الأمان (Audit Logs)
        </button>
      </div>

      {/* Subtab 1: Company Verifications Queue */}
      {activeAdminSubtab === 'verifications' && (
        <div className="space-y-4">
          <h2 className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>قائمة مراجعة السجلات التجارية وتوثيق الشركات</span>
          </h2>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-4">اسم الشركة</th>
                    <th className="p-4">المحافظة</th>
                    <th className="p-4">القطاع</th>
                    <th className="p-4">مستند التوثيق</th>
                    <th className="p-4">الحالة الحالية</th>
                    <th className="p-4 text-center">الإجراء الإداري</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {companies.map(c => (
                    <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-bold text-slate-100">{c.name}</td>
                      <td className="p-4">{c.governorate}</td>
                      <td className="p-4">{c.sector}</td>
                      <td className="p-4">
                        {c.verificationDocumentUrl ? (
                          <a
                            href={c.verificationDocumentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 underline font-medium flex items-center gap-1"
                          >
                            <span>عرض المستند</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-500">لم يرفع مستند بعد</span>
                        )}
                      </td>
                      <td className="p-4">
                        <VerificationBadge status={c.verificationStatus} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateCompanyVerification(c.id, 'Verified', 'تمت مطابقة السجل التجاري بنجاح')}
                            className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold text-[11px]"
                          >
                            اعتماد وتوثيق ✓
                          </button>

                          <button
                            onClick={() => updateCompanyVerification(c.id, 'Rejected', 'مستند غير مكتمل أو غير مطابق')}
                            className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded-lg font-bold text-[11px]"
                          >
                            رفض ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Jobs Moderation */}
      {activeAdminSubtab === 'jobs' && (
        <div className="space-y-4">
          <h2 className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <span>إدارة وتدقيق إعلانات الوظائف المنشورة</span>
          </h2>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-4">عنوان الوظيفة</th>
                    <th className="p-4">الشركة</th>
                    <th className="p-4">المحافظة</th>
                    <th className="p-4">تاريخ النشر</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {jobs.map(j => (
                    <tr key={j.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-bold text-slate-100">{j.title}</td>
                      <td className="p-4">{j.companyName}</td>
                      <td className="p-4">{j.governorate}</td>
                      <td className="p-4">{j.postedAt}</td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          j.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {j.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => updateJobStatus(j.id, j.status === 'Active' ? 'Suspended' : 'Active')}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold"
                        >
                          {j.status === 'Active' ? 'تعليق الإعلان' : 'إعادة تفعيل'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Audit Logs */}
      {activeAdminSubtab === 'audit' && (
        <div className="space-y-4">
          <h2 className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-400" />
            <span>سجلات الأحداث الأمنية والإدارية (Audit & Security Logs)</span>
          </h2>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4 space-y-3">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">{log.action}</span>
                    <span className="text-slate-400">• {log.actorName}</span>
                  </div>
                  <p className="text-slate-300 mt-1">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500 dir-ltr font-mono">{new Date(log.timestamp).toLocaleTimeString('en-US')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
