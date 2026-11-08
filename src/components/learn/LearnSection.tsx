import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { GraduationCap, PlayCircle, Award, CheckCircle2, Star, Clock, BookOpen, ShieldCheck } from 'lucide-react';

export const LearnSection: React.FC = () => {
  const { courses, enrolledCourseIds, enrollCourse } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      
      {/* Hero Intro Header */}
      <div className="p-8 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>قسم MIZN LEARN التعليمي والتطوير المهني</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100">
          طوّر مهاراتك بشهادات معتمدة متوافقة مع متطلبات شركات العراق
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          دورات تدريبية مجانية ومسارات تعلم مكثفة تم تصميمها بالتعاون مع كبار المهندسين والخبراء لربط التحصيل الأكاديمي بسوق العمل الفعلي.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          return (
            <div
              key={course.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-100 line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {course.skillsGained.map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Course Meta Info */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {course.durationHours} ساعة تدريبية
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    {course.lessonsCount} درس عملي
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                  >
                    استعراض المنهج
                  </button>

                  <button
                    onClick={() => enrollCourse(course.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                      isEnrolled
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                    }`}
                  >
                    {isEnrolled ? 'مسجل بالفعل ✓' : 'تسجيل مجاني'}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4 text-right"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-bold">{selectedCourse.provider}</span>
                <h2 className="text-xl font-extrabold text-slate-100 mt-1">{selectedCourse.title}</h2>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="p-2 text-slate-400 hover:text-slate-100">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedCourse.description}</p>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="font-bold text-sm text-slate-200">الوحدات والدروس التعليمية:</h3>
              {selectedCourse.modules.map((m, idx) => (
                <div key={m.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{idx + 1}. {m.title}</span>
                  <span className="text-slate-400">{m.durationMinutes} دقيقة</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  enrollCourse(selectedCourse.id);
                  setSelectedCourse(null);
                }}
                className="px-6 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl"
              >
                البدء في الدراسة الآن
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
