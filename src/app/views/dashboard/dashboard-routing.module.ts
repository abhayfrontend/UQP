import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { MemberComponent } from './member/member.component';
import { QualityComponent } from './quality/quality.component';
import { MraDashboardComponent } from './mra-dashboard/mra-dashboard.component';

import { AuthGuard } from '../../base/guards/auth.guard';
import { RoleGuard } from '../../base/guards/role.guard';
import { MraAuditDashboardComponent } from './mra-audit-dashboard/mra-audit-dashboard.component';
import { AcoDashboardComponent } from './aco-dashboard/aco-dashboard.component';
import { DefaultComponent } from './default/default.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
      name: 'dashboard'
    }
  },
  {
    path: 'member',
    component: MemberComponent,
    data: {
      title: 'Member'
    }
  },
  {
    path: 'aco',
    component: AcoDashboardComponent,
     canActivate: [AuthGuard,RoleGuard],
    data: {
      title: 'ACO',
      name: 'ACO Dashboard'
    }
  },
  {
    path: 'quality-audit',
    component: QualityComponent,
    data: {
      title: 'Quality'
    }
  },
  {
    path: 'mra',
    component: MraDashboardComponent,
    canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'MRA',
          name: 'MRA Dashboard'
        }
  },
  {
    path: 'default',
    component: DefaultComponent,
    
        data: {
          title: 'MRA',
          name: 'Default Dashboard'
        }
  },
  {
    path: 'audit/mra',
    component: MraAuditDashboardComponent,
    canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'MRA',
          name: 'MRA Dashboard'
        }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
