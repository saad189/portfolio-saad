import { Component } from '@angular/core';
import { SharedModule } from 'src/shared/shared.module';
import { ProjectsComponent } from '../projects/projects.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [SharedModule, ProjectsComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {

}
