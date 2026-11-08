import assert from 'node:assert';
import { test } from 'node:test';
import { calculateJobMatch } from './aiMatcher';
import { Job, UserProfile } from '../types';

const mockCandidate: UserProfile = {
  id: 'cand-test-1',
  name: 'احمد المحمداوي',
  email: 'ahmed@test.iq',
  role: 'JOB_SEEKER',
  governorate: 'بغداد (Baghdad)',
  city: 'الكرادة',
  experienceYears: 3,
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
  languages: ['العربية', 'English'],
  createdAt: '2025-01-01',
};

const mockJob: Job = {
  id: 'job-test-1',
  companyId: 'comp-1',
  companyName: 'Test Tech Iraq',
  title: 'Frontend Engineer',
  description: 'Looking for React developer',
  responsibilities: [],
  qualifications: [],
  requiredSkills: ['React', 'TypeScript', 'Node.js'],
  experienceYears: 2,
  jobType: 'Full-Time',
  governorate: 'بغداد (Baghdad)',
  city: 'الكرادة',
  workMode: 'On-site',
  salaryRangeIQD: { min: 1500000, max: 2000000, showSalary: true },
  vacancies: 1,
  isVerifiedSource: true,
  sourceType: 'Private Verified',
  postedAt: '2025-01-01',
  expiresAt: '2025-12-31',
  status: 'Active',
};

test('calculateJobMatch returns high score for matching skills and location', () => {
  const result = calculateJobMatch(mockCandidate, mockJob);
  assert.strictEqual(result.skillMatchPct, 100);
  assert.strictEqual(result.locationMatchPct, 100);
  assert.strictEqual(result.experienceMatchPct, 100);
  assert.ok(result.score >= 90);
  assert.strictEqual(result.matchingSkills.length, 3);
  assert.strictEqual(result.missingSkills.length, 0);
});

test('calculateJobMatch handles missing skills gracefully', () => {
  const candidateLackingSkills: UserProfile = {
    ...mockCandidate,
    skills: ['HTML', 'CSS'],
  };
  const result = calculateJobMatch(candidateLackingSkills, mockJob);
  assert.strictEqual(result.skillMatchPct, 0);
  assert.ok(result.score < 60);
  assert.strictEqual(result.missingSkills.length, 3);
});

test('calculateJobMatch grants 100% location score for Remote jobs', () => {
  const remoteJob: Job = {
    ...mockJob,
    governorate: 'أربيل (Erbil)',
    workMode: 'Remote',
  };
  const result = calculateJobMatch(mockCandidate, remoteJob);
  assert.strictEqual(result.locationMatchPct, 100);
});
