import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';
import { PagerService } from '../../services/pager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;

	search_text: string;
  provider_name: string;
  provider_id: number;

  members: any;
  member_list: any
  showPanel: boolean = true;
  page: number = 1;
	pager: any = {};
	total_pages: number;
	showPagination: boolean = true;
  insurance_list: any;
  
  provider = {
    healthplan_id: '',
    uniqeproviderno: ''
  }
  search_category: string = '';
  subplans: boolean = false;
  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'providerid': '',
    'IPA_ID': '',
    'healthplan_id': '',
    'gender': '',
    'agemin': '',
    'agemax': '',
    'startdate': '',
    'enddate': '',
    'subsId': '',
    'membername': '',
    'planid': '',
    'report':false,
    'type':''
  }
  ipa_list: any;
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


  years: string[] = [];
  date: any = {};
  days: any;
  current_date = new Date();

  current_month = this.authS.getDates().last_month;

  previous_month = this.authS.getDates().previous_month;
  current_year = this.authS.getDates().current_year;
  // showDates: boolean = false; 
  plan: any;
  @ViewChild('term') input: ElementRef;
  constructor(public authS: AuthService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService,
    private pagerService: PagerService,
    private userService: UserService) { }

  ngOnInit() {
    
    this.date.month = this.current_month;
    this.date.year = this.current_year;
   
    this.checkMonth(this.current_year)
    let date = JSON.parse(localStorage.getItem('dashboard_date'));
    if (date) {
      this.params.startdate = date.startdate;
      this.params.enddate = date.enddate;
    }

    //check if provider is entering then get details a/c to that provider
    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    if (this.rolename == 'provider') {
      this.params.providerid = this.roleid;
      this.commonService.getInsurance(this.roleid
      ).subscribe(results => {

        this.insurance_list = results;
      }, err => {
      });
    }
    //  this.route.queryParams.subscribe(params => {
    //    console.log(params)
    // this.subplans = params['subplan']; 
    // });
    // return localStorage.getItem(pre) == 'true' ? true : false;
    this.plan = localStorage.getItem('plan');
    // this.plan = localStorage.getItem('subplanhpid');
    this.subplans = localStorage.getItem('subplan') == 'true' ? true : false;
    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }
    // this.getAllIPA();
    if (this.subplans) {
      this.date = {
        // 'month':this.current_month,
        'month':  this.current_month,
        'year': this.current_year
      }
      this.formatDate();
      this.params['planid'] = this.plan;
      this.params['healthplan_id'] = localStorage.getItem('subplanhpid');
    }
    if (this.rolename == 'provider') {
      this.params.providerid = this.roleid;
      this.commonService.getInsurance(this.roleid
      ).subscribe(results => {

        this.insurance_list = results;
      }, err => {
      });
    }else if(this.rolename == 'healthplan'){
      this.params.healthplan_id = this.roleid;
    }else if(this.rolename == 'ipa'){
      // this.params.IPA_ID = this.roleid;
    }
  console.log(this.date.month)
    this.getAllMembers(false);
  }

  ngOnDestroy() {
    localStorage.removeItem('dashboard_date');
    localStorage.removeItem('planid');
    localStorage.removeItem('subplanhpid');
  }


  formatDate() {
    this.months.map((month) => {
      if (this.date.month == month.value) {
        // this.selectedMonth = month.full;
        console.log(month.value)
        this.days = month.days;
      }
    });
    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;


    // new Date("2015-03-25");
  }
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
    else if(this.search_category == 'dob')
    {
      this.params['membername'] = '';
      this.params['subsId'] = '';
      this.params['dob']=val;
    }

  }
  search(term) {
    this.checkCategory(term)

    if (term.length > 2) {
      this.page = 1;
      this.getAllMembers(true);

    } else if (term.length == 0) {
      this.page = 1;
      // this.params.membername = '';
      this.getAllMembers(true);
    }
  }
  resetFilters() {
    this.page = 1;
    this.params = {
      'pageNumber': 1,
      'pageSize': 15,
      'providerid': '',
      'IPA_ID': '',
      'healthplan_id': '',
      'gender': '',
      'agemin': '',
      'agemax': '',
      'startdate': '',
      'enddate': '',
      'subsId': '',
      'membername': '',
      'planid': '',
      'report':false,
      'type':''


    }
    // this.date = {
    //   'month': '',
    //   'year': ''
    // }
    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;
    this.getAllMembers(true);
    this.input.nativeElement.value = ''
    this.provider_name = ''
  }
  getInsurance(member) {
    this.showPanel = false;
    this.provider_name = member.FirstName + ' ' + member.LastName;
    this.params.providerid = member.id;
    this.showPanel = false;
    this.provider.uniqeproviderno = member.id;
    this.commonService.getInsurance(member.id
    ).subscribe(results => {

      this.insurance_list = results;

    }, err => {

    });
  }
  getAllIPA() {
    this.commonService.getAllIPA().subscribe(results => {

      this.ipa_list = results;
    }, err => {

    });
  }

  checkMax(ageMax, valid) {
    console.log(ageMax);
    if (ageMax < this.params.agemin) {
      this.params.agemax = '';
    }
  }
  calculateAge(birthday) {
    // console.log(birthday)
    let age = birthday.split('-')
    return this.current_year - age[0];

  }
  search_value(term)
  {
    
    if(term.length==0)
      {
         
          
            this.params['membername']='';
          this.params['dob']='';
          
             this.params['subsId']='';
                
      }
      else{
         console.log('termis')
          }
    }
  getAllMembers(resetPage) {
    // localStorage.removeItem('subplan');
    if (resetPage) {
      this.params['pageNumber'] = 1;
      this.page = 1;
    }
    this.params.type = '';
    this.params.report = false;
    this.commonService.getAllMembers(this.params).subscribe(results => {
      this.showPagination = true;
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.member_list = results.body
      this.setPages();
      // localStorage.removeItem('dashboard_date')
    }, err => {

    });
  }

    getReport(type) {

    this.params.type = type;
    this.params.report = true;
 
    this.commonService.getAllMembers(this.params
    ).subscribe(results => {

      if (type == 'pdf') {
        saveAs(results, `member-list.pdf`)
      } else {
        saveAs(results, `member-list.xlsx`)
      }

    }, err => {
    });
  }


  searchMembers() {
    if (this.search_text.length > 2) {
      // this.showPanel = true;
      this.showPagination = false;
      this.page = 1;
      //     this.params  = {
      // 	'pageNumber': 1,
      // 	'pageSize': 15 
      // }
      this.userService.search_provider(this.search_text).subscribe(
        res => {

          this.member_list = res;
        },
        err => {
          //
        }
      )
    } else if (this.search_text.length == 0) {
      this.getAllMembers(true)
    }


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
}
