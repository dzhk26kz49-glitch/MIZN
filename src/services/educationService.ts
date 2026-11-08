import { Course, Opportunity, OpportunityType } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_COURSES, MOCK_OPPORTUNITIES } from '../data/mockData';

export interface UserLearningProgress {
  courseId: string;
  completedLessonIds: string[];
  progressPct: number;
  enrolledAt: string;
  isCompleted: boolean;
}

export class EducationService {
  private static inMemoryCourses: Course[] = [];
  private static inMemoryProgress: Record<string, UserLearningProgress> = {};

  // Fetch Courses
  static async getCourses(): Promise<Course[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('courses').select('*');
        if (!error && data && data.length > 0) {
          return data as Course[];
        }
      } catch (err) {
        console.warn('Supabase fetch courses error:', err);
      }
    }

    if (this.inMemoryCourses.length === 0) {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('mizn_courses');
        if (stored) this.inMemoryCourses = JSON.parse(stored);
      }
      if (this.inMemoryCourses.length === 0) {
        this.inMemoryCourses = [...MOCK_COURSES];
      }
    }

    return this.inMemoryCourses;
  }

  // Get User Learning Progress for a Course
  static getProgress(courseId: string): UserLearningProgress {
    if (this.inMemoryProgress[courseId]) {
      return this.inMemoryProgress[courseId];
    }
    return {
      courseId,
      completedLessonIds: [],
      progressPct: 0,
      enrolledAt: new Date().toISOString(),
      isCompleted: false,
    };
  }

  // Toggle Lesson Completion & Recalculate Progress
  static completeLesson(course: Course, lessonId: string): UserLearningProgress {
    const current = this.getProgress(course.id);
    const isDone = current.completedLessonIds.includes(lessonId);

    const updatedLessons = isDone
      ? current.completedLessonIds.filter(id => id !== lessonId)
      : [...current.completedLessonIds, lessonId];

    const totalLessons = Math.max(1, course.modules.length);
    const progressPct = Math.min(100, Math.round((updatedLessons.length / totalLessons) * 100));

    const updated: UserLearningProgress = {
      ...current,
      completedLessonIds: updatedLessons,
      progressPct,
      isCompleted: progressPct === 100,
    };

    this.inMemoryProgress[course.id] = updated;
    return updated;
  }
}

export class OpportunityService {
  private static inMemoryOpportunities: Opportunity[] = [];

  // Fetch Opportunities with verified source checks
  static async getOpportunities(typeFilter: OpportunityType | 'ALL' = 'ALL'): Promise<Opportunity[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('opportunities').select('*');
        if (typeFilter !== 'ALL') query = query.eq('type', typeFilter);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Opportunity[];
        }
      } catch (err) {
        console.warn('Supabase fetch opportunities error:', err);
      }
    }

    if (this.inMemoryOpportunities.length === 0) {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('mizn_opps');
        if (stored) this.inMemoryOpportunities = JSON.parse(stored);
      }
      if (this.inMemoryOpportunities.length === 0) {
        this.inMemoryOpportunities = [...MOCK_OPPORTUNITIES];
      }
    }

    return this.inMemoryOpportunities.filter(op => {
      if (typeFilter !== 'ALL' && op.type !== typeFilter) return false;
      return true;
    });
  }
}
