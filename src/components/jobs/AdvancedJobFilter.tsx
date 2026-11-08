import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IRAQI_GOVERNORATES } from '../../data/mockData';
import { JobType, IraqiGovernorate } from '../../types';
import { Filter, Search, MapPin, Banknote, ShieldCheck, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface AdvancedJobFilterProps {
  onApplyFilters: (filters: {
    governorate: IraqiGovernorate | 'ALL';
    jobType: JobType | 'ALL';
    workMode: 'On-site' | 'Hybrid' | 'Remote' | 'ALL';
    minSalaryIQD: number;
    maxExperienceYears?: number;
    onlyVerifiedSources: boolean;
    sortBy: 'newest' | 'salary' | 'exp';
  }) => void;
}

export const AdvancedJobFilter: React.FC<AdvancedJobFilterProps> = ({ onApplyFilters }) => {
  const { selectedGov, setSelectedGov, selectedJobType, setSelectedJobType } = useApp();

  const [workMode, setWorkMode] = useState<'On-site' | 'Hybrid' | 'Remote' | 'ALL'>('ALL');
  const [minSalaryIQD, setMinSalaryIQD] = useState<number>(0);
  const [maxExpYears, setMaxExpYears] = useState<number | undefined>(undefined);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'salary' | 'exp'>('newest');
  const [showExpanded, setShowExpanded] = useState<boolean>(false);

  const handleApply = () => {
    onApplyFilters({
      governorate: selectedGov,
      jobType: selectedJobType,
      workMode,
      minSalaryIQD,
      maxExperienceYears: maxExpYears,
      onlyVerifiedSources: onlyVerified,
      sortBy,
    });
  };

  const handleReset = () => {
    setSelectedGov('ALL');
    setSelectedJobType('ALL');
    setWorkMode('ALL');
    setMinSalaryIQD(0);
    setMaxExpYears(undefined);
    setOnlyVerified(false);
    setSortBy('newest');
    onApplyFilters({
      governorate: 'ALL',
      jobType: 'ALL',
      workMode: 'ALL',
      minSalaryIQD: 0,
      onlyVerifiedSources: false,
      sortBy: 'newest',
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-right space-y-3 shadow-lg">
      
      {/* Primary Toggle Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowExpanded(!showExpanded)}
          className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>تصفية متقدمة (الفلترة حسب الراتب بالدينار والخبرات)</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">الترتيب:</span>
          <select
            value={sortBy}
            onChange={e => {
              const val = e.target.value as any;
              setSortBy(val);
              onApplyFilters({
                governorate: selectedGov,
                jobType: selectedJobType,
                workMode,
                minSalaryIQD,
                maxExperienceYears: maxExpYears,
                onlyVerifiedSources: onlyVerified,
                sortBy: val,
              });
            }}
            className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 cursor-pointer"
          >
            <option value="newest">الأحدث نشرأ</option>
            <option value="salary">الأعلى راتباً (IQD)</option>
            <option value="exp">الخبرة المطلوبة</option>
          </select>
        </div>
      </div>

      {/* Expanded Filters Drawer */}
      {showExpanded && (
        <div className="pt-3 border-t border-slate-800 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Work Mode */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">نمط الدوام</label>
              <select
                value={workMode}
                onChange={e => setWorkMode(e.target.value as any)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
              >
                <option value="ALL">جميع الأنماط</option>
                <option value="On-site">حضوري في المقر</option>
                <option value="Hybrid">هجين</option>
                <option value="Remote">عن بُعد</option>
              </select>
            </div>

            {/* Min Salary IQD */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">الحد الأدنى للراتب (IQD)</label>
              <select
                value={minSalaryIQD}
                onChange={e => setMinSalaryIQD(Number(e.target.value))}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
              >
                <option value={0}>الكل</option>
                <option value={1000000}>أكثر من 1,000,000 د.ع</option>
                <option value={1500000}>أكثر من 1,500,000 د.ع</option>
                <option value={2000000}>أكثر من 2,000,000 د.ع</option>
                <option value={2500000}>أكثر من 2,500,000 د.ع</option>
              </select>
            </div>

            {/* Max Experience Years */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">سنوات الخبرة القصوى</label>
              <select
                value={maxExpYears === undefined ? 'ALL' : maxExpYears}
                onChange={e => setMaxExpYears(e.target.value === 'ALL' ? undefined : Number(e.target.value))}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
              >
                <option value="ALL">بدون تحديد</option>
                <option value={1}>خريج جديد / سنة واحدة</option>
                <option value={3}>3 سنوات أو أقل</option>
                <option value={5}>5 سنوات أو أقل</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={e => setOnlyVerified(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-emerald-500"
              />
              <span className="flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                إظهار وظائف الشركات الموثقة رسمياً فقط
              </span>
            </label>

            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة ضبط</span>
              </button>

              <button
                onClick={handleApply}
                className="px-5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-lg shadow-md"
              >
                تطبيق الفلاتر
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
