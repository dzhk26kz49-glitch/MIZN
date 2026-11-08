import { Application, ApplicationStatus, UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export class ApplicationService {
  private static inMemoryApplications: Application[] = [
    {
      id: 'app-init-1',
      jobId: 'job-1',
      jobTitle: 'مطور برمجيات Full-Stack (React & Node.js)',
      companyName: 'شركة دجلة للحلول البرمجية (Dijlah Tech)',
      candidateId: 'user-seeker-1',
      candidateName: 'على حسين العبيدي',
      candidateEmail: 'ali.hassan@mizn.iq',
      candidatePhone: '+964 770 123 4567',
      matchScore: 92,
      status: 'Under Review',
      coverNote: 'أنا مطور برمجيات خبير في React & TypeScript ويسعدني العمل في أربيل.',
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    }
  ];

  // Get applications for candidate or company
  static async getApplications(candidateId?: string, jobId?: string): Promise<Application[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('applications').select('*');
        if (candidateId) query = query.eq('candidate_id', candidateId);
        if (jobId) query = query.eq('job_id', jobId);
        
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Application[];
        }
      } catch (err) {
        console.warn('Supabase fetch applications error:', err);
      }
    }

    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('mizn_apps');
      if (stored) {
        this.inMemoryApplications = JSON.parse(stored);
      }
    }

    return this.inMemoryApplications.filter(a => {
      if (candidateId && a.candidateId !== candidateId) return false;
      if (jobId && a.jobId !== jobId) return false;
      return true;
    });
  }

  // Submit job application with duplicate prevention
  static async applyToJob(
    jobId: string,
    jobTitle: string,
    companyName: string,
    candidate: UserProfile,
    coverNote?: string,
    matchScore: number = 85
  ): Promise<{ application: Application | null; error: string | null }> {
    const existing = (await this.getApplications(candidate.id)).find(a => a.jobId === jobId);
    if (existing) {
      return { application: null, error: 'لقد قمت بالتقديم على هذه الوظيفة مسبقاً.' };
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle,
      companyName,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      candidatePhone: candidate.phone,
      matchScore,
      status: 'Submitted',
      coverNote,
      cvUrl: candidate.cvUrl,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('applications').insert([{
          id: newApp.id,
          job_id: newApp.jobId,
          candidate_id: newApp.candidateId,
          match_score: newApp.matchScore,
          status: newApp.status,
          cover_note: newApp.coverNote,
          cv_url: newApp.cvUrl,
        }]);
      } catch (err) {
        console.warn('Supabase application insert error:', err);
      }
    }

    this.inMemoryApplications = [newApp, ...this.inMemoryApplications];
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mizn_apps', JSON.stringify(this.inMemoryApplications));
    }

    return { application: newApp, error: null };
  }

  // Update application status by employer/recruiter
  static async updateStatus(
    appId: string,
    newStatus: ApplicationStatus,
    notes?: string
  ): Promise<Application | null> {
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('applications')
          .update({
            status: newStatus,
            notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', appId);
      } catch (err) {
        console.warn('Supabase application update status error:', err);
      }
    }

    let updated: Application | null = null;
    this.inMemoryApplications = this.inMemoryApplications.map(a => {
      if (a.id === appId) {
        updated = {
          ...a,
          status: newStatus,
          notes: notes || a.notes,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }
      return a;
    });

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mizn_apps', JSON.stringify(this.inMemoryApplications));
    }

    return updated;
  }
}
