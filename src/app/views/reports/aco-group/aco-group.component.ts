import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { AcoService } from '../../../services/aco.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-aco-group',
  templateUrl: './aco-group.component.html',
  styleUrls: ['./aco-group.component.scss']
})
export class AcoGroupComponent implements OnInit {

  search_category: string = '';
	// global variables to identify user role entered/logged in
	rolename: string;
	roleid: any;

	group_name: string;
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
		'name':null,
		'status':"",
		'quarter':'',
		'key':''
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
		private route: ActivatedRoute,private toastr: ToastrService, private commonService: CommonService,
		private pagerService: PagerService,
		private userService: UserService,
		private acoService: AcoService) {}
	   showSuccess(msg, title) {
        this.toastr.success(title, msg);
      }
       showDanger(msg, title) {
        this.toastr.error(title, msg);
     }

	ngOnInit() {
		if(localStorage.getItem('ACO_Gap_Details')){
			this.params.key='dashboardprovider';
			this.params.quarter= '2018 04 Q';
		}

		// this.params.year = this.current_year;
		// this.params.month = this.previous_month;
		// //check if provider is entering then get details a/c to that provider
		// this.rolename = this.authS.getUserRole();
		// this.roleid = this.authS.getUserId();
		
		
		
		this.getAllGroups(true);
		
	}

	ngOnDestroy() {
		localStorage.removeItem("ACO_Gap_Details")
		localStorage.removeItem("MraHpScorecard")
		// localStorage.removeItem("piechartdata")
		localStorage.removeItem("providerperformancedata")
	}




	//Excel report configurations
	getReport(type) {
		// var obj = Object.assign(this.provider);
		var reportParams = { ...this.params, 'report': true };
		

		this.acoService.getACOGroup(reportParams).subscribe(results => {
			saveAs(results, `aco-group.xlsx`)
		}, err => {
		});
	}



	//Getting all members
	getAllGroups(resetPage) {
		// localStorage.removeItem('subplan');
		if (resetPage) {
			this.params['pageNumber'] = 1;
			this.page = 1;
		}
		// this.page=1;
		this.params['report'] = false;
		this.acoService.getACOGroup(this.params).subscribe(results => {
			this.showPagination = true;
			// console.log(results.headers);
			
			this.member_list = results.body;
			this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
			this.setPages();

		}, err => {
		});
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
		this. getAllGroups(false);
		// window.scrollTo(0, 200);
	}

storeAcoProvider(member)
{

   localStorage.setItem('prov',JSON.stringify(member))
   this.router.navigate(['/aco-provider/list']);
}
	setPages() {
		// get pager object from service
		this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
	}

	searchGroup() {
		if (this.params.name.length > 2) {
			this.showPanel = true;
			this.acoService.getACOGroup(this.params).subscribe(
				res => {
					this.members = res;
				},
				err => {
					//
				}
			)
		}
		if (this.params.name.length == 0) {
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



	    checkCategory(val) {
    // console.log(val)
   if (this.search_category == 'name') {

      this.params['membername'] = val;
      this.params['subsId'] = '';
      this.params['dob'] = '';
    } else if (this.search_category == 'id') {

      this.params['membername'] = '';
      this.params['subsId'] = val;
      this.params['dob'] = '';
    }else if (this.search_category == 'dob') {

      this.params['membername'] = '';
      this.params['subsId'] = '';
      this.params['dob'] = val;
    }

  }
	search(term) {
		console.log(term.length)
		 if(term.trim()==''){}
		 	else{
		this.checkCategory(term)

		if (term.length > 2) {
			this.page = 1;
			this. getAllGroups(true);

		} else if (term.length == 0) {
			this.page = 1;
			// this.params.membername = '';
			this.getAllGroups(true);
		}
	}}




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


updateUserRoleStatus(id, status) {
    let fromStatus = status ? 'Active' : 'Inactive';
    let toStatus = !status ? 'Active' : 'Inactive';
    this.userService.updateAcoroleStatus(id, !status).subscribe(results => {
      this.showSuccess('Update role status', name + ' changed from ' + fromStatus + ' to ' + toStatus)
    }, err => {
      this.showDanger('Update role status', name + ' User role status update failed')
    });
    // this.params.status="";
    
    // this.getAllGroups(true);
  }

 

}
