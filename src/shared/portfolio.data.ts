import { Certificate, Education, Job, Project, SkillCategory } from './interfaces';

export const JOBS: Job[] = [
  {
    company: 'Motive',
    companyUrl: 'https://gomotive.com',
    logoUrl: 'assets/logos/motive.png',
    role: 'Software Engineer - Frontend',
    duration: 'Jan 2026 — Present',
    location: 'Lahore, Pakistan',
    description: [
      'Built AI-driven document analysis features in the customer-facing web platform, carrying work from product discovery discussions through to production release.',
      'Authored, reviewed and presented Technical Design Documents for frontend initiatives, aligning product and engineering on scope before implementation and reducing late-stage rework.',
      'Instrumented frontend observability with Datadog and Pendo to measure whether shipped features worked, and ran production incident response through Rootly.',
      'Established the AI-assisted development practices (Claude Code, Cursor) the frontend team now uses to ship faster without loosening code review or test coverage standards.'
    ],
    stats: ['Frontend observability', 'AI-assisted delivery'],
    techTags: ['TypeScript', 'AI / LLM', 'Technical Design Docs', 'Datadog', 'Pendo', 'Rootly', 'Claude Code', 'Cursor'],
    isCurrent: true
  },
  {
    company: 'Glotte',
    companyUrl: 'https://glotte.org',
  //  logoUrl: 'assets/logos/glotte.ico',
    role: 'Lead Software Engineer / CTO',
    duration: 'May 2024 — Jan 2026',
    tenure: '1 yr 9 mos',
    location: 'Doha, Qatar',
    description: [
      'Built and launched Hasanah, a consumer mobile product, as sole engineer — from architecture through to approved listings on both the Apple App Store and Google Play.',
      'Designed and implemented the full stack: React Native (Expo) client with federated Apple and Google Sign-In, NestJS + TypeORM backend on MySQL, Redis caching and Elasticsearch content search.',
      'Shipped a cross-platform RevenueCat subscription system — multi-tier plans, free trials and unified entitlements reconciled across Apple and Google, including grace periods, restores and cross-platform upgrades.',
      'Ran cloud infrastructure across AWS (Cognito, S3) and Railway sized for reliability at low fixed cost, and owned the release process through store compliance and reviewer feedback to approval.'
    ],
    stats: ['App Store + Play Store', 'Built from 0', 'Sole engineer'],
    techTags: ['React Native', 'Expo', 'NestJS', 'TypeORM', 'MySQL', 'Redis', 'Elasticsearch', 'AWS', 'Railway', 'RevenueCat']
  },
  {
    company: 'Dubizzle Labs',
    companyUrl: 'https://dubizzlelabs.com',
    logoUrl: 'assets/logos/dubizzle-labs.png',
    role: 'Software Engineer · Full Stack',
    duration: 'May 2021 — Jun 2023',
    tenure: '2 yrs 2 mos',
    location: 'Lahore, Pakistan',
    description: [
      'Built and improved Zameen\'s CRM, deployed across 4 companies and used by 4,000+ active users; rebuilt the lead generation module to cut lead submission time by 50%.',
      'Led a refactor of legacy code into reusable, performant components — 2× component performance while holding 90%+ code coverage through unit testing and structured QA.',
      'Redesigned the reporting and staff modules around aggregated data visualization (TypeScript, SCSS, RxJS, ng2-charts, Lodash), reducing load times by 20%.'
    ],
    stats: ['4,000+ users', '50% faster lead flow', '2× perf gain', '90%+ coverage'],
    techTags: ['Angular', 'TypeScript', 'RxJS', 'ng2-charts', 'Node.js', 'Sequelize', 'MySQL', 'Redis', 'AWS']
  },
  {
    company: 'Ciklum',
    companyUrl: 'https://www.ciklum.com',
    logoUrl: 'assets/logos/ciklum.png',
    role: 'Software Engineer · Full Stack',
    duration: 'Jun 2019 — Nov 2020',
    tenure: '1.5 yrs',
    location: 'Islamabad, Pakistan',
    description: [
      'Built location tracking and geographic compliance into an IoT management system deployed in the maritime industry for remote B2B vessel management.',
      'Integrated microservices running on Linux-based Docker containers deployed to Azure, using PostGIS and time-series databases for geospatial and telemetry data.',
      'Collaborated with trans-national teams on Agile sprints tracked in Azure Boards, interfaced directly with clients through requirements analysis and demos, and built report extraction against core system APIs.'
    ],
    techTags: ['Angular', '.NET Core', 'Microservices', 'PostGIS', 'TimeSeries SQL', 'Azure', 'Azure Boards', 'Docker'],
    isPast: true
  }
];

export const PROJECTS: Project[] = [
  {
    title: 'Worthy Goals — AI Accountability App',
    description: 'A personality-driven goal app where every goal is assigned to an AI mentor who checks in, pushes, and responds in their own voice. React Native (Expo) app on a NestJS backend with PostgreSQL + pgvector for mentor memory, AWS Cognito auth, socket.io chat, and an eval harness that keeps each personality from drifting. Marketing site and waitlist are live; the app is in pre-launch.',
    tag: 'Featured',
    tagVariant: 'featured',
    stats: ['Waitlist Live', 'AI Personality Runtime', 'iOS + Android'],
    techTags: ['React Native', 'Expo', 'NestJS', 'PostgreSQL', 'pgvector', 'Redis', 'AWS Cognito', 'Angular'],
    links: [{ label: 'Waitlist ↗', href: 'https://worthygoals.web.app' }],
    isFeatured: true,
    artImageUrl: 'assets/worthygoals-logo.png',
    logoUrl: 'assets/worthygoals-logo.png'
  },
  {
    title: 'VisionMedia — SnE Organization Website',
    description: 'Built the official website for the Scientists & Engineers (SnE) organization. Fully dynamic content powered by Supabase — events, research papers, and projects are all managed in real-time through a full-featured admin panel, letting organization staff publish and update content without touching code.',
    tag: 'Live Product',
    tagVariant: 'accent',
    stats: ['Live on Web', 'Full Admin Panel', 'Supabase-powered'],
    techTags: ['Angular', 'TypeScript', 'Supabase'],
    links: [
      { label: 'Live Site ↗', href: 'https://snevisionmedia.com' },
      { label: 'Admin ↗', href: 'https://snevisionmedia.com/admin/login' }
    ],
    logoUrl: 'assets/logos/snevisionmedia.png'
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
      { label: 'Live Site ↗', href: 'https://scientistsandengineers.web.app' }
    ],
  //  logoUrl: 'assets/logos/sne-platform.png'
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    label: 'Frontend',
    heading: 'Interfaces & experience',
    iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    skills: ['Angular', 'TypeScript', 'JavaScript', 'React', 'React Native (Expo)', 'SCSS', 'HTML / CSS', 'RxJS', 'ng2-charts']
  },
  {
    label: 'Backend & Data',
    heading: 'Systems & persistence',
    iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="6" rx="1.5"></rect><rect x="2" y="11" width="20" height="6" rx="1.5"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="14" x2="6.01" y2="14"></line><line x1="2" y1="19" x2="22" y2="19"></line></svg>`,
    skills: ['Node.js', 'NestJS', '.NET Core', 'C#', 'Python', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Sequelize', 'TypeORM', 'Jest']
  },
  {
    label: 'Cloud & DevOps',
    heading: 'Infra & delivery',
    iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
    skills: ['AWS (Cognito, S3)', 'Azure', 'Docker', 'Git', 'Railway', 'CI / CD', 'Datadog', 'Pendo', 'Rootly', 'Jira', 'Azure Boards', 'Agile (Scrum, Kanban)']
  }
];

export const CURRENT_WORKING_WITH: string[] = [
  'AI-Driven Development',
  'Claude Code & Cursor',
  'Technical Design Docs',
  'LLM Integration',
  'Documentation Analysis'
];

export const EDUCATION: Education[] = [
  {
    university: {
      name: 'Lahore University of Management Sciences',
      link: 'https://lums.edu.pk',
      iconUrl: 'assets/logos/lums.png',
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
      iconUrl: 'assets/logos/fast-nuces.jpg',
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
    iconUrl: 'assets/logos/microsoft.ico',
    completionDate: 'May 2020',
    offeredOrg: 'Microsoft',
    description: 'AZ-900 · Credential ID: 5971717DB08B6EEF',
    isVerified: true
  },
  {
    name: 'SQL for Beginners — Learn SQL using MySQL & Database Design',
    url: 'https://www.udemy.com/certificate/UC-f2f9ad82-584a-4109-8d05-078021b60ef4/',
    iconUrl: 'assets/logos/udemy.png',
    completionDate: 'May 2020',
    offeredOrg: 'Udemy'
  },
  {
    name: 'C# Advanced Topics — Prepare for Technical Interviews',
    url: 'https://www.udemy.com/certificate/UC-e1fdbe40-faa6-4f9c-a126-edba24e77d13/',
    iconUrl: 'assets/logos/udemy.png',
    completionDate: 'May 2020',
    offeredOrg: 'Udemy'
  },
  {
    name: 'Mastering LINQ with C# and .NET',
    url: 'https://www.udemy.com/certificate/UC-1C3VVRGF/',
    iconUrl: 'assets/logos/udemy.png',
    completionDate: '2020',
    offeredOrg: 'Udemy'
  }
];
