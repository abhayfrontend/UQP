import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecondaryComponent } from './secondary.component';
import { EducationComponent } from './education/education.component';
import { MessageComponent } from './message/message.component';
import { BulkMailComponent } from './bulk-mail/bulk-mail.component';
import { EmailManagementComponent } from './email-management/email-management.component';
import { QuestionsComponent } from './questions/questions.component';
import { AcoProviderComponent } from './aco-provider/aco-provider.component';
import { HospSurveyComponent } from './hosp-survey/hosp-survey.component';
import { CaphsSurveyComponent } from './caphs-survey/caphs-survey.component';
import { AuthGuard } from '../../base/guards/auth.guard';
import { RoleGuard } from '../../base/guards/role.guard';
import { TrendsComponent } from './trends/trends.component';
import { AcoScorecardComponent } from './aco-scorecard/aco-scorecard.component';
import { SurveyScorecardComponent } from './survey-scorecard/survey-scorecard.component';
import { SurveyerListComponent } from './surveyer-list/surveyer-list.component';
const routes: Routes = [{
  path: '',
  component: SecondaryComponent,
  children: [
    {
      path: 'education', canActivate: [AuthGuard, RoleGuard], component: EducationComponent, data: {
        title: 'dashboard',
        name: 'Education'
      }
    },
    {
      path: 'questions/:type', canActivate: [AuthGuard, RoleGuard], component: QuestionsComponent, data: {
        title: 'dashboard',
        name: 'questions'
      }
    },
    {
      path: 'message', canActivate: [AuthGuard, RoleGuard], component: MessageComponent, data: {
        title: 'dashboard',
        name: 'Message Management'
      }
    },

    {
      path: 'bulk-mail', canActivate: [AuthGuard, RoleGuard], component: BulkMailComponent, data: {
        title: 'dashboard',
        name: 'Bulk Email Management'
      }
    },
    {
      path: 'aco-provider/list', canActivate: [AuthGuard, RoleGuard], component: AcoProviderComponent, data: {
        title: 'dashboard',
        name: 'ACO Provider Management'
      }
    },
    {
      path: 'survey/cahps', canActivate: [AuthGuard, RoleGuard], component: CaphsSurveyComponent, data: {
        title: 'dashboard',
        name: 'CAHPS Survey'
      }
    },
    {
      path: 'survey/hosp', canActivate: [AuthGuard, RoleGuard], component: HospSurveyComponent, data: {
        title: 'dashboard',
        name: 'HOS Survey'
      }
    },
    {
      path: 'scorecard/aco-scorecard', canActivate: [AuthGuard, RoleGuard], component: AcoScorecardComponent, data: {
        title: 'dashboard',
        name: 'ACO Scorecard'
      }
    },
    {
      path: 'scorecard/survey-scorecard/CAHPS', canActivate: [AuthGuard, RoleGuard], component: SurveyScorecardComponent, data: {
        title: 'CAHPS',
        name: 'CAHPS Scorecard'
      }
    },
    {
      path: 'scorecard/survey-scorecard/HOS', canActivate: [AuthGuard, RoleGuard], component: SurveyScorecardComponent, data: {
        title: 'HOS',
        name: 'HOS Scorecard'
      }
    },

    {
      path: 'productivity/surveyor', canActivate: [AuthGuard, RoleGuard], component: SurveyerListComponent, data: {
        title: 'dashboard',
        name: 'Surveyor Productivity'
      }
    },


    {
      path: 'trends', canActivate: [AuthGuard, RoleGuard], component: TrendsComponent, data: {
        title: 'dashboard',
        name: 'Trends'
      }

    },


    {
      path: 'email-management', canActivate: [AuthGuard, RoleGuard], component: EmailManagementComponent, data: {
        title: 'dashboard',
        name: 'Email Management'
      }
    },
    { path: '**', redirectTo: '/user/404' }

    // {path: 'magazine/pai',redirectTo: 'magazine/paintindia/2017/SEP', pathMatch: 'full'},

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecondaryRoutingModule { }
