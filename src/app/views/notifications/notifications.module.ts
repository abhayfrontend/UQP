import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { BaseModule } from '../../base/base.module';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { NgUploaderModule } from 'ngx-uploader';
@NgModule({
  imports: [
    CommonModule, BaseModule, NotificationsRoutingModule, AngularMultiSelectModule, NgUploaderModule, 
  ],
  declarations: [NotificationsComponent]
})
export class NotificationsModule { }