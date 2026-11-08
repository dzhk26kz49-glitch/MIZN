import React from 'react';
import { Job } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateJobMatch } from '../../utils/aiMatcher';
import { MatchBadge } from '../common/MatchBadge';
import { JobTypeBadge, VerificationBadge } from '../common/StatusBadge';
import { MapPin, Building2, Bookmark, BookmarkCheck, Banknote, Calendar, ArrowUpRight } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  const { currentUser, savedJobIds, toggleSaveJob } = useApp();
  const isSaved = savedJobIds.includes(job.id);
  const matchResult = calculateJobMatch(currentUser, job);

  const formattedMin = job.salaryRangeIQD.min.toLocaleString('ar-IQ');
  const formattedMax = job.salaryRangeIQD.max.toLocaleString('ar-IQ');

  return (
    <div
      onClick={() => onSelect(job)}
      className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg flex flex-col justify-between space-y-4 relative"
    >
      <div className="space-y-3">
        {/* Top bar on card: Company & Save Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-emerald-400 text-lg shadow-inner shrink-0">
              {job.companyName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="font-medium text-slate-300">{job.companyName}</span>
                {job.isVerifiedSource && <VerificationBadge status="Verified" />}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
            className={`p-2 rounded-xl transition-colors ${
              isSaved
                ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isSaved ? 'إزالة من الوظائف المحفوظة' : 'حفظ الوظيفة'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* AI Match Badge */}
        <div className="flex items-center justify-between border-y border-slate-800/80 py-2">
          <MatchBadge matchResult={matchResult} />
          <JobTypeBadge type={job.jobType} />
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {job.description}
        </p>

        {/* Required Skills list */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.requiredSkills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span className="text-[10px] text-slate-500 self-center">
              +{job.requiredSkills.length - 4} أكثر
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Governorate & Salary in IQD */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{job.governorate}</span>
          <span className="text-slate-600">•</span>
          <span>{job.workMode}</span>
        </div>

        {job.salaryRangeIQD.showSalary ? (
          <div className="flex items-center gap-1 font-semibold text-emerald-400 text-xs">
            <Banknote className="w-3.5 h-3.5" />
            <span>{formattedMin} - {formattedMax} د.ع</span>
          </div>
        ) : (
          <span className="text-slate-500">الراتب عند المقابلة</span>
        )}
      </div>

    </div>
  );
};
