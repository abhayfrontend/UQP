import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { AcoService } from '../../../services/aco.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-aco-membership',
  templateUrl: './aco-membership.component.html',
  styleUrls: ['./aco-membership.component.scss']
})
export class AcoMembershipComponent implements OnInit {
	search_category: string = '';
	// global variables to identify user role entered/logged in
	rolename: string;
	roleid: any;

	provider_name: string;
	provider_id: number;
	ipa_list: any;
	insurance_list: any;
	search_text: string;
	members: any;
	member_list: any
	showPanel: boolean = true;
	page: number = 1;
	pager: any = {};
	total_pages: number;
	showPagination: boolean = true;

	// search_category:string='';
	healthplanName: string = 'All';


    months = [{ "full": "January", "value": "01", "days": "31" },
      { "full": "February", "value": "02", "days": "28" },
      { "full": "March", "value": "03", "days": "31" },
      { "full": "April", "value": "04", "days": "30" },
      { "full": "May", "value": "05", "days": "31" },
      { "full": "June", "value": "06", "days": "30" },
      { "full": "July", "value": "07", "days": "31" },
      { "full": "August", "value": "08", "days": "31" },
      { "full": "September", "value": "09", "days": "30" },
      { "full": "October", "value": "10", "days": "31" },
      { "full": "November", "value": "11", "days": "30" },
      { "full": "December", "value": "12", "days": "31" }
      ];

	params = {
		'pageNumber': 1,
		'pageSize': 15,
		'npi': null,
		'groupid':0,
		'quarter':'2018 04 Q'
	}
	
	years: string[] = [];
	date: any;
	days: any;
	current_date = new Date();
	current_month = this.authS.getDates().current_month;
  	previous_month = this.authS.getDates().previous_month;
	current_year = this.authS.getDates().current_year;
	selectedItem: any;
	address_list: any;
	tooltip_data: any;

	hcc_list:any;
	hcc_desc:string = "";
	temp_desc:string = "";
	show_hcc:boolean = false;
	@ViewChild('term') input: ElementRef;






	ACO_groups:any;
	constructor(public authS: AuthService, private router: Router,
		private route: ActivatedRoute, private commonService: CommonService,
		private pagerService: PagerService,
		private userService: UserService,
		private acoService: AcoService) { }

	ngOnInit() {
		

		// this.params.year = this.current_year;
		// this.params.month = this.previous_month;
		// //check if provider is entering then get details a/c to that provider
		// this.rolename = this.authS.getUserRole();
		// this.roleid = this.authS.getUserId();
		
		this.getACOGroups();
		this.getAllHealthplans();
		this.getAllMembers(false);
		
	}

	ngOnDestroy() {
		localStorage.removeItem("MraHpScorecard")
		// localStorage.removeItem("piechartdata")
		localStorage.removeItem("providerperformancedata")
	}




	//Excel report configurations
	getReport(type) {
		
		// var obj = Object.assign(this.provider);
		var reportParams = { ...this.params, 'report': true };
		

		this.acoService.getACOMembership(reportParams).subscribe(results => {
			saveAs(results, `aco-membership-list.xlsx`)
		}, err => {
		});
	}



	//Getting all members
	getAllMembers(resetPage) {
		// localStorage.removeItem('subplan');
		if (resetPage) {
			this.params['pageNumber'] = 1;
			this.page = 1;
		}
		// this.page=1;
		this.params['report'] = false;
		this.acoService.getACOMembership(this.params).subscribe(results => {
			this.showPagination = true;
			this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
			this.member_list = results.body;
			this.setPages();
		}, err => {
		});
	}

	  resetFilters(){
    this.params = {
		'pageNumber': 1,
		'pageSize': 15,
		'npi': null,
		'groupid':0,
		'quarter':'2018 04 Q'		
	}
	this.provider_name = '';
	this.search_category='';
    this.params['dob']='';
    this.input.nativeElement.value = "";
    this.params['membername'] = '';
    this.params['subsid'] = '';
    this.getAllMembers(true);
  }

	

	  getInsurance(member) {
	    this.showPanel = false;
	    this.provider_name = member.FirstName + ' ' + member.LastName;
	    this.params.npi = member.uniqeproviderno;
	  
  }

	loadByPage(page_number: number) {
		if (page_number < 1 || page_number > this.pager.total_pages) {
			return;
		}
		page_number = Number(page_number);
		this.page = page_number;
		// console.log("Page"+this.page)
		// console.log("Page numbe"+page_number)
		this.params['pageNumber'] = this.page
		this.getAllMembers(false);
		// window.scrollTo(0, 200);
	}


	setPages() {
		// get pager object from service
		this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
	}

	searchProvider() {
		if (this.provider_name.length > 2) {
			this.showPanel = true;
			this.userService.search_ACO_provider(this.provider_name).subscribe(
				res => {
					this.members = res;
				},
				err => {
					//
				}
			)
		}
		if (this.provider_name.length == 0) {
			this.members = [];
			this.params.npi = null;
			this.showPanel = false;
		}

	}


	getAllHealthplans() {
		this.commonService.getAllHealthplans().subscribe(results => {

			this.insurance_list = results;
		}, err => {

		});
	}

getACOGroups(){
	this.acoService.getACOGroups(0).subscribe(results => {

			this.ACO_groups = results;
		}, err => {

		});
}

	    checkCategory(val) {
    // console.log(val)
   if (this.search_category == 'name') {

      this.params['membername'] = val;
      this.params['subsid'] = '';
      this.params['dob'] = '';
    } else if (this.search_category == 'id') {

      this.params['membername'] = '';
      this.params['subsid'] = val;
      this.params['dob'] = '';
    }else if (this.search_category == 'dob') {

      this.params['membername'] = '';
      this.params['subsid'] = '';
      this.params['dob']=val;
    }

  }
	search(term) {
		if(term.trim()==''){}
			else{term=term.trim();
		this.checkCategory(term)

		if (term.length > 2) {
			this.page = 1;
			this.getAllMembers(true);

		} else if (term.length == 0) {
			this.page = 1;
			// this.params.membername = '';
			this.getAllMembers(true);
		}
	}}




  search_value(term)
  {
    
    if(term.length==0)
      {
        this.params['name']='';
        this.params['subsid']='';
        this.params['dob']='';      
      }
      else{
         
          }
    }


}
