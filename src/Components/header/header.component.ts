import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  logTheCall() {
    console.log('Called')
  }

  constructor(private router: Router) { }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
