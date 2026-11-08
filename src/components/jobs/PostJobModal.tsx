import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IRAQI_GOVERNORATES } from '../../data/mockData';
import { JobType, IraqiGovernorate } from '../../types';
import { X, Building2, MapPin, Banknote, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface PostJobModalProps {
  onClose: () => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ onClose }) => {
  const { addJob, currentCompany } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState<JobType>('Full-Time');
  const [workMode, setWorkMode] = useState<'On-site' | 'Hybrid' | 'Remote'>('On-site');
  const [governorate, setGovernorate] = useState<IraqiGovernorate>('بغداد (Baghdad)');
  const [city, setCity] = useState('');
  const [experienceYears, setExperienceYears] = useState(2);
  const [minSalary, setMinSalary] = useState(1200000);
  const [maxSalary, setMaxSalary] = useState(2000000);
  const [showSalary, setShowSalary] = useState(true);
  const [vacancies, setVacancies] = useState(1);
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Tailwind');
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('بناء الواجهات, تحسين الأداء, اختبار الكود');
  const [sourceType, setSourceType] = useState<'Private Verified' | 'Direct Employer' | 'Government'>('Private Verified');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const responsibilities = responsibilitiesInput.split(',').map(s => s.trim()).filter(Boolean);

    addJob({
      companyId: currentCompany?.id || 'comp-1',
      companyName: currentCompany?.name || 'شركة عراقية موثقة',
      companyLogo: currentCompany?.logoUrl,
      title,
      description,
      responsibilities,
      qualifications: ['خبرة عملية متطابقة', 'التزام بالدقة ومواعيد التسليم'],
      requiredSkills: skills,
      experienceYears,
      jobType,
      workMode,
      governorate,
      city: city || 'المركز',
      salaryRangeIQD: {
        min: minSalary,
        max: maxSalary,
        showSalary
      },
      vacancies,
      isVerifiedSource: currentCompany?.verificationStatus === 'Verified',
      sourceType,
      expiresAt: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-100">نشر إعلان وظيفة جديد</h2>
              <p className="text-xs text-slate-400">إعلان رسمي على منصة MIZN للوصول لأجود الكفاءات العراقية</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-right">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان الوظيفة *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="مثال: Senior React Developer / مهندس صيانة حاسبات"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">نوع الوظيفة</label>
              <select
                value={jobType}
                onChange={e => setJobType(e.target.value as JobType)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              >
                <option value="Full-Time">دوام كامل (Full-Time)</option>
                <option value="Part-Time">دوام جزئي (Part-Time)</option>
                <option value="Government">وظيفة حكومية (Government)</option>
                <option value="Internship">تدريب صيفي (Internship)</option>
                <option value="Freelance">عمل حر (Freelance)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">نمط العمل</label>
              <select
                value={workMode}
                onChange={e => setWorkMode(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              >
                <option value="On-site">حضوري في المقر (On-site)</option>
                <option value="Hybrid">هجين (Hybrid)</option>
                <option value="Remote">عن بعد (Remote)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المحافظة العراقية</label>
              <select
                value={governorate}
                onChange={e => setGovernorate(e.target.value as IraqiGovernorate)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              >
                {IRAQI_GOVERNORATES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المنطقة / المدينة</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="مثال: المنصور / عنكاوا / الكرادة"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>
          </div>

          {/* Salary in IQD */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">نطاق الراتب بالدينار العراقي (IQD)</span>
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSalary}
                  onChange={e => setShowSalary(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500"
                />
                <span>إظهار الراتب للإعلان</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">الحد الأدنى (د.ع)</span>
                <input
                  type="number"
                  step={100000}
                  value={minSalary}
                  onChange={e => setMinSalary(Number(e.target.value))}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">الحد الأقصى (د.ع)</span>
                <input
                  type="number"
                  step={100000}
                  value={maxSalary}
                  onChange={e => setMaxSalary(Number(e.target.value))}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">المهارات المطلوبة (مفصولة بفارزة)</label>
            <input
              type="text"
              value={skillsInput}
              onChange={e => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, PostgreSQL, Figma..."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">الوصف التفصيلي والشروط *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="اكتب وصف الوظيفة والمتطلبات الأكاديمية والعملية بالتفصيل..."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/40"
            >
              نشر الوظيفة فوراً
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
