
import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { NgUploaderModule } from 'ngx-uploader';


// import { FormsModule } from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
// import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BaseModule } from '../../base/base.module';

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
import { AcoGroupComponent } from './aco-group/aco-group.component';
import { CustomReportsComponent } from './custom-reports/custom-reports.component';
import { AcoGapsComponent } from './aco-gaps/aco-gaps.component';
import { PrevalenceComponent } from './prevalence/prevalence.component';

@NgModule({
  imports: [ ReportsRoutingModule, BaseModule, AngularMultiSelectModule, NgUploaderModule ],
  declarations: [
    MembershipRosterComponent,
     SingleMeasureComponent,
     OverallGapsComponent,
     LogViewerComponent,
     LastVisitComponent,
     UserActivityComponent,
     MraMembershipComponent,
     MraGapsComponent,
     MraProvidersComponent,
     ProductivityComponent,
     FollowUpsComponent,
     MraProductivityComponent,
     AuditProductivityComponent,
     CensusReportComponent,
     AcoMembershipComponent,
     AcoGroupComponent,
     CustomReportsComponent,
     AcoGapsComponent,
     PrevalenceComponent,
   


  ]
})
export class ReportsModule { }
