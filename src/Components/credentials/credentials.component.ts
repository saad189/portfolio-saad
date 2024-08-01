import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';

@Component({
  selector: 'app-credentials',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss'
})
export class CredentialsComponent {

}
