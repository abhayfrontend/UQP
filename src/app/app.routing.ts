import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadingStrategy, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AcmComponent } from './views/acm/acm.component';
import { MeasuresComponent } from './views/measures/measures.component';
// import { ResetPasswordComponent } from './views/user/reset-password/reset-password.component';
import { StarManagementComponent } from './views/star-management/star-management.component';
import { MeasuresViewComponent } from './views/measures/measures-view/measures-view.component';

import { ProviderComponent } from './views/provider/provider.component';
import { MemberComponent } from './views/member/member.component';
import { IpaComponent } from './views/ipa/ipa.component';
import { InsuranceComponent } from './views/insurance/insurance.component';
import { GapsComponent } from './views/gaps/gaps.component';

import { LogoManagementComponent } from './views/logo-management/logo-management.component';

import { CanDeactivateGuard } from './base/guards/can-deactivate.guard';
// import { NotFoundComponent } from './views/user/404/404.component';
// import { HelpComponent } from './views/help/help.component';

import { AuthGuard } from './base/guards/auth.guard';
import { RoleGuard } from './base/guards/role.guard';

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

export const routes: Routes = [
  {
    path: '',
    canDeactivate:[CanDeactivateGuard],
    component: HomeComponent,
    data: {
          name:'home',
          shouldclear: true
        }
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'dashboard'
         
        }
        //should clear and detach are used forreusing routereuse strategy
        // loadChildren: './views/user/user.module#UserModule'
      },
      {
        path: 'notifications',
        loadChildren: './views/notifications/notifications.module#NotificationsModule',
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'notifications',
          name: 'Notification Management'
        }
        // loadChildren: './views/user/user.module#UserModule'
      },
      {
        path: 'videos',
        loadChildren: './views/video-management/video.module#VideoModule',
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'videos',
          name: 'Video Management'
        }
        // loadChildren: './views/user/user.module#UserModule'
      },
      {
        path: 'user',
        loadChildren: './views/user/user.module#UserModule'
      },
      
      {
        path: 'scorecard',
        loadChildren: './views/scorecard/scorecard.module#ScorecardModule',
        canActivate: [AuthGuard,RoleGuard]
      },
      {
        path: 'reports',
        loadChildren: './views/reports/reports.module#ReportsModule',
        canActivate: [AuthGuard,RoleGuard]
      },

    

      {
        path: 'gap-closure',
        loadChildren: './views/gap-closure/gap-closure.module#GapClosureModule',
        canActivate: [AuthGuard,RoleGuard]
      },
      {
        path: 'acm',
        component: AcmComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Access Control Management'
        }
      },
      // {
      //   path: 'help',
      //   component: HelpComponent,
      //   canActivate: [AuthGuard,RoleGuard],
      //   data: {
      //     title: 'dashboard',
      //     name: 'Quality Measure'
      //   }
      // },
      {
        path: 'measures',
        component: MeasuresComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Quality Measure'
        }
      },
    {
        path: 'star-management',
        component: StarManagementComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'STAR Values'
        }
      },
      
      {
        path: 'provider/list',
        component: ProviderComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Provider Management'
        }
      },
      
      {
        path: 'IPA/list',
        component: IpaComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'IPA Management'
        }
      },
      {
        path: 'insurance/list',
        component: InsuranceComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Insurance Management'
        }
      },
      {
        path: 'member/list',
        component: MemberComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Member Management'
        }
      },
      {
        path: 'measures/view/:id',
        component: MeasuresViewComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'Quality Measure'
        }
      },
      {
        path: 'members/:term',
        component: GapsComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'dashboard'
        }
      },
    
      
      {
        path: 'logo-management',
        component: LogoManagementComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: {
          title: 'dashboard',
          name: 'dashboard'
        }
      },{
        path: '',
        loadChildren: './views/secondary/secondary.module#SecondaryModule',
        canActivate: [AuthGuard,RoleGuard]
      }
     
    ]
  }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

// master member list
// {
//         path: 'member/list',
//         component: MemberComponent,
//         canActivate: [AuthGuard,RoleGuard],
//         data: {
//           title: 'dashboard',
//           name: 'Member Management'
//         }
//       },