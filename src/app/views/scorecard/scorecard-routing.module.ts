import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthplanScorecardComponent } from './healthplan-scorecard/healthplan-scorecard.component';
import { IpaScorecardComponent } from './ipa-scorecard/ipa-scorecard.component';
import { ProviderScorecardComponent } from './provider-scorecard/provider-scorecard.component';
import { MraHealthplanScorecardComponent } from './mra-healthplan-scorecard/mra-healthplan-scorecard.component';
import { AuthGuard } from '../../base/guards/auth.guard';
import { RoleGuard } from '../../base/guards/role.guard';
import { OverallProviderComponent } from './overall-provider/overall-provider.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Example Pages'
    },
    children: [
      {
        path: 'provider',
        component: ProviderScorecardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Provider Score Card'
        }
      },
      {
        path: 'healthplan',
        component: HealthplanScorecardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Health Plan Score Card'
        }
      },
      {
        path: 'overallprovider',
        component: OverallProviderComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Overall Provider Score Card'
        }
      },
      {
        path: 'mra/healthplan',
        component: MraHealthplanScorecardComponent,

        data: {
          title: 'dashboard',
          name: 'Health Plan Score Card'
        }
      },
      {
        path: 'ipa',
        component: IpaScorecardComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          title: 'dashboard',
          name: 'IPA Score Card'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScorecardRoutingModule { }



