import assert from 'node:assert';
import { test } from 'node:test';
import { JobService } from './jobService';
import { CompanyService } from './companyService';
import { Job } from '../types';

const testJobs: Job[] = [
  {
    id: 'test-j-1',
    companyId: 'c-1',
    companyName: 'شركة دجلة',
    title: 'Senior Frontend Developer React',
    description: 'React developer position',
    responsibilities: [],
    qualifications: [],
    requiredSkills: ['React', 'TypeScript'],
    experienceYears: 3,
    jobType: 'Full-Time',
    governorate: 'بغداد (Baghdad)',
    city: 'المنصور',
    workMode: 'On-site',
    salaryRangeIQD: { min: 1800000, max: 2500000, showSalary: true },
    vacancies: 2,
    isVerifiedSource: true,
    sourceType: 'Private Verified',
    postedAt: '2025-02-01',
    expiresAt: '2025-12-31',
    status: 'Active',
  },
  {
    id: 'test-j-2',
    companyId: 'c-2',
    companyName: 'وزارة الاتصالات',
    title: 'مهندس شبكات وسيرفرات (حكومي)',
    description: 'وظيفة حكومية في بغداد',
    responsibilities: [],
    qualifications: [],
    requiredSkills: ['Networking', 'Linux'],
    experienceYears: 1,
    jobType: 'Government',
    governorate: 'بغداد (Baghdad)',
    city: 'شارع فلسطين',
    workMode: 'On-site',
    salaryRangeIQD: { min: 1000000, max: 1400000, showSalary: true },
    vacancies: 5,
    isVerifiedSource: true,
    sourceType: 'Government',
    postedAt: '2025-01-15',
    expiresAt: '2025-11-30',
    status: 'Active',
  },
  {
    id: 'test-j-3',
    companyId: 'c-1',
    companyName: 'شركة دجلة',
    title: 'UI/UX Designer',
    description: 'Remote design position',
    responsibilities: [],
    qualifications: [],
    requiredSkills: ['Figma', 'UI Design'],
    experienceYears: 2,
    jobType: 'Full-Time',
    governorate: 'أربيل (Erbil)',
    city: 'عنكاوا',
    workMode: 'Remote',
    salaryRangeIQD: { min: 1200000, max: 1800000, showSalary: true },
    vacancies: 1,
    isVerifiedSource: true,
    sourceType: 'Private Verified',
    postedAt: '2025-02-10',
    expiresAt: '2025-10-30',
    status: 'Active',
  },
  {
    id: 'test-j-expired',
    companyId: 'c-1',
    companyName: 'Old Corp',
    title: 'Expired Job',
    description: 'Old listing',
    responsibilities: [],
    qualifications: [],
    requiredSkills: ['Excel'],
    experienceYears: 1,
    jobType: 'Part-Time',
    governorate: 'البصرة (Basra)',
    city: 'المعقل',
    workMode: 'On-site',
    salaryRangeIQD: { min: 500000, max: 800000, showSalary: true },
    vacancies: 1,
    isVerifiedSource: false,
    sourceType: 'Direct Employer',
    postedAt: '2020-01-01',
    expiresAt: '2020-02-01', // Expired
    status: 'Active',
  },
];

test('JobService.filterJobs correctly filters by governorate and job type', () => {
  const erbilJobs = JobService.filterJobs(testJobs, { governorate: 'أربيل (Erbil)' });
  assert.strictEqual(erbilJobs.length, 1);
  assert.strictEqual(erbilJobs[0].title, 'UI/UX Designer');

  const govJobs = JobService.filterJobs(testJobs, { jobType: 'Government' });
  assert.strictEqual(govJobs.length, 1);
  assert.strictEqual(govJobs[0].title, 'مهندس شبكات وسيرفرات (حكومي)');
});

test('JobService.filterJobs correctly filters by salary range in IQD', () => {
  const highSalaryJobs = JobService.filterJobs(testJobs, { minSalaryIQD: 1500000 });
  assert.strictEqual(highSalaryJobs.length, 1);
  assert.strictEqual(highSalaryJobs[0].id, 'test-j-1');
});

test('JobService.filterJobs performs multi-field search query', () => {
  const searchReact = JobService.filterJobs(testJobs, { searchQuery: 'React' });
  assert.strictEqual(searchReact.length, 1);
  assert.strictEqual(searchReact[0].id, 'test-j-1');

  const searchFigma = JobService.filterJobs(testJobs, { searchQuery: 'Figma' });
  assert.strictEqual(searchFigma.length, 1);
  assert.strictEqual(searchFigma[0].id, 'test-j-3');
});

test('CompanyService manages company creation and admin verification transitions', async () => {
  const company = await CompanyService.createCompany({
    name: 'شركة الفرات للتقنية',
    sector: 'البرمجيات',
    governorate: 'النجف (Najaf)',
    city: 'حي الحسين',
    description: 'تطوير التطبيقات',
    contactEmail: 'info@furat.iq',
    members: [],
  });

  assert.strictEqual(company.verificationStatus, 'Pending');

  const verified = await CompanyService.updateVerificationStatus(company.id, 'Verified', 'https://docs.furat.iq/cr.pdf');
  assert.strictEqual(verified?.verificationStatus, 'Verified');
  assert.ok(verified?.verifiedAt);
});
