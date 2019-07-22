import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {
  //  search_category: string = '';
  //  // global variables to identify user role entered/logged in
  //  rolename: string;
  //  roleid: any;

  //  provider_name: string;
  //  provider_id: number;
  //  ipa_list: any;
  //  insurance_list: any;



  // search_text: string;
  members: any;
  user_list: any
  //  showPanel: boolean = true;
  page: number = 1;
  pager: any = {};
  total_pages: number;
  showPagination: boolean = true;

  // search_category:string='';
  // healthplanName: string = 'All';

  params = {
    'pageNumber': 1,
    'pageSize': 15,
    // 'startdate': '',
    // 'enddate': '',
    // 'providerid': 0,
    // 'healthplanid': 0,
    // 'subsId': '',
    // 'membername': ''
    'report': false
  }

  // months = [{ "full": "January", "value": "01", "days": "31" },
  // { "full": "February", "value": "02", "days": "28" },
  // { "full": "March", "value": "03", "days": "31" },
  // { "full": "April", "value": "04", "days": "30" },
  // { "full": "May", "value": "05", "days": "31" },
  // { "full": "June", "value": "06", "days": "30" },
  // { "full": "July", "value": "07", "days": "31" },
  // { "full": "August", "value": "08", "days": "31" },
  // { "full": "September", "value": "09", "days": "30" },
  // { "full": "October", "value": "10", "days": "31" },
  // { "full": "November", "value": "11", "days": "30" },
  // { "full": "December", "value": "12", "days": "31" }
  // ]


  // years: string[] = [];
  // date: any;
  // days: any;
  // current_date = new Date();
  // current_month = this.authS.getDates().current_month;
  // previous_month = this.authS.getDates().previous_month;
  // current_year = this.authS.getDates().current_year;
  // selectedItem: any;
  // address_list: any;
  // @ViewChild('term') input: ElementRef;
  constructor(public authS: AuthService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService,
    private pagerService: PagerService,
    private userService: UserService) { }

  ngOnInit() {

    // for (let year = Number(this.current_year); year > 2016; year -= 1) {
    //   this.years.push(year.toString());
    // }

    // //check if provider is entering then get details a/c to that provider
    // this.rolename = this.authS.getUserRole();
    // this.roleid = this.authS.getUserId();
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
    this.getAllUsers(false);
  }


  // selectFacility(id, i) {
  //   let selectedItem = this.user_list[i].address.find((item) => item.facilityid == id);
  //   this.user_list[i].phoneno = selectedItem.phoneno;
  //   this.user_list[i].fax = selectedItem.fax;
  //   this.user_list[i].county = selectedItem.county;
  // }

  // // Format and check date and year
  // formatDate() {
  //   this.months.map((month) => {
  //     if (this.date.month == month.value) {
  //       // this.selectedMonth = month.full;
  //       if (month.value == '02' && this.date.year % 4 == 0) {
  //         this.days = '29';
  //       } else {
  //         // console.log(month.value)
  //         this.days = month.days;
  //       }

  //     }
  //   });
  //   this.params.startdate = this.date.year + '-' + this.date.month + '-01';
  //   this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;

  // }

  // resetFilters(){
  //   this.provider_name = '';
  //   if (this.rolename != 'provider') {
  //     this.params.providerid =  0;
  //   }

  //   this.params.healthplanid =  0;
  //   this.input.nativeElement.value = "";
  //   this.params['membername'] = '';
  //   this.params['subsId'] = '';
  //   this.getAllUsers(true);
  // }

  // checkMonth(selectedYear) {
  //   this.formatDate();
  //   if (selectedYear == this.authS.getDates().actual_year) {

  //     this.months.map((month) => {
  //       if (this.current_month == month.value) {
  //         this.months.splice(Number(month.value), 12)
  //       }
  //     })
  //   } else {
  //     this.months = [{ "full": "January", "value": "01", "days": "31" },
  //     { "full": "February", "value": "02", "days": "28" },
  //     { "full": "March", "value": "03", "days": "31" },
  //     { "full": "April", "value": "04", "days": "30" },
  //     { "full": "May", "value": "05", "days": "31" },
  //     { "full": "June", "value": "06", "days": "30" },
  //     { "full": "July", "value": "07", "days": "31" },
  //     { "full": "August", "value": "08", "days": "31" },
  //     { "full": "September", "value": "09", "days": "30" },
  //     { "full": "October", "value": "10", "days": "31" },
  //     { "full": "November", "value": "11", "days": "30" },
  //     { "full": "December", "value": "12", "days": "31" }
  //     ]
  //   }
  // }

  // search(term) {
  //   // this.checkCategory(term)
  //   this.params['providername'] = term;
  //   if (term.length > 2) {

  //     this.getAllUsers(true);

  //   } else if (term.length == 0) {

  //     this.getAllUsers(true);
  //   }
  // }

  //Excel report configurations
  getReport(type) {
    // this.provider.type=type;
    //   this.provider.report = true;
    // let reportDetails = {
    //   // 'providername': this.provider_name,
    //   // 'healthplanname': this.healthplanName,
    //   // //   'selectedmonth':this.selectedMonth,
    //   'type': type,
    //   'report': true
    // }
    // var obj = Object.assign(this.provider);
    // var reportParams = { ...this.params, ...reportDetails };
    // console.log(obj)/
    this.params.report = true;
    this.commonService.getUserActivity(this.params).subscribe(results => {

      if (type == 'pdf') {
        saveAs(results, `user-activity-report.pdf`)
      } else {
        saveAs(results, `user-activity-report.xlsx`)
      }

    }, err => {
    });
  }



  //Getting all members
  getAllUsers(resetPage) {
    if (resetPage) {
      this.params['pageNumber'] = 1;
      this.page = 1;
    }
    // this.page=1;
    this.params.report = false;
    this.commonService.getUserActivity(this.params).subscribe(results => {
      this.showPagination = true;

      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.user_list = results.body;
      this.setPages();
    }, err => {
    });
  }

  // Function to calculate age
  // calculateAge(birthday) {
  //   if (birthday) {
  //     let age = birthday.split('-')
  //     return this.current_year - age[0];
  //   }


  // }

  // searchMembers() {
  //   if (this.search_text.length > 2) {
  //     this.showPagination = false;
  //     this.page = 1;

  //     this.userService.search_provider(this.search_text).subscribe(
  //       res => {

  //         this.user_list = res;
  //       },
  //       err => {
  //         //
  //       }
  //     )
  //   } else if (this.search_text.length == 0) {
  //     this.getAllUsers(true)
  //   }


  // }
  //pager service
  loadByPage(page_number: number) {
    if (page_number < 1 || page_number > this.pager.total_pages) {
      return;
    }
    this.page = page_number;
    // console.log("Page"+this.page)
    // console.log("Page numbe"+page_number)
    this.params['pageNumber'] = this.page
    this.getAllUsers(false);
    // window.scrollTo(0, 200);
  }


  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }

  // searchProvider() {
  //   if (this.provider_name.length > 2) {
  //     this.showPanel = true;
  //     this.userService.search_provider(this.provider_name).subscribe(
  //       res => {
  //         this.members = res;
  //       },
  //       err => {
  //         //
  //       }
  //     )
  //   }
  //   if (this.provider_name.length == 0) {
  //     this.members = [];
  //     this.showPanel = false;
  //   }

  // }


  // getInsurance(member) {
  //   this.showPanel = false;
  //   this.provider_name = member.FirstName + ' ' + member.LastName;
  //   this.params.providerid = member.id;
  //   this.showPanel = false;
  //   // this.provider.uniqeproviderno = member.id;
  //   this.commonService.getInsurance(member.id
  //   ).subscribe(results => {

  //     this.insurance_list = results;
  //     this.params.healthplanid = 0;
  //   }, err => {

  //   });
  // }

  //   checkCategory(val) {
  //   // console.log(val)
  //   if (this.search_category == 'name') {

  //     this.params['membername'] = val;
  //     this.params['subsId'] = ''
  //   } else if (this.search_category == 'id') {

  //     this.params['membername'] = '';
  //     this.params['subsId'] = val;
  //   }

  // }
  // search(term) {
  //   this.checkCategory(term)

  //   if (term.length > 2) {
  //     this.page = 1;
  //     this.getAllUsers(true);

  //   } else if (term.length == 0) {
  //     this.page = 1;
  //     // this.params.membername = '';
  //     this.getAllUsers(true);
  //   }
  // }
}