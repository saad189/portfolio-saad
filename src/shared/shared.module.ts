import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FragmentLinkActiveDirective } from 'src/Directives/fragment-link.directive';
import { PillTagComponent } from './components/pill-tag/pill-tag.component';
import { StatPillComponent } from './components/stat-pill/stat-pill.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';

@NgModule({
  declarations: [FragmentLinkActiveDirective],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatSidenavModule,
    PillTagComponent,
    StatPillComponent,
    SectionHeaderComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatSidenavModule,
    FragmentLinkActiveDirective,
    PillTagComponent,
    StatPillComponent,
    SectionHeaderComponent
  ]
})
export class SharedModule { }
