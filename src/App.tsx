import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeaderHero } from './components/common/HeaderHero';
import { JobCard } from './components/jobs/JobCard';
import { JobDetailModal } from './components/jobs/JobDetailModal';
import { PostJobModal } from './components/jobs/PostJobModal';
import { CvBuilderModal } from './components/cv/CvBuilderModal';
import { AiCareerAssistantModal } from './components/ai/AiCareerAssistantModal';
import { EmployerDashboard } from './components/employer/EmployerDashboard';
import { LearnSection } from './components/learn/LearnSection';
import { OpportunitiesSection } from './components/opportunities/OpportunitiesSection';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { AdvancedJobFilter } from './components/jobs/AdvancedJobFilter';
import { Job, Company } from './types';
import { VerificationBadge, ApplicationStatusBadge } from './components/common/StatusBadge';
import { Sparkles, Briefcase, Bookmark, Building2, MapPin, Search, CheckCircle2 } from 'lucide-react';

function MainAppContent() {
  const {
    jobs,
    searchQuery,
    selectedGov,
    selectedJobType,
    savedJobIds,
    activeTab,
    setActiveTab,
    applications,
    companies,
    activeRole,
  } = useApp();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCvBuilder, setShowCvBuilder] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showPostJob, setShowPostJob] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [jobsSubtab, setJobsSubtab] = useState<'all' | 'saved' | 'my-applications'>('all');
  const [companySearch, setCompanySearch] = useState('');
  const [advFilters, setAdvFilters] = useState<any>({
    workMode: 'ALL',
    minSalaryIQD: 0,
    onlyVerifiedSources: false,
    sortBy: 'newest',
  });

  // Filter Jobs Logic
  const filteredJobs = jobs.filter(job => {
    // Governorate filter
    if (selectedGov !== 'ALL' && job.governorate !== selectedGov) return false;
    // Job type filter
    if (selectedJobType !== 'ALL' && job.jobType !== selectedJobType) return false;
    // Saved jobs subtab
    if (jobsSubtab === 'saved' && !savedJobIds.includes(job.id)) return false;
    // Work mode filter
    if (advFilters.workMode !== 'ALL' && job.workMode !== advFilters.workMode) return false;
    // Min salary IQD filter
    if (advFilters.minSalaryIQD > 0 && job.salaryRangeIQD.min < advFilters.minSalaryIQD) return false;
    // Only verified sources filter
    if (advFilters.onlyVerifiedSources && !job.isVerifiedSource) return false;
    // Max experience years filter
    if (advFilters.maxExperienceYears !== undefined && job.experienceYears > advFilters.maxExperienceYears) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchComp = job.companyName.toLowerCase().includes(q);
      const matchGov = job.governorate.toLowerCase().includes(q);
      const matchSkills = job.requiredSkills.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchGov && !matchSkills) return false;
    }
    return true;
  }).sort((a, b) => {
    if (advFilters.sortBy === 'salary') return b.salaryRangeIQD.max - a.salaryRangeIQD.max;
    if (advFilters.sortBy === 'exp') return a.experienceYears - b.experienceYears;
    return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
  });

  const filteredCompanies = companies.filter(c => {
    if (!companySearch.trim()) return true;
    const q = companySearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q) || c.governorate.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Bar Contract Navbar */}
      <Navbar
        onOpenCvBuilder={() => setShowCvBuilder(true)}
        onOpenAiAssistant={() => setShowAiAssistant(true)}
        onToggleNotifications={() => setShowNotifications(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Dynamic Tab Views */}
      <main className="flex-1">
        
        {/* TAB 1: JOBS BOARD & APPLICATION TRACKER */}
        {activeTab === 'jobs' && (
          <div>
            <HeaderHero />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right">
              
              {/* Jobs Board Sub-tabs (جميع الوظائف | المحفوظة | طلباتي المقدمة) */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-900">
                <div className="flex items-center gap-2 bg-slate-900 p-1 border border-slate-800 rounded-xl">
                  <button
                    onClick={() => setJobsSubtab('all')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                      jobsSubtab === 'all'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    الوظائف المتاحة ({jobs.length})
                  </button>

                  <button
                    onClick={() => setJobsSubtab('saved')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      jobsSubtab === 'saved'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>المحفوظة ({savedJobIds.length})</span>
                  </button>

                  <button
                    onClick={() => setJobsSubtab('my-applications')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      jobsSubtab === 'my-applications'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>طلباتي التقديمية ({applications.length})</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowAiAssistant(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-500/30 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>تحليل ملاءمة السيرة الذاتية لجميع الوظائف</span>
                </button>
              </div>

              {/* View 1: My Applications Track */}
              {jobsSubtab === 'my-applications' ? (
                <div className="space-y-4">
                  <h2 className="font-extrabold text-lg text-slate-100">سجل طلبات التقديم ومتابعة الحالة</h2>
                  {applications.length === 0 ? (
                    <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
                      <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-sm text-slate-400">لم تقدم على أي وظيفة بعد. تصفح الوظائف المتاحة وقدم بنقرة واحدة!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {applications.map(app => (
                        <div key={app.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-sm text-slate-100">{app.jobTitle}</h3>
                              <p className="text-xs text-slate-400">{app.companyName}</p>
                            </div>
                            <ApplicationStatusBadge status={app.status} />
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                            <span>نسبة المطابقة: <strong className="text-emerald-400">{app.matchScore}%</strong></span>
                            <span>تاريخ التقديم: {new Date(app.submittedAt).toLocaleDateString('ar-IQ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* View 2: Job Cards Grid */
                <div className="space-y-4">
                  <AdvancedJobFilter onApplyFilters={f => setAdvFilters(f)} />

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>عرض {filteredJobs.length} فرصة عمل مطابقة</span>
                    {selectedGov !== 'ALL' && <span>فلترة حسب: {selectedGov}</span>}
                  </div>

                  {filteredJobs.length === 0 ? (
                    <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
                      <Search className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-sm text-slate-400">لا توجد وظائف مطابقة لخيارات البحث المحددة.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredJobs.map(job => (
                        <JobCard key={job.id} job={job} onSelect={j => setSelectedJob(j)} />
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: OPPORTUNITIES */}
        {activeTab === 'opportunities' && <OpportunitiesSection />}

        {/* TAB 3: LEARN */}
        {activeTab === 'learn' && <LearnSection />}

        {/* TAB 4: COMPANIES DIRECTORY */}
        {activeTab === 'companies' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">دليل الشركات والمؤسسات الموثقة في العراق</h1>
              <p className="text-xs sm:text-sm text-slate-400">تصفح الشركات الموثوقة رسمياً واكتشف بيئة العمل والوظائف المتاحة لديها.</p>
              
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={companySearch}
                  onChange={e => setCompanySearch(e.target.value)}
                  placeholder="ابحث باسم الشركة أو القطاع أو المحافظة..."
                  className="w-full pr-10 pl-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCompanies.map(c => (
                <div key={c.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-extrabold text-xl text-emerald-400">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{c.name}</h3>
                      <VerificationBadge status={c.verificationStatus} />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{c.description}</p>
                  <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span>{c.governorate}</span>
                    <span className="text-emerald-400 font-semibold">{c.sector}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: EMPLOYER PANEL */}
        {activeTab === 'employer' && <EmployerDashboard onOpenPostJob={() => setShowPostJob(true)} />}

        {/* TAB 6: SUPER ADMIN PANEL */}
        {activeTab === 'admin' && <SuperAdminDashboard />}

      </main>

      {/* Floating AI Assistant Action Trigger */}
      <div className="fixed bottom-6 left-6 z-30">
        <button
          onClick={() => setShowAiAssistant(true)}
          className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-xs rounded-full shadow-2xl shadow-emerald-500/40 flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Sparkles className="w-5 h-5 fill-slate-950" />
          <span className="hidden sm:inline">مساعد MIZN AI للمطابقة والتحليل</span>
        </button>
      </div>

      {/* Modals & Drawers */}
      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

      {showCvBuilder && (
        <CvBuilderModal onClose={() => setShowCvBuilder(false)} />
      )}

      {showAiAssistant && (
        <AiCareerAssistantModal onClose={() => setShowAiAssistant(false)} />
      )}

      {showPostJob && (
        <PostJobModal onClose={() => setShowPostJob(false)} />
      )}

      {showNotifications && (
        <NotificationDrawer onClose={() => setShowNotifications(false)} />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
