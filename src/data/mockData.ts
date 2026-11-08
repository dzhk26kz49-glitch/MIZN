import { Company, Course, IraqiGovernorate, Job, Opportunity, UserProfile } from '../types';

export const IRAQI_GOVERNORATES: IraqiGovernorate[] = [
  'بغداد (Baghdad)',
  'أربيل (Erbil)',
  'البصرة (Basra)',
  'النجف (Najaf)',
  'كربلاء (Karbala)',
  'الموصل (Mosul)',
  'السليمانية (Sulaymaniyah)',
  'بابل (Babil)',
  'ذي قار (Dhi Qar)',
  'كركوك (Kirkuk)',
  'الأنبار (Anbar)',
  'واسط (Wasit)',
  'ميسان (Maysan)',
  'ديالى (Diyala)',
  'القادسية (Qadisiyyah)',
  'صلاح الدين (Salah Al-Din)',
  'المثنى (Muthanna)',
  'دهوك (Duhok)',
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-seeker-1',
    name: 'على حسين العبيدي',
    email: 'ali.hassan@mizn.iq',
    phone: '+964 770 123 4567',
    role: 'JOB_SEEKER',
    governorate: 'بغداد (Baghdad)',
    city: 'المنصور',
    title: 'مهندس برمجيات واجهات أمامي (Frontend Developer)',
    bio: 'مهندس برمجيات خبرة 3 سنوات في بناء تطبيقات React & TypeScript متجاوبة ومطابقة للمواصفات العالمية.',
    education: 'بكالوريوس هندسة حاسبات - جامعة بغداد (2022)',
    experienceYears: 3,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Git', 'REST API', 'Figma'],
    languages: ['العربية (اللغة الأم)', 'English (Professional)'],
    expectedSalaryIQD: 1800000,
    targetJobType: 'Full-Time',
    cvUrl: '#',
    cvData: {
      fullName: 'علي حسين العبيدي',
      jobTitle: 'Frontend Software Engineer',
      email: 'ali.hassan@mizn.iq',
      phone: '+964 770 123 4567',
      governorate: 'بغداد (Baghdad)',
      summary: 'مطور واجهات ومصمم تجربة مستخدم مع شغف ببناء منصات سريعة وآمنة في العراق.',
      experience: [
        {
          id: 'exp-1',
          company: 'شركة دجلة للتقنية',
          position: 'Senior Frontend Developer',
          startDate: '2023-01',
          endDate: 'الحالي',
          description: 'تطوير منصة التجارة الإلكترونية وأنظمة إدارة المخازن باستخدام React وTypeScript.'
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'جامعة بغداد - كلية الهندسة',
          degree: 'بكالوريوس',
          fieldOfStudy: 'هندسة الحاسوب والبرمجيات',
          graduationYear: '2022'
        }
      ],
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'REST API', 'Figma'],
      languages: ['العربية', 'الإنجليزية']
    },
    createdAt: '2025-01-10'
  },
  {
    id: 'user-company-1',
    name: 'سارة الكرخي (مديرة التوظيف)',
    email: 'hr@techcorp.iq',
    phone: '+964 750 987 6543',
    role: 'COMPANY_OWNER',
    governorate: 'أربيل (Erbil)',
    city: 'عنكاوا',
    title: 'رئيس قسم الموارد البشرية - شركة دجلة للتقنية',
    companyId: 'comp-1',
    skills: ['Recruitment', 'HR Management', 'Tech Hiring'],
    languages: ['العربية', 'الكردية', 'English'],
    createdAt: '2025-01-01'
  },
  {
    id: 'user-admin-1',
    name: 'د. ليث البغدادي (مدير المنصة)',
    email: 'admin@mizn.iq',
    phone: '+964 780 000 1111',
    role: 'SUPER_ADMIN',
    governorate: 'بغداد (Baghdad)',
    city: 'الجادرية',
    title: 'Super Admin Engine Lead',
    skills: ['Platform Governance', 'Cybersecurity', 'Database Operations'],
    languages: ['العربية', 'English'],
    createdAt: '2024-12-01'
  }
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'شركة دجلة للحلول البرمجية (Dijlah Tech)',
    sector: 'تكنولوجيا المعلومات والبرمجيات',
    governorate: 'أربيل (Erbil)',
    city: 'شارع 100',
    description: 'شركة عراقية رائدة في تطوير الحلول الرقمية، وتطبيقات الهاتف المحمول، والتحول الرقمي للمؤسسات.',
    website: 'https://dijlah-tech.iq',
    contactEmail: 'contact@dijlah-tech.iq',
    verificationStatus: 'Verified',
    verifiedAt: '2025-01-15',
    members: ['user-company-1'],
    createdAt: '2024-11-20'
  },
  {
    id: 'comp-2',
    name: 'مصرف سومر الرقمي (Sumer Digital Bank)',
    sector: 'البنوك والخدمات المالية',
    governorate: 'بغداد (Baghdad)',
    city: 'الكرادة',
    description: 'أول منصة مصرفية رقمية متكاملة تقدم خدمات الفينتك والحلول المالية الذكية للأفراد والشركات في العراق.',
    website: 'https://sumerbank.iq',
    contactEmail: 'careers@sumerbank.iq',
    verificationStatus: 'Verified',
    verifiedAt: '2025-02-01',
    members: [],
    createdAt: '2024-10-10'
  },
  {
    id: 'comp-3',
    name: 'مجموعة الرافدين للخدمات اللوجستية',
    sector: 'اللوجستيات والشحن',
    governorate: 'البصرة (Basra)',
    city: 'المعقل',
    description: 'إدارة عمليات النقل والشحن البحري والبري وتوفير أنظمة إدارة سلاسل الإمداد.',
    contactEmail: 'jobs@rafidain-logistics.iq',
    verificationStatus: 'Pending',
    members: [],
    createdAt: '2025-02-18'
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    companyId: 'comp-1',
    companyName: 'شركة دجلة للحلول البرمجية (Dijlah Tech)',
    title: 'مطور برمجيات Full-Stack (React & Node.js)',
    description: 'نبحث عن مطور Full-Stack موهوب للانضمام إلى فريقنا في أربيل لبناء وتطوير منصات سحابية عالية الأداء.',
    responsibilities: [
      'تطوير الواجهات الأمامية باستخدام React وTypeScript وTailwind CSS.',
      'بناء واجهات API سريعة وآمنة باستخدام Node.js وExpress.',
      'تحسين أداء الاستعلامات وتكامل قواعد البيانات PostgreSQL.',
      'التعاون مع فريق تصميم UX/UI لكتابة كود نظيف وقابل للتطوير.'
    ],
    qualifications: [
      'شهادة بكالوريوس في علوم الحاسوب أو هندسة البرمجيات أو خبرة مكافئة.',
      'خبرة لا تقل عن سنتين في تطوير React & Node.js.',
      'إتقان التعامل مع Git وأنظمة CI/CD.'
    ],
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git'],
    experienceYears: 2,
    jobType: 'Full-Time',
    workHours: '8 ساعات يومياً (الأحد - الخميس)',
    governorate: 'أربيل (Erbil)',
    city: 'عنكاوا',
    workMode: 'Hybrid',
    salaryRangeIQD: {
      min: 1600000,
      max: 2500000,
      showSalary: true
    },
    vacancies: 3,
    isVerifiedSource: true,
    sourceType: 'Private Verified',
    postedAt: '2025-02-20',
    expiresAt: '2025-03-30',
    status: 'Active'
  },
  {
    id: 'job-2',
    companyId: 'comp-2',
    companyName: 'مصرف سومر الرقمي (Sumer Digital Bank)',
    title: 'محلل بيانات أول (Senior Data Analyst)',
    description: 'فرصة عمل ممتازة في بغداد لتحليل السلوك المالي والأنماط المصرفية وإنشاء لوحات تحكم تفاعلية للإدارة العليا.',
    responsibilities: [
      'جمع وتحليل البيانات المالية باستخدام SQL وPython.',
      'بناء لوحات قياس الأداء (Power BI / Metabase).',
      'تقديم توصيات مبنية على البيانات لتحسين تجربة العملاء.'
    ],
    qualifications: [
      'خبرة 3+ سنوات في مجال تحليل البيانات أو الذكاء الاصطناعي.',
      'إتقان تام لغة SQL ومعالجة البيانات الكبيرة.'
    ],
    requiredSkills: ['SQL', 'Python', 'Power BI', 'Data Analysis', 'Excel'],
    experienceYears: 3,
    jobType: 'Full-Time',
    governorate: 'بغداد (Baghdad)',
    city: 'الكرادة',
    workMode: 'On-site',
    salaryRangeIQD: {
      min: 2200000,
      max: 3200000,
      showSalary: true
    },
    vacancies: 2,
    isVerifiedSource: true,
    sourceType: 'Private Verified',
    postedAt: '2025-02-22',
    expiresAt: '2025-04-10',
    status: 'Active'
  },
  {
    id: 'job-3',
    companyId: 'gov-source',
    companyName: 'وزارة الاتصالات - مبادرة الشمول الرقمي',
    title: 'مهندس شبكات وأمن معلومات (حكومي)',
    description: 'إعلان وظيفة حكومية لتعزيز أمن البنية التحتية الرقمية ومراكز البيانات الوطنية.',
    responsibilities: [
      'إدارة وتأمين الشبكات المحلية والعريضة.',
      'مراقبة التهديدات السيبرانية وتطبيق سياسات الأمان.'
    ],
    qualifications: [
      'بكالوريوس هندسة اتصالات / شبكات.',
      'شهادة CCNA / CCNP تعتبر ميزة إضافية.'
    ],
    requiredSkills: ['Cisco Networking', 'Cybersecurity', 'Firewalls', 'Linux'],
    experienceYears: 1,
    jobType: 'Government',
    governorate: 'بغداد (Baghdad)',
    city: 'شارع فلسطين',
    workMode: 'On-site',
    salaryRangeIQD: {
      min: 900000,
      max: 1400000,
      showSalary: true
    },
    vacancies: 5,
    isVerifiedSource: true,
    sourceType: 'Government',
    postedAt: '2025-02-15',
    expiresAt: '2025-03-25',
    status: 'Active'
  },
  {
    id: 'job-4',
    companyId: 'comp-1',
    companyName: 'شركة دجلة للحلول البرمجية (Dijlah Tech)',
    title: 'مصمم تجربة وواجهة المستخدم (UI/UX Designer)',
    description: 'تصميم تجارب رقمية جذابة وبسيطة تناسب المستخدم العراقي والعربي وتدعم اتجاهات RTL.',
    responsibilities: [
      'إعداد المخططات السلكية (Wireframes) والنماذج التفاعلية.',
      'اختبار الواجهات مع مستخدمين حقيقيين لتحسين سهولة الاستخدام.'
    ],
    qualifications: [
      'معرض أعمال (Portfolio) متميز يظهر مشاريع سابقة.',
      'إتقان برنامج Figma.'
    ],
    requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'RTL Design'],
    experienceYears: 2,
    jobType: 'Full-Time',
    governorate: 'النجف (Najaf)',
    city: 'حي الحسين',
    workMode: 'Remote',
    salaryRangeIQD: {
      min: 1400000,
      max: 2000000,
      showSalary: true
    },
    vacancies: 1,
    isVerifiedSource: true,
    sourceType: 'Private Verified',
    postedAt: '2025-02-25',
    expiresAt: '2025-04-15',
    status: 'Active'
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'الدبلوم الاحترافي لتطوير تطبيقات Web في سوق العمل العراقي',
    provider: 'أكاديمية MIZN الرقمية',
    description: 'مسار متكامل يأخذك من الصفر لإتقان React وTypeScript وبناء تطبيقات متكاملة مع قواعد البيانات.',
    category: 'Software Development',
    level: 'Beginner',
    durationHours: 40,
    skillsGained: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    lessonsCount: 24,
    enrolledCount: 1420,
    rating: 4.9,
    isFree: true,
    certificateProvided: true,
    modules: [
      { id: 'm1', title: 'مقدمة في الأساسيات وبيئة العمل', durationMinutes: 45 },
      { id: 'm2', title: 'بناء الواجهات التفاعلية بـ React & Tailwind', durationMinutes: 90 },
      { id: 'm3', title: 'إدارة الحالة المتقدمة والربط بـ API', durationMinutes: 120 }
    ]
  },
  {
    id: 'course-2',
    title: 'أساسيات الأمن السيبراني وحماية البيانات للمؤسسات',
    provider: 'مركز التكنولوجيا العراقي',
    description: 'دورة عمليّة في اكتشاف الثغرات وتأمين الشبكات وحماية بيانات المستخدمين في بيئة الشركات.',
    category: 'Data & AI',
    level: 'Intermediate',
    durationHours: 25,
    skillsGained: ['Cybersecurity', 'Network Defense', 'Ethical Hacking basics', 'OWASP Top 10'],
    lessonsCount: 16,
    enrolledCount: 890,
    rating: 4.8,
    isFree: true,
    certificateProvided: true,
    modules: [
      { id: 'cm1', title: 'مفاهيم الأمن السيبراني والتشفير', durationMinutes: 60 },
      { id: 'cm2', title: 'ثغرات الويب وكيفية الحماية منها', durationMinutes: 90 }
    ]
  },
  {
    id: 'course-3',
    title: 'إدارة المشاريع والتواصل المهني باللغة الإنجليزية للشركات',
    provider: 'MIZN Business School',
    description: 'تطوير كتابة الإيميلات الرسمية وإدارة الاجتماعات والتفاوض المهني باللغتين العربية والإنجليزية.',
    category: 'Business & Sales',
    level: 'Beginner',
    durationHours: 18,
    skillsGained: ['Business Communication', 'Project Planning', 'English for Work'],
    lessonsCount: 12,
    enrolledCount: 2150,
    rating: 4.7,
    isFree: true,
    certificateProvided: true,
    modules: [
      { id: 'bm1', title: 'المراسلات المهنية وإتيكيت العمل', durationMinutes: 50 }
    ]
  }
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'برنامج المنح الدراسية للماجستير والدكتوراه - المبادرة العراقية',
    organization: 'وزارة التعليم العالي والبحث العلمي',
    type: 'Scholarship',
    country: 'العراق / دولي',
    city: 'بغداد',
    description: 'منحة دراسية ممولة بالكامل للطلاب العراقيين المتميزين للدراسة في مجالات الذكاء الاصطناعي والطاقة والتخصصات الطبية.',
    eligibility: ['معدل لا يقل عن 80%', 'إتقان اللغة الإنجليزية (IELTS 6.0)', 'العمر أقل من 35 سنة'],
    targetAudience: 'Graduates',
    deadline: '2025-05-30',
    applyLink: 'https://mohesr.gov.iq',
    isVerified: true,
    verifiedAt: '2025-01-20',
    postedAt: '2025-01-15'
  },
  {
    id: 'opp-2',
    title: 'برنامج التدريب الصيفي التقني للطلاب والخريجين الجدد',
    organization: 'حاضنة الأعمال الرقمية - أربيل',
    type: 'Internship',
    country: 'العراق',
    city: 'أربيل',
    description: 'تدريب مدفوع الأجر لمدة 3 أشهر مع فرصة التوظيف المباشر في أفضل شركات التكنولوجيا العراقية.',
    eligibility: ['طلاب المرحلة الأخيرة أو خريجو 2023-2024', 'شغف بالتكنولوجيا والتصميم'],
    targetAudience: 'Both',
    deadline: '2025-04-15',
    applyLink: 'https://erbilhub.iq/apply',
    isVerified: true,
    verifiedAt: '2025-02-10',
    postedAt: '2025-02-01'
  },
  {
    id: 'opp-3',
    title: 'زمالة الابتكار الرقمي وتطوير الأعمال الريادية',
    organization: 'المجلس الثقافي البريطاني في العراق',
    type: 'Fellowship',
    country: 'العراق',
    city: 'البصرة',
    description: 'برنامج دعم وتمويل الأفكار والشركات الناشئة للشباب العراقي مع إرشاد مباشر من خبراء عالميين.',
    eligibility: ['فكرة مشروع مبتكرة', 'فريق عمل من 2-4 أفراد'],
    targetAudience: 'Graduates',
    deadline: '2025-06-01',
    applyLink: 'https://britishcouncil.iq/fellowship',
    isVerified: true,
    verifiedAt: '2025-02-05',
    postedAt: '2025-01-28'
  }
];
