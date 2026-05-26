import { Injectable } from '@angular/core';
import { CERTIFICATES, CURRENT_WORKING_WITH, EDUCATION, JOBS, PROJECTS, SKILL_CATEGORIES } from './portfolio.data';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  getJobs() { return JOBS; }
  getProjects() { return PROJECTS; }
  getSkillCategories() { return SKILL_CATEGORIES; }
  getCurrentWorkingWith() { return CURRENT_WORKING_WITH; }
  getEducation() { return EDUCATION; }
  getCertificates() { return CERTIFICATES; }
}
