import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';

import { saveAs } from 'file-saver';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from "moment";
@Component({
  selector: 'app-survey-scorecard',
  templateUrl: './survey-scorecard.component.html',
  styleUrls: ['./survey-scorecard.component.scss']
})
export class SurveyScorecardComponent implements OnInit {


  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;
  currentUser: any;

  modalMeasureId: number;
  members: any;
  showPanel: boolean = true;

  provider = {

    healthplanid: '',
    providername: '',
    providerid: '',
    ipaid: ''
  }

  Math: any;
  showeverything: boolean = false;
  scorecard: any;

  insurance_list: any;
  current_year = this.authS.getDates().current_year;

  healthplanname: any;
  provider_name: any;
  ipa_list: any;
  searching: boolean = false;
  checkvalidity: boolean = false;
  scorecard_type: string;
  currentRole: any;
  constructor(public authS: AuthService, private userService: UserService,
    private commonService: CommonService, private route: ActivatedRoute) {

    this.scorecard_type = route.snapshot.data['title'];

    this.Math = Math;

  }
  // ngOnInit starts --->
  ngOnInit() {


    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getAllIPA();
    this.getAllHealthplans();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));


    this.currentRole = this.authS.getCurrentRole(this.currentUser.roleid);
  }
  // ngOnInit ends --->

  // ngOnDestroy
  ngOnDestroy() {

  }

  getAllHealthplans() {
    this.commonService.getAllHealthplans().subscribe(results => {

      this.insurance_list = results;
    }, err => {

    });
  }
  //hide provider list panel on focus out
  hidePanel() {
    setTimeout(() => { this.showPanel = false }, 200)
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
  //on reset button
  resetFilters() {
    this.provider = {

      healthplanid: '',
      providername: '',
      providerid: '',
      ipaid: ''
    };
    this.provider_name = '';
    this.showeverything = false;
  }

  getAllIPA() {
    this.commonService.getAllIPA().subscribe(results => {

      this.ipa_list = results;
    }, err => {

    });
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

  // <-- checking and formatting dates
  roundInput(num) {
    return Math.round(num * 100) / 100
  }
  // report excel and pdf
  getReport(type) {
    let reportDetails = {
      // 'providername':this.provider_name,


      'type': type,
      'report': true
    }
    // var obj = Object.assign(this.provider);
    var reportParams = { ...this.provider, ...reportDetails };
    // console.log(obj)/
    this.commonService.getScorecardReport(reportParams, 'HealthplanScorecard'
    ).subscribe(results => {

      if (type == 'pdf') {
        saveAs(results, `healthplan-scorecard.pdf`)
      } else {
        saveAs(results, `healthplan-scorecard.xlsx`)
      }

    }, err => {
    });
  }
  //month range
  getMonthDateRange(year, month) {
    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    month = Number(month);
    if (month < 4) {
      month = 1;
    } else if (month < 7) {
      month = 4;
    } else if (month < 10) {
      month = 7;
    } else if (month <= 12) {
      month = 10;
    }
    var startDate = moment([year, month - 1]);

    // Clone the value before .endOf()
    var endDate = moment([year, month - 1 + 2]).endOf("month");

    this.provider["startdate"] = startDate.startOf("day");
    this.provider["enddate"] = endDate.startOf("day");
  }
  // Getting scorecard and further calculations
  getScorecard() {

    if (this.scorecard_type == 'HOSP') {
      var date = new Date();
      var month = date.getMonth();
      var year = date.getFullYear();
      this.getMonthDateRange(year, month + 1);
    }
    this.commonService.getSurveyScorecard(this.provider, this.scorecard_type
    ).subscribe(results => {
      this.showeverything = true;
      this.scorecard = results;

    }, err => {

    });
  }


}

