import { Certificate, Education, Job, Project, SkillCategory } from './interfaces';

export const JOBS: Job[] = [
  {
    company: 'Motive',
    companyUrl: 'https://gomotive.com',
    role: 'Software Engineer - Frontend',
    duration: 'Jan 2026 — Present',
    location: 'Lahore, Pakistan',
    description: 'Working on AI-based documentation analysis systems — improving tooling for how logistics companies manage documentation.',
    techTags: ['AI', 'Documentation', 'Full-Stack'],
    isCurrent: true
  },
  {
    company: 'Glotte',
    companyUrl: 'https://glotte.org',
    role: 'Lead Software Engineer / CTO',
    duration: 'May 2024 — Jan 2026',
    tenure: '1 yr 9 mos',
    location: 'Doha, Qatar',
    description: 'Architected and built the core product from scratch — mobile app (React Native / Expo), backend (NestJS + MySQL + Redis + Elasticsearch), and cloud infrastructure (AWS + Railway). Led launch on Apple App Store and Google Play, including federated auth (Apple/Google Sign-In) and a RevenueCat subscription system with multi-tier plans.',
    stats: ['App Store + Play Store', 'Built from 0'],
    techTags: ['React Native', 'NestJS', 'MySQL', 'Redis', 'Elasticsearch', 'AWS', 'RevenueCat']
  },
  {
    company: 'Dubizzle Labs',
    companyUrl: 'https://dubizzlelabs.com',
    role: 'Software Engineer · Full Stack',
    duration: 'May 2021 — Apr 2023',
    tenure: '2 yrs',
    location: 'Lahore, Pakistan',
    description: 'Worked on Salesforce — Zameen\'s internal CRM — used by 4,000+ active users across 4 companies. Improved the lead generation module (50% reduction in submission time), redesigned reporting and staff modules (20% load-time improvement), and led a codebase refactor achieving 90%+ code coverage and 2× component performance.',
    stats: ['4,000+ users', '50% faster lead flow', '2× perf gain', '90%+ coverage'],
    techTags: ['Angular', 'Node.js', 'Sequelize', 'MySQL', 'Redis', 'AWS']
  },
  {
    company: 'Ciklum',
    companyUrl: 'https://www.ciklum.com',
    role: 'Software Engineer · Full Stack',
    duration: 'Jun 2019 — Nov 2020',
    tenure: '1.5 yrs',
    location: 'Islamabad, Pakistan',
    description: 'Built location tracking and geographical-compliance features for an IoT management system in the maritime industry. Worked with transnational teams using Agile / Scrum, interfaced with clients in requirements analysis, and developed report-extraction features using Linux bash scripting.',
    techTags: ['Angular', '.NET Core', 'PostGIS', 'TimeSeries SQL', 'Azure', 'Docker'],
    isPast: true
  }
];

export const PROJECTS: Project[] = [
  {
    title: 'VisionMedia — SnE Organization Website',
    description: 'Built the official website for the Scientists & Engineers (SnE) organization. Fully dynamic content powered by Supabase — events, research papers, and projects are all managed in real-time through a full-featured admin panel, letting organization staff publish and update content without touching code.',
    tag: 'Live Product',
    tagVariant: 'featured',
    stats: ['Live on Web', 'Full Admin Panel', 'Supabase-powered'],
    techTags: ['Angular', 'TypeScript', 'Supabase'],
    links: [
      { label: 'Live Site ↗', href: 'https://snevisionmedia.com' },
      { label: 'Admin ↗', href: 'https://snevisionmedia.com/admin/login' }
    ],
    isFeatured: true,
    artImageUrl: 'assets/media-logo.png'
  },
  {
    title: 'Lab Booking App — Enhanced Accessibility',
    description: 'Built a digital lab scheduling system for an institution previously relying on error-prone manual processes, eliminating booking conflicts and double-bookings. Instructors gain full visibility and control over lab usage through a dedicated management interface. Designed with accessibility at its core — tailored for users with visual impairments, filling a gap left by existing market solutions.',
    tag: 'Accessibility',
    tagVariant: 'accent',
    stats: ['Instructor Control Panel', 'Visual Impairment Support', 'Zero Conflicts'],
    techTags: ['Angular', 'ASP.NET Core', 'C#', 'MySQL', 'TypeScript']
  },
  {
    title: 'Scientists & Engineers Platform',
    description: 'A full-featured interactive platform for the SnE community. Includes dynamically-controlled visualizations of classic sorting and search algorithms (adjustable speed and array size), built-in mini games, and a community hub for events, papers, and projects — all backed by Firebase for real-time data sync.',
    tag: 'Interactive',
    tagVariant: 'accent',
    stats: ['Algorithm Visualizer', 'Mini Games', 'Firebase Real-time'],
    techTags: ['Angular', 'TypeScript', 'Firebase', 'Angular Material'],
    links: [
      { label: 'Live Site ↗', href: 'https://scientistsandengineers-243ca.web.app/dashboard' }
    ]
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    label: 'Frontend',
    heading: 'Interfaces & experience',
    iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    skills: ['Angular', 'TypeScript', 'SCSS', 'React Native', 'HTML / CSS', 'RxJS', 'ng2-charts']
  },
  {
    label: 'Backend & Data',
    heading: 'Systems & persistence',
    iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="6" rx="1.5"></rect><rect x="2" y="11" width="20" height="6" rx="1.5"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="14" x2="6.01" y2="14"></line><line x1="2" y1="19" x2="22" y2="19"></line></svg>`,
    skills: ['Node.js', 'NestJS', '.NET Core', 'C#', 'Python', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Sequelize', 'TypeORM', 'JEST']
  },
  {
    label: 'Cloud & DevOps',
    heading: 'Infra & delivery',
    iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
    skills: ['AWS (Cognito, S3)', 'Azure', 'Docker', 'Git', 'Azure Boards', 'Railway', 'CI / CD', 'Agile (Scrum, Kanban)', 'Prompt Engineering']
  }
];

export const CURRENT_WORKING_WITH: string[] = [
  'AI-Driven Development',
  'LLM Integration',
  'Documentation Analysis'
];

export const EDUCATION: Education[] = [
  {
    university: {
      name: 'Lahore University of Management Sciences',
      link: 'https://lums.edu.pk',
      iconUrl: '',
      programUrl: 'https://lums.edu.pk/programmes/ms-technology-management-and-entrepreneurship'
    },
    shortName: 'LUMS',
    programName: 'MS — Technology Management & Entrepreneurship',
    description: 'Best Practices in Project Management, Documentation & Compliance.',
    startDate: 'Jul 2022',
    endDate: 'Jun 2024',
    courses: ['Operations Management', 'Data Analysis', 'Technology Entrepreneurship']
  },
  {
    university: {
      name: 'National University of Computer & Emerging Sciences',
      link: 'https://nu.edu.pk',
      iconUrl: '',
      programUrl: 'https://nu.edu.pk/Program/BS(CS)'
    },
    shortName: 'FAST',
    programName: 'BS — Computer Science',
    description: '',
    startDate: 'Aug 2015',
    endDate: 'Jun 2019',
    courses: ['Web Programming', 'UI / UX', 'Mobile Computing', 'Distributed Computing'],
    honors: ["Bronze Medal — Academic Excellence", "Dean's List · Spring '16 & '17"]
  }
];

export const CERTIFICATES: Certificate[] = [
  {
    name: 'Microsoft Certified: Azure Fundamentals',
    url: 'https://learn.microsoft.com/en-us/users/saadahmed-6949/credentials/5971717db08b6eef',
    iconUrl: 'https://learn.microsoft.com/favicon.ico',
    completionDate: 'May 2020',
    offeredOrg: 'Microsoft',
    description: 'Credential ID: 5971717DB08B6EEF',
    isVerified: true
  },
  {
    name: 'SQL for Beginners — Learn SQL using MySQL & Database Design',
    url: 'https://www.udemy.com/certificate/UC-f2f9ad82-584a-4109-8d05-078021b60ef4/',
    iconUrl: '',
    completionDate: 'May 2020',
    offeredOrg: 'Udemy'
  },
  {
    name: 'C# Advanced Topics — Prepare for Technical Interviews',
    url: 'https://www.udemy.com/certificate/UC-e1fdbe40-faa6-4f9c-a126-edba24e77d13/',
    iconUrl: '',
    completionDate: 'May 2020',
    offeredOrg: 'Udemy'
  },
  {
    name: 'Mastering LINQ with C# and .NET',
    url: 'https://www.udemy.com/certificate/UC-1C3VVRGF/',
    iconUrl: '',
    completionDate: '2020',
    offeredOrg: 'Udemy'
  }
];
