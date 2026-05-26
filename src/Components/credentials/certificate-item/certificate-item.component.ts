import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Certificate } from 'src/shared/interfaces';

@Component({
  selector: 'app-certificate-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate-item.component.html',
  styleUrls: ['./certificate-item.component.scss']
})
export class CertificateItemComponent {
  @Input() certificate!: Certificate;
}
