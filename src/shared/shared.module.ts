import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from "@angular/material/sidenav";
import { FragmentLinkActiveDirective } from 'src/Directives/fragment-link.directive';
const materialModules = [
  // BrowserAnimationsModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatListModule,
  MatSidenavModule
]

const otherAndDirectives = [RouterModule]

@NgModule({
  declarations: [FragmentLinkActiveDirective],
  imports: [
    CommonModule,
    ...otherAndDirectives,
    ...materialModules
  ],
  exports: [materialModules, otherAndDirectives, CommonModule, FragmentLinkActiveDirective]
})
export class SharedModule { }
