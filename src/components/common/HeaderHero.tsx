import React from 'react';
import { useApp } from '../../context/AppContext';
import { IRAQI_GOVERNORATES } from '../../data/mockData';
import { JobType, IraqiGovernorate } from '../../types';
import { Search, MapPin, Briefcase, Filter, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export const HeaderHero: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedGov,
    setSelectedGov,
    selectedJobType,
    setSelectedJobType,
    jobs,
    companies,
    opportunities,
  } = useApp();

  const activeJobsCount = jobs.filter(j => j.status === 'Active').length;
  const verifiedCompaniesCount = companies.filter(c => c.verificationStatus === 'Verified').length;

  const jobTypesList: { type: JobType | 'ALL'; label: string }[] = [
    { type: 'ALL', label: 'كافة الوظائف' },
    { type: 'Full-Time', label: 'دوام كامل' },
    { type: 'Government', label: 'حكومية 🏛️' },
    { type: 'Internship', label: 'تدريب صيفي 🎓' },
    { type: 'Freelance', label: 'عمل حر 💻' },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 border-b border-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Soft Radial Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10 text-center">
        
        {/* Main Headline */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>محرك التوظيف والمطابقة الذكية الأحدث في العراق</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
            ابنِ مستقبلك المهني مع منصة <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">مُزْن | MIZN</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
            المنصة الوطنية الشاملة للربط بين الباحثين عن عمل، والطلاب، والشركات الموثوقة. مطابقة ذكية، سير ذاتية احترافية، ودورات تدريبية متوافقة مع سوق العمل.
          </p>
        </div>

        {/* Live Platform Proof Counters */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>{activeJobsCount} فرصة عمل شاغرة اليوم</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{verifiedCompaniesCount} شركة عراقية موثقة</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>تحليل مطابقة AI فورية</span>
          </div>
        </div>

        {/* Search & Filter Container */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-2xl space-y-3 text-right">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-7 relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث بعنوان الوظيفة، المهارة، أو اسم الشركة (مثال: مطور React، محسب، بغداد)..."
                className="w-full pr-10 pl-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 placeholder:text-slate-500 transition-colors"
              />
            </div>

            {/* Iraqi Governorate Dropdown */}
            <div className="sm:col-span-5 relative">
              <MapPin className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3.5" />
              <select
                value={selectedGov}
                onChange={e => setSelectedGov(e.target.value as IraqiGovernorate | 'ALL')}
                className="w-full pr-10 pl-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="ALL">جميع المحافظات العراقية</option>
                {IRAQI_GOVERNORATES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Type Segmented Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap pl-2">نوع الوظيفة:</span>
            {jobTypesList.map(item => {
              const active = selectedJobType === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => setSelectedJobType(item.type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
