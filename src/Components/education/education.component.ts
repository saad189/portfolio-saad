import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from 'src/shared/portfolio.service';
import { EducationItemComponent } from './education-item/education-item.component';
import { SectionHeaderComponent } from 'src/shared/components/section-header/section-header.component';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, EducationItemComponent, SectionHeaderComponent],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent {
  education = this.portfolio.getEducation();
  constructor(private portfolio: PortfolioService) {}
}
