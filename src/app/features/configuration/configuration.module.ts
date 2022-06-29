import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { UserConfigurationComponent } from './components/user-configuration/user-configuration.component';
import { TeamConfigurationComponent } from './components/team-configuration/team-configuration.component';
import { TeamService } from './services/team.service';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ConfigurationComponent,
    UserConfigurationComponent,
    TeamConfigurationComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    TeamService
  ]
})
export class ConfigurationModule { }
