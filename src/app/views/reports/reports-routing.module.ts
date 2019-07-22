import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../base/guards/auth.guard';
import { RoleGuard } from '../../base/guards/role.guard';

import { MembershipRosterComponent } from './membership-roster/membership-roster.component';
import { SingleMeasureComponent } from './single-measure/single-measure.component';
import { OverallGapsComponent } from './overall-gaps/overall-gaps.component';
import { LogViewerComponent } from './log-viewer/log-viewer.component';
import { LastVisitComponent } from './last-visit/last-visit.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { MraMembershipComponent } from './mra-membership/mra-membership.component';
import { MraGapsComponent } from './mra-gaps/mra-gaps.component';
import { MraProvidersComponent } from './mra-providers/mra-providers.component';
import { ProductivityComponent } from './productivity/productivity.component';
import { FollowUpsComponent } from './follow-ups/follow-ups.component';
import { MraProductivityComponent } from './productivity/mra-productivity/mra-productivity.component';
import { AuditProductivityComponent } from './productivity/audit-productivity/audit-productivity.component';
import { CensusReportComponent } from './census-report/census-report.component';
import { AcoMembershipComponent } from './aco-membership/aco-membership.component';
import {AcoGroupComponent} from './aco-group/aco-group.component';
import {CustomReportsComponent} from './custom-reports/custom-reports.component';
import {AcoGapsComponent} from './aco-gaps/aco-gaps.component';
import { PrevalenceComponent } from './prevalence/prevalence.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Example Pages'
    },
    children: [
      {
        path: 'membership-roster',
        component: MembershipRosterComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Membership Roaster'
        }
      },
      {
        path: 'single-measure-gaps',
        component: SingleMeasureComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Single Measure Gap'
        }
      },
      {
        path: 'custom-report',
        component: CustomReportsComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Custom Reports'
        }
      },
      {
        path: 'prevalence',
        component: PrevalenceComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Prevalece Reports'
        }
      },
      {
        path: 'non-compliant',
        component: OverallGapsComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'non-compliant',
          name: 'Overall Gap'
        }
      },
      {
        path: 'compliant',
        component: OverallGapsComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'compliant',
          name: 'Overall Gap'
        }
      },
      
      {
        path: 'logs',
        component: LogViewerComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'dashboard'
        }
      },
      {
        path: 'aco-group',
        component: AcoGroupComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'ACO Group'
        }
      },
       {
        path: 'aco/gaps',
        component: AcoGapsComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'acogaps',
          name: 'ACO Gaps'
        }
      },
      {
        path: 'aco/audit',
        component: AcoGapsComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'acoaudit',
          name: 'ACO Gap Audit'
        }
      },

      {
        path: 'last-visit',
        component: LastVisitComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Last Visit'
        }
      },
      {
        path: 'user-activity',
        component: UserActivityComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'User Activity'
        }
      },
      {
        path: 'mra/members',
        component: MraMembershipComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'MRA Members'
        }
      },
       {
        path: 'reports/aco-group',
        component: MraMembershipComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'MRA Members'
        }
      },
      
      {
        path: 'aco/members',
        component: AcoMembershipComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'ACO Members'
        }
      },

      {
        path: 'mra/providers',
        component: MraProvidersComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'MRA Providers'
        }
      },
      {
       path: 'census-report',
       component: CensusReportComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Census report'
        }
      },
      {
        path: 'mra/gaps',
        component: MraGapsComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'MRA Gaps'
        }
      },
       
      
      {
        path: 'productivity/HEDIS',
        component: ProductivityComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Hedis Productivity'
        }
      },
      {
        path: 'productivity/MRA',
        component: MraProductivityComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'MRA Productivity'
        }
      },
      {
       path: 'productivity/audit/hedis',
       component: AuditProductivityComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Quality Audit Productivity'
        }
      },
      
      
      {
        path: 'followups',
        component: FollowUpsComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Follow Ups'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}



