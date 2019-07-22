import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video.component';
import { BaseModule } from '../../base/base.module';
import { VideoRoutingModule } from './video-routing.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { NgUploaderModule } from 'ngx-uploader';
@NgModule({
  imports: [
    CommonModule, BaseModule, VideoRoutingModule, AngularMultiSelectModule, NgUploaderModule, 
  ],
  declarations: [VideoComponent]
})
export class VideoModule { }