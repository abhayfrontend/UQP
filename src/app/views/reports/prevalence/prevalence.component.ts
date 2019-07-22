import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from '../../../services/auth.service';
import { MraService } from '../../../services/mra.service';
import { PagerService } from '../../../services/pager.service';
@Component({
  selector: 'app-prevalence',
  templateUrl: './prevalence.component.html',
  styleUrls: ['./prevalence.component.scss']
})
export class PrevalenceComponent implements OnInit {

  rolename: string;
  roleid: any;
  // modals reference

  provider_name: string;
  members: any;
  showPanel: boolean = true;
  insurance_list: any;
  params: any;
  searching: boolean = false;
  checkvalidity: boolean = false;
  member_list: any;
  provider = {
    healthplanid: '',
    providerid: '',
    month: '',
    year: '',
    startdate: '',
    enddate: '',
    pageNumber: 1,
    pageSize: 15
  }
  page: number = 1;
  pager: any = {};
  total_pages: number;
  showPagination: boolean = true;
  gapMeasures: any;
  gapMeasuresc: any;
  gapMeasuresd: any;
  Math: any;
  scorecard: any;
  selectedMonth: string;
  healthplanName: string;
  modalMeasureId: number;
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
  current_date = new Date();
  overallprovidertype: any;

  // current_month = this.authS.getDates().current_month;
  // current_year = this.authS.getDates().current_year;
  //temporary january implementation
  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month;
  previous_month_full = this.authS.getDates().previous_month_full;
  current_year = this.authS.getDates().current_year;


  showDates: boolean = false;
  total_Weight_C: number = 0;
  total_Score_C: number = 0;
  part_C_Overall: number = 0;
  total_Weight_D: number = 0;
  total_Score_D: number = 0;
  part_D_Overall: number = 0;
  combined_Overall: number = 0;
  days: any;
  currentUser: any;
  constructor(public authS: AuthService, private pagerService: PagerService, private userService: UserService, private commonService: CommonService, private router: Router, private mraservice: MraService) {
    this.Math = Math;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }


  // ngOnDestroy
  ngOnDestroy() {
    if (this.rolename == 'provider') {
      localStorage.removeItem('hpScorecard');
    }
    else if (this.overallprovidertype == 'overall') {
      localStorage.removeItem('hpScorecard');
      this.overallprovidertype = '';
    }
  }


  ngOnInit() {
    //year logic
    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }
    //check if provider is entering then get details a/c to that provider
    this.rolename = this.authS.getUserRole();
    //checkuing role
    this.roleid = this.authS.getUserId();
    if (this.rolename == 'healthplan') {
      this.showDates = true;
      this.provider.healthplanid = this.roleid;
    }
    if (this.rolename == 'provider') {
      this.provider.providerid = this.roleid;
      this.provider_name = this.authS.getUserDetails().name;
      this.commonService.getInsurance(this.roleid
      ).subscribe(results => {

        this.insurance_list = results;
        if (this.insurance_list.length > 0) {
          this.checkvalidity = true;
        } else {
          this.checkvalidity = false;
        }
        this.searching = false;
      }, err => {
        this.searching = false;
      });
    }
    if (this.currentUser.rolename == 'Office Staff') {
      this.provider_name = this.currentUser.officestaff_providername;
    }


    this.checkMonth(this.provider.year)
  }



  // searching provider
  searchProvider() {
    if (this.provider_name.length > 2) {
      this.showPanel = true;
      this.searching = true;
      this.userService.search_provider(this.provider_name).subscribe(
        res => {
          this.members = res;
          this.searching = false;
        },
        err => {
          this.searching = false;
        }
      )
    }
    if (this.provider_name.length == 0) {
      this.members = [];
      this.showPanel = false;
    }

  }

  // format date according to input year and month
  formatDate() {
    this.months.map((month) => {
      if (this.provider.month == month.value) {
        if (this.provider.month == '02' && Number(this.provider.year) % 4 == 0) {
          this.selectedMonth = month.full;
          this.days = '29';
        } else {
          this.selectedMonth = month.full;
          this.days = month.days;
        }

      }
    });
    this.provider.startdate = this.provider.year + '-' + this.provider.month + '-01';
    this.provider.enddate = this.provider.year + '-' + this.provider.month + '-' + this.days;
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

  //hide provider list panel on focus out
  hidePanel() {
    setTimeout(() => { this.showPanel = false }, 200)
  }
  // getting insurance of particular provider
  getInsurance(member) {
    this.showPanel = false;
    this.searching = true;
    this.provider_name = member.LastName + " " + member.FirstName;
    this.provider.providerid = member.id;
    this.commonService.getInsurance(member.id
    ).subscribe(results => {

      this.insurance_list = results;
      if (this.insurance_list.length > 0) {
        this.checkvalidity = true;
      } else {
        this.checkvalidity = false;
      }
      this.searching = false;
    }, err => {
      this.searching = false;
    });
  }


  //prevalence data
  getPrevalence(resetPage) {

    if (resetPage) {
      this.provider['pageNumber'] = 1;
      this.page = 1;
    }
    this.provider['report'] = false;


    this.mraservice.getMraPrevalence(this.provider).subscribe(results => {
      this.showPagination = true;

      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.member_list = results.body;
      this.setPages();
    }, err => {
    });
  }
  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }
  //pagination
  loadByPage(page_number: number) {
    if (page_number < 1 || page_number > this.pager.total_pages) {
      return;
    }
    page_number = Number(page_number);
    this.page = page_number;
    this.provider['pageNumber'] = this.page
    this.getPrevalence(false);
    // window.scrollTo(0, 200);
  }
  storeHccDetails(percent) {

    this.provider['hccnotfound'] = percent;
    this.provider['provider_name'] = this.provider_name;
    localStorage.setItem('prevalence', JSON.stringify(this.provider))
    console.log(this.params)
  }
  setHealthplan() {
    this.insurance_list.map((insurance) => {
      if (this.provider.healthplanid == insurance.healthplan_id) {
        this.healthplanName = insurance.health_Name;
      } else if (this.provider.healthplanid == "0") {
        this.healthplanName = "ALL"
      }
    })

  }
}




