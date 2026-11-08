import assert from 'node:assert';
import { test } from 'node:test';
import { EducationService, OpportunityService } from './educationService';
import { Course, Opportunity } from '../types';

const mockCourse: Course = {
  id: 'c-test-1',
  title: 'Full-Stack Web Dev',
  provider: 'أكاديمية MIZN',
  description: 'Test course',
  category: 'Software Development',
  level: 'Beginner',
  durationHours: 30,
  skillsGained: ['React', 'Node.js'],
  lessonsCount: 3,
  enrolledCount: 100,
  rating: 4.9,
  isFree: true,
  certificateProvided: true,
  modules: [
    { id: 'm1', title: 'Lesson 1', durationMinutes: 30 },
    { id: 'm2', title: 'Lesson 2', durationMinutes: 45 },
    { id: 'm3', title: 'Lesson 3', durationMinutes: 60 },
  ],
};

test('EducationService tracks lesson completion and calculates progress percentage', () => {
  // Complete 1 lesson out of 3
  const progress1 = EducationService.completeLesson(mockCourse, 'm1');
  assert.strictEqual(progress1.completedLessonIds.length, 1);
  assert.strictEqual(progress1.progressPct, 33);
  assert.strictEqual(progress1.isCompleted, false);

  // Complete remaining lessons
  EducationService.completeLesson(mockCourse, 'm2');
  const progress3 = EducationService.completeLesson(mockCourse, 'm3');
  assert.strictEqual(progress3.completedLessonIds.length, 3);
  assert.strictEqual(progress3.progressPct, 100);
  assert.strictEqual(progress3.isCompleted, true);
});

test('OpportunityService retrieves and filters verified opportunities', async () => {
  const opps = await OpportunityService.getOpportunities('Scholarship');
  assert.ok(opps.length >= 1);
  assert.strictEqual(opps[0].type, 'Scholarship');
  assert.ok(opps[0].isVerified);
  assert.ok(opps[0].applyLink.startsWith('http'));
});
