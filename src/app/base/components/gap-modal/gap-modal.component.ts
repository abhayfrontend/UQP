import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { CommonService } from '../../../services/common.service';
@Component({
	selector: 'app-gap-modal',
	templateUrl: './gap-modal.component.html',
	styleUrls: ['./gap-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class GapModalComponent implements OnInit {
	currentUser:any;
	// @Input() gapMember;
	@Input() gapSubmit;
	ndc_codes: any;
	brandNames: any;

	brand_name: any;
	route: any;

	itemList = [];
	selectedItems = [];
	settings = {};
	rejectedReasons:any;
	disableRetinopathy:boolean = false;

	discharge_date:boolean = false;
	dexa_date:boolean = false;
	reconcilation_date:boolean = false;
	constructor(private commonService: CommonService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	ngOnInit() {
		console.log(this.gapSubmit);
		
		// this.getNdcCodes(id);
		this.getSubmissionReasons(1);
		this.settings = {
			singleSelection: true,
			text: "Select Brand Name",

			enableSearchFilter: true,
			badgeShowLimit: 1,
			labelKey: 'brand_name',
			primaryKey: 'id'
		};
	}

	onItemSelect(item: any) {
		// this.getValueNdc(item)
		this.gapSubmit.brand_name = this.selectedItems[0].brand_name;
			
		// console.log(item);  
		// console.log(this.selectedItems);
	}
	OnItemDeSelect(item: any) {
		// console.log(item);
		// console.log(this.selectedItems);
	}
	onSelectAll(items: any) {
		// console.log(items);
	}
	onDeSelectAll(items: any) {
		// console.log(items);
	}


	// getNdcCodes(id) {
	// 	// alert("frefref");
	// 	// console.log("Feefr");
	// 	this.commonService.getNdcCodes(id).subscribe(results => {
	// 		this.ndc_codes = results;
	// 	}, err => {

	// 	});
	// }


	getBrandNames(id) {
		// alert("frefref");
		// console.log("Feefr");
		this.commonService.getBrandNames(id).subscribe(results => {
			this.brandNames = results;
		}, err => {

		});
	}

	getSubmissionReasons(id) {
		// alert("frefref");
		// console.log("Feefr");
		this.commonService.getSubmissionReasons(id).subscribe(results => {
			this.rejectedReasons = results;
		}, err => {

		});
	}
	//to set the beand and route a/c to the selected ndc code
	getValueNdc(item) {
		this.gapSubmit.brand_name = '';
		this.gapSubmit.route = '';
		this.gapSubmit.ndc_code = '';
		this.commonService.getValueNdc(item.id).subscribe(results => {
			// this.ndc_codes = results;cl	
			this.brand_name = results.brand_name;
			this.route = results.route;
			this.gapSubmit.brand_name = this.brand_name;
			this.gapSubmit.route = this.route;
			this.gapSubmit.ndc_code = this.selectedItems[0].NDC_codes;

			// console.log(results);
		}, err => {

		});
	}

	checkDatesFromDB(dateDetails){
		console.log(dateDetails);
		this.dexa_date = false;
		this.discharge_date = false;
		this.reconcilation_date = false;

		if(dateDetails.dateofdexaneeded){
			this.dexa_date = true;
		}
		if(dateDetails.dateofdischarge){
			this.discharge_date = true;
		}
		if(dateDetails.dateofmedicalreconcilation){
			this.reconcilation_date = true;
		}
	
	}

	//is getting called from parent element to set multiselect and ndc parameters
	retreiveNDCList(results) {
		this.selectedItems = results.BrandNameList
		// this.brand_name = results.brand_name;
		// this.route = results.route;
	}

	//resetNDC for other members
	resetNDC() {
		this.selectedItems = []
		this.brand_name = '';
		this.route = '';
	}

	// add details before submitting gap
	addDetails(){
		// alert("fdsf");
		     if((this.currentUser.roleid == 51)||(this.currentUser.roleid == 3)||(this.currentUser.roleid == 35)||(this.currentUser.roleid == 36) || (this.currentUser.roleid == 2)){
		     	this.gapSubmit.userid = this.currentUser.userid;
  			}else{
  				this.gapSubmit.userid = 0;
  			}
  			// console.log(this.gapSubmit.dateofservice);
  			// console.log(this.gapSubmit.dateofservice.toDateString() )
  			if(this.gapSubmit.dateofservice){
  				if(typeof this.gapSubmit.dateofservice != 'string'){
  					this.gapSubmit.dateofservice = this.gapSubmit.dateofservice.toDateString();
  				}

  				
  			}
  			if(this.gapSubmit.dateofrx){
  				if(typeof this.gapSubmit.dateofrx != 'string'){
  					this.gapSubmit.dateofrx = this.gapSubmit.dateofrx.toDateString();
  				}
  				
  			}
  			if(this.gapSubmit.dateofdexaneeded){
  				if(typeof this.gapSubmit.dateofdexaneeded != 'string'){
  					this.gapSubmit.dateofdexaneeded = this.gapSubmit.dateofdexaneeded.toDateString();
  				}
  				
  			}
  			if(this.gapSubmit.dateofdexacompleted){
  				if(typeof this.gapSubmit.dateofdexacompleted != 'string'){
  					this.gapSubmit.dateofdexacompleted = this.gapSubmit.dateofdexacompleted.toDateString();
  				}
  				
  			}
  			if(this.gapSubmit.dateofdischarge){
  				if(typeof this.gapSubmit.dateofdischarge != 'string'){
  					this.gapSubmit.dateofdischarge = this.gapSubmit.dateofdischarge.toDateString();
  				}
  				
  			}
  			if(this.gapSubmit.dateofmedicalreconcilation){
  				
  				if(typeof this.gapSubmit.dateofmedicalreconcilation != 'string'){
  					this.gapSubmit.dateofmedicalreconcilation = this.gapSubmit.dateofmedicalreconcilation.toDateString();
  				}
  			}
  			if(this.gapSubmit.dateofhypertension){
  				if(typeof this.gapSubmit.dateofhypertension != 'string'){
  					this.gapSubmit.dateofhypertension = this.gapSubmit.dateofhypertension.toDateString();
  				}
  				
  			}

  			
  			
  			
  			
  			
  			
  			
		// this.gapSubmit.userid = this.currentUser.userid;
		this.gapSubmit.username = this.currentUser.name;
		this.gapSubmit.rolename = this.currentUser.rolename;
		this.gapSubmit.roleid = this.currentUser.roleid;
		if(this.currentUser.rolename == 'Office Staff'){
			this.gapSubmit.roleid = 36;
		}

	}
	removereason()
	{
		this.gapSubmit.reasonid=0;
	}


	checkEyeExamDate(date){
		if(date){
			if(date.getFullYear() == 2018){
				this.gapSubmit.dee_result = "Negative for Retinopathy";
				this.disableRetinopathy = true;
			}else{
				this.disableRetinopathy = false;
			}
		}
		
	}
}