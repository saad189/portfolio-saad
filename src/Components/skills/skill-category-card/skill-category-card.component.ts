import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SkillCategory } from 'src/shared/interfaces';
import { RevealDirective } from 'src/Directives/reveal.directive';

@Component({
  selector: 'app-skill-category-card',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
    }
    .glass-card {
      flex: 1;
    }
    .skill-head {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1.25rem;
    }
    .skill-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--color-accent-employment-light);
      color: var(--color-accent-employment);
      flex-shrink: 0;
    }
    .skill-label {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-text-tertiary);
    }
    h3 {
      font-family: var(--font-mono);
      font-size: var(--text-lg);
      font-weight: 600;
      margin: 0;
      color: var(--color-text-primary);
    }
    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
  `],
  template: `
    <div class="glass-card skill-card" appReveal>
      <div class="skill-head">
        <span class="skill-icon" aria-hidden="true" [innerHTML]="safeIcon"></span>
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
  @Input() set category(value: SkillCategory) {
    this._category = value;
    this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(value.iconSvg);
  }
  get category(): SkillCategory { return this._category; }
  private _category!: SkillCategory;
  safeIcon!: SafeHtml;
  constructor(private sanitizer: DomSanitizer) {}
}
