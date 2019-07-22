import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
// import { CommonModule } from '@angular/common';
import { BaseModule } from '../../base/base.module';
import { MemberComponent } from './member/member.component';
import { NgUploaderModule } from 'ngx-uploader';
import { QualityComponent } from './quality/quality.component';
import { MraDashboardComponent } from './mra-dashboard/mra-dashboard.component';
import { MraAuditDashboardComponent } from './mra-audit-dashboard/mra-audit-dashboard.component';
import { DefaultComponent } from './default/default.component';
import { AcoDashboardComponent } from './aco-dashboard/aco-dashboard.component';
@NgModule({
  imports: [
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    BaseModule,
    NgUploaderModule
  ],
  declarations: [ DashboardComponent, MemberComponent, QualityComponent, MraDashboardComponent, MraAuditDashboardComponent, DefaultComponent, AcoDashboardComponent ]
})
export class DashboardModule { }
