import { AiMatchResult, Job, UserProfile } from '../types';

export function calculateJobMatch(candidate: UserProfile, job: Job): AiMatchResult {
  const candidateSkills = (candidate.skills || []).map(s => s.toLowerCase().trim());
  const requiredSkills = (job.requiredSkills || []).map(s => s.toLowerCase().trim());

  let matchingSkills: string[] = [];
  let missingSkills: string[] = [];

  if (requiredSkills.length > 0) {
    requiredSkills.forEach(req => {
      if (candidateSkills.some(cs => cs.includes(req) || req.includes(cs))) {
        matchingSkills.push(req.toUpperCase());
      } else {
        missingSkills.push(req.toUpperCase());
      }
    });
  }

  const skillMatchPct = requiredSkills.length > 0
    ? Math.round((matchingSkills.length / requiredSkills.length) * 100)
    : 85;

  // Experience Match
  const reqExp = job.experienceYears || 0;
  const candExp = candidate.experienceYears || 0;
  let experienceMatchPct = 100;
  if (candExp < reqExp) {
    experienceMatchPct = Math.max(40, Math.round((candExp / Math.max(1, reqExp)) * 100));
  }

  // Location Match
  const candidateGov = (candidate.governorate || '').split(' ')[0];
  const jobGov = (job.governorate || '').split(' ')[0];
  const isRemote = job.workMode === 'Remote';
  const locationMatchPct = (isRemote || candidateGov === jobGov) ? 100 : 70;

  // Calculate Weighted Overall Score
  // 50% Skills, 30% Experience, 20% Location
  const overallScore = Math.min(
    99,
    Math.round(skillMatchPct * 0.5 + experienceMatchPct * 0.3 + locationMatchPct * 0.2)
  );

  const reasons: string[] = [];
  if (skillMatchPct >= 80) {
    reasons.push(`تطابق ممتاز للمهارات المطلوب (%${skillMatchPct})`);
  } else if (skillMatchPct >= 50) {
    reasons.push(`تطابق متوسط للمهارات (%${skillMatchPct}) - ينصح بالتدريب على: ${missingSkills.slice(0, 2).join(', ')}`);
  } else {
    reasons.push(`نقص في المهارات الرئيسية المطلوبة (%${skillMatchPct})`);
  }

  if (candExp >= reqExp) {
    reasons.push(`الخبرة العملية كافية وتطابق المتطلبات (${candExp} سنوات)`);
  } else {
    reasons.push(`الخبرة المسجلة (${candExp} سنوات) أقل من الحد المطلوب (${reqExp} سنوات)`);
  }

  if (isRemote) {
    reasons.push('العمل عن بعد متوافق من أي محافظة داخل العراق');
  } else if (candidateGov === jobGov) {
    reasons.push(`تطابق الموقع الجغرافي والمحافظة (${jobGov})`);
  } else {
    reasons.push(`الوظيفة في ${jobGov} وسكنك في ${candidateGov}`);
  }

  return {
    score: overallScore,
    skillMatchPct,
    experienceMatchPct,
    locationMatchPct,
    matchingSkills,
    missingSkills,
    reasons,
  };
}
