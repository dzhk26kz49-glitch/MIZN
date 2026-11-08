export type UserRole = 
  | 'JOB_SEEKER'
  | 'STUDENT'
  | 'GRADUATE'
  | 'COMPANY_OWNER'
  | 'RECRUITER'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected' | 'Suspended';

export type ApplicationStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export type JobType = 'Full-Time' | 'Part-Time' | 'Freelance' | 'Government' | 'Internship';

export type OpportunityType = 
  | 'Scholarship'
  | 'Internship'
  | 'Fellowship'
  | 'Freelance'
  | 'Graduate Program'
  | 'Competition'
  | 'International';

export type IraqiGovernorate =
  | 'بغداد (Baghdad)'
  | 'أربيل (Erbil)'
  | 'البصرة (Basra)'
  | 'النجف (Najaf)'
  | 'كربلاء (Karbala)'
  | 'الموصل (Mosul)'
  | 'السليمانية (Sulaymaniyah)'
  | 'بابل (Babil)'
  | 'ذي قار (Dhi Qar)'
  | 'كركوك (Kirkuk)'
  | 'الأنبار (Anbar)'
  | 'واسط (Wasit)'
  | 'ميسان (Maysan)'
  | 'ديالى (Diyala)'
  | 'القادسية (Qadisiyyah)'
  | 'صلاح الدين (Salah Al-Din)'
  | 'المثنى (Muthanna)'
  | 'دهوك (Duhok)';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  governorate: IraqiGovernorate;
  city: string;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  education?: string;
  experienceYears?: number;
  skills: string[];
  languages: string[];
  expectedSalaryIQD?: number;
  targetJobType?: JobType;
  cvUrl?: string;
  cvData?: CvBuilderData;
  companyId?: string;
  createdAt: string;
}

export interface CvBuilderData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  governorate: string;
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: string;
  }>;
  skills: string[];
  languages: string[];
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  sector: string;
  governorate: IraqiGovernorate;
  city: string;
  description: string;
  website?: string;
  contactEmail: string;
  verificationStatus: VerificationStatus;
  verificationDocumentUrl?: string;
  verifiedAt?: string;
  members: string[]; // user IDs
  createdAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  requiredSkills: string[];
  experienceYears: number;
  jobType: JobType;
  workHours?: string;
  governorate: IraqiGovernorate;
  city: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  salaryRangeIQD: {
    min: number;
    max: number;
    showSalary: boolean;
  };
  vacancies: number;
  isVerifiedSource: boolean; // Govt verified / Company verified
  sourceType: 'Government' | 'Private Verified' | 'Direct Employer';
  postedAt: string;
  expiresAt: string;
  status: 'Active' | 'Closed' | 'Draft' | 'Suspended';
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  matchScore: number;
  status: ApplicationStatus;
  coverNote?: string;
  cvUrl?: string;
  submittedAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  providerLogo?: string;
  description: string;
  category: 'Software Development' | 'Data & AI' | 'Business & Sales' | 'Languages' | 'Project Management' | 'Design';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  skillsGained: string[];
  lessonsCount: number;
  enrolledCount: number;
  rating: number;
  isFree: boolean;
  certificateProvided: boolean;
  modules: Array<{
    id: string;
    title: string;
    durationMinutes: number;
  }>;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  country: string;
  city?: string;
  description: string;
  eligibility: string[];
  targetAudience: 'Students' | 'Graduates' | 'Both';
  deadline: string;
  applyLink: string;
  isVerified: boolean;
  verifiedAt?: string;
  postedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'APPLICATION_UPDATE' | 'JOB_ALERT' | 'OPPORTUNITY_DEADLINE' | 'VERIFICATION_UPDATE' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface AiMatchResult {
  score: number;
  skillMatchPct: number;
  experienceMatchPct: number;
  locationMatchPct: number;
  matchingSkills: string[];
  missingSkills: string[];
  reasons: string[];
}
