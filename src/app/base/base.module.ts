import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from './pipes/truncate.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HelpComponent } from './components/help/help.component';
import { IpaModalComponent } from './components/ipa-modal/ipa-modal.component';
import { GapModalComponent } from './components/gap-modal/gap-modal.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
// By re-exporting CommonModule and FormsModule, any other module that imports this SharedModule, gets access
//  to directives like NgIf and NgFor from CommonModule and can bind to component properties with [(ngModel)], a directive in the FormsModule.
@NgModule({
  imports: [
    CommonModule, FormsModule, BsDatepickerModule, AngularMultiSelectModule,ModalModule.forRoot(),TabsModule.forRoot()
  ],
  declarations: [TruncatePipe, SpinnerComponent, RoundPipe, HelpComponent, SafePipe, GapModalComponent, IpaModalComponent],
  exports:[TruncatePipe, SpinnerComponent, RoundPipe, SafePipe,
   CommonModule, FormsModule, ModalModule, BsDatepickerModule, AccordionModule,TabsModule, 
    HelpComponent, TooltipModule, GapModalComponent, AngularMultiSelectModule, IpaModalComponent]
})
export class BaseModule { }
// Even though the components declared by SharedModule might not bind with [(ngModel)] and there may be no need 
// for SharedModule to import FormsModule, SharedModule can still export FormsModule without listing it among its imports.
//  This way, you can give other modules access to FormsModule without having to import it directly into the @NgModule decorator.