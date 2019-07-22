import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { MraService } from '../../../services/mra.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { saveAs } from 'file-saver';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-mra-healthplan-scorecard',
  templateUrl: './mra-healthplan-scorecard.component.html',
  styleUrls: ['./mra-healthplan-scorecard.component.scss']
})
export class MraHealthplanScorecardComponent implements OnInit {
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;

  modalMeasureId: number;
  members: any;
  showPanel: boolean = true;

  provider = {
    healthplanid: 0,
    providerid: 0,
    year: '',
    type: ''
  }
  Math: any;
  scorecard: any;
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


  years: string[] = [];
  current_date = new Date();
  // current_month = this.authS.getDates().current_month;
  // previous_month = this.authS.getDates().previous_month;
  // previous_month_full = this.authS.getDates().previous_month_full;
  current_year = this.authS.getDates().current_year;
  // showDates: boolean = false;

  healthplanName: string;
  days: any;
  date: any;

  constructor(public authS: AuthService, private userService: UserService, private commonService: CommonService, private mraService: MraService) {
    this.Math = Math;
  }
  // ngOnInit starts --->
  ngOnInit() {


    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();


    // setting years array
    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }
    let MrahpScorecard = JSON.parse(localStorage.getItem('MrahpScorecard'));

    // if user is coming from dashboard
    if (MrahpScorecard) {


      this.provider.healthplanid = MrahpScorecard.id;
      this.provider.year = MrahpScorecard.year;
      this.healthplanName = MrahpScorecard.healthplanName;
      if (MrahpScorecard.providerid) {
        this.provider.providerid = MrahpScorecard.providerid;
      } else {
        this.provider.providerid = 0;
      }

      localStorage.setItem('healthplanName', this.healthplanName);
      // localStorage.removeItem('provider_name');
      localStorage.removeItem('ipaName');
      if (MrahpScorecard.type == 'overallproviderscorecard') {
        this.rolename = 'provider';
        this.roleid = MrahpScorecard.providerid;
        this.provider.year = MrahpScorecard.year;
        this.provider.providerid = MrahpScorecard.providerid;
        this.provider.type = '';
      } else {
        localStorage.removeItem('provider_name')
        // this.getMraScorecard();
      }
    } else {

      this.provider.healthplanid = 2;
      this.healthplanName = "FREEDOM HEALTH PLAN"
      // this.provider.month = this.previous_month;
      this.provider.year = this.current_year.toString();

    }
    //check if provider is entering then get details a/c to that provider
    if (this.rolename == 'provider') {
      this.provider.providerid = this.roleid;
    } else if (this.rolename == 'healthplan') {
      this.provider.healthplanid = this.roleid;
    }


    this.getMraScorecard();
  }
  // ngOnInit ends --->

  // ngOnDestroy
  ngOnDestroy() {

    localStorage.removeItem('MrahpScorecard');

  }



  // report excel and pdf
  getReport(type) {
    let reportDetails = {
      // 'providername':this.provider_name,
      // 'healthplanname': this.healthplanName,
      // 'selectedmonth': this.selectedMonth,
      // 'totalweightc': this.total_Weight_C,
      //       'totalscorec': this.roundInput(this.total_Score_C),
      // 'partcoverall': this.roundInput(this.part_C_Overall),
      // 'combinedoverall': this.roundInput(this.combined_Overall),
      // 'totalweightd': this.total_Weight_D,
      // 'totalscored': this.roundInput(this.total_Score_D),
      // 'partdoverall': this.roundInput(this.part_D_Overall),

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

  // Getting scorecard and further calculations





  getMraScorecard() {

    this.mraService.getMraHealthplanScorecard(this.provider
    ).subscribe(results => {
      this.scorecard = results;
      console.log(results);
    }, err => {

    });
  }


  // storing parameters for gap screen
  storeMraHpScorecard(type) {
    this.provider['type'] = type;

    localStorage.setItem('MraHpScorecard', JSON.stringify(this.provider));
    // localStorage.setItem('measureid', measureid);
    // if (this.provider_name) {
    //   localStorage.setItem('provider_name', this.provider_name);
    // } else {
    //   localStorage.removeItem('provider_name')
    // } 
    // localStorage.removeItem('provider_name');
    // localStorage.removeItem('ipaName');
    // localStorage.setItem('gapMeasures', JSON.stringify(this.gapMeasures));
    // localStorage.setItem('selectedMonth', this.selectedMonth);
    // localStorage.setItem('healthplanName', this.healthplanName);
  }

  storeMraHpGaps(type) {
    this.provider['type'] = type;
    localStorage.setItem('MraHpGaps', JSON.stringify(this.provider));
  }




}

