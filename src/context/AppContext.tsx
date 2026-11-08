import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Application,
  ApplicationStatus,
  AuditLog,
  Company,
  Course,
  IraqiGovernorate,
  Job,
  JobType,
  NotificationItem,
  Opportunity,
  UserProfile,
  UserRole,
  VerificationStatus,
} from '../types';
import { MOCK_COMPANIES, MOCK_COURSES, MOCK_JOBS, MOCK_OPPORTUNITIES, MOCK_USERS } from '../data/mockData';

interface AppContextType {
  // User & Auth
  currentUser: UserProfile;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  
  // Theme & Language
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  language: 'ar' | 'en';
  toggleLanguage: () => void;
  dir: 'rtl' | 'ltr';
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Jobs
  jobs: Job[];
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  addJob: (newJob: Omit<Job, 'id' | 'postedAt' | 'status'>) => void;
  updateJobStatus: (jobId: string, status: Job['status']) => void;
  
  // Applications
  applications: Application[];
  applyToJob: (jobId: string, coverNote?: string) => boolean;
  updateApplicationStatus: (appId: string, newStatus: ApplicationStatus, notes?: string) => void;
  
  // Companies & Verification
  companies: Company[];
  currentCompany?: Company;
  updateCompanyVerification: (companyId: string, status: VerificationStatus, note?: string) => void;
  submitCompanyVerificationDoc: (companyId: string, docUrl: string) => void;
  
  // Learn & Opportunities
  courses: Course[];
  enrolledCourseIds: string[];
  enrollCourse: (courseId: string) => void;
  opportunities: Opportunity[];
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  
  // Admin & Audit
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string) => void;
  aiTokensUsed: number;
  incrementAiTokens: (amount: number) => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedGov: IraqiGovernorate | 'ALL';
  setSelectedGov: (gov: IraqiGovernorate | 'ALL') => void;
  selectedJobType: JobType | 'ALL';
  setSelectedJobType: (type: JobType | 'ALL') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('mizn_theme') as 'dark' | 'light') || 'dark';
  });

  // Language state
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('mizn_lang') as 'ar' | 'en') || 'ar';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Role & Active User
  const [activeRole, setActiveRole] = useState<UserRole>('JOB_SEEKER');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    return MOCK_USERS.find(u => u.role === 'JOB_SEEKER') || MOCK_USERS[0];
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('jobs');

  // Datasets with local storage persistence fallback
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('mizn_jobs');
    return saved ? JSON.parse(saved) : MOCK_JOBS;
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mizn_saved_jobs');
    return saved ? JSON.parse(saved) : ['job-1'];
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('mizn_companies');
    return saved ? JSON.parse(saved) : MOCK_COMPANIES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('mizn_apps');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'app-init-1',
        jobId: 'job-1',
        jobTitle: 'مطور برمجيات Full-Stack (React & Node.js)',
        companyName: 'شركة دجلة للحلول البرمجية (Dijlah Tech)',
        candidateId: 'user-seeker-1',
        candidateName: 'على حسين العبيدي',
        candidateEmail: 'ali.hassan@mizn.iq',
        candidatePhone: '+964 770 123 4567',
        matchScore: 92,
        status: 'Under Review',
        coverNote: 'أنا مطور برمجيات خبير في React & TypeScript ويسعدني العمل في أربيل.',
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      }
    ];
  });

  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['course-1']);
  const [opportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGov, setSelectedGov] = useState<IraqiGovernorate | 'ALL'>('ALL');
  const [selectedJobType, setSelectedJobType] = useState<JobType | 'ALL'>('ALL');

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => [
    {
      id: 'n-1',
      userId: 'user-seeker-1',
      title: 'تحديث حالة الطلب',
      message: 'قامت شركة دجلة بمراجعة طلبك لوظيفة مطور Full-Stack وحالته الآن: Under Review',
      type: 'APPLICATION_UPDATE',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'n-2',
      userId: 'user-seeker-1',
      title: 'مطابقة ذكاء اصطناعي جديدة',
      message: 'تم العثور على وظيفة تطابق مهاراتك بنسبة 92% في بغداد',
      type: 'JOB_ALERT',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    }
  ]);

  // Audit Logs & AI stats
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => [
    {
      id: 'log-1',
      actorId: 'user-admin-1',
      actorName: 'د. ليث البغدادي',
      action: 'SYSTEM_BOOT',
      details: 'تم تشغيل محرك MIZN وتحديث قواعد RLS لقواعد البيانات',
      timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
    }
  ]);

  const [aiTokensUsed, setAiTokensUsed] = useState<number>(14250);

  // Sync Theme HTML class
  useEffect(() => {
    localStorage.setItem('mizn_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync Language HTML attr
  useEffect(() => {
    localStorage.setItem('mizn_lang', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', dir);
  }, [language, dir]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('mizn_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('mizn_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem('mizn_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('mizn_companies', JSON.stringify(companies));
  }, [companies]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const switchRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    const targetUser = MOCK_USERS.find(u => u.role === newRole) || {
      ...currentUser,
      role: newRole
    };
    setCurrentUser(targetUser);
    addAuditLog('ROLE_SWITCH', `تم تغيير دور المستخدم الحالي إلى ${newRole}`);
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const addJob = (newJobData: Omit<Job, 'id' | 'postedAt' | 'status'>) => {
    const created: Job = {
      ...newJobData,
      id: `job-${Date.now()}`,
      postedAt: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    setJobs(prev => [created, ...prev]);
    addAuditLog('JOB_CREATE', `تم إنشاء إعلان وظيفة جديد: ${created.title}`);
    addNotification(
      'تم نشر الوظيفة بنجاح',
      `وظيفتك "${created.title}" أصبحت متاحة الآن على المنصة`,
      'SYSTEM'
    );
  };

  const updateJobStatus = (jobId: string, status: Job['status']) => {
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status } : j)));
    addAuditLog('JOB_STATUS_CHANGE', `تم تغيير حالة الوظيفة ${jobId} إلى ${status}`);
  };

  const applyToJob = (jobId: string, coverNote?: string): boolean => {
    const existing = applications.find(
      a => a.jobId === jobId && a.candidateId === currentUser.id
    );
    if (existing) {
      return false; // Prevent duplicate
    }
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return false;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: targetJob.title,
      companyName: targetJob.companyName,
      candidateId: currentUser.id,
      candidateName: currentUser.name,
      candidateEmail: currentUser.email,
      candidatePhone: currentUser.phone,
      matchScore: 88, // Score calculated or default
      status: 'Submitted',
      coverNote,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setApplications(prev => [newApp, ...prev]);
    addNotification(
      'تم إرسال طلب التقديم',
      `تم إرسال طلبك لوظيفة "${targetJob.title}" إلى ${targetJob.companyName}`,
      'APPLICATION_UPDATE'
    );
    addAuditLog('APPLICATION_SUBMIT', `تقدم ${currentUser.name} لوظيفة ${targetJob.title}`);
    return true;
  };

  const updateApplicationStatus = (appId: string, newStatus: ApplicationStatus, notes?: string) => {
    setApplications(prev =>
      prev.map(a => {
        if (a.id === appId) {
          const updated = { ...a, status: newStatus, notes, updatedAt: new Date().toISOString() };
          addNotification(
            'تحديث حالة طلب الوظيفة',
            `تم تحديث حالة طلبك لوظيفة "${a.jobTitle}" إلى "${newStatus}"`,
            'APPLICATION_UPDATE'
          );
          return updated;
        }
        return a;
      })
    );
    addAuditLog('APPLICATION_STATUS_UPDATE', `تحديث طلب ${appId} إلى ${newStatus}`);
  };

  const updateCompanyVerification = (companyId: string, status: VerificationStatus, note?: string) => {
    setCompanies(prev =>
      prev.map(c =>
        c.id === companyId
          ? {
              ...c,
              verificationStatus: status,
              verifiedAt: status === 'Verified' ? new Date().toISOString() : undefined,
            }
          : c
      )
    );
    addAuditLog('COMPANY_VERIFICATION', `تم تغيير توثيق الشركة ${companyId} إلى ${status}. ملاحظة: ${note || '-'}`);
  };

  const submitCompanyVerificationDoc = (companyId: string, docUrl: string) => {
    setCompanies(prev =>
      prev.map(c =>
        c.id === companyId
          ? { ...c, verificationDocumentUrl: docUrl, verificationStatus: 'Pending' }
          : c
      )
    );
    addNotification('تم تقديم مستند التوثيق', 'تم استلام مستند التوثيق التجاري وهو قيد المراجعة الإدارية', 'VERIFICATION_UPDATE');
  };

  const enrollCourse = (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds(prev => [...prev, courseId]);
      addNotification('تم التسجيل في الدورة', 'يمكنك الآن بدء التعلم ومتابعة تقدمك في الدورة', 'SYSTEM');
    }
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const incrementAiTokens = (amount: number) => {
    setAiTokensUsed(prev => prev + amount);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  const currentCompany = companies.find(c => c.id === currentUser.companyId) || companies[0];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        switchRole,
        updateUserProfile,
        theme,
        toggleTheme,
        language,
        toggleLanguage,
        dir,
        activeTab,
        setActiveTab,
        jobs,
        savedJobIds,
        toggleSaveJob,
        addJob,
        updateJobStatus,
        applications,
        applyToJob,
        updateApplicationStatus,
        companies,
        currentCompany,
        updateCompanyVerification,
        submitCompanyVerificationDoc,
        courses,
        enrolledCourseIds,
        enrollCourse,
        opportunities,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        clearAllNotifications,
        addNotification,
        auditLogs,
        addAuditLog,
        aiTokensUsed,
        incrementAiTokens,
        searchQuery,
        setSearchQuery,
        selectedGov,
        setSelectedGov,
        selectedJobType,
        setSelectedJobType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
