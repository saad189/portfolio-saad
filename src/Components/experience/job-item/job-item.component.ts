import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from 'src/shared/interfaces';
import { RevealDirective } from 'src/Directives/reveal.directive';

@Component({
  selector: 'app-job-item',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './job-item.component.html',
  styleUrl: './job-item.component.scss'
})
export class JobItemComponent {
  @Input() job!: Job;
}
