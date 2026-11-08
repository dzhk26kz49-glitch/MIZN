import assert from 'node:assert';
import { test } from 'node:test';
import { AutomationService } from './automationService';
import { Job, Opportunity } from '../types';

const mockJobs: Job[] = [
  {
    id: 'j-auto-1',
    companyId: 'c1',
    companyName: 'Dijlah Tech',
    title: 'Active Job',
    description: 'Active',
    responsibilities: [],
    qualifications: [],
    requiredSkills: [],
    experienceYears: 1,
    jobType: 'Full-Time',
    governorate: 'بغداد (Baghdad)',
    city: 'المنصور',
    workMode: 'On-site',
    salaryRangeIQD: { min: 1000000, max: 1500000, showSalary: true },
    vacancies: 1,
    isVerifiedSource: true,
    sourceType: 'Private Verified',
    postedAt: '2025-01-01',
    expiresAt: '2026-12-31', // Active
    status: 'Active',
  },
  {
    id: 'j-auto-expired',
    companyId: 'c1',
    companyName: 'Dijlah Tech',
    title: 'Expired Job',
    description: 'Expired',
    responsibilities: [],
    qualifications: [],
    requiredSkills: [],
    experienceYears: 1,
    jobType: 'Full-Time',
    governorate: 'بغداد (Baghdad)',
    city: 'المنصور',
    workMode: 'On-site',
    salaryRangeIQD: { min: 1000000, max: 1500000, showSalary: true },
    vacancies: 1,
    isVerifiedSource: true,
    sourceType: 'Private Verified',
    postedAt: '2020-01-01',
    expiresAt: '2020-02-01', // Expired
    status: 'Active',
  },
];

test('AutomationService.shouldSendNotification prevents duplicate spam', () => {
  const first = AutomationService.shouldSendNotification('user-1', 'تنبيه', 'رسالة تنبيهية');
  const second = AutomationService.shouldSendNotification('user-1', 'تنبيه', 'رسالة تنبيهية');

  assert.strictEqual(first, true);
  assert.strictEqual(second, false); // Blocked duplicate
});

test('AutomationService.runAutoExpiryTask marks expired jobs as Closed', () => {
  AutomationService.setAutomationMasterSwitch(true);
  const { updatedJobs, log } = AutomationService.runAutoExpiryTask(mockJobs);

  assert.strictEqual(log.status, 'SUCCESS');
  assert.strictEqual(log.itemsProcessed, 1);
  assert.strictEqual(updatedJobs.find(j => j.id === 'j-auto-expired')?.status, 'Closed');
});

test('AutomationService Master Kill Switch pauses background tasks', () => {
  AutomationService.setAutomationMasterSwitch(false);
  const { log } = AutomationService.runAutoExpiryTask(mockJobs);

  assert.strictEqual(log.status, 'PAUSED');
  assert.strictEqual(log.itemsProcessed, 0);

  // Restore
  AutomationService.setAutomationMasterSwitch(true);
});
