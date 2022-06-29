import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    canActivate: [ AuthGuard ],
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'configuration',
    canActivate: [ AuthGuard ],
    loadChildren: () => import('./features/configuration/configuration.module').then(
      m => m.ConfigurationModule
    )
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
