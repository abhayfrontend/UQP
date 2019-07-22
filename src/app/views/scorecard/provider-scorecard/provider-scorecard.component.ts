import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from '../../../services/auth.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-provider-scorecard',
  templateUrl: './provider-scorecard.component.html',
  styleUrls: ['./provider-scorecard.component.scss']
})
export class ProviderScorecardComponent implements OnInit {
  rolename: string;
  roleid: any;
  // modals reference
  @ViewChild('denModal') public denModal: ModalDirective;
  @ViewChild('numModal') public numModal: ModalDirective;
  provider_name: string;
  members: any;
  showPanel: boolean = true;
  insurance_list: any;
  searching: boolean = false;
  checkvalidity: boolean = false;
  provider = {
    healthplanid: '',
    providerid: '',
    month: '',
    year: '',
    startdate: '',
    enddate: ''
  }
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
  constructor(public authS: AuthService, private userService: UserService, private commonService: CommonService, private router: Router) {
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

    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }
    //check if provider is entering then get details a/c to that provider
    this.rolename = this.authS.getUserRole();
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
    let hpScorecard = JSON.parse(localStorage.getItem('hpScorecard'));
    if (hpScorecard) {
      this.showDates = true;

      this.provider.healthplanid = hpScorecard.id;
      this.provider.year = hpScorecard.year;
      this.provider.month = hpScorecard.month;
      this.provider.startdate = hpScorecard.startdate;
      this.provider.enddate = hpScorecard.enddate;


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


      // setting these names for next gap screen 
      // from scorecard in case of dashboard clickables
      this.healthplanName = hpScorecard.healthplanName;
      localStorage.setItem('selectedMonth', this.selectedMonth);
      localStorage.setItem('healthplanName', this.healthplanName);
      // localStorage.removeItem('provider_name');
      localStorage.removeItem('ipaName');


      if (hpScorecard.type == 'overall') {
        this.showDates = true;
        this.provider.providerid = hpScorecard.providerid;
        this.provider_name = hpScorecard.name;
        this.checkvalidity = true;

        this.selectedMonth = hpScorecard.month;

        this.provider.year = hpScorecard.year;
        this.provider.month = hpScorecard.month;
        this.overallprovidertype = hpScorecard.type;


        this.healthplanName = hpScorecard.healthplanName;
        localStorage.setItem('selectedMonth', this.selectedMonth);
        localStorage.setItem('healthplanName', this.healthplanName);

        localStorage.removeItem('ipaName');



      }

      this.getScorecard();
      this.checkMonth(this.provider.year)
    }

    //case when provider search is done on dashboard
    if (this.currentUser.root_exec) {
      this.provider_name = this.currentUser.officestaff_providername
    }




    // this.provider.month = this.previous_month;
    // this.provider.year = this.current_year.toString();
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
  showDenModal(id) {
    this.modalMeasureId = id;
    this.denModal.show()
  }
  showNumModal(id) {
    this.modalMeasureId = id;
    this.numModal.show()
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
  // function to round decimal places to send report
  roundInput(num) {
    return Math.round(num * 100) / 100
  }
  // Excel reports functionality
  getReport(type) {
    // this.provider.type=type;
    //   this.provider.report = true;

    let reportDetails = {
      'providername': this.provider_name,
      'healthplanname': this.healthplanName,
      'selectedmonth': this.selectedMonth,
      'totalweightc': this.total_Weight_C,
      'totalscorec': this.roundInput(this.total_Score_C),
      'partcoverall': this.roundInput(this.part_C_Overall),
      'combinedoverall': this.roundInput(this.combined_Overall),
      'totalweightd': this.total_Weight_D,
      'totalscored': this.roundInput(this.total_Score_D),
      'partdoverall': this.roundInput(this.part_D_Overall),
      'type': type,
      'report': true
    }
    // var obj = Object.assign(this.provider);
    var reportParams = { ...this.provider, ...reportDetails };
    // console.log(obj)/
    this.commonService.getScorecardReport(reportParams, 'providerscorecard'
    ).subscribe(results => {

      if (type == 'pdf') {
        saveAs(results, `provider-scorecard.pdf`)
      } else {
        saveAs(results, `provider-scorecard.xlsx`)
      }

    }, err => {
    });
  }

  // Scorecard calculations
  getScorecard() {
    // this.scorecard = this.scorecards;
    // this.provider.type='';
    // this.provider.report = false;
    this.total_Weight_C = 0;
    this.total_Score_C = 0;
    this.part_C_Overall = 0;
    this.total_Weight_D = 0;
    this.total_Score_D = 0;
    this.part_D_Overall = 0;
    this.combined_Overall = 0;
    this.commonService.getScorecard(this.provider
    ).subscribe(results => {
      this.scorecard = results;
      this.gapMeasures = results.measurecalculationsc.concat(results.measurecalculationsd)
      this.gapMeasuresc = results.measurecalculationsc;
      this.gapMeasuresd = results.measurecalculationsd;

      this.gapMeasuresc.map((measure) => {
        this.total_Weight_C += measure.weight;
        this.total_Score_C += (measure.starscore * measure.weight);
        this.part_C_Overall = this.total_Score_C / this.total_Weight_C;
        // this.combined_Overall=this.part_C_Overall;

      })

      this.gapMeasuresd.map((measure) => {
        this.total_Weight_D += measure.weight;
        this.total_Score_D += (measure.starscore * measure.weight);
        this.part_D_Overall = this.total_Score_D / this.total_Weight_D;


      })
      // this.combined_Overall = (this.part_C_Overall + this.part_D_Overall)/2;
      this.combined_Overall = (this.total_Score_C + this.total_Score_D) / (this.total_Weight_C + this.total_Weight_D);
    }, err => {
    });
  }

  // Storing gap essential details
  storeGapDetails(measureid, measurename) {

    localStorage.setItem('providerScorecard', JSON.stringify(this.provider));
    localStorage.setItem('measureid', measureid);
    localStorage.setItem('measurename', measurename);
    localStorage.setItem('provider_name', this.provider_name);
    localStorage.setItem('gapMeasures', JSON.stringify(this.gapMeasures));
    localStorage.setItem('selectedMonth', this.selectedMonth);
    localStorage.setItem('healthplanName', this.healthplanName);
    // localStorage.setItem('gaps', gaps);
    localStorage.removeItem('ipaName');
    // this.router.navigate(['/gaps']);
  }

  // Setting healthplan for gap screens
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



