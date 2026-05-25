import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillCategory } from 'src/shared/interfaces';
import { RevealDirective } from 'src/Directives/reveal.directive';

@Component({
  selector: 'app-skill-category-card',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <div class="glass-card skill-card" appReveal>
      <div class="skill-head">
        <span class="skill-icon" aria-hidden="true" [innerHTML]="category.iconSvg"></span>
        <div>
          <div class="skill-label">{{ category.label }}</div>
          <h3>{{ category.heading }}</h3>
        </div>
      </div>
      <div class="skill-tags">
        <span class="pill" *ngFor="let skill of category.skills">{{ skill }}</span>
      </div>
    </div>
  `
})
export class SkillCategoryCardComponent {
  @Input() category!: SkillCategory;
}
