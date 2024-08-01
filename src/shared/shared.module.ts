import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

const materialModules = [
  // BrowserAnimationsModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatListModule,
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ...materialModules
  ],
  exports: [materialModules, CommonModule]
})
export class SharedModule { }
