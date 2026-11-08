import assert from 'node:assert';
import { test } from 'node:test';
import { ApplicationService } from './applicationService';
import { CandidateService } from './candidateService';
import { UserProfile, CvBuilderData } from '../types';

const mockCandidate: UserProfile = {
  id: 'cand-phase4-1',
  name: 'مصطفى البصري',
  email: 'mustafa@basra.iq',
  phone: '+964 780 111 2222',
  role: 'JOB_SEEKER',
  governorate: 'البصرة (Basra)',
  city: 'المعقل',
  skills: ['SQL', 'Python'],
  languages: ['العربية', 'English'],
  createdAt: '2025-01-01',
};

test('ApplicationService.applyToJob submits application successfully', async () => {
  const result = await ApplicationService.applyToJob(
    'job-phase4-test',
    'Data Analyst',
    'شركة البصرة للنفط والخدمات',
    mockCandidate,
    'أنا مهتم بالتقديم على هذه الوظيفة'
  );

  assert.strictEqual(result.error, null);
  assert.ok(result.application);
  assert.strictEqual(result.application?.candidateId, mockCandidate.id);
  assert.strictEqual(result.application?.status, 'Submitted');
});

test('ApplicationService.applyToJob prevents duplicate submissions for the same job', async () => {
  // Try applying again to the same job
  const duplicateResult = await ApplicationService.applyToJob(
    'job-phase4-test',
    'Data Analyst',
    'شركة البصرة للنفط والخدمات',
    mockCandidate
  );

  assert.strictEqual(duplicateResult.application, null);
  assert.ok(duplicateResult.error?.includes('مسبقاً'));
});

test('ApplicationService.updateStatus updates status in hiring pipeline', async () => {
  const { application } = await ApplicationService.applyToJob(
    'job-pipeline-1',
    'Network Engineer',
    'Tech Iraq',
    mockCandidate
  );

  assert.ok(application);
  const updated = await ApplicationService.updateStatus(application.id, 'Interview', 'تم تحديد موعد مقابلة عبر Zoom');
  
  assert.strictEqual(updated?.status, 'Interview');
  assert.strictEqual(updated?.notes, 'تم تحديد موعد مقابلة عبر Zoom');
});

test('CandidateService.exportCvToPdf creates printable PDF document', () => {
  const cvData: CvBuilderData = {
    fullName: 'مصطفى البصري',
    jobTitle: 'Senior Data Analyst',
    email: 'mustafa@basra.iq',
    phone: '+964 780 111 2222',
    governorate: 'البصرة (Basra)',
    summary: 'خبرة في تحليل البيانات المالية والمصرفية',
    experience: [
      {
        id: 'exp-1',
        company: 'شركة البصرة',
        position: 'Data Analyst',
        startDate: '2022-01',
        endDate: '2024-12',
        description: 'تحليل البيانات وإعداد التقارير الدوريّة',
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'جامعة البصرة',
        degree: 'بكالوريوس',
        fieldOfStudy: 'علوم الحاسوب',
        graduationYear: '2021',
      },
    ],
    skills: ['SQL', 'Python', 'Power BI'],
    languages: ['العربية', 'الإنجليزية'],
  };

  const pdfDoc = CandidateService.exportCvToPdf(cvData);
  assert.ok(pdfDoc);
});
