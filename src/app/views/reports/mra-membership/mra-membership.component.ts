import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { MraService } from '../../../services/mra.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-mra-membership',
	templateUrl: './mra-membership.component.html',
	styleUrls: ['./mra-membership.component.scss']
})
export class MraMembershipComponent implements OnInit {
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
		'providerid':0,
		'healthplanid': 2,
		'year': 0,
		'month':'',
		'hcccategory':'',
		'status':''

	}
	type: string = "projectedscore";
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
	constructor(public authS: AuthService, private router: Router,
		private route: ActivatedRoute, private commonService: CommonService,
		private pagerService: PagerService,
		private userService: UserService,
		private mraService: MraService) { 
                                           }

	ngOnInit() {
		
   
		this.params.year = this.current_year;
		this.params.month = this.previous_month;
		//check if provider is entering then get details a/c to that provider
		this.rolename = this.authS.getUserRole();
		this.roleid = this.authS.getUserId();
		
           let MraPrevalence=JSON.parse(localStorage.getItem("prevalence"));
		let MraHpScorecard = JSON.parse(localStorage.getItem("MraHpScorecard"));
		if(MraPrevalence){
			this.years = [];
			for (let year = Number(this.current_year); year > 2017; year -= 1) {
					this.years.push(year.toString());
				}
			this.type='projectedscore';
			this.params.year=MraPrevalence.year;
			this.params.healthplanid=MraPrevalence.healthplanid;
			this.params['hccnotfound']=MraPrevalence.hccnotfound;
			this.params.providerid=MraPrevalence.providerid;
			this.provider_name=MraPrevalence.provider_name;
		}


		//coming from pie chart of mra dashboard
		let piechartdata = JSON.parse(localStorage.getItem("piechartdata"));
		if(piechartdata){
			this.years = [];
			for (let year = Number(this.current_year); year > 2017; year -= 1) {
					this.years.push(year.toString());
				}
			this.type = piechartdata.type;
			this.params.year = piechartdata.year;
			this.params.healthplanid = piechartdata.hpid;
			let range = piechartdata.range.split('-');
			this.params['minscore'] = range[0];
			this.params['maxscore'] = range[1];
			// this.params.healthplanid = 0;
		}

if (MraHpScorecard) {
			this.years = [];
			this.type = MraHpScorecard.type;
			if (this.type == 'currentscore') {
				for (let year = Number(this.current_year); year > 2016; year -= 1) {
					this.years.push(year.toString());
				}
				this.params.year = MraHpScorecard.year ;
			} else if (this.type == 'projectedscore') {
				for (let year = Number(this.current_year); year > 2017; year -= 1) {
					this.years.push(year.toString());
				}
				this.params.year = MraHpScorecard.year;
			} else {
				for (let year = Number(this.current_year); year > 2017; year -= 1) {
					this.years.push(year.toString());
				}
				this.params.year = MraHpScorecard.year;
			}
			this.params.healthplanid = MraHpScorecard.healthplanid;
this.params.providerid = MraHpScorecard.providerid;
if (localStorage.getItem('provider_name')) {
      this.provider_name = localStorage.getItem('provider_name')
    } 
			
		}

		//coming from top/bottom performers
		let providerperformancedata = JSON.parse(localStorage.getItem("providerperformancedata"));
		if(providerperformancedata){
			this.params['minscore'] = '';
			this.params['maxscore'] = '';
			this.years = [];
			for (let year = Number(this.current_year); year > 2017; year -= 1) {
					this.years.push(year.toString());
				}
			this.type = providerperformancedata.type;
			this.params.year = providerperformancedata.year;
			this.params.healthplanid = providerperformancedata.hpid;
			this.params.providerid = providerperformancedata.providerid;
			this.provider_name = providerperformancedata.providername;
			// this.params.healthplanid = 0;
		}
		if (this.rolename == 'provider') {
	      this.params.providerid = this.roleid;  
	    }else if(this.rolename == 'healthplan'){
			this.params.healthplanid = this.roleid; 
	    }
		// if (this.rolename == 'provider') {
		//   this.params.providerid = this.roleid;
		//   this.commonService.getInsurance(this.roleid
		//   ).subscribe(results => {

		//     this.insurance_list = results;
		//   }, err => {
		//   });
		// }

		// this.date = {
		//   // 'month':this.current_month,
		//   'month': this.previous_month,
		//   'year': this.current_year
		// }
		// this.checkMonth(this.current_year)
		// get all members on init
		if(MraHpScorecard){
			console.log(MraHpScorecard.providerid)
		}
		this.getAllHealthplans();
		this.getAllMembers(false, this.type);
		this.getHccCategory();
	}

	ngOnDestroy() {
		localStorage.removeItem("MraHpScorecard")
		localStorage.removeItem("prevalence")
		localStorage.removeItem("provider_name")
		localStorage.removeItem("providerperformancedata")
		localStorage.removeItem("piechartdata")
	}


	resetFilters() {
		this.search_category='';
		this.show_hcc = false;
		this.provider_name = '';
		if (this.rolename != 'provider') {
			this.params.providerid = 0;
		}
		if (this.rolename != 'healthplan') {
			this.params.healthplanid = 0;
		}

		
		this.params.hcccategory = '';
		this.params.status = '';
		this.temp_desc= "";
		 this.input.nativeElement.value = "";
		this.params['membername'] = '';
		this.params['subsId'] = '';
		this.params['dob']='';
		this.getAllMembers(true, this.type);
	}


	//Excel report configurations
	getReport(type) {
		// this.provider.type=type;
		//   this.provider.report = true;
		let reportDetails = {
			// 'providername': this.provider_name,
			// 'healthplanname': this.healthplanName,
			//   'selectedmonth':this.selectedMonth,
			'type': type,
			'report': true,
			'description': this.hcc_desc
		}
		// var obj = Object.assign(this.provider);
		var reportParams = { ...this.params, ...reportDetails };
		// console.log(obj)/
		this.mraService.getMraMembers(reportParams, this.type
		).subscribe(results => {

			if (type == 'pdf') {
				saveAs(results, `mra-member-list.pdf`)
			} else {
				saveAs(results, `mra-member-list.xlsx`)
			}

		}, err => {
		});
	}
  search_value(term)
  {
    
    if(term.length==0)
      {
        this.params['membername']='';
        this.params['subsId']='';
        this.params['dob']='';      
      }
      else{
         
          }
    }


	//Getting all members
	getAllMembers(resetPage, type) {
		// localStorage.removeItem('subplan');
		if (resetPage) {
			this.params['pageNumber'] = 1;
			this.page = 1;
		}
		// this.page=1;
		this.params['report'] = false;
		this.mraService.getMraMembers(this.params, type).subscribe(results => {
			this.showPagination = true;
			if(this.temp_desc){
				this.show_hcc = true;
				this.hcc_desc = this.temp_desc;
			}
			this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
			this.member_list = results.body;
			this.setPages();
		}, err => {
		});
	}
	addHccDesc(desc){
		this.temp_desc = desc;
	}
	// Function to calculate age
	calculateAge(birthday) {
		if (birthday) {
			let age = birthday.split('-')
			return this.current_year - age[0];
		}


	}

	searchMembers() {
		if (this.search_text.length > 2) {
			this.showPagination = false;
			this.page = 1;

			this.userService.search_provider(this.search_text).subscribe(
				res => {

					this.member_list = res;
				},
				err => {
					//
				}
			)
		} else if (this.search_text.length == 0) {
			this.getAllMembers(true, this.type)
		}


	}

	  getInsurance(member) {
	    this.showPanel = false;
	    this.provider_name = member.FirstName + ' ' + member.LastName;
	    this.params.providerid = member.id;
	   
	    // this.provider.uniqeproviderno = member.id;
	    // this.commonService.getInsurance(member.id
	    // ).subscribe(results => {

	    //   this.insurance_list = results;
	    //   this.params.healthplanid = 0;
	    // }, err => {

	    // });
  }

	loadByPage(page_number: number) {
		if (page_number < 1 || page_number > this.pager.total_pages) {
			return;
		}
		this.page = page_number;
		// console.log("Page"+this.page)
		// console.log("Page numbe"+page_number)
		this.params['pageNumber'] = this.page
		this.getAllMembers(false, this.type);
		// window.scrollTo(0, 200);
	}


	setPages() {
		// get pager object from service
		this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
	}

	searchProvider() {
		if (this.provider_name.length > 2) {
			this.showPanel = true;
			this.userService.search_provider(this.provider_name).subscribe(
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
			this.params.providerid = 0;
			this.showPanel = false;
		}

	}


	getAllHealthplans() {
		this.commonService.getAllHealthplans().subscribe(results => {

			this.insurance_list = results;
		}, err => {

		});
	}

	getHccCategory(){
		this.mraService.getHccCategory("").subscribe(results => {

			this.hcc_list = results;
		}, err => {

		});
	}
	checkCategory(val) {
		// console.log(val)
		if (this.search_category == 'name') {

			this.params['membername'] = val;
			this.params['subsId'] = '';
			this.params['dob']='';
		} else if (this.search_category == 'id') {

			this.params['membername'] = '';
			this.params['subsId'] = val;
			this.params['dob']='';

		}
		else if(this.search_category=='dob')
		{
			this.params['membername']='';
			this.params['subsId']='';
			this.params['dob']=val;
		}

	}
	search(term) {
		 if(term.trim()=='')
	  {

	  }
		
	 
	  else{
	  	  term=term.trim();
	  	  
	  	this.checkCategory(term)
		if (term.length > 2) {
			this.page = 1;
			this.getAllMembers(true, this.type);

		} else if (term.length == 0) {
			this.page = 1;
			// this.params.membername = '';
			this.getAllMembers(true, this.type);
		}
	}
}
}
