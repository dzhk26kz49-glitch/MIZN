import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VerificationBadge, ApplicationStatusBadge } from '../common/StatusBadge';
import { ApplicationStatus } from '../../types';
import { Building2, Plus, FileText, CheckCircle2, Clock, Users, ShieldAlert, Upload, ExternalLink, Filter } from 'lucide-react';

interface EmployerDashboardProps {
  onOpenPostJob: () => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onOpenPostJob }) => {
  const {
    currentCompany,
    companies,
    jobs,
    applications,
    updateApplicationStatus,
    submitCompanyVerificationDoc,
    updateJobStatus,
  } = useApp();

  const safeCompany = currentCompany || companies[0];

  const [selectedJobIdFilter, setSelectedJobIdFilter] = useState<string>('ALL');
  const [docInput, setDocInput] = useState('');
  const [showDocUpload, setShowDocUpload] = useState(false);

  const companyJobs = jobs.filter(j => j.companyId === safeCompany.id || safeCompany.members.includes(j.companyId));
  const companyJobIds = companyJobs.map(j => j.id);

  const companyApps = applications.filter(a =>
    selectedJobIdFilter === 'ALL'
      ? companyJobIds.includes(a.jobId)
      : a.jobId === selectedJobIdFilter
  );

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docInput.trim()) return;
    submitCompanyVerificationDoc(safeCompany.id, docInput);
    setShowDocUpload(false);
    setDocInput('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-right">
      
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-3xl text-emerald-400 shadow-inner">
            {safeCompany.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-100">{safeCompany.name}</h1>
              <VerificationBadge status={safeCompany.verificationStatus} />
            </div>
            <p className="text-xs text-slate-400">
              قطاع: <span className="text-slate-200">{safeCompany.sector}</span> • المحافظة: <span className="text-slate-200">{safeCompany.governorate}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {safeCompany.verificationStatus !== 'Verified' && (
            <button
              onClick={() => setShowDocUpload(!showDocUpload)}
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>تقديم مستند التوثيق التجاري (C.R)</span>
            </button>
          )}

          <button
            onClick={onOpenPostJob}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة إعلان وظيفة جديد</span>
          </button>
        </div>
      </div>

      {/* Verification Document Upload Form Modal */}
      {showDocUpload && (
        <form onSubmit={handleDocSubmit} className="p-5 bg-amber-950/30 border border-amber-500/30 rounded-2xl space-y-3">
          <h3 className="font-bold text-sm text-amber-300">رفع السجل التجاري أو مستند تأسيس الشركة في العراق</h3>
          <p className="text-xs text-slate-400">
            أدخل رابط المستند الرسمي (PDF / صورة السجل) لمراجعته من قبل إدارة منصة MIZN وإتاحة شارة التوثيق.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={docInput}
              onChange={e => setDocInput(e.target.value)}
              placeholder="https://drive.google.com/doc/registry.pdf..."
              className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
            />
            <button type="submit" className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl">
              إرسال للتوثيق
            </button>
          </div>
        </form>
      )}

      {/* Company Posted Jobs & Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Posted Jobs Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>الوظائف المنشورة ({companyJobs.length})</span>
            </h2>
          </div>

          <div className="space-y-3">
            {companyJobs.map(j => (
              <div
                key={j.id}
                className={`p-4 bg-slate-900 border rounded-2xl space-y-2 transition-all ${
                  selectedJobIdFilter === j.id ? 'border-emerald-500 bg-slate-900/90 shadow-md' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{j.title}</h3>
                    <span className="text-[11px] text-slate-400">{j.governorate} • {j.jobType}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    j.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {j.status === 'Active' ? 'نشط' : 'مغلق'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => setSelectedJobIdFilter(selectedJobIdFilter === j.id ? 'ALL' : j.id)}
                    className="text-xs text-emerald-400 font-semibold hover:underline"
                  >
                    عرض المتقدمين ({applications.filter(a => a.jobId === j.id).length})
                  </button>

                  <button
                    onClick={() => updateJobStatus(j.id, j.status === 'Active' ? 'Closed' : 'Active')}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    {j.status === 'Active' ? 'إيقاف الإعلان' : 'إعادة تفعيل'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applicants Management Pipeline (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>إدارة طلبيات التقديم والمتقدمين ({companyApps.length})</span>
            </h2>

            {selectedJobIdFilter !== 'ALL' && (
              <button
                onClick={() => setSelectedJobIdFilter('ALL')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                إلغاء تصفية الوظيفة ✕
              </button>
            )}
          </div>

          <div className="space-y-3">
            {companyApps.length === 0 ? (
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
                <Users className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">لا توجد طلبات تقديم حالياً لهذه الوظيفة.</p>
              </div>
            ) : (
              companyApps.map(app => (
                <div key={app.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{app.candidateName}</h3>
                      <p className="text-xs text-slate-400">{app.candidateEmail} • {app.candidatePhone || 'لا يوجد رقم'}</p>
                      <p className="text-[11px] text-emerald-400 font-medium mt-0.5">متقدم لوظيفة: {app.jobTitle}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-400 block">مطابقة AI</span>
                        <span className="font-bold text-xs text-emerald-400">{app.matchScore}%</span>
                      </div>
                      <ApplicationStatusBadge status={app.status} />
                    </div>
                  </div>

                  {app.coverNote && (
                    <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs text-slate-300">
                      <span className="font-bold text-slate-400 block mb-0.5">رسالة المتقدم:</span>
                      <p>{app.coverNote}</p>
                    </div>
                  )}

                  {/* Change Status Pipeline Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-slate-400 font-semibold">تغيير حالة الطلب:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(['Under Review', 'Shortlisted', 'Interview', 'Accepted', 'Rejected'] as ApplicationStatus[]).map(st => (
                        <button
                          key={st}
                          onClick={() => updateApplicationStatus(app.id, st)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                            app.status === st
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {st === 'Under Review' ? 'قيد المراجعة' : st === 'Shortlisted' ? 'القائمة القصيرة' : st === 'Interview' ? 'مقابلة' : st === 'Accepted' ? 'قبول' : 'رفض'}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
