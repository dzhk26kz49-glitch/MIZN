import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityType } from '../../types';
import { VerificationBadge } from '../common/StatusBadge';
import { Compass, GraduationCap, Calendar, MapPin, ExternalLink, ShieldCheck, Filter } from 'lucide-react';

export const OpportunitiesSection: React.FC = () => {
  const { opportunities } = useApp();
  const [selectedType, setSelectedType] = useState<OpportunityType | 'ALL'>('ALL');

  const filteredOpportunities = opportunities.filter(op =>
    selectedType === 'ALL' ? true : op.type === selectedType
  );

  const typesList: { type: OpportunityType | 'ALL'; label: string }[] = [
    { type: 'ALL', label: 'جميع الفرص والمنح' },
    { type: 'Scholarship', label: 'منح دراسية 🎓' },
    { type: 'Internship', label: 'تدريب صيفي 💼' },
    { type: 'Fellowship', label: 'زمالات وحاضنات 🚀' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      
      {/* Intro Header */}
      <div className="p-8 bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-950 border border-teal-500/30 rounded-3xl space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded-full text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>قسم MIZN OPPORTUNITIES للفرص والمنح والبرامج المعتمدة</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
          استكشف المنح الدراسية وحاضنات الأعمال وفرص التدريب الصيفي
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          فرص موثقة رسمياً موجهة للطلاب والخريجين الجدد في العراق والدول العربية والمبادرات العالمية.
        </p>

        {/* Filter Segmented Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          {typesList.map(item => (
            <button
              key={item.type}
              onClick={() => setSelectedType(item.type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                selectedType === item.type
                  ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpportunities.map(op => (
          <div
            key={op.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-teal-500/40 transition-all shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-teal-400 bg-teal-950/60 border border-teal-500/30 px-3 py-1 rounded-lg">
                  {op.type === 'Scholarship' ? 'منحة دراسية' : op.type === 'Internship' ? 'تدريب عملي' : 'زمالة دراسية'}
                </span>

                {op.isVerified && <VerificationBadge status="Verified" />}
              </div>

              <h3 className="font-extrabold text-base text-slate-100">{op.title}</h3>
              <p className="text-xs font-semibold text-slate-300">{op.organization}</p>

              <p className="text-xs text-slate-400 leading-relaxed">
                {op.description}
              </p>

              <div className="space-y-1 pt-1">
                <span className="text-xs font-semibold text-slate-200 block">شروط التقديم الرئيسية:</span>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {op.eligibility.map((el, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-teal-400 font-bold">•</span>
                      <span>{el}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Opportunity Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-1 text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>{op.country} {op.city ? `(${op.city})` : ''}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>الموعد النهائي: {op.deadline}</span>
                </div>
              </div>

              <a
                href={op.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <span>رابط التقديم المباشر</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
