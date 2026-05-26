import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from 'src/shared/portfolio.service';
import { ProjectItemComponent } from './project-item/project-item.component';
import { SectionHeaderComponent } from 'src/shared/components/section-header/section-header.component';
import { RevealDirective } from 'src/Directives/reveal.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectItemComponent, SectionHeaderComponent, RevealDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  projects = this.portfolio.getProjects();
  constructor(private portfolio: PortfolioService) {}
}
