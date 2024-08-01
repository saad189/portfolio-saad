import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CredentialsComponent } from 'src/Components/credentials/credentials.component';
import { DashboardComponent } from 'src/Components/dashboard/dashboard.component';
import { ExperienceComponent } from 'src/Components/experience/experience.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'main', pathMatch: 'full'
  },
  {
    path: 'main', component: DashboardComponent
  },
  {
    path: 'experience', component: ExperienceComponent
  },
  {
    path: 'credentials', component: CredentialsComponent
  },
  {
    path: '**', redirectTo: 'main'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
