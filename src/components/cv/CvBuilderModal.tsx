import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CvBuilderData } from '../../types';
import { jsPDF } from 'jspdf';
import { X, FileText, Download, Printer, Plus, Trash2, CheckCircle2, User, GraduationCap, Briefcase } from 'lucide-react';

interface CvBuilderModalProps {
  onClose: () => void;
}

export const CvBuilderModal: React.FC<CvBuilderModalProps> = ({ onClose }) => {
  const { currentUser, updateUserProfile } = useApp();

  const [cvData, setCvData] = useState<CvBuilderData>(() => {
    return (
      currentUser.cvData || {
        fullName: currentUser.name || 'على حسين العبيدي',
        jobTitle: currentUser.title || 'Senior Software Engineer',
        email: currentUser.email || 'ali.hassan@mizn.iq',
        phone: currentUser.phone || '+964 770 123 4567',
        governorate: currentUser.governorate || 'بغداد (Baghdad)',
        summary: currentUser.bio || 'مطور برمجيات ذو خبرة في بناء تطبيقات الويب عالية الأداء وقابلة للتطوير.',
        experience: [
          {
            id: 'exp-1',
            company: 'شركة دجلة للحلول البرمجية',
            position: 'Frontend Engineer',
            startDate: '2023-01',
            endDate: 'الحالي',
            description: 'تطوير وتأمين منصات تجارية تفاعلية باستخدام React وTypeScript.',
          },
        ],
        education: [
          {
            id: 'edu-1',
            institution: 'جامعة بغداد - كلية الهندسة',
            degree: 'بكالوريوس',
            fieldOfStudy: 'هندسة البرمجيات والحاسوب',
            graduationYear: '2022',
          },
        ],
        skills: currentUser.skills || ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
        languages: currentUser.languages || ['العربية (اللغة الأم)', 'English (Professional)'],
      }
    );
  });

  const [activeStep, setActiveStep] = useState<'edit' | 'preview'>('edit');
  const [newSkill, setNewSkill] = useState('');

  const handleSaveCv = () => {
    updateUserProfile({ cvData, cvUrl: '#cv-saved' });
    setActiveStep('preview');
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(cvData.fullName, 20, 20);
    doc.setFontSize(12);
    doc.text(cvData.jobTitle, 20, 30);
    doc.text(`Email: ${cvData.email} | Phone: ${cvData.phone}`, 20, 38);
    doc.text(`Location: ${cvData.governorate}`, 20, 46);
    
    doc.setFontSize(14);
    doc.text('Professional Summary', 20, 60);
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(cvData.summary, 170);
    doc.text(splitSummary, 20, 68);

    doc.setFontSize(14);
    doc.text('Skills', 20, 90);
    doc.setFontSize(10);
    doc.text(cvData.skills.join(', '), 20, 98);

    doc.save(`CV_${cvData.fullName.replace(/\s+/g, '_')}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-6 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-100">صانع السيرة الذاتية الاحترافية (MIZN CV Builder)</h2>
              <p className="text-xs text-slate-400">أنشئ ورتب سيرتك الذاتية بتنسيق عالمي يدعم التقديم المباشر والتصدير PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveStep('edit')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeStep === 'edit' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                تعديل البيانات
              </button>
              <button
                onClick={() => setActiveStep('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeStep === 'preview' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                معاينة وتصدير
              </button>
            </div>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeStep === 'edit' ? (
            <div className="space-y-6 text-right">
              {/* Personal info */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>المعلومات الشخصية والاتصال</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">الاسم الكامل</label>
                    <input
                      type="text"
                      value={cvData.fullName}
                      onChange={e => setCvData({ ...cvData, fullName: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">المسمى الوظيفي المستهدف</label>
                    <input
                      type="text"
                      value={cvData.jobTitle}
                      onChange={e => setCvData({ ...cvData, jobTitle: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={cvData.email}
                      onChange={e => setCvData({ ...cvData, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">رقم الهاتف</label>
                    <input
                      type="text"
                      value={cvData.phone}
                      onChange={e => setCvData({ ...cvData, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">الملخص المهني (Professional Summary)</label>
                  <textarea
                    rows={3}
                    value={cvData.summary}
                    onChange={e => setCvData({ ...cvData, summary: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>

              {/* Skills Editor */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-cyan-400">المهارات التقنية والمهنية</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    placeholder="إضافة مهارة جديدة (مثال: React, SQL, Project Management)"
                    className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSkill.trim()) {
                        setCvData({ ...cvData, skills: [...cvData.skills, newSkill.trim()] });
                        setNewSkill('');
                      }
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl"
                  >
                    إضافة
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {cvData.skills.map((s, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 text-xs bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-slate-300">
                      <span>{s}</span>
                      <button
                        onClick={() => setCvData({ ...cvData, skills: cvData.skills.filter((_, i) => i !== idx) })}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleSaveCv}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg"
                >
                  حفظ ومعاينة السيرة الذاتية
                </button>
              </div>
            </div>
          ) : (
            /* Printable CV Preview Section */
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs text-slate-400">نموذج MIZN القياسي المعتمد لدى الشركات</span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                    <span>طباعة مباشرة</span>
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold rounded-xl flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل ملف PDF</span>
                  </button>
                </div>
              </div>

              {/* Printable Area */}
              <div id="cv-print-area" className="p-8 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 space-y-6 text-right">
                <div className="border-b border-slate-800 pb-4">
                  <h1 className="text-2xl font-black text-slate-100">{cvData.fullName}</h1>
                  <p className="text-sm font-semibold text-cyan-400">{cvData.jobTitle}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {cvData.email} • {cvData.phone} • {cvData.governorate}
                  </p>
                </div>

                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">الملخص المهني</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">{cvData.summary}</p>
                </div>

                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">الخبرات العملية</h2>
                  {cvData.experience.map(exp => (
                    <div key={exp.id} className="mb-3 text-xs">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{exp.position} — {exp.company}</span>
                        <span className="text-slate-400">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">{exp.description}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">التعليم الأكاديمي</h2>
                  {cvData.education.map(edu => (
                    <div key={edu.id} className="text-xs font-bold text-slate-200">
                      <span>{edu.degree} في {edu.fieldOfStudy} ({edu.institution})</span>
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">المهارات واللغات</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {cvData.skills.map((s, i) => (
                      <span key={i} className="text-[11px] bg-slate-900 border border-slate-800 text-slate-200 px-2.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
