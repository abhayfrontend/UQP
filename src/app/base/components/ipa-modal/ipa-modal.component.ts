import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
	selector: 'app-ipa-modal',
	templateUrl: './ipa-modal.component.html',
	styleUrls: ['./ipa-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class IpaModalComponent implements OnInit {
	currentUser:any;
	associated_ipa:any;
	// check: boolean = false;
	error_msg: string;
	//to restrict navigating without selecting ipa
	isIPASelected:boolean = true;
	@ViewChild('ipaSelection') public ipaSelection: ModalDirective;
	constructor(private commonService: CommonService, private authS: AuthService, private router: Router) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	ngOnInit() {
		this.associated_ipa = this.currentUser.ipadetails;
		
	}
	ngAfterViewInit(){
		this.ipaSelection.show()
	}
		selectIPADB(ipa){

		this.authS.selectIPADB(ipa.IPA_ID).subscribe(
				res => {
					this.ipaSelection.hide()
					this.isIPASelected = true;
					localStorage.setItem('selectedIPA',ipa.IPA_Name);
					this.router.navigate(['/dashboard']);
					
				},
				err => {
					// localStorage.clear();
					// this.router.navigate(['/']);
					// this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
				}
			)
	}

}