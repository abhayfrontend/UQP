import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { BaseModule } from './base/base.module';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { CommonService } from './services/common.service';
import { PagerService } from './services/pager.service';
import { MemberService } from './services/member.service';
import { NotificationService } from './views/notifications/notifications.service';
import { MraService } from './services/mra.service';
import { AcoService } from './services/aco.service';
// import { UserModule } from './views/user/user.module';
// import { ScorecardModule } from './views/scorecard/scorecard.module';
// import { ReportsModule } from './views/reports/reports.module';
import { TabsModule } from 'ngx-bootstrap';
import { SecondaryModule } from './views/secondary/secondary.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { HttpModule,JsonpModule } from '@angular/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './base/guards/auth.guard';
import { RoleGuard } from './base/guards/role.guard';
import { ReuseGuard } from './base/guards/reuse.guard';
import { CanDeactivateGuard } from './base/guards/can-deactivate.guard';
// import { QuillModule } from 'ngx-quill'
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from "./base/guards/route-reuse";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup

import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
// Import containers

import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

const APP_CONTAINERS = [
  FullLayoutComponent,
  SimpleLayoutComponent
]

// Import components
import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
} from './components';

const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
]


// Import directives
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
]

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
// import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HomeComponent } from './views/home/home.component';
import { AcmComponent } from './views/acm/acm.component';
import { MeasuresComponent } from './views/measures/measures.component';
import { StarManagementComponent } from './views/star-management/star-management.component';
import { MeasuresViewComponent } from './views/measures/measures-view/measures-view.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor'
// import { ProviderScorecardComponent } from './views/scorecard/provider-scorecard/provider-scorecard.component';
// import { HealthplanScorecardComponent } from './views/scorecard/healthplan-scorecard/healthplan-scorecard.component';
// import { IpaScorecardComponent } from './views/scorecard/ipa-scorecard/ipa-scorecard.component';
import { ProviderComponent } from './views/provider/provider.component';
import { MemberComponent } from './views/member/member.component';
import { IpaComponent } from './views/ipa/ipa.component';
import { InsuranceComponent } from './views/insurance/insurance.component';
import { SpinnerService } from './services/spinner.service';
import { GapsComponent } from './views/gaps/gaps.component';
// import { MembershipRosterComponent } from './views/reports/membership-roster/membership-roster.component';
// import { SingleMeasureComponent } from './views/reports/single-measure/single-measure.component';
// import { OverallGapsComponent } from './views/reports/overall-gaps/overall-gaps.component';
// import { LogViewerComponent } from './views/reports/log-viewer/log-viewer.component';


import { LogoManagementComponent } from './views/logo-management/logo-management.component';
import { NgUploaderModule } from 'ngx-uploader';
// import { LastVisitComponent } from './views/reports/last-visit/last-visit.component';
import { SpinnerComponent } from './base/components/spinner/spinner.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

// import { DragScrollModule } from 'ngx-drag-scroll';

@NgModule({
  imports: [
  AngularMultiSelectModule,
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    // TabsModule.forRoot(),
    ChartsModule,
    // DragScrollModule,
    // ModalModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    CarouselModule.forRoot(),
    TabsModule.forRoot(),
    // UserModule,
    // ScorecardModule,
    // ReportsModule,
    SecondaryModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    BaseModule,
    NgUploaderModule,
    NgHttpLoaderModule,
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    // QuillModule,
    // BrowserAnimationsModule,
    ToastrModule.forRoot({
      
      progressAnimation: 'increasing',
      timeOut: 3500
    })

  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
    HomeComponent,
    AcmComponent,
    MeasuresComponent,
    StarManagementComponent,
    MeasuresViewComponent,
    // ProviderScorecardComponent,
    // HealthplanScorecardComponent,
    // IpaScorecardComponent,
    ProviderComponent,
    MemberComponent,
    IpaComponent,
    InsuranceComponent,
    GapsComponent,
    // MembershipRosterComponent,
    // SingleMeasureComponent,
    // OverallGapsComponent,
    // LogViewerComponent,
    LogoManagementComponent,
    
    // LastVisitComponent,
  ],
 providers: [UserService,AuthService,CommonService,PagerService, NotificationService,
  SpinnerService,MemberService, AuthGuard, CanDeactivateGuard, RoleGuard,ReuseGuard, MraService, AcoService
  ,{
                provide: RouteReuseStrategy,
                useClass: CustomReuseStrategy
            },
    {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [ AppComponent ],
  entryComponents: [
        SpinnerComponent
    ]
})
export class AppModule { }
