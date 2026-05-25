import { Component } from '@angular/core';
import { RevealDirective } from 'src/Directives/reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  email = 'saad18910@hotmail.com';

  copyEmail() {
    navigator.clipboard.writeText(this.email);
  }
}
