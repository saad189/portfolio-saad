import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { SkillsComponent } from '../skills/skills.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent } from '../projects/projects.component';
import { EducationComponent } from '../education/education.component';
import { CredentialsComponent } from '../credentials/credentials.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeroComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    EducationComponent,
    CredentialsComponent,
    ContactComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {}
