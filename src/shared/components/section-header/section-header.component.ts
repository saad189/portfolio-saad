import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from 'src/Directives/reveal.directive';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <div class="section-head" appReveal>
      <p class="eyebrow">{{ eyebrow }}</p>
      <h2 class="section-title">{{ title }}</h2>
      <p class="section-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
    </div>
  `
})
export class SectionHeaderComponent {
  @Input() eyebrow: string = '';
  @Input() title: string = '';
  @Input() subtitle?: string;
}
