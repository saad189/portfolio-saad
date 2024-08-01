import { Component } from '@angular/core';
import { SharedModule } from 'src/shared/shared.module';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {

}
