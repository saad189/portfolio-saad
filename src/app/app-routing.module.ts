import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/Components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  // ponytail: kept so old /main links and bookmarks still land somewhere.
  { path: 'main', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
