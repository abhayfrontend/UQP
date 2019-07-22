import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CommonService } from "../../../services/common.service";
import { PagerService } from "../../../services/pager.service";

import { AuthService } from "../../../services/auth.service";
import { saveAs } from "file-saver";

import { Router, ActivatedRoute } from "@angular/router";
import * as moment from "moment";
@Component({
  selector: "app-surveyer-list",
  templateUrl: "./surveyer-list.component.html",
  styleUrls: ["./surveyer-list.component.scss"]
})
export class SurveyerListComponent implements OnInit {
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;
  currentUser: any;

  userRolePerm: any;
  surveyer_list: any;
  insurance_list: any;
  page: number = 1;
  pager: any = {};
  total_pages: number;
  showPagination: boolean = true;

  month: any;
  year: any;

  params = {
    pageNumber: 1,
    pageSize: 15,
    name: null,
    type: "cahps",
    reporttype: "",
    quarter: 1
  };
  current_year = this.authS.getDates().current_year;
  constructor(
    public authS: AuthService,
    private commonService: CommonService,
    private pagerService: PagerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getMonthDateRange(2019, 1);
    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.getSurveyerProductivity(true)
  }
  //month range functionality

  getMonthDateRange(year, month) {
    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    month = Number(month);
    var startDate = moment([year, month - 1]);

    // Clone the value before .endOf()
    var endDate = moment([year, month - 1 + 2]).endOf("month");

    this.params["startdate"] = startDate.startOf("day");
    this.params["enddate"] = endDate.startOf("day");
  }
  // get survey data
  getSurveyerProductivity(resetPage) {
    // console.log(this.bsRangeValue);


    // console.log(this.params)
    // this.page=1;
    if (resetPage) {
      this.params["pageNumber"] = 1;
      this.page = 1;
    }
    // this.params.reporttype = "";

    this.commonService
      .getSurveyerProductivity(this.params)
      .subscribe(
        results => {
          this.showPagination = true;
          //  console.log(results.headers.get('Content-Type'))
          // console.log(JSON.parse(results.headers.get('Paging-Headers')).totalCount)

          this.total_pages = JSON.parse(
            results.headers.get("Paging-Headers")
          ).totalCount;
          this.surveyer_list = results.body;

          this.setPages();
          // localStorage.removeItem('dashboard_date')
        },
        err => { }
      );
  }

  // Searching provider
  // searchAssurance() {
  //   this.params.reporttype = "";
  //   this.params.report = false;
  //   if (this.params.name.length > 2) {
  //     // this.showPanel = true;

  //     this.page = 1;
  //     this.params["pageNumber"] = 1;
  //     this.params["pageSize"] = 15;
  //     this.commonService.getAssuranceProductivity(this.params, "MRA").subscribe(
  //       res => {
  //         this.getAllAssurance(true);
  //       },
  //       err => {
  //         //
  //       }
  //     );
  //   } else if (this.params.name.length == 0) {
  //     this.getAllAssurance(true);
  //   }
  // }

  // getAllHealthplans() {
  //   this.commonService.getAllHealthplans().subscribe(results => {

  //     this.insurance_list = results;
  //   }, err => {

  //   });
  // }
  //excel function
  getReport(type) {
    this.params.reporttype = type;
    this.params['report'] = true;

    this.commonService.getSurveyerProductivity(this.params).subscribe(
      results => {
        if (type == "pdf") {
          saveAs(results, `surveyor-productivity-report.pdf`);
        } else {
          saveAs(results, `surveyor-productivity-report.xlsx`);
        }
      },
      err => { }
    );
  }
  //pager function 
  loadByPage(page_number: number) {
    if (page_number < 1 || page_number > this.pager.total_pages) {
      return;
    }
    this.page = page_number;
    this.params["pageNumber"] = this.page;
    this.getSurveyerProductivity(false);
  }

  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }
}
