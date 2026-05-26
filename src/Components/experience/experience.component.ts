import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from 'src/shared/portfolio.service';
import { JobItemComponent } from './job-item/job-item.component';
import { SectionHeaderComponent } from 'src/shared/components/section-header/section-header.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, JobItemComponent, SectionHeaderComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
  jobs = this.portfolio.getJobs();
  constructor(private portfolio: PortfolioService) {}
}
