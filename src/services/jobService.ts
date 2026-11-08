import { Job, JobType, IraqiGovernorate } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_JOBS } from '../data/mockData';

export interface JobFilterOptions {
  searchQuery?: string;
  governorate?: IraqiGovernorate | 'ALL';
  jobType?: JobType | 'ALL';
  workMode?: 'On-site' | 'Hybrid' | 'Remote' | 'ALL';
  minSalaryIQD?: number;
  maxSalaryIQD?: number;
  maxExperienceYears?: number;
  onlyVerifiedSources?: boolean;
  sortBy?: 'newest' | 'salary' | 'exp';
}

export class JobService {
  // Get all jobs with auto-expiry check
  static async getJobs(): Promise<Job[]> {
    let rawJobs: Job[] = [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('jobs').select('*');
        if (!error && data) {
          rawJobs = data as Job[];
        }
      } catch (err) {
        console.warn('Supabase fetch jobs error:', err);
      }
    }

    if (rawJobs.length === 0) {
      let stored: string | null = null;
      if (typeof localStorage !== 'undefined') {
        stored = localStorage.getItem('mizn_jobs');
      }
      rawJobs = stored ? JSON.parse(stored) : MOCK_JOBS;
    }

    // Auto-expiry check: Transition jobs past expiresAt date to 'Closed' status
    const now = new Date();
    const checkedJobs = rawJobs.map(j => {
      if (j.status === 'Active' && j.expiresAt) {
        const expiryDate = new Date(j.expiresAt);
        if (expiryDate < now) {
          return { ...j, status: 'Closed' as const };
        }
      }
      return j;
    });

    return checkedJobs;
  }

  // Filter jobs based on advanced search options
  static filterJobs(jobs: Job[], options: JobFilterOptions): Job[] {
    const {
      searchQuery = '',
      governorate = 'ALL',
      jobType = 'ALL',
      workMode = 'ALL',
      minSalaryIQD = 0,
      maxSalaryIQD,
      maxExperienceYears,
      onlyVerifiedSources = false,
      sortBy = 'newest',
    } = options;

    return jobs.filter(job => {
      // 1. Governorate Filter
      if (governorate !== 'ALL' && job.governorate !== governorate) {
        return false;
      }

      // 2. Job Type Filter
      if (jobType !== 'ALL' && job.jobType !== jobType) {
        return false;
      }

      // 3. Work Mode Filter
      if (workMode !== 'ALL' && job.workMode !== workMode) {
        return false;
      }

      // 4. Salary Range IQD Filter
      if (minSalaryIQD > 0 && job.salaryRangeIQD.min < minSalaryIQD) {
        return false;
      }
      if (maxSalaryIQD && maxSalaryIQD > 0 && job.salaryRangeIQD.max > maxSalaryIQD) {
        return false;
      }

      // 5. Experience Level Filter
      if (maxExperienceYears !== undefined && job.experienceYears > maxExperienceYears) {
        return false;
      }

      // 6. Verified Source Only Filter
      if (onlyVerifiedSources && !job.isVerifiedSource) {
        return false;
      }

      // 7. Search Query Filter (Title, Company, Skills, Governorate, City)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.companyName.toLowerCase().includes(q);
        const matchGov = job.governorate.toLowerCase().includes(q);
        const matchCity = job.city.toLowerCase().includes(q);
        const matchSkills = job.requiredSkills.some(s => s.toLowerCase().includes(q));

        if (!matchTitle && !matchCompany && !matchGov && !matchCity && !matchSkills) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'salary') {
        return b.salaryRangeIQD.max - a.salaryRangeIQD.max;
      }
      if (sortBy === 'exp') {
        return a.experienceYears - b.experienceYears;
      }
      // Newest
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });
  }

  // Create new job posting
  static async createJob(newJob: Omit<Job, 'id' | 'postedAt' | 'status'>): Promise<Job> {
    const created: Job = {
      ...newJob,
      id: `job-${Date.now()}`,
      postedAt: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('jobs').insert([{
          id: created.id,
          company_id: created.companyId,
          company_name: created.companyName,
          title: created.title,
          description: created.description,
          responsibilities: created.responsibilities,
          required_skills: created.requiredSkills,
          experience_years: created.experienceYears,
          job_type: created.jobType,
          governorate: created.governorate,
          city: created.city,
          work_mode: created.workMode,
          min_salary_iqd: created.salaryRangeIQD.min,
          max_salary_iqd: created.salaryRangeIQD.max,
          show_salary: created.salaryRangeIQD.showSalary,
          vacancies: created.vacancies,
          status: 'Active',
          expires_at: created.expiresAt,
        }]);
      } catch (err) {
        console.warn('Supabase job insert error:', err);
      }
    }

    const currentJobs = await this.getJobs();
    const updatedList = [created, ...currentJobs];
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mizn_jobs', JSON.stringify(updatedList));
    }

    return created;
  }
}
