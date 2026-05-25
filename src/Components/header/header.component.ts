import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { SharedModule } from 'src/shared/shared.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() openDrawer = new EventEmitter<void>();
  scrolled = false;

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }

  openResume() {
    window.open('assets/Resume_SaadAhmed.pdf', '_blank');
  }
}
