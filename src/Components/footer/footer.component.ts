import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  linkedInUrl = `https://www.linkedin.com/in/saad189`;

  githubUrl = `https://github.com/saad189`

}
