import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { AcoService } from '../../../services/aco.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-aco-scorecard',
	templateUrl: './aco-scorecard.component.html',
	styleUrls: ['./aco-scorecard.component.scss']
})
export class AcoScorecardComponent implements OnInit {
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
	GroupName: string;
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

		'groupid': '',
		'npi': '',
		'aco': '',
		month: '',
		year: '',
		startdate: '',
		enddate: ''

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
		// setting years array
		for (let year = Number(this.current_year); year > 2018; year -= 1) {
			this.years.push(year.toString());
		}
		this.getACOGroups(null);

	}



	//Excel report configurations
	getReport(type) {

		// var obj = Object.assign(this.provider);
		var reportParams = { ...this.params, 'report': true };


		this.acoService.getacoscorecard(reportParams).subscribe(results => {
			saveAs(results, `aco-scorecard-list.xlsx`)
		}, err => {
		});
	}



	//Getting all members
	getAllMembers(resetPage) {
		if (this.provider_name) { console.log('true') }
		console.log(this.params.npi)
		if (this.provider_name) {
			this.params['providername'] = this.provider_name;

		}
		else {
			this.params['providername'] = 'all';
		}
		if (this.params.groupid == '') {
			this.params['groupname'] = 'all';
		}
		else {
			this.params['groupname'] = this.GroupName;
		}

		this.params['report'] = false;
		this.acoService.getacoscorecard(this.params).subscribe(results => {

			this.member_list = results.body;

		}, err => {
		});
	}
  //on reset button
	resetFilters() {
		this.params = {

			'groupid': '',
			'npi': '',
			'aco': '',
			month: '',
			year: '',
			startdate: '',
			enddate: ''

		}
		this.provider_name = '';
		this.getACOGroups(null);
		this.member_list = [];
	}



	getInsurance(member) {

		this.showPanel = false;
		this.provider_name = member.LastName + ' ' + member.FirstName;
		this.params.npi = member.uniqeproviderno;
		// this.provider_id=member.providerid;
		this.getACOGroups(member.uniqeproviderno);

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

			this.showPanel = false;
		}

	}


	getAllHealthplans() {
		this.commonService.getAllHealthplans().subscribe(results => {

			this.insurance_list = results;
		}, err => {

		});
	}

	storeACODetails(mid, mname, type) {
		console.log(mid, mname, type);
		if (!this.provider_name) {
			this.params['npi'] = null;
		}
		let temp = {
			mid, mname, type
		}
		let ACO_Gap_Details = { ...this.params, ...temp, 'provider_name': this.provider_name }
		localStorage.setItem('ACO_Gap_Details', JSON.stringify(ACO_Gap_Details));



	}


	getACOGroups(id) {
		this.acoService.getACOGroups(id).subscribe(results => {

			this.ACO_groups = results;
		}, err => {

		});

	}

	// checking and formatting dates -->
	formatDate() {

		this.months.map((month) => {
			if (this.params.month == month.value) {
				if (this.params.month == '02' && Number(this.params.year) % 4 == 0) {
					// this.selectedMonth = month.full;
					this.days = '29';
				} else {
					// this.selectedMonth = month.full;
					this.days = month.days;
				}

			}
		});
		this.params.startdate = this.params.year + '-' + this.params.month + '-01';
		this.params.enddate = this.params.year + '-' + this.params.month + '-' + this.days;
	}
	//month logic
	checkMonth(selectedYear) {
		this.formatDate();
		if (selectedYear == this.authS.getDates().actual_year) {

			this.months.map((month) => {
				if (this.current_month == month.value) {
					this.months.splice(Number(month.value), 12)
				}
			})
		} else {
			this.months = [{ "full": "January", "value": "01", "days": "31" },
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
			]
		}
	}


}