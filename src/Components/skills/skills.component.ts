import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from 'src/shared/portfolio.service';
import { SkillCategoryCardComponent } from './skill-category-card/skill-category-card.component';
import { RevealDirective } from 'src/Directives/reveal.directive';
import { SectionHeaderComponent } from 'src/shared/components/section-header/section-header.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, SkillCategoryCardComponent, RevealDirective, SectionHeaderComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  categories = this.portfolio.getSkillCategories();
  currentWorkingWith = this.portfolio.getCurrentWorkingWith();

  constructor(private portfolio: PortfolioService) {}
}
