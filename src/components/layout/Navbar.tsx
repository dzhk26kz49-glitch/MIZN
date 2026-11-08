import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  Building2,
  Compass,
  Bell,
  Sun,
  Moon,
  Globe,
  User,
  FileText,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onOpenCvBuilder: () => void;
  onOpenAiAssistant: () => void;
  onToggleNotifications: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCvBuilder,
  onOpenAiAssistant,
  onToggleNotifications,
  onOpenAuth,
}) => {
  const {
    currentUser,
    activeRole,
    switchRole,
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    activeTab,
    setActiveTab,
    unreadNotificationsCount,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'JOB_SEEKER', label: 'باحث عن عمل', desc: 'تصفح الوظائف، والتقديم، ومتابعة السيرة الذاتية' },
    { role: 'STUDENT', label: 'طالب جامعي', desc: 'استكشاف التدريب الصيفي والمنح والفرص' },
    { role: 'GRADUATE', label: 'خريج جديد', desc: 'البحث عن الوظائف الأولى وبرامج التطوير' },
    { role: 'COMPANY_OWNER', label: 'صاحب شركة / موظف HR', desc: 'نشر الوظائف ومراجعة المرشحين وتوثيق الشركة' },
    { role: 'SUPER_ADMIN', label: 'مدير المنصة (Super Admin)', desc: 'لوحة التحكم الشاملة والتوثيق والأمان' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('jobs')}
            className="flex items-center gap-2.5 group text-right"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
              <span className="text-xl tracking-tighter">مُزْن</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-wide text-slate-100 group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                MIZN <span className="text-emerald-500 font-extrabold">|</span> مُزْن
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-tight -mt-1 whitespace-nowrap">
                منصة المهن والفرص الذكية
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Clean Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-1.5 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'jobs' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500 py-4 -mb-[17px]' : ''
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>الوظائف</span>
          </button>

          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex items-center gap-1.5 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'opportunities' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500 py-4 -mb-[17px]' : ''
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>الفرص والمنح</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`flex items-center gap-1.5 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'learn' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500 py-4 -mb-[17px]' : ''
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>MIZN LEARN</span>
          </button>

          <button
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-1.5 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'companies' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500 py-4 -mb-[17px]' : ''
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>الشركات العراقية</span>
          </button>

          {activeRole === 'COMPANY_OWNER' && (
            <button
              onClick={() => setActiveTab('employer')}
              className={`flex items-center gap-1.5 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'employer' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500 py-4 -mb-[17px]' : ''
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>لوحة الشركة</span>
            </button>
          )}

          {activeRole === 'SUPER_ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'admin' ? 'font-semibold border-b-2 border-amber-400 py-4 -mb-[17px]' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>لوحة الإدارة</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Role Quick Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* AI Assistant Quick Trigger */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">مساعد AI المهني</span>
          </button>

          {/* CV Builder Button */}
          <button
            onClick={onOpenCvBuilder}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>صانع السيرة الذاتية</span>
          </button>

          {/* Notifications Drawer Toggle */}
          <button
            onClick={onToggleNotifications}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors relative"
            title="الإشعارات"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            )}
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            )}
          </button>

          {/* Theme & Language Toggles */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={toggleLanguage}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors text-xs font-semibold"
              title="تغيير اللغة"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Sign In / Sign Up Trigger */}
          <button
            onClick={onOpenAuth}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>دخول / حساب جديد</span>
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div
                className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-right"
                onClick={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-200">{currentUser.name}</p>
                  <p className="text-[11px] text-emerald-400">{currentUser.email}</p>
                </div>

                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1">
                  تبديل الدور للتجربة (Demo Role Switch):
                </div>

                {rolesList.map(item => (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchRole(item.role);
                      if (item.role === 'COMPANY_OWNER') setActiveTab('employer');
                      if (item.role === 'SUPER_ADMIN') setActiveTab('admin');
                    }}
                    className={`w-full text-right p-2.5 rounded-xl transition-colors flex flex-col ${
                      activeRole === item.role
                        ? 'bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
