import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-pill',
  standalone: true,
  template: `<span class="pill pill--metric"><strong>{{ value }}</strong>&nbsp;{{ label }}</span>`
})
export class StatPillComponent {
  @Input() value: string = '';
  @Input() label: string = '';
}
