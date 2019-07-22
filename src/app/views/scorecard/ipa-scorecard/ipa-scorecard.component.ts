import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from '../../../services/auth.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ipa-scorecard',
  templateUrl: './ipa-scorecard.component.html',
  styleUrls: ['./ipa-scorecard.component.scss']
})
export class IpaScorecardComponent implements OnInit {
  rolename: string;
  roleid: any;
  // modals reference
  @ViewChild('denModal') public denModal: ModalDirective;
  @ViewChild('numModal') public numModal: ModalDirective;
  members: any;
  showPanel: boolean = true;
  provider = {
    providerid: 0,
    healthplanid: '',
    month: '',
    year: '',
    startdate: '',
    enddate: '',
    ipaid: '',
  }
  Math: any;
  scorecard: any;

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
  days: any;
  current_date = new Date();


  // current_month = this.authS.getDates().current_month;
  // current_year = this.authS.getDates().current_year;

  //temporary january implementation
  current_month = this.authS.getDates().current_month;
  previous_month = '01';
  current_year = this.authS.getDates().current_year;


  showDates: boolean = false;
  gapMeasures: any;
  gapMeasuresc: any;
  gapMeasuresd: any;
  selectedMonth: any;
  healthplanName: string;
  ipaName: string;
  total_Weight_C: number = 0;
  total_Score_C: number = 0;
  part_C_Overall: number = 0;
  total_Weight_D: number = 0;
  total_Score_D: number = 0;
  part_D_Overall: number = 0;
  combined_Overall: number = 0;
  ipa_list: any;
  insurance_list: any;
  modalMeasureId: number;
  constructor(public authS: AuthService, private userService: UserService, private commonService: CommonService) {
    this.Math = Math;
  }
  // ngOnInit starts --->
  ngOnInit() {
    // setting years array
    for (let year
      = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }
    this.getAllIPA();
    // check current user logged in, if its IPA then get its healthplans 
    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();

    if (this.rolename == 'healthplan') {
      this.showDates = true;
      this.provider.healthplanid = this.roleid;
    }

    if (this.rolename == 'ipa') {
      this.provider.ipaid = this.roleid;
      this.commonService.getInsuranceByIpa(this.roleid
      ).subscribe(results => {
        this.insurance_list = results;
      }, err => {

      });

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

        this.getScorecard();
        this.checkMonth(this.provider.year)
      }



    } // <-- if  statement ends 

    let ipaScorecard = JSON.parse(localStorage.getItem('ipaScorecard'));
    // if user is coming from dashboard
    if (ipaScorecard) {
      this.showDates = true;
      this.provider.ipaid = ipaScorecard.id;
      this.provider.year = ipaScorecard.year;
      this.provider.month = ipaScorecard.month;
      this.provider.startdate = ipaScorecard.startdate;
      this.provider.enddate = ipaScorecard.enddate;

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

      this.provider.healthplanid = ipaScorecard.hpid;
      this.getInsuranceByIpa(ipaScorecard.id)
      this.getScorecard();
      // setting these names for next gap screen 
      // from scorecard in case of dashboard clickables
      this.healthplanName = ipaScorecard.healthplanName;
      this.ipaName = ipaScorecard.ipaName;
      localStorage.removeItem('provider_name');
      localStorage.setItem('selectedMonth', this.selectedMonth);
      localStorage.setItem('healthplanName', this.healthplanName);
      localStorage.setItem('ipaName', this.ipaName);
    }
    this.checkMonth(this.provider.year)
  }


  // ngOnDestroy
  ngOnDestroy() {
    localStorage.removeItem('ipaScorecard');


    if (this.rolename == 'ipa') {
      localStorage.removeItem('hpScorecard');

    }
  }
  getAllIPA() {
    this.commonService.getAllIPA().subscribe(results => {

      this.ipa_list = results;
    }, err => {

    });
  }
  // Modal showing functions
  showDenModal(id) {
    this.modalMeasureId = id;
    this.denModal.show()
  }
  showNumModal(id) {
    this.modalMeasureId = id;
    this.numModal.show()
  }
  getInsuranceByIpa(id) {
    this.commonService.getInsuranceByIpa(id
    ).subscribe(results => {

      this.insurance_list = results;
      // this.provider.healthplanid = '';
    }, err => {

    });
  }

  // checking and formatting dates -->
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
  // <-- checking and formatting dates
  roundInput(num) {
    return Math.round(num * 100) / 100
  }
  // report excel and pdf
  getReport(type) {
    let reportDetails = {
      // 'providername':this.provider_name,
      'healthplanname': this.healthplanName,
      'ipaname': this.ipaName,
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
    this.commonService.getScorecardReport(reportParams, 'ipascorecard'
    ).subscribe(results => {

      if (type == 'pdf') {
        saveAs(results, `ipa-scorecard.pdf`)
      } else {
        saveAs(results, `ipa-scorecard.xlsx`)
      }

    }, err => {
    });
  }
  // Getting scorecard and further calculations
  getScorecard() {
    this.total_Weight_C = 0;
    this.total_Score_C = 0;
    this.total_Weight_D = 0;
    this.total_Score_D = 0;
    this.part_C_Overall = 0;
    this.combined_Overall = 0;
    this.commonService.getIpaScorecard(this.provider
    ).subscribe(results => {
      // console.log(results.json())
      // localStorage.removeItem('ipaScorecard')
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

  //storing parameters for gap screen
  storeGapDetails(measureid, measurename) {
    localStorage.setItem('providerScorecard', JSON.stringify(this.provider));
    localStorage.setItem('measureid', measureid);
    localStorage.setItem('measurename', measurename);
    localStorage.removeItem('provider_name');
    localStorage.setItem('gapMeasures', JSON.stringify(this.gapMeasures));
    localStorage.setItem('selectedMonth', this.selectedMonth);
    localStorage.setItem('healthplanName', this.healthplanName);
    localStorage.setItem('ipaName', this.ipaName);
  }
}

