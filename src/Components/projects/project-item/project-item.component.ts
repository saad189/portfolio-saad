import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from 'src/shared/interfaces';
import { RevealDirective } from 'src/Directives/reveal.directive';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.scss'
})
export class ProjectItemComponent {
  @Input() project!: Project;
  @HostBinding('class.featured') get isFeatured() { return this.project?.isFeatured; }

  /** First link (the live site) — what the logo and art click through to. */
  get primaryLink(): string | undefined { return this.project?.links?.[0]?.href; }
}
