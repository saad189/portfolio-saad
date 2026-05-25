import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pill-tag',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="pill" [ngClass]="variantClass">{{ label }}</span>`
})
export class PillTagComponent {
  @Input() label: string = '';
  @Input() variant: 'default' | 'metric' | 'gold' | 'accent' | 'featured' | 'current' = 'default';

  get variantClass(): string {
    const map: Record<string, string> = {
      metric: 'pill--metric',
      gold: 'pill--gold',
      accent: 'pill--accent',
      featured: 'pill--featured',
      current: 'pill--current',
    };
    return map[this.variant] ?? '';
  }
}
