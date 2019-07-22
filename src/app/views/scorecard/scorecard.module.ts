
import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { TimepickerModule,TimepickerConfig} from 'ngx-bootstrap/timepicker';

// import { FormsModule } from '@angular/forms';
import { ScorecardRoutingModule } from './scorecard-routing.module';
// import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BaseModule } from '../../base/base.module';

import { HealthplanScorecardComponent } from './healthplan-scorecard/healthplan-scorecard.component';
import { IpaScorecardComponent } from './ipa-scorecard/ipa-scorecard.component'
import { ProviderScorecardComponent } from './provider-scorecard/provider-scorecard.component';
import { MraHealthplanScorecardComponent } from './mra-healthplan-scorecard/mra-healthplan-scorecard.component';
import { OverallProviderComponent } from './overall-provider/overall-provider.component'
@NgModule({
  imports: [ TimepickerModule.forRoot(),ScorecardRoutingModule, BaseModule ],
  declarations: [

    HealthplanScorecardComponent,
     IpaScorecardComponent,
     ProviderScorecardComponent,
     MraHealthplanScorecardComponent,
     OverallProviderComponent

  ],
  providers: [ TimepickerConfig ]
})
export class ScorecardModule { }
