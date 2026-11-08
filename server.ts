import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get server-side Gemini client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// --- API ROUTES ---

// Health check
app.get('/api/health', (_req, res) => {
  const aiAvailable = Boolean(getAiClient());
  res.json({
    status: 'ok',
    service: 'MIZN Career Platform Engine',
    aiAvailable,
    timestamp: new Date().toISOString(),
  });
});

// AI Resume Analysis
app.post('/api/ai/analyze-resume', async (req, res) => {
  try {
    const { cvText, targetJobTitle, targetGovernorate } = req.body;
    
    if (!cvText || cvText.trim().length < 10) {
      return res.status(400).json({ error: 'السيرة الذاتية قصيرة جداً للتحليل' });
    }

    const ai = getAiClient();
    
    if (ai) {
      const prompt = `أنت خبير توظيف ومستشار مهني في سوق العمل العراقي والعربي منصة MIZN.
قم بتحليل السيرة الذاتية التالية للمسمى الوظيفي المستهدف: "${targetJobTitle || 'مطور برمجيات / موظف مهني'}" في محافظة: "${targetGovernorate || 'بغداد'}".

محتوى السيرة الذاتية:
"""
${cvText}
"""

قم بإعادة النتيجة في صيغة JSON باللغة العربية تحتوي على الهيكل التالي:
{
  "extractedSkills": ["مهارة 1", "مهارة 2"],
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "gaps": ["نقطة نقص 1", "نقطة نقص 2"],
  "improvements": ["اقتراح تحسين 1", "اقتراح تحسين 2"],
  "overallScore": 85,
  "marketDemandLevel": "عالي جداً في بغداد وأربيل",
  "salaryEstimateIQD": "1,500,000 - 2,500,000 دينار عراقي"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed, source: 'gemini' });
    }

    // Rule-based fallback if no Gemini Key available
    const words = cvText.toLowerCase();
    const skillsFound: string[] = [];
    const keywords = ['react', 'typescript', 'javascript', 'python', 'sql', 'node', 'tailwind', 'management', 'accounting', 'sales', 'arabic', 'english', 'excel', 'design', 'marketing'];
    keywords.forEach(kw => {
      if (words.includes(kw)) skillsFound.push(kw.toUpperCase());
    });

    const fallbackData = {
      extractedSkills: skillsFound.length > 0 ? skillsFound : ['إدارة المهام', 'التواصل المهني', 'اللغة العربية'],
      strengths: ['خبرة عملية متوازنة', 'تنظيم مهني جيد للمعلومات'],
      gaps: ['تحتاج لزيادة المشاريع العملية الموثقة', 'إضافة شهادات تخصصية معتمدة'],
      improvements: ['إضافة رابط Portfolio أو LinkedIn', 'تحديد نتائج إنجازاتك بالأرقام بدلاً من الوصف العام'],
      overallScore: Math.min(95, 65 + skillsFound.length * 5),
      marketDemandLevel: 'مطلوب في الشركات العراقية النشطة',
      salaryEstimateIQD: '1,200,000 - 2,000,000 دينار عراقي',
    };

    return res.json({ success: true, data: fallbackData, source: 'local_engine' });
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    return res.status(500).json({ error: 'حدث خطأ أثناء تحليل السيرة الذاتية', details: error?.message });
  }
});

// AI Career Roadmap & Advisor
app.post('/api/ai/career-advisor', async (req, res) => {
  try {
    const { currentRole, targetRole, governorate } = req.body;
    const ai = getAiClient();

    if (ai) {
      const prompt = `أنت المستشار المهني الذكي لمنصة MIZN في العراق.
يقدم المستهدف دوراً كـ "${currentRole || 'خريج جديد'}" ويرغب بالانتقال أو التطور إلى "${targetRole || 'مهندس برمجيات'}" في محافظة "${governorate || 'بغداد'}".

قدم خارطة طريق مهنية وتوصيات دقيقة باللغة العربية بتنسيق JSON:
{
  "careerTitle": "مسار التحول الوظيفي إلى ${targetRole || 'المجال المستهدف'}",
  "estimatedMonths": 6,
  "keySkillsToLearn": ["مهارة 1", "مهارة 2", "مهارة 3"],
  "steps": [
    { "phase": "المرحلة الأولى (الشهر 1-2)", "action": "إتقان المفاهيم الأساسية والأدوات" },
    { "phase": "المرحلة الثانية (الشهر 3-4)", "action": "بناء 3 مشاريع تخرج حقيقية" },
    { "phase": "المرحلة الثالثة (الشهر 5-6)", "action": "التقدم للشركات والتجهيز للمقابلات" }
  ],
  "iraqMarketInsights": "يتميز هذا المجال بطلب متزايد في بغداد وأربيل مع متوسط رواتب تبدأ من 1,500,000 دينار عراقي.",
  "recommendedCourses": [
    "دورة تطوير التطبيقات الشاملة",
    "مهارات التواصل والعمل الجماعي في الشركات"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed, source: 'gemini' });
    }

    const fallbackMap = {
      careerTitle: `مسار التطوير المهني نحو ${targetRole || 'الهدف الوظيفي'}`,
      estimatedMonths: 4,
      keySkillsToLearn: ['التفكير التحليلي', 'إدارة المشاريع', 'التواصل التقني', 'إتقان الأدوات الحديثة'],
      steps: [
        { phase: 'المرحلة 1: التأسيس (الأسابيع 1-4)', action: 'دراسة الأساسيات والتطبيقات العملية' },
        { phase: 'المرحلة 2: التطبيق (الأسابيع 5-8)', action: 'تنفيذ مشاريع محاكاة لسوق العمل العراقي' },
        { phase: 'المرحلة 3: الجاهزية (الأسابيع 9-12)', action: 'تجهيز السيرة الذاتية والتقديم على شركات MIZN الموثقة' }
      ],
      iraqMarketInsights: 'مجال فرعي واعد يشهد نمواً متزايداً في القطاع الخاص والمبادرات التنموية.',
      recommendedCourses: ['أساسيات سوق العمل في العراق', 'إدارة المشاريع الاحترافية']
    };

    return res.json({ success: true, data: fallbackMap, source: 'local_engine' });
  } catch (err: any) {
    res.status(500).json({ error: 'فشل إعداد التوصية المهنية', details: err?.message });
  }
});

// AI Interview Prep Questions
app.post('/api/ai/interview-prep', async (req, res) => {
  try {
    const { jobTitle, companySector } = req.body;
    const ai = getAiClient();

    if (ai) {
      const prompt = `أنت خبير إعداد المقابلات في منصة MIZN.
قم بإنشاء 5 أسئلة مقابلة عمل محاكية ومخصصة لوظيفة: "${jobTitle || 'موظف مهني'}" في قطاع: "${companySector || 'التقنية والخدمات'}".

أعد JSON يحتوي على:
{
  "questions": [
    {
      "id": 1,
      "type": "تقني / سلوكي",
      "question": "السؤال هنا باللغة العربية",
      "tips": "تلميح للإجابة النموذجية وطريقة الإجابة بإستراتيجية STAR"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed, source: 'gemini' });
    }

    const defaultQuestions = {
      questions: [
        {
          id: 1,
          type: 'سلوكي',
          question: 'كيف تتعامل مع الضغط والمواعيد النهائية الضيقة عند إنجاز المشروع؟',
          tips: 'اذكر موقفاً واقعياً قمت فيه بترتيب الأولويات والارتقاء بجودة العمل تحت الضغط.'
        },
        {
          id: 2,
          type: 'تقني / تخصصي',
          question: `ما هي أهم المهارات والأدوات الأساسية التي تستخدمها في وظيفك كـ ${jobTitle || 'مختص'}؟`,
          tips: 'اشرح المعرفة النظرية والتطبيق العملي والأدوات التي تتقنها بوضوح.'
        },
        {
          id: 3,
          type: 'عمل جماعي',
          question: 'حدثنا عن حالة واجهت فيها اختلافاً في الآراء مع زميل عمل وكيف تم حل الموضوع؟',
          tips: 'ركز على الاستماع الفعال والاحترام المهني والوصول لحل يخدم مصلحة العمل.'
        },
        {
          id: 4,
          type: 'حل المشكلات',
          question: 'إذا اكتشفت خطأ كبيراً في مرحلة متأخرة من التسليم، ما هي الخطوات التي تتخذها فوراً؟',
          tips: 'بيّن الشفافية والإبلاغ السريع وتقديم الحل البديل العاجل.'
        },
        {
          id: 5,
          type: 'طموح وشغف',
          question: 'أين ترى نفسك مهنياً بعد 3 سنوات من الانضمام إلى فريقنا في منصة MIZN؟',
          tips: 'ربط النمو الشخصي بتطوير وتوسيع أهداف الشركة والإنتاجية.'
        }
      ]
    };

    return res.json({ success: true, data: defaultQuestions, source: 'local_engine' });
  } catch (err: any) {
    res.status(500).json({ error: 'فشل إنشاء أسئلة المقابلة', details: err?.message });
  }
});

// Vite Middleware integration in dev server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(url, '');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 MIZN Full-Stack Platform server listening on http://localhost:${PORT}`);
  });
}

startServer();
