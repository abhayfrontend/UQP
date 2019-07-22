import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseModule } from '../../base/base.module';
// import { GapClosureComponent } from './gap-closure.component';
import { GapClosureRoutingModule } from './gap-closure-routing.module';
import { GapAuditComponent } from './gap-audit/gap-audit.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
@NgModule({
  imports: [
    CommonModule, GapClosureRoutingModule, BaseModule, AngularMultiSelectModule
  ],
  declarations: [ GapAuditComponent]
})
export class GapClosureModule { }