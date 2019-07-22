
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-single-measure',
  templateUrl: './single-measure.component.html'
  // styleUrls: ['./single-measure.component.scss']
})
export class SingleMeasureComponent implements OnInit {
  search_text: string;


  members: any;
  member_list: any
  showPanel: boolean = true;
  page: number = 1;
  pager: any = {};
  total_pages: number;
  showPagination: boolean = true;

  // search_category:string='';

  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'providername': '',
    'startdate': '',
    'enddate': '',
    'measureid': '1'
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
  ]


  years: string[] = [];
  date: any;
  days: any;
  measures: any;
  current_date = new Date();
  // current_month = this.authS.getDates().current_month;
  // previous_month = this.authS.getDates().previous_month;
  current_year = this.current_date.getFullYear();
  @ViewChild('term') input: ElementRef;
  constructor(private router: Router,
    private route: ActivatedRoute, private commonService: CommonService,
    private pagerService: PagerService,
    private userService: UserService) { }

  ngOnInit() {
    this.getMeasures()
    for (let year = Number(this.current_year); year > 2014; year -= 1) {
      this.years.push(year.toString());
    }
    this.date = {
      // 'month':this.current_month,
      // 'month':this.previous_month,
      'year': this.current_year
    }
    this.formatDate();

    this.getAllMembers(false);
  }

  formatDate() {
    this.months.map((month) => {
      if (this.date.month == month.value) {
        // this.selectedMonth = month.full;
        if (month.value == '02' && this.date.year % 4 == 0) {
          this.days = '29';
        } else {
          // console.log(month.value)
          this.days = month.days;
        }

      }
    });
    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;


    // new Date("2015-03-25");
  }

  getMeasures() {
    this.commonService.getMeasures().subscribe(results => {

      this.measures = results;
    }, err => {

    });
  }
  checkMonth(selectedYear) {
    this.formatDate();
    if (selectedYear == this.current_year) {

      this.months.map((month) => {
        //     if(this.current_month == month.value){
        // this.months.splice(Number(month.value),12)
        //     }
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

  search(term) {
    // this.checkCategory(term)
    this.params['providername'] = term;
    if (term.length > 2) {

      this.getAllMembers(true);

    } else if (term.length == 0) {

      this.getAllMembers(true);
    }
  }

  getAllMembers(resetPage) {

    if (resetPage) {
      this.params['pageNumber'] = 1
    }

    this.commonService.getSingleMeasureGaps(this.params).subscribe(results => {
      this.showPagination = true;

      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.member_list = results.body

      this.setPages();
    }, err => {

    });
  }

  calculateAge(birthday) {
    if (birthday) {
      let age = birthday.split('-')
      return this.current_year - age[0];
    }


  }

  selectFacility(id, i) {
    let selectedItem = this.member_list[i].address.find((item) => item.facilityid == id);
    this.member_list[i].phoneno = selectedItem.phoneno;
    this.member_list[i].fax = selectedItem.fax;
    this.member_list[i].county = selectedItem.county;
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
      this.getAllMembers(true)
    }


  }
//paging logic
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
}
