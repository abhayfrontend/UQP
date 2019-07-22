import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseModule } from '../../base/base.module';
import { SecondaryComponent } from './secondary.component';
import { EducationComponent } from './education/education.component';
import { SecondaryRoutingModule } from './secondary-routing.module';
import { MessageComponent } from './message/message.component';
import { NgUploaderModule } from 'ngx-uploader';
import { BulkMailComponent } from './bulk-mail/bulk-mail.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
// import { DragScrollModule } from 'ngx-drag-scroll';
import { QuillModule } from 'ngx-quill';
import { EmailManagementComponent } from './email-management/email-management.component';
import { QuestionsComponent } from './questions/questions.component';
import { AcoProviderComponent } from './aco-provider/aco-provider.component';
import { CaphsSurveyComponent } from './caphs-survey/caphs-survey.component';
import { HospSurveyComponent } from './hosp-survey/hosp-survey.component';
import { MomentModule } from 'angular2-moment';
import { TrendsComponent } from './trends/trends.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AcoScorecardComponent } from './aco-scorecard/aco-scorecard.component';
import { SurveyScorecardComponent } from './survey-scorecard/survey-scorecard.component';
import { SurveyerListComponent } from './surveyer-list/surveyer-list.component';
@NgModule({
  imports: [
    CommonModule, SecondaryRoutingModule, MomentModule, BaseModule, NgUploaderModule, AngularMultiSelectModule, QuillModule, ChartsModule
  ],
  declarations: [EducationComponent, SecondaryComponent, MessageComponent, BulkMailComponent,
    EmailManagementComponent, QuestionsComponent, AcoProviderComponent, CaphsSurveyComponent,
    HospSurveyComponent, TrendsComponent, AcoScorecardComponent, SurveyScorecardComponent, SurveyerListComponent]
})
export class SecondaryModule { }
