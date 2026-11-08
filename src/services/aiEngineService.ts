import { AiMatchResult, Job, UserProfile } from '../types';
import { calculateJobMatch } from '../utils/aiMatcher';

export interface ResumeAnalysisOutput {
  extractedSkills: string[];
  strengths: string[];
  gaps: string[];
  improvements: string[];
  overallScore: number;
  marketDemandLevel: string;
  salaryEstimateIQD: string;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  disclaimer: string;
}

export interface CareerAdvisorOutput {
  careerTitle: string;
  estimatedMonths: number;
  keySkillsToLearn: string[];
  steps: Array<{ phase: string; action: string }>;
  iraqMarketInsights: string;
  recommendedCourses: string[];
}

export class AiEngineService {
  // 1. Local Free Rule-Based Resume Analyzer
  static analyzeResumeLocally(cvText: string, targetJobTitle?: string, governorate?: string): ResumeAnalysisOutput {
    const textLower = cvText.toLowerCase();
    const knownSkills = [
      'react', 'typescript', 'javascript', 'python', 'sql', 'node.js', 'node', 'tailwind',
      'figma', 'html', 'css', 'git', 'postgresql', 'cisco', 'networking', 'power bi',
      'excel', 'cybersecurity', 'management', 'accounting', 'sales', 'arabic', 'english'
    ];

    const extracted: string[] = [];
    knownSkills.forEach(sk => {
      if (textLower.includes(sk)) {
        extracted.push(sk.toUpperCase());
      }
    });

    const hasTech = extracted.length > 2;
    const wordCount = cvText.split(/\s+/).length;

    const strengths: string[] = [];
    const gaps: string[] = [];
    const improvements: string[] = [];

    if (extracted.length > 0) {
      strengths.push(`تمتلك مهارات تقنية أساسية مثبتة: ${extracted.slice(0, 3).join(', ')}`);
    } else {
      gaps.push('لم يتم العثور على كلمات مفتاحية تخصصية واضحة في النص');
    }

    if (wordCount > 50) {
      strengths.push('توثيق واسع وتفصيلي للملف المهني والخبرات السابق تنفيذها');
    } else {
      gaps.push('الملخص المهني قصير؛ ينصح بالتوسع في شرح المشاريع والمسؤوليات');
      improvements.push('قم بإضافة تفاصيل عن النتائج والأرقام المحققة في عملك السابق');
    }

    improvements.push('أضف رابط Portfolio أو مشاريع عملية مثبتة على Git');
    improvements.push('تأكد من مطابقة مسميات مهاراتك مع الشروط المطلوبة في إعلانات MIZN');

    const score = Math.min(96, Math.max(45, 60 + extracted.length * 7 + (wordCount > 10 ? 10 : 0)));
    const confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' =
      extracted.length >= 3 || wordCount >= 10 ? 'HIGH' : extracted.length >= 1 ? 'MEDIUM' : 'LOW';

    return {
      extractedSkills: extracted.length > 0 ? extracted : ['إدارة العمل', 'التواصل المهني'],
      strengths: strengths.length > 0 ? strengths : ['استعداد تام للتعلم والتطوير'],
      gaps: gaps.length > 0 ? gaps : ['ينصح بالحصول على شهادات تخصصية معتمدة'],
      improvements,
      overallScore: score,
      marketDemandLevel: `مطلوب بدرجة عالية في ${governorate || 'بغداد وأربيل'}`,
      salaryEstimateIQD: '1,300,000 - 2,200,000 دينار عراقي',
      confidenceLevel,
      disclaimer: 'تنبيه: هذا التقييم استشاري لمساعدة المتقدمين وصناع القرار ولا يعتبر قرار توظيف آلي نهائي.',
    };
  }

  // 2. Comprehensive Job Matcher with Explanations & Confidence
  static evaluateJobMatch(candidate: UserProfile, job: Job): AiMatchResult & { confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW'; disclaimer: string } {
    const baseMatch = calculateJobMatch(candidate, job);
    const candidateSkillsCount = (candidate.skills || []).length;
    
    const confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' =
      candidateSkillsCount >= 4 ? 'HIGH' : candidateSkillsCount >= 2 ? 'MEDIUM' : 'LOW';

    return {
      ...baseMatch,
      confidenceLevel,
      disclaimer: 'تنبيه: نظام المطابقة الذكي يقدم توصيات استشارية فقط؛ القرارات النهائية تعود لمسؤولي التوظيف.',
    };
  }

  // 3. Local Career Advisor Roadmap
  static generateCareerRoadmapLocally(currentRole: string, targetRole: string, governorate?: string): CareerAdvisorOutput {
    return {
      careerTitle: `مسار التحول والتطوير نحو: ${targetRole || 'مختص مهني'}`,
      estimatedMonths: 6,
      keySkillsToLearn: ['التفكير التحليلي', 'إدارة المشاريع', 'التواصل التقني', 'إتقان الأدوات الحديثة'],
      steps: [
        { phase: 'المرحلة الأولى (الشهر 1-2)', action: 'دراسة المفاهيم والأدوات الأساسية وإتقان التطبيق الميداني' },
        { phase: 'المرحلة الثانية (الشهر 3-4)', action: 'بناء وتوثيق 3 مشاريع تخرج حقيقية محاكية لسوق العمل العراقي' },
        { phase: 'المرحلة الثالثة (الشهر 5-6)', action: 'تجهيز السيرة الذاتية والتقديم على شركات MIZN الموثوقة' }
      ],
      iraqMarketInsights: `تشهد وظائف ${targetRole} نمواً ملحوظاً في ${governorate || 'بغداد وأربيل'} مع متوسط رواتب ممتازة بالدينار العراقي.`,
      recommendedCourses: [
        'الدبلوم الاحترافي لتطوير التطبيقات والويب',
        'مهارات التواصل والعمل الجماعي في الشركات'
      ]
    };
  }
}
