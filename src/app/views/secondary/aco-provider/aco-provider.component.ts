import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { AcoService } from '../../../services/aco.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-aco-provider',
	templateUrl: './aco-provider.component.html',
	styleUrls: ['./aco-provider.component.scss']
})
export class AcoProviderComponent implements OnInit {
	search_category: string = '';
	// global variables to identify user role entered/logged in
	rolename: string;
	roleid: any;

	provider_name: string;
	provider_id: number;
	ipa_list: any;
	insurance_list: any;
	search_text: any;
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
		'npi_number': null,
		'groupid': 0,
		'name': '',
		'key': '',
		'quarter': ''
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
	acogroup: any;
	hcc_list: any;
	hcc_desc: string = "";
	temp_desc: string = "";
	show_hcc: boolean = false;
	@ViewChild('term') input: ElementRef;






	ACO_groups: any;
	constructor(public authS: AuthService, private router: Router,
		private route: ActivatedRoute, private commonService: CommonService,
		private pagerService: PagerService,
		private userService: UserService,
		private acoService: AcoService) { }

	ngOnInit() {
//checking local storage data 
		if (localStorage.getItem('prov')) {
			this.acogroup = JSON.parse(localStorage.getItem('prov'))
			this.params.groupid = this.acogroup.groupid;

			// this.params.year = this.current_year;
			// this.params.month = this.previous_month;
			// //check if provider is entering then get details a/c to that provider
			// this.rolename = this.authS.getUserRole();
			// this.roleid = this.authS.getUserId();

			this.getACOGroups();
			this.getAllHealthplans();
			this.getAllMembers(false);
		}
		else if (localStorage.getItem('ACO_Provider_Details')) {
			this.params.key = 'dashboardprovider';
			this.params.quarter = '2018 04 Q';
			this.getACOGroups();
			this.getAllHealthplans();
			this.getAllMembers(false);
		}
		else {
			this.getACOGroups();
			this.getAllHealthplans();
			this.getAllMembers(false);
		}


	}

	ngOnDestroy() {
		localStorage.removeItem("ACO_Provider_Details")
		localStorage.removeItem("MraHpScorecard")
		// localStorage.removeItem("piechartdata")
		localStorage.removeItem("providerperformancedata")
		localStorage.removeItem('prov')
	}




	//Excel report configurations
	getReport(type) {

		// var obj = Object.assign(this.provider);
		var reportParams = { ...this.params, 'report': true };
		// console.log(obj)/
		// this.acoService.getMraMembers(reportParams
		// ).subscribe(results => {

		// 	if (type == 'pdf') {
		// 		saveAs(results, `mra-member-list.pdf`)
		// 	} else {
		// 		saveAs(results, `mra-member-list.xlsx`)
		// 	}

		// }, err => {
		// });

		this.acoService.getACOProviders(reportParams).subscribe(results => {
			saveAs(results, `aco-provider-list.xlsx`)
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
		this.acoService.getACOProviders(this.params).subscribe(results => {
			this.showPagination = true;
			console.log(results.headers);
			this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
			this.member_list = results.body;
			this.setPages();
		}, err => {
		});
	}
//on reset button
	resetFilters() {
		this.params = {
			'pageNumber': 1,
			'pageSize': 15,
			'npi_number': null,
			'groupid': 0,
			'name': '',
			'key': '',
			'quarter': ''
		}
		this.provider_name = '';
		this.search_text = '';

		this.getAllMembers(true);
	}



	getInsurance(member) {
		this.showPanel = false;
		this.provider_name = member.FirstName + ' ' + member.LastName;
		this.params.npi_number = member.uniqeproviderno;

	}
//pager service
	loadByPage(page_number: number) {
		if (page_number < 1 || page_number > this.pager.total_pages) {
			return;
		}
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

	// searchProvider() {
	// 	if (this.provider_name.length > 2) {
	// 		this.showPanel = true;
	// 		this.userService.search_ACO_provider(this.provider_name).subscribe(
	// 			res => {
	// 				this.members = res;
	// 			},
	// 			err => {
	// 				//
	// 			}
	// 		)
	// 	}
	// 	if (this.provider_name.length == 0) {
	// 		this.members = [];
	// 		this.params.npi = null;
	// 		this.showPanel = false;
	// 	}

	// }


	getAllHealthplans() {
		this.commonService.getAllHealthplans().subscribe(results => {

			this.insurance_list = results;
		}, err => {

		});
	}

	getACOGroups() {
		this.acoService.getACOGroups(null).subscribe(results => {

			this.ACO_groups = results;
		}, err => {

		});
	}


	//Search user roles
	search() {
		if (this.search_text > 0) {
			this.params.npi_number = this.search_text;
			this.getAllMembers(true);
		} else {
			this.params.name = "";
			this.getAllMembers(true);
		}
	}


}
