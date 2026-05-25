import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Education } from 'src/shared/interfaces';
import { RevealDirective } from 'src/Directives/reveal.directive';

@Component({
  selector: 'app-education-item',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './education-item.component.html',
  styleUrl: './education-item.component.scss'
})
export class EducationItemComponent {
  @Input() edu!: Education;
}
