import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from 'src/shared/portfolio.service';
import { CertificateItemComponent } from './certificate-item/certificate-item.component';
import { SectionHeaderComponent } from 'src/shared/components/section-header/section-header.component';
import { RevealDirective } from 'src/Directives/reveal.directive';

@Component({
  selector: 'app-credentials',
  standalone: true,
  imports: [CommonModule, CertificateItemComponent, SectionHeaderComponent, RevealDirective],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss'
})
export class CredentialsComponent {
  certificates = this.portfolio.getCertificates();
  constructor(private portfolio: PortfolioService) {}
}
