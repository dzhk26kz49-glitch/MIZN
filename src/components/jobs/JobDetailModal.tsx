import React, { useState } from 'react';
import { Job } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateJobMatch } from '../../utils/aiMatcher';
import { VerificationBadge, JobTypeBadge } from '../common/StatusBadge';
import { MatchBadge } from '../common/MatchBadge';
import {
  X,
  MapPin,
  Building2,
  Calendar,
  Banknote,
  CheckCircle2,
  Briefcase,
  Send,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  const { currentUser, applications, applyToJob, addNotification } = useApp();
  const [coverNote, setCoverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [reported, setReported] = useState(false);

  const existingApp = applications.find(
    a => a.jobId === job.id && a.candidateId === currentUser.id
  );

  const matchResult = calculateJobMatch(currentUser, job);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const success = applyToJob(job.id, coverNote);
      setIsSubmitting(false);
      if (success) {
        setSubmittedSuccess(true);
      }
    }, 600);
  };

  const handleReport = () => {
    setReported(true);
    addNotification(
      'تم إرسال البلاغ',
      `تم استلام بلاغك بشأن الوظيفة "${job.title}" وسيقوم فريق الأمن الإداري بمراجعتها`,
      'SYSTEM'
    );
  };

  const formattedMin = job.salaryRangeIQD.min.toLocaleString('ar-IQ');
  const formattedMax = job.salaryRangeIQD.max.toLocaleString('ar-IQ');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-8 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-2xl text-emerald-400 shadow-inner">
              {job.companyName.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-100">{job.title}</h2>
                {job.isVerifiedSource && <VerificationBadge status="Verified" />}
              </div>
              <p className="text-sm font-semibold text-slate-300">{job.companyName}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {job.governorate} ({job.city})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  {job.workMode}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  الخبرة المطلوبة: {job.experienceYears} سنوات
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Key Quick Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">الراتب المتوقع (IQD):</span>
              <span className="font-bold text-emerald-400 text-sm">
                {job.salaryRangeIQD.showSalary ? `${formattedMin} - ${formattedMax} د.ع` : 'يحدد عند المقابلة'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">عدد الشواغر:</span>
              <span className="font-bold text-slate-100 text-sm">{job.vacancies} وظائف</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">الموعد النهائي للتقديم:</span>
              <span className="font-bold text-slate-100 text-sm">{job.expiresAt}</span>
            </div>
          </div>

          {/* AI Match Overview Card */}
          <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950 p-4 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs text-emerald-300">تحليل الملاءمة الذكي لملفك الشخصي</span>
              </div>
              <MatchBadge matchResult={matchResult} />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              تتطابق مهاراتك مع {matchResult.matchingSkills.length} من أصل {job.requiredSkills.length} مهارة رئيسية مطلوبة لهذه الوظيفة.
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-sm text-slate-200 mb-2">الوصف الوظيفي</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-slate-200 mb-2">المهام والمسؤوليات الرئيسية</h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills & Qualifications */}
          <div>
            <h3 className="font-bold text-sm text-slate-200 mb-2">المهارات المطلوبة</h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((s, i) => (
                <span key={i} className="text-xs bg-slate-950 text-slate-200 border border-slate-800 px-3 py-1 rounded-lg">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Application Form or Status */}
          <div className="pt-4 border-t border-slate-800">
            {existingApp || submittedSuccess ? (
              <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-300">تم تقديم الطلب بنجاح!</h4>
                <p className="text-xs text-slate-400">
                  حالة الطلب الحالية: <span className="font-bold text-slate-200">{existingApp?.status || 'Submitted'}</span>. يمكنك متابعة التحديثات من لوحة حسابك.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <h3 className="font-bold text-sm text-slate-200">التقديم الفوري على الوظيفة</h3>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    رسالة تعريفية / ملاحظة موجهة لشركة {job.companyName} (اختياري):
                  </label>
                  <textarea
                    rows={3}
                    value={coverNote}
                    onChange={e => setCoverNote(e.target.value)}
                    placeholder="بيّن لماذا تعتبر نفسك المرشح الأنسب وتلخيص خبرتك الميدانية..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleReport}
                    disabled={reported}
                    className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{reported ? 'تم الإبلاغ' : 'الإبلاغ عن إعلان غير مطابق'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال طلب التقديم الآن'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
