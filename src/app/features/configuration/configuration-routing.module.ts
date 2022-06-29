import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamConfigurationComponent } from './components/team-configuration/team-configuration.component';
import { UserConfigurationComponent } from './components/user-configuration/user-configuration.component';
import { ConfigurationComponent } from './configuration.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'user', component: UserConfigurationComponent },
      { path: 'team', component: TeamConfigurationComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
