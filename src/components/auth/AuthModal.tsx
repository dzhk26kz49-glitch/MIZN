import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthService } from '../../services/authService';
import { IRAQI_GOVERNORATES } from '../../data/mockData';
import { UserRole, IraqiGovernorate } from '../../types';
import { X, LogIn, UserPlus, ShieldCheck, Mail, Lock, User, MapPin, Building2, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { updateUserProfile, switchRole, addNotification } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('JOB_SEEKER');
  const [governorate, setGovernorate] = useState<IraqiGovernorate>('بغداد (Baghdad)');
  const [city, setCity] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'signup') {
      if (!name || !email) {
        setLoading(false);
        setErrorMsg('يرجى ملء جميع الحقول المطلوبة');
        return;
      }

      const res = await AuthService.signUp({
        name,
        email,
        password,
        phone,
        role,
        governorate,
        city: city || 'المركز',
      });

      setLoading(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.user) {
        updateUserProfile(res.user);
        switchRole(res.user.role);
        setSuccessMsg('تم إنشاء الحساب وتسجيل الدخول بنجاح!');
        addNotification('مرحباً بك في MIZN', 'تم إنشاء حسابك وتفعيل الصلاحيات المناسبة لدورك', 'SYSTEM');
        setTimeout(() => onClose(), 800);
      }
    } else {
      if (!email) {
        setLoading(false);
        setErrorMsg('يرجى كتابة البريد الإلكتروني');
        return;
      }

      const res = await AuthService.signIn(email, password);
      setLoading(false);

      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.user) {
        updateUserProfile(res.user);
        switchRole(res.user.role);
        setSuccessMsg('تم تسجيل الدخول بنجاح!');
        addNotification('تم تسجيل الدخول', `مرحباً بعودتك ${res.user.name}`, 'SYSTEM');
        setTimeout(() => onClose(), 800);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 overflow-hidden my-6 relative text-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-sm">
              مُزْن
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-100">
                {mode === 'signup' ? 'إنشاء حساب جديد في منصة MIZN' : 'تسجيل الدخول إلى حسابك'}
              </h2>
              <p className="text-[11px] text-slate-400">نظام المصادقة وعزل الصلاحيات بـ Supabase Auth</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mode === 'signup' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              حساب جديد (Sign Up)
            </button>
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mode === 'signin' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              تسجيل الدخول (Sign In)
            </button>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الاسم الكامل *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="مثال: علي حسين العبيدي"
                    className="w-full pr-10 pl-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">نوع الحساب / الدور المهني *</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 cursor-pointer"
                >
                  <option value="JOB_SEEKER">باحث عن عمل (Job Seeker)</option>
                  <option value="STUDENT">طالب جامعي (Student)</option>
                  <option value="GRADUATE">خريج جديد (Graduate)</option>
                  <option value="COMPANY_OWNER">صاحب شركة / مسؤل توظيف (Employer/HR)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">المحافظة</label>
                  <select
                    value={governorate}
                    onChange={e => setGovernorate(e.target.value as IraqiGovernorate)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  >
                    {IRAQI_GOVERNORATES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">المدينة</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="المنصور / الكرادة"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">البريد الإلكتروني *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@mizn.iq"
                className="w-full pr-10 pl-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">كلمة المرور *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري الاتصال بالسيرفر...' : mode === 'signup' ? 'إكمال تسجيل الحساب' : 'الدخول الحين'}
          </button>

        </form>
      </div>
    </div>
  );
};
