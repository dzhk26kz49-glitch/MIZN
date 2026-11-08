import React from 'react';
import { IRAQI_GOVERNORATES } from '../../data/mockData';
import { ShieldCheck, MapPin, Mail, Phone, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Vision */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-sm">
                مُزْن
              </div>
              <span className="text-base font-bold text-slate-100">MIZN | منصة مزن</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              المنصة الوطنية الذكية للوظائف والتعليم والفرص والتطوير المهني في العراق والوطن العربي. نربط مخرجات التعليم بمتطلبات سوق العمل المحلي والدولي.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>بيانات موثوقة ونظام حماية مطابق للمعايير</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-sm mb-3">أقسام المنصة</h4>
            <ul className="space-y-2">
              <li><a href="#jobs" className="hover:text-emerald-400 transition-colors">الوظائف الحكومية والخاصة</a></li>
              <li><a href="#opportunities" className="hover:text-emerald-400 transition-colors">المنح والتدريب الصيفي</a></li>
              <li><a href="#learn" className="hover:text-emerald-400 transition-colors">MIZN LEARN للتطوير المهني</a></li>
              <li><a href="#companies" className="hover:text-emerald-400 transition-colors">دليل الشركات الموثقة</a></li>
              <li><a href="#cv" className="hover:text-emerald-400 transition-colors">منشئ السيرة الذاتية مجاناً</a></li>
            </ul>
          </div>

          {/* Col 3: Governorates Covered */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-sm mb-3">المحافظات المغطاة</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              تغطي منصة مزن الوظائف والفرص في كافة المحافظات العراقية: بغداد، أربيل، البصرة، النجف، كربلاء، الموصل، السليمانية، بابل، ذي قار، كركوك، الأنبار وباقي المحافظات.
            </p>
            <div className="flex items-center gap-1.5 text-slate-300 pt-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>مقراتنا: بغداد - أربيل - البصرة</span>
            </div>
          </div>

          {/* Col 4: Contact & IQD info */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm mb-3">الدعم الفني والشركات</h4>
            <div className="space-y-1.5 text-slate-400">
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-emerald-400" /> support@mizn.iq</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> +964 770 000 9988</p>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400">
              <span className="font-semibold text-slate-200 block">العملة الافتراضية:</span>
              الدينار العراقي (IQD) مع دعم النطاقات الرواتب وتكافؤ الفرص.
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} MIZN Iraq.
          </div>
          <div className="flex items-center gap-1">
            تم التطوير بحب في العراق <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> لدعم الشباب وصنّاع المستقبل
          </div>
        </div>

      </div>
    </footer>
  );
};
