import React, { useState } from 'react';
import { AiMatchResult } from '../../types';
import { Sparkles, Info, CheckCircle2, AlertCircle, MapPin, Briefcase } from 'lucide-react';

interface MatchBadgeProps {
  matchResult: AiMatchResult;
  compact?: boolean;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ matchResult, compact = false }) => {
  const [showModal, setShowModal] = useState(false);
  const score = matchResult.score;

  let colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (score < 60) colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  if (score < 40) colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        title="انقر لمشاهدة تفاصيل مطابقة الذكاء الاصطناعي"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-105 ${colorClasses}`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>مطابقة AI: {score}%</span>
        {!compact && <Info className="w-3 h-3 opacity-60" />}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-100">تحليل المطابقة الذكية</h3>
                  <p className="text-xs text-slate-400">تقييم خوارزمية MIZN AI غير المنحازة</p>
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-400">{score}%</div>
            </div>

            {/* Score Breakdown Progress Bars */}
            <div className="py-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">مطابقة المهارات المطلوبة</span>
                  <span className="font-bold text-slate-100">{matchResult.skillMatchPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${matchResult.skillMatchPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">مطابقة سنوات الخبرة</span>
                  <span className="font-bold text-slate-100">{matchResult.experienceMatchPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${matchResult.experienceMatchPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">توافق الموقع ونوع الدوام</span>
                  <span className="font-bold text-slate-100">{matchResult.locationMatchPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${matchResult.locationMatchPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Matching & Missing Skills */}
            <div className="space-y-3 border-t border-slate-800 pt-4">
              {matchResult.matchingSkills.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>المهارات المتطابقة ({matchResult.matchingSkills.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matchingSkills.map((sk, idx) => (
                      <span key={idx} className="text-[11px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {matchResult.missingSkills.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-amber-400 mb-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>المهارات المقترح تعلمها ({matchResult.missingSkills.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingSkills.map((sk, idx) => (
                      <span key={idx} className="text-[11px] bg-amber-950/60 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanations */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-slate-100 block mb-1">أسباب التقييم:</span>
                {matchResult.reasons.map((r, i) => (
                  <p key={i} className="flex items-start gap-1.5 text-slate-400">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{r}</span>
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}
    </>
  );
};
