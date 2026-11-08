-- ====================================================================
-- MIZN PLATFORM — INITIAL POSTGRESQL DB SCHEMA & RLS POLICIES (MIGRATION 00001)
-- Target: Supabase / Cloud PostgreSQL
-- ====================================================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM (
  'JOB_SEEKER',
  'STUDENT',
  'GRADUATE',
  'COMPANY_OWNER',
  'RECRUITER',
  'ADMIN',
  'SUPER_ADMIN'
);

CREATE TYPE verification_status AS ENUM ('Pending', 'Verified', 'Rejected', 'Suspended');

CREATE TYPE application_status AS ENUM (
  'Submitted',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Accepted',
  'Rejected',
  'Withdrawn'
);

CREATE TYPE job_type AS ENUM ('Full-Time', 'Part-Time', 'Freelance', 'Government', 'Internship');

-- 2. PROFILES TABLE (Tied to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'JOB_SEEKER',
  governorate TEXT NOT NULL DEFAULT 'بغداد (Baghdad)',
  city TEXT NOT NULL DEFAULT 'المركز',
  avatar_url TEXT,
  title TEXT,
  bio TEXT,
  education TEXT,
  experience_years INT DEFAULT 0,
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{"العربية"}',
  expected_salary_iqd INT,
  target_job_type job_type DEFAULT 'Full-Time',
  cv_url TEXT,
  cv_data JSONB,
  company_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT NOT NULL,
  website TEXT,
  contact_email TEXT NOT NULL,
  verification_status verification_status DEFAULT 'Pending',
  verification_document_url TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COMPANY MEMBERS TABLE (RBAC)
CREATE TABLE IF NOT EXISTS public.company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_role TEXT DEFAULT 'Recruiter',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

-- 5. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  company_logo TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  qualifications TEXT[] DEFAULT '{}',
  required_skills TEXT[] DEFAULT '{}',
  experience_years INT DEFAULT 0,
  job_type job_type NOT NULL DEFAULT 'Full-Time',
  work_hours TEXT,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  work_mode TEXT NOT NULL DEFAULT 'On-site',
  min_salary_iqd INT DEFAULT 0,
  max_salary_iqd INT DEFAULT 0,
  show_salary BOOLEAN DEFAULT true,
  vacancies INT DEFAULT 1,
  is_verified_source BOOLEAN DEFAULT false,
  source_type TEXT DEFAULT 'Direct Employer',
  status TEXT DEFAULT 'Active',
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- 6. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_score INT DEFAULT 0,
  status application_status DEFAULT 'Submitted',
  cover_note TEXT,
  cv_url TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(job_id, candidate_id)
);

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- JOBS POLICIES
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (status = 'Active');

CREATE POLICY "Company owners can insert jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_members
      WHERE company_members.company_id = jobs.company_id
        AND company_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can update their jobs"
  ON public.jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.company_members
      WHERE company_members.company_id = jobs.company_id
        AND company_members.user_id = auth.uid()
    )
  );

-- APPLICATIONS POLICIES
CREATE POLICY "Candidates can view their own applications"
  ON public.applications FOR SELECT
  USING (candidate_id = auth.uid());

CREATE POLICY "Company owners can view applications for their jobs"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      JOIN public.company_members ON company_members.company_id = jobs.company_id
      WHERE jobs.id = applications.job_id
        AND company_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can insert applications"
  ON public.applications FOR INSERT
  WITH CHECK (candidate_id = auth.uid());

-- AUDIT LOGS POLICIES
CREATE POLICY "Only admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );
