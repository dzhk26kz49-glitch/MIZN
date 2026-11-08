import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Brain, Compass, HelpCircle, CheckCircle2, AlertCircle, TrendingUp, Send, Loader2 } from 'lucide-react';

interface AiCareerAssistantModalProps {
  onClose: () => void;
}

export const AiCareerAssistantModal: React.FC<AiCareerAssistantModalProps> = ({ onClose }) => {
  const { currentUser, incrementAiTokens } = useApp();
  const [activeTab, setActiveTab] = useState<'resume' | 'roadmap' | 'interview'>('resume');

  // Resume State
  const [cvText, setCvText] = useState(currentUser.bio || '');
  const [targetJob, setTargetJob] = useState(currentUser.title || 'Frontend Developer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeAnalysisResult, setResumeAnalysisResult] = useState<any>(null);

  // Roadmap State
  const [currentRole, setCurrentRole] = useState('طالب / خريج جديد');
  const [desiredRole, setDesiredRole] = useState('Senior Full-Stack Engineer');
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapResult, setRoadmapResult] = useState<any>(null);

  // Interview Simulator State
  const [prepRole, setPrepRole] = useState('مطور برمجيات');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [prepResult, setPrepResult] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [answerFeedback, setAnswerFeedback] = useState<Record<number, string>>({});

  // 1. Analyze Resume Handler
  const handleAnalyzeResume = async () => {
    if (!cvText.trim()) return;
    setIsAnalyzing(true);
    setResumeAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText,
          targetJobTitle: targetJob,
          targetGovernorate: currentUser.governorate,
        }),
      });
      const data = await res.json();
      setIsAnalyzing(false);
      if (data.success) {
        setResumeAnalysisResult(data.data);
        incrementAiTokens(350);
      }
    } catch (err) {
      setIsAnalyzing(false);
      console.error(err);
    }
  };

  // 2. Career Roadmap Handler
  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    setRoadmapResult(null);

    try {
      const res = await fetch('/api/ai/career-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRole,
          targetRole: desiredRole,
          governorate: currentUser.governorate,
        }),
      });
      const data = await res.json();
      setIsGeneratingRoadmap(false);
      if (data.success) {
        setRoadmapResult(data.data);
        incrementAiTokens(400);
      }
    } catch (err) {
      setIsGeneratingRoadmap(false);
      console.error(err);
    }
  };

  // 3. Interview Prep Handler
  const handleGenerateInterview = async () => {
    setIsGeneratingQuestions(true);
    setPrepResult(null);

    try {
      const res = await fetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: prepRole,
          companySector: 'التكنولوجيا والخدمات الرقمية في العراق',
        }),
      });
      const data = await res.json();
      setIsGeneratingQuestions(false);
      if (data.success) {
        setPrepResult(data.data);
        incrementAiTokens(450);
      }
    } catch (err) {
      setIsGeneratingQuestions(false);
      console.error(err);
    }
  };

  const evaluateAnswer = (qId: number) => {
    const text = userAnswers[qId] || '';
    if (text.length < 10) {
      setAnswerFeedback(prev => ({ ...prev, [qId]: 'الإجابة قصيرة جداً. يفضل تقديم تفاصيل أكثر باستخدام أسلوب STAR.' }));
    } else {
      setAnswerFeedback(prev => ({ ...prev, [qId]: 'إجابة متميزة! بيّنت القدرة على حل المشاكل وتقديم حلول عملية.' }));
    }
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
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl text-slate-950 font-black shadow-lg shadow-emerald-950/40">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-100">المساعد المهني الذكي (MIZN AI Advisor)</h2>
              <p className="text-xs text-slate-400">تحليل السير الذاتية، التخطيط المهني، والتدريب على المقابلات في العراق</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4">
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'resume' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>تحليل السيرة الذاتية (CV Analyzer)</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'roadmap' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>خارطة الطريق المهنية (Career Roadmap)</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'interview' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>محاكي المقابلات (Interview Simulator)</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[72vh] overflow-y-auto text-right space-y-6">
          
          {/* TAB 1: RESUME ANALYZER */}
          {activeTab === 'resume' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">المسمى الوظيفي المستهدف</label>
                  <input
                    type="text"
                    value={targetJob}
                    onChange={e => setTargetJob(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">المحافظة</label>
                  <input
                    type="text"
                    readOnly
                    value={currentUser.governorate}
                    className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">محتوى السيرة الذاتية أو الخبرات</label>
                <textarea
                  rows={4}
                  value={cvText}
                  onChange={e => setCvText(e.target.value)}
                  placeholder="ضع نص السيرة الذاتية هنا أو الخبرات والمهارات التي تملكها..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleAnalyzeResume}
                disabled={isAnalyzing || !cvText.trim()}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري تحليل السيرة الذاتية بالذكاء الاصطناعي...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>بدء التقييم والتحليل الفوري</span>
                  </>
                )}
              </button>

              {/* Analysis Result */}
              {resumeAnalysisResult && (
                <div className="p-5 bg-slate-950 border border-emerald-500/30 rounded-2xl space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-sm text-emerald-400">نتيجة تقييم MIZN AI</span>
                    <span className="text-xl font-black text-emerald-400">{resumeAnalysisResult.overallScore} / 100</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <span className="text-slate-400 block mb-1">الطلب في السوق العراقي:</span>
                      <span className="font-bold text-slate-100">{resumeAnalysisResult.marketDemandLevel}</span>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <span className="text-slate-400 block mb-1">تقدير الراتب المتوقع (IQD):</span>
                      <span className="font-bold text-emerald-400">{resumeAnalysisResult.salaryEstimateIQD}</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-200 block mb-1">نقاط القوة الأساسية:</span>
                    <ul className="space-y-1 text-slate-300">
                      {resumeAnalysisResult.strengths?.map((s: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-amber-400 block mb-1">توصيات التحسين والتطوير:</span>
                    <ul className="space-y-1 text-slate-300">
                      {resumeAnalysisResult.improvements?.map((imp: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CAREER ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">مستواك / وظيفك الحالية</label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={e => setCurrentRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الهدف المهني المطلوب الوصول إليه</label>
                  <input
                    type="text"
                    value={desiredRole}
                    onChange={e => setDesiredRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateRoadmap}
                disabled={isGeneratingRoadmap}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isGeneratingRoadmap ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري توليد مسار التطوير المخصص...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    <span>توليد خارطة الطريق المهنية</span>
                  </>
                )}
              </button>

              {roadmapResult && (
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-xs">
                  <div className="pb-2 border-b border-slate-800">
                    <h3 className="font-extrabold text-sm text-emerald-400">{roadmapResult.careerTitle}</h3>
                    <p className="text-slate-400 text-[11px]">المدة الزمنية المتوقعة: {roadmapResult.estimatedMonths} أشهر</p>
                  </div>

                  <div className="space-y-3">
                    <span className="font-bold text-slate-200 block">خطوات التنفيذ المرحلية:</span>
                    {roadmapResult.steps?.map((step: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="font-bold text-emerald-400 block mb-0.5">{step.phase}</span>
                        <span className="text-slate-300">{step.action}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300">
                    <span className="font-bold text-slate-100 block mb-1">رؤية سوق العمل العراقي:</span>
                    <span>{roadmapResult.iraqMarketInsights}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INTERVIEW SIMULATOR */}
          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prepRole}
                  onChange={e => setPrepRole(e.target.value)}
                  placeholder="المسمى الوظيفي للمقابلة (مثال: Full-Stack Developer)"
                  className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
                <button
                  onClick={handleGenerateInterview}
                  disabled={isGeneratingQuestions}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shrink-0 flex items-center gap-1.5"
                >
                  {isGeneratingQuestions ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
                  <span>توليد الأسئلة</span>
                </button>
              </div>

              {prepResult && prepResult.questions && (
                <div className="space-y-4">
                  {prepResult.questions.map((q: any) => (
                    <div key={q.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100 text-sm">سؤال {q.id}: {q.question}</span>
                        <span className="text-[10px] bg-slate-900 text-cyan-400 border border-slate-800 px-2 py-0.5 rounded">
                          {q.type}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">💡 تلميح للإجابة: {q.tips}</p>

                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={userAnswers[q.id] || ''}
                          onChange={e => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                          placeholder="اكتب إجابتك للتجربة والتقييم..."
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                        />
                        <button
                          onClick={() => evaluateAnswer(q.id)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                        >
                          تقييم الإجابة
                        </button>
                        {answerFeedback[q.id] && (
                          <div className="p-2 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 rounded-lg font-medium text-[11px]">
                            {answerFeedback[q.id]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
