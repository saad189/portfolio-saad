import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RevealDirective } from 'src/Directives/reveal.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule, RevealDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {}
