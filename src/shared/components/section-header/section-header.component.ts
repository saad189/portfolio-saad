import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-head reveal">
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
