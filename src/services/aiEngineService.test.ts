import assert from 'node:assert';
import { test } from 'node:test';
import { AiEngineService } from './aiEngineService';
import { Job, UserProfile } from '../types';

const mockCandidate: UserProfile = {
  id: 'cand-ai-test',
  name: 'زينب البغدادي',
  email: 'zainab@baghdad.iq',
  role: 'JOB_SEEKER',
  governorate: 'بغداد (Baghdad)',
  city: 'المنصور',
  skills: ['React', 'TypeScript', 'Tailwind', 'PostgreSQL'],
  languages: ['العربية', 'English'],
  createdAt: '2025-01-01',
};

const mockJob: Job = {
  id: 'job-ai-test',
  companyId: 'comp-1',
  companyName: 'Dijlah Tech',
  title: 'React Software Engineer',
  description: 'Building web applications',
  responsibilities: [],
  qualifications: [],
  requiredSkills: ['React', 'TypeScript'],
  experienceYears: 2,
  jobType: 'Full-Time',
  governorate: 'بغداد (Baghdad)',
  city: 'المنصور',
  workMode: 'On-site',
  salaryRangeIQD: { min: 1800000, max: 2500000, showSalary: true },
  vacancies: 1,
  isVerifiedSource: true,
  sourceType: 'Private Verified',
  postedAt: '2025-01-01',
  expiresAt: '2025-12-31',
  status: 'Active',
};

test('AiEngineService.analyzeResumeLocally extracts skills and provides confidence & disclaimer', () => {
  const cvText = 'أنا مهندسة برمجيات أمتلك خبرة في بناء الواجهات باستخدام React وTypeScript وTailwind وPostgreSQL.';
  const result = AiEngineService.analyzeResumeLocally(cvText, 'React Engineer', 'بغداد (Baghdad)');

  assert.ok(result.extractedSkills.length >= 3);
  assert.ok(result.overallScore > 60);
  assert.strictEqual(result.confidenceLevel, 'HIGH');
  assert.ok(result.disclaimer.includes('قرار توظيف آلي'));
});

test('AiEngineService.evaluateJobMatch calculates match reasons and confidence level', () => {
  const matchResult = AiEngineService.evaluateJobMatch(mockCandidate, mockJob);

  assert.strictEqual(matchResult.skillMatchPct, 100);
  assert.strictEqual(matchResult.confidenceLevel, 'HIGH');
  assert.ok(matchResult.reasons.length >= 2);
  assert.ok(matchResult.disclaimer.includes('توصيات استشارية'));
});

test('AiEngineService.generateCareerRoadmapLocally provides structured steps and learning path', () => {
  const roadmap = AiEngineService.generateCareerRoadmapLocally('خريجة جديدة', 'Frontend Lead', 'أربيل (Erbil)');

  assert.ok(roadmap.steps.length >= 3);
  assert.ok(roadmap.keySkillsToLearn.length >= 2);
  assert.ok(roadmap.iraqMarketInsights.includes('أربيل'));
});
