export interface Education {
  university: University;
  shortName: string;
  programName: string;
  description: string;
  startDate: string;
  endDate: string;
  courses: string[];
  honors?: string[];
}

export interface University {
  name: string;
  link: string;
  iconUrl: string;
  programUrl?: string;
}

export interface Certificate {
  name: string;
  description?: string;
  url: string;
  iconUrl: string;
  completionDate: string;
  offeredOrg: string;
  isVerified?: boolean;
}

export interface Experience {
  roleName: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Job {
  company: string;
  companyUrl?: string;
  logoUrl?: string;
  role: string;
  duration: string;
  tenure?: string;
  location: string;
  description: string;
  stats?: string[];
  techTags: string[];
  isCurrent?: boolean;
  isPast?: boolean;
}

export interface Project {
  title: string;
  subtitle?: string;
  description: string;
  tag: string;
  tagVariant: 'featured' | 'accent';
  stats?: string[];
  techTags: string[];
  links?: { label: string; href: string }[];
  isFeatured?: boolean;
  artImageUrl?: string;
  logoUrl?: string;
}

export interface SkillCategory {
  label: string;
  heading: string;
  iconSvg: string;
  skills: string[];
}
