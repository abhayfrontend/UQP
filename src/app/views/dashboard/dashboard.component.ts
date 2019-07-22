import { Component, OnInit, NgZone, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppSidebarNavComponent } from '../../components/app-sidebar-nav/app-sidebar-nav.component'
// converting html to canvas and then pdf
import * as jsPDF from 'jspdf';

import * as $ from 'jquery';

declare var Gauge; declare var Donut;
@Component({
  providers: [AppSidebarNavComponent],
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  //clickables
  hpscorecard: any = { 'id': '' };
  ipascorecard: any = { 'id': '' };
  memberscorecard: any = { 'id': '' };
  gapscorecard: any = { 'mid': '', 'mname': '' };

  //data counts
  data_count: any;
  membership_count: any;
  healthplan_data: any;
  ipa_data: any;
  gaps_data: any;

  // graphs variable
  showHealthplangraph: boolean = false;
  showIPAgraph: boolean = false;
  showcensusgraph: boolean = false;

  cData_healthplan: any;
  cData_ipa: any;
  cData_census: any;

  chartLabels1: any = [];
  chartLabels2: any = [];
  chartLabels3: any = [];

  total_gaps: any;
  total_numerator: any;
  total_denominator: any;
  total_pending: any;
  prevMonthGaps: any;
  showGapCard: boolean = true;

  selectedMonth: any;
  healthplanName: string;
  ipaName: string;
  //global date
  params = {
    'startdate': '',
    'enddate': '',
    'month': '',
    'year': ''
  }

  dashboard = {
    'startdate': '',
    'enddate': ''
  }
  //hp date
  healthplandate = {
    'startdate': '',
    'enddate': '',
    'month': '',
    'year': 0
  };

  censusdate = {
    'startdate': '',
    'enddate': '',
    'month': '',
    'year': 0
  };

  //IPA date
  IPAdate = {
    'startdate': '',
    'enddate': '',
    'month': '',
    'year': 0
  };

  assurance_param = {

    'qaranking': true,
    'report': false,
    'pageNumber': 1,
    'pageSize': 15
  }
  currentUser: any;
  currentRole: string;
  currentId: any;

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
  months2 = this.months;
  months3 = this.months;
  months4 = this.months;
  years: string[] = [];
  date: any;
  days: any;
  current_date = new Date();
  // current_month = this.authS.getDates().current_month;
  // previous_month = this.authS.getDates().previous_month;
  // previous_month_full = this.authS.getDates().previous_month_full;
  current_year = this.authS.getDates().current_year;

  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month;
  previous_month_full = this.authS.getDates().previous_month_full;


  //provider
  provider_name_dash: string;
  members_dash: any;
  showPanel_dash: boolean = true;
  searching_dash: boolean = false;


  //provider
  provider_name: string;
  members: any;
  showPanel: boolean = true;
  insurance_list: any;
  ipa_list: any;
  searching: boolean = false;
  showDates: boolean = false;
  provider = {
    healthplanid: 0,
    providerid: 0,
    ipaid: 0,
    month: '',
    year: 0,
    startdate: '',
    enddate: ''
  }

  loading: boolean = false;
  createGaugeObj = [];
  ipa_list_by_month: any;
  tooltip_html: any;
  userRolePerm: any;
  userRolePerm_HEDIS: any;
  userRolePerm_ACO: any;
  otp_msg: string;
  otp_error: boolean = false;
  officestaff_providername: string = '';

  census_data: any;
  //assurance top and bottm
  assurance_list: any;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  @ViewChild('gapDocsDownload') public otpModal: ModalDirective;
  constructor(private commonService: CommonService, private userService: UserService,
    public authS: AuthService, private router: Router, private comp: AppSidebarNavComponent, private ngZone: NgZone, private cdRef: ChangeDetectorRef) {


    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let user = JSON.parse(localStorage.getItem('currentUser'));

    this.getCurrentId(user);
    this.userRolePerm = this.authS.getPermission('MRA Dashboard');
    this.userRolePerm_HEDIS = this.authS.getPermission('Hedis Dashboard');
    this.userRolePerm_ACO = this.authS.getPermission('ACO Dashboard');

    //assurance top and bottm
    this.maxDate.setDate(this.maxDate.getDate());
    this.bsValue.setDate(this.bsValue.getDate() - 30);
    this.bsRangeValue = [this.bsValue, this.maxDate];

    this.currentRole = this.authS.getCurrentRole(user.roleid);
    this.officestaff_providername = this.currentUser.officestaff_providername;
    if (this.currentUser.rolename == 'Office Staff') {
      this.officestaff_providername = this.currentUser.officestaff_providername;
    }
    if (this.currentRole == 'member') {
      this.router.navigate(['/dashboard/member']);
    } else if (this.currentRole == 'audit') {
      this.router.navigate(['/dashboard/quality-audit']);
    }
    if (this.currentRole == 'undefined') {
      this.router.navigate(['/dashboard/default']);
    }


    if (!this.userRolePerm_HEDIS.view) {
      this.router.navigate(['/dashboard/mra']);
    }

  }
  ngOnInit(): void {

    let ref = localStorage.getItem('refresh');
    if (!ref) {

      localStorage.setItem('refresh', 'true');
      location.reload(true);//refresh dashboard on first time entering dashboard to reload cache`
    }
    else {

      if (!this.userRolePerm_HEDIS.view) {
        this.router.navigate(['/dashboard/mra']);/*else navigate to mra dashboard*/ 
      }
      // alert(this.previous_month)
      // this.getAllGapDocs();
      if (this.currentRole == "audit") {
        this.getAllAssurance();
      }

      this.getAllIPA();

      document.querySelector('body').classList.add('aside-menu-hidden');//add aside menu class 

      //check the role logged in
      if (this.currentRole == "provider") {
        this.provider.providerid = this.currentId;
        localStorage.setItem('provider_name', this.currentUser.name);
        this.commonService.getInsurance(this.currentId
        ).subscribe(results => {
          this.insurance_list = results;

        }, err => {

        });
      } else if (this.currentRole == "executive") {
        this.getAllHealthplans();
      } else if (this.currentRole == "ipa") {
        this.provider.ipaid = this.currentId;

        this.commonService.getInsuranceByIpa(this.provider.ipaid
        ).subscribe(results => {
          this.insurance_list = results;
        }, err => {

        });


      } else if (this.currentRole == "healthplan") {
        this.provider.healthplanid = this.currentId;
        this.censusdate['healthplanid'] = this.currentId;
      } else if (this.currentRole == 'qa') {
        //temporary january implementation
        this.current_month = this.authS.getDates().current_month;
        this.previous_month = this.authS.getDates().previous_month;

        this.current_year = this.authS.getDates().current_year;
        this.previous_month_full = this.authS.getDates().previous_month_full;
      }
      if (this.currentUser.root_exec) {
        localStorage.setItem('provider_name', this.currentUser.officestaff_providername);
      }
      // year array logic
      for (let year = 2019; year > 2017; year -= 1) {
        this.years.push(year.toString());
      }
      //date logic
      this.date = {
        'month': this.previous_month - 1,
        'year': this.current_year
      }
      this.healthplandate.month = this.IPAdate.month = this.previous_month;
      this.healthplandate.year = this.IPAdate.year = this.current_year;
      this.provider.year = this.current_year;
      this.provider.month = this.previous_month;

      this.censusdate.year = this.current_year;
      this.censusdate.month = this.previous_month;

      this.checkMonth(this.current_year, '');
      //customized check for provider December
      // this.checkMonth(this.provider.year, 'provider')


      this.params.startdate = this.date.year + '-' + this.date.month + '-01';
      this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;
      this.dashboard.startdate = this.params.startdate;
      this.dashboard.enddate = this.params.enddate;

      // else if (this.currentRole == "provider") {
      //       this.params['userid'] = this.currentUser.userid;
      //     }
      if (this.currentRole !== "provider" && this.currentRole !== "ipa") {
        this.getAllHealthplans();
      }
      this.getIpaByDate();
      this.getDataCount()
      this.getHealthplanCount()
      this.getIPACount()
      this.getGapsCount()
      // this.getCensusGraph()
      if (this.currentUser.rolename == 'Office Staff') {

        localStorage.setItem('provider_name', this.currentUser.officestaff_providername);
      }
    }

  }

  // getting current id from auth
  getCurrentId(user) {
    if (user.healthplanid) {
      this.currentId = user.healthplanid
    } else if (user.ipaid) {
      this.currentId = user.ipaid
    } else if (user.providerid) {
      this.currentId = user.providerid;
      this.provider.providerid = this.currentId;
    } else {
      this.currentId = ""
    }
    //When quality ssurance role comes then we have to fetch id from userid
    if (user.roleid == 3) {
      this.currentId = user.userid;
    }
  }
  buttonClick() {
    let asd = JSON.parse(localStorage.getItem('permission'));

    asd[2].add = false;
    asd[2].edit = false;
    asd[2].view = false;
    localStorage.setItem('permission', JSON.stringify(asd));
    this.comp.ngOnInit();
  }
//generating pdf from screenshot
  GeneratePDF(): void {
    $('#dashboard').append("<p class='pdf-elem' style='margin: 0;font-size: 18px;text-align: center;color:#59669d'><b>Downloaded from UQP</b></p>.");
    const elementToPrint = document.getElementById('dashboard'); //The html element to become a pdf
    // const pdf = new jsPDF('p', 'pt', 'a4');
    var pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [14, 12]
    })
    pdf.addHTML(elementToPrint, () => {
      pdf.save('dashboard.pdf');
      $('.pdf-elem').remove();
    });

  }

  getAllIPA() {
    this.commonService.getAllIPA().subscribe(results => {
      //on gap card we donot need to show primecare and all american
      this.ipa_list = results.filter((ipa) => ipa.IPA_ID != 5 && ipa.IPA_ID != 6);
    }, err => {

    });


  }

  getIpaByDate() {
    let current_date = {
      'startdate': this.dashboard.startdate,
      'enddate': this.dashboard.enddate
    }
    this.commonService.getIpaByDate(current_date).subscribe(results => {
      this.ipa_list_by_month = results.body;
    }, err => {

    });
  }
//checkinfor routing that which page to route
  goToNonCompliant(text) {
    if (text == 'pending') {
      this.provider['status'] = 'submitted';
    }

    else if (text == 'gaps') {
      this.provider['status'] = 'all';
    }
    this.provider['provider_name'] = this.provider_name;
    localStorage.setItem('gotonc', JSON.stringify(this.provider))
    this.router.navigate(['/reports/non-compliant']);

  }

//on search provider ,changing the dashboard as provider dashboard
  changeProv(member, name) {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if (name == "provider") {
      user.providerid = member.id;
      user.roleid = 35;
      user.rolename = "Provider";
      // user.provider_name = member.FirstName+" "+member.LastName;
      user.officestaff_providername = member.LastName + " " + member.FirstName;
      user.root_exec = true;
    } else {
      user.providerid = null;
      user.roleid = 2;
      user.rolename = "Executive Management";
      user.officestaff_providername = null;
      user.root_exec = false;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //   this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };
    this.router.navigateByUrl(`/`).then(
      () => {
        this.router.navigateByUrl(`/dashboard`);
      });
    //   this.router.navigateByUrl('/dashboard/mra', {skipLocationChange: true}).then(()=>
    // this.router.navigate(["/dashboard"])); 
  }
//provider search dashboard
  searchProvider_dash() {
    if (this.provider_name_dash.length > 2) {
      this.showPanel_dash = true;
      this.searching_dash = true;
      this.userService.search_provider(this.provider_name_dash).subscribe(
        res => {
          this.members_dash = res;
          this.searching_dash = false;
        },
        err => {
          this.searching_dash = false;
        }
      )
    }
    if (this.provider_name_dash.length == 0) {
      // this.provider.providerid = 0;
      this.members_dash = [];
      this.showPanel_dash = false;
    }

  }
  //total member lisitng screen
  storeMemberScorecard(hp) {

    this.memberscorecard = { ...this.dashboard }
    this.memberscorecard['healthplanid'] = hp.healthplan_id;
    this.memberscorecard['providerid'] = 0;
    this.memberscorecard['year'] = this.current_year;
    this.memberscorecard['month'] = this.previous_month;
    if (this.currentRole == 'provider') {
      this.memberscorecard['providerid'] = this.currentId;
    }
    // this.memberscorecard['healthplanName'] = hp.health_Name;
    localStorage.setItem('healthplanName', hp.health_Name);
    localStorage.setItem('selectedMonth', this.previous_month_full);
    localStorage.setItem('providerScorecard', JSON.stringify(this.memberscorecard));
    localStorage.setItem('fromDashboard', JSON.stringify(true))
    localStorage.removeItem('ipaName')
  }

  storeHpScorecard(healthplan) {

    this.hpscorecard = { ...this.healthplandate }
    this.hpscorecard['id'] = healthplan.plancard.hpid;
    this.hpscorecard['healthplanName'] = healthplan.plancard.healthplan;
    // this.selectedMonth = localStorage.getItem('selectedMonth');
    //   this.healthplanName =  localStorage.getItem('healthplanName');
    console.log(this.hpscorecard)
    localStorage.setItem('hpScorecard', JSON.stringify(this.hpscorecard))
  }

  storeIpaScorecard(ipa) {

    this.ipascorecard = { ...this.IPAdate }
    this.ipascorecard['id'] = ipa.plancard.hpid;
    this.ipascorecard['ipaName'] = ipa.plancard.healthplan;
    this.ipascorecard['hpid'] = 0;
    this.ipascorecard['healthplanName'] = 'ALL';
    localStorage.setItem('ipaScorecard', JSON.stringify(this.ipascorecard))
  }

  storeGapScorecard(gap) {
    this.gapscorecard = { ...this.provider }
    this.gapscorecard['mid'] = gap.measureid;
    this.gapscorecard['mname'] = gap.measname;
    this.gapscorecard['pname'] = this.provider_name;
    localStorage.setItem('gapScorecard', JSON.stringify(this.gapscorecard))
  }
  storeDashboardDate(date) {
    localStorage.setItem('dashboard_date', JSON.stringify(date))
  }

  storeDashboardQAgaps(status) {
    localStorage.setItem('qaStatus', status);
    this.router.navigate(['/gap-closure/gap-audit'])

  }



  //change in membership counts from last month clickable from dashboard to membership roster
  storeMemberchanges(name) {
    localStorage.setItem('memberchangevalue', name);
    this.router.navigate(['/reports/membership-roster']);
  }

  storeGaugechanges(name, id) {
    localStorage.setItem('memberchangevalue', name);
    localStorage.setItem('gaugeHpId', id);
    this.router.navigate(['/reports/membership-roster']);
  }
  getDataCount() {
    if (this.currentUser.officetype) {
      let idArr = [];
      this.currentUser.officetype.map((staff) => {
        idArr.push(staff.User_ProviderId)
      })
      this.params['officetype'] = idArr;
      this.provider['officetype'] = idArr;
    }
    this.commonService.getDataCount(this.params, this.currentRole, this.currentId).subscribe(results => {
      // alert($("[id*='thisIsAnId" + i+ "']"));

      this.data_count = results;
      //  	let length = this.data_count.healthplan.length;
      //  	for(let i =1;i<=length;i++){
      //     this.createGaugeObj.push({  

      //    "name":'gauge'+i,
      //    "id":'g'+i,
      //    "option":'opts'+i,
      //    "target":'target'+i,


      // })
      //   }
      //  		$('.gauge .row').find('.col').slice(length,6).remove()



      this.membership_count = this.data_count.healthplan;
      //below line checks if the view is binded and after taht 
      // gauge options is called, this solves the problem of Cannot read property 'getContext' of null
      this.cdRef.detectChanges();
      this.gaugeOptions();
    }, err => {
    });
  }

  getHealthplanCount() {
    this.formatDate('healthplan');
    this.commonService.getHealthplanCount(this.healthplandate, this.currentRole, this.currentId).subscribe(results => {

      this.healthplan_data = results;
      this.chartLabels2.length = 0;
      this.data()

    }, err => {
    });
  }
  getIPACount() {
    this.formatDate('ipa');
    this.commonService.getIPACount(this.IPAdate, this.currentRole, this.currentId).subscribe(results => {

      this.ipa_data = results;
      this.chartLabels1.length = 0;

      this.data_ipa()

    }, err => {
    });
  }

  getCensusGraph() {
    this.formatDate('census');
    this.commonService.getCensusGraph(this.censusdate).subscribe(results => {

      this.census_data = results;
      this.chartLabels3.length = 0;
      this.censusData()

    }, err => {
    });
  }

  getGapsCount() {
    this.formatDate('provider');
    this.loading = true;
    this.commonService.getGapsCount(this.provider, this.currentRole, this.currentId).subscribe(results => {
      this.loading = false;
      this.gaps_data = results
      if (this.gaps_data.length > 0) {
        this.total_gaps = this.gaps_data.map(item => item.gapcount).reduce((prev, next) => prev + next);
        if (this.showGapCard) {
          this.prevMonthGaps = this.total_gaps;
          this.showGapCard = false;
        }

        this.total_numerator = this.gaps_data.map(item => item.totalnumerator).reduce((prev, next) => prev + next);
        this.total_denominator = this.gaps_data.map(item => item.totaldenominator).reduce((prev, next) => prev + next);
        this.total_pending = this.gaps_data.map(item => item.totalpending).reduce((prev, next) => prev + next);
      } else {
        this.total_gaps = this.total_numerator = this.total_denominator = this.total_pending = 0;
      }



    }, err => {
      this.loading = false;
    });
  }
//date functional logic
  formatDate(name) {
    if (name == 'provider') {
      this.months.map((month) => {
        if (this.provider.month == month.value) {
          this.selectedMonth = month.full;
          if (month.value == '02' && this.provider.year % 4 == 0) {
            this.days = '29';
          } else {
            // console.log(month.value)
            this.days = month.days;
          }

        }
      });
      this.provider.startdate = this.provider.year + '-' + this.provider.month + '-01';
      this.provider.enddate = this.provider.year + '-' + this.provider.month + '-' + this.days;
    } else if (name == 'ipa') {
      this.months.map((month) => {
        if (this.IPAdate.month == month.value) {
          // this.selectedMonth = month.full;
          if (month.value == '02' && this.IPAdate.year % 4 == 0) {
            this.days = '29';
          } else {
            // console.log(month.value)
            this.days = month.days;
          }

        }
      });
      this.IPAdate.startdate = this.IPAdate.year + '-' + this.IPAdate.month + '-01';
      this.IPAdate.enddate = this.IPAdate.year + '-' + this.IPAdate.month + '-' + this.days;
    } else if (name == 'healthplan') {

      this.months.map((month) => {
        if (this.healthplandate.month == month.value) {
          // this.selectedMonth = month.full;
          if (month.value == '02' && this.healthplandate.year % 4 == 0) {
            this.days = '29';
          } else {
            // console.log(month.value)
            this.days = month.days;
          }

        }
      });
      this.healthplandate.startdate = this.healthplandate.year + '-' + this.healthplandate.month + '-01';
      this.healthplandate.enddate = this.healthplandate.year + '-' + this.healthplandate.month + '-' + this.days;
    } else if (name == 'census') {

      this.months.map((month) => {
        if (this.censusdate.month == month.value) {
          // this.selectedMonth = month.full;
          if (month.value == '02' && this.censusdate.year % 4 == 0) {
            this.days = '29';
          } else {
            // console.log(month.value)
            this.days = month.days;
          }

        }
      });
      this.censusdate.startdate = this.censusdate.year + '-' + this.censusdate.month + '-01';
      this.censusdate.enddate = this.censusdate.year + '-' + this.censusdate.month + '-' + this.days;
    } else {
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
    }

    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;


    // new Date("2015-03-25");
  }
  checkMonth(selectedYear, name) {
    this.formatDate(name);

    if (selectedYear == this.authS.getDates().actual_year) {
      if (name == 'healthplan') {
        this.months.map((month) => {
          if (this.current_month == month.value) {
            this.months.splice(Number(month.value), 12)
          }
        })
      } else if (name == 'ipa') {
        this.months2.map((month) => {
          if (this.current_month == month.value) {
            this.months2.splice(Number(month.value), 12)
          }
        })
      } else if (name == 'provider') {
        this.months3.map((month) => {
          if (this.current_month == month.value) {
            this.months3.splice(Number(month.value), 12)
          }
        })
      } else if (name == 'census') {
        this.months4.map((month) => {
          if (this.current_month == month.value) {
            this.months4.splice(Number(month.value), 12)
          }
        })
      } else {
        this.months.map((month) => {
          if (this.current_month == month.value) {
            this.months.splice(Number(month.value), 12)
          }
        })
      }



    } else {

      let lmonth = [{ "full": "January", "value": "01", "days": "31" },
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

      if (name == 'healthplan') {
        this.months = lmonth;
      } else if (name == 'ipa') {
        this.months2 = lmonth;
      } else if (name == 'provider') {
        this.months3 = lmonth;
      } else if (name == 'census') {
        this.months4 = lmonth;
      } else {
        this.months = lmonth;
      }
    }
  }

  data_ipa() {
    let m1 = [];
    let m2 = [];
    let m3 = [];
    let m4 = [];
    let m1Name; let m2Name; let m3Name;
    let hh = this.ipa_data;
    m1Name = hh[0].plangraph[2].monthname;
    m2Name = hh[0].plangraph[1].monthname;
    m3Name = hh[0].plangraph[0].monthname;
    for (let i = 0; i < hh.length; i++) {

      m1.push(parseFloat(hh[i].plangraph[2].totalscore).toFixed(2));
      m2.push(parseFloat(hh[i].plangraph[1].totalscore).toFixed(2));
      m3.push(parseFloat(hh[i].plangraph[0].totalscore).toFixed(2));
      // m4.push(hh[i].plancard.healthplan.replace(/ .*/,''))
      let hName = hh[i].plancard.healthplan.toLowerCase();
      if (hName.includes("access 2 health care llc")) {
        this.chartLabels1.push("Access")
      } else if (hName.includes("physicians")) {
        this.chartLabels1.push("Physicians")
      } else if (hName.includes("american")) {
        this.chartLabels1.push("American")
      } else {
        this.chartLabels1.push(hName.replace(/ .*/, '')
          .replace(/\b./g, function (a) { return a.toUpperCase(); }).split(",").join(""))

      }
    }

    // this.chartLabels1 = m4;
    this.cData_ipa = [
      { data: m1, label: m1Name },
      { data: m2, label: m2Name },
      { data: m3, label: m3Name }
    ];

    // array.map(item => item.age)
    //  .filter((value, index, self) => self.indexOf(value) === index)
    this.showIPAgraph = true;
  }
//data for bar chart 
  data() {
    let m1 = [];
    let m2 = [];
    let m3 = [];
    let m4 = [];
    let m1Name; let m2Name; let m3Name;
    let hh = this.healthplan_data;
    m1Name = hh[0].plangraph[2].monthname;
    m2Name = hh[0].plangraph[1].monthname;
    m3Name = hh[0].plangraph[0].monthname;
    for (let i = 0; i < hh.length; i++) {

      m1.push(parseFloat(hh[i].plangraph[2].totalscore).toFixed(2));
      m2.push(parseFloat(hh[i].plangraph[1].totalscore).toFixed(2));
      m3.push(parseFloat(hh[i].plangraph[0].totalscore).toFixed(2));
      this.chartLabels2.push(hh[i].plancard.healthplan.toLowerCase()
        .replace(/ .*/, '').replace(/\b./g, function (a) { return a.toUpperCase(); }))
    }
    // this.chartLabels2 = m4;

    this.cData_healthplan = [
      { data: m1, label: m1Name },
      { data: m2, label: m2Name },
      { data: m3, label: m3Name }
    ];
    // array.map(item => item.age)
    //  .filter((value, index, self) => self.indexOf(value) === index)
    this.showHealthplangraph = true;
  }

  censusData() {
    let m1 = [];
    let m2 = [];
    let m3 = [];

    let hh = this.census_data;

    for (let i = 0; i < hh.length; i++) {

      m1.push(hh[i].admit)
      m2.push(hh[i].discharge)
      m3.push(hh[i].readmit)
      this.chartLabels3.push(hh[i].Healthplan.toLowerCase()
        .replace(/ .*/, '').replace(/\b./g, function (a) { return a.toUpperCase(); }))
    }
    // this.chartLabels2 = m4;

    this.cData_census = [
      { data: m1, label: "admit" },
      { data: m2, label: "discharge" },
      { data: m3, label: "readmit" }
    ];
    console.log(m1);
    console.log(m2);

    console.log(m3);

    // array.map(item => item.age)
    //  .filter((value, index, self) => self.indexOf(value) === index)
    this.showcensusgraph = true;
  }

  //provider
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
      this.provider.providerid = 0;
      this.members = [];
      this.showPanel = false;
    }

  }

  getInsurance(member) {
    this.showPanel = false;
    // this.searching = true;
    this.provider_name = member.FirstName + " " + member.LastName;
    this.provider.providerid = member.id;
    // this.commonService.getInsurance(member.id
    // ).subscribe(results => {

    //   this.insurance_list = results;
    //   this.searching = false;
    // }, err => {
    //   this.searching = false;
    // });
  }

  getAllHealthplans() {
    this.commonService.getAllHealthplans().subscribe(results => {

      this.insurance_list = results;
    }, err => {

    });
  }
  gaugeOptions() {
    var opts = {
      angle: 0, // The span of the gauge arc
      lineWidth: 0.24, // The line thickness
      radiusScale: 0.57, // Relative radius
      pointer: {
        length: 0.61, // // Relative to gauge radius
        strokeWidth: 0.02, // The thickness
        color: '#000000' // Fill color
      },
      limitMax: false,
      // If false, max value increases automatically if value > maxValue
      limitMin: false,     // If true, the min value of the gauge will be fixed
      strokeColor: '#E0E0E0',  // to see which ones work best for you
      generateGradient: true,
      highDpiSupport: true,     // High resolution support

    };
    // debugger;

    if (this.membership_count) {
      for (let i = 0; i < this.membership_count.length; i++) {
        if (i == 0) {
          var opts1 = { ...opts, colorStart: '#efb818' };
          var target1 = document.getElementById('g0');
          var gauge1 = new Gauge(target1).setOptions(opts1);
          gauge1.maxValue = this.data_count.membercount;
          gauge1.set(this.membership_count[i].membercount);


        } else if (i == 1) {
          var opts2 = { ...opts, colorStart: '#b1bec5' }
          var target2 = document.getElementById('g1');
          var gauge2 = new Gauge(target2).setOptions(opts2);
          gauge2.maxValue = this.data_count.membercount;
          gauge2.set(this.membership_count[i].membercount);

        } else if (i == 2) {
          var opts3 = { ...opts, colorStart: '#333' }
          var target3 = document.getElementById('g2');
          var gauge3 = new Gauge(target3).setOptions(opts3);
          gauge3.maxValue = this.data_count.membercount;
          gauge3.set(this.membership_count[i].membercount);

        } else if (i == 3) {
          var opts4 = { ...opts, colorStart: '#63ae68' }
          var target4 = document.getElementById('g3');
          var gauge4 = new Gauge(target4).setOptions(opts4);
          gauge4.maxValue = this.data_count.membercount;
          gauge4.set(this.membership_count[i].membercount);

        } else if (i == 4) {
          var opts5 = { ...opts, colorStart: '#ed5724' }
          var target5 = document.getElementById('g4');
          var gauge5 = new Gauge(target5).setOptions(opts5);
          gauge5.maxValue = this.data_count.membercount;
          gauge5.set(this.membership_count[i].membercount);

        } else if (i == 5) {
          var opts6 = { ...opts, colorStart: '#293b6e' }
          var target6 = document.getElementById('g5');
          var gauge6 = new Gauge(target6).setOptions(opts6);
          gauge6.maxValue = this.data_count.membercount;
          gauge6.set(this.membership_count[i].membercount);

        }

      }
    }








  }

  options = {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'probability'
        }
      }]
    }
  }

  //clickable of dashboard gaps section to numerator, denominator and gaps section
  storeGapDetails(measureid, measurename, text) {
    localStorage.setItem('providerScorecard', JSON.stringify(this.provider));
    localStorage.setItem('measureid', measureid);
    localStorage.setItem('measurename', measurename)

    localStorage.setItem('selectedMonth', this.selectedMonth);
    if (this.healthplanName) {
      localStorage.setItem('healthplanName', this.healthplanName);
    } else {
      localStorage.removeItem('healthplanName')
    }


    if (this.ipaName) {
      localStorage.setItem('ipaName', this.ipaName);
    } else {
      localStorage.removeItem('ipaName')
    }

    if (this.provider_name) {
      localStorage.setItem('provider_name', this.provider_name);
    } else {
      localStorage.removeItem('provider_name')
    }
    // if(text=='denom')
    // {

    //   this.router.navigate(['/members/Denominator']);
    // }
    // else if(text=='num')
    // {
    //   this.router.navigate(['/members/Numerator']);
    // }
  }

  getAllAssurance() {
    // console.log(this.bsRangeValue);
    this.assurance_param['startdate'] = this.bsRangeValue[0];
    this.assurance_param['enddate'] = this.bsRangeValue[1];
    // console.log(this.params)
    // this.page=1;


    this.commonService.getAssuranceProductivity(this.assurance_param, 'hedis').subscribe(results => {
      // this.showPagination = true;

      // console.log(JSON.parse(results.headers.get('Paging-Headers')).totalCount)
      // console.log(results.headers.get('Content-Type'))
      // this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.assurance_list = results.body;

      // this.setPages();
      // localStorage.removeItem('dashboard_date')
    }, err => {

    });
  }
  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,

    title: {
      display: true,
      text: 'Last 3 Months Comparision'
    },

    scales: {
      yAxes: [{
        ticks: {
          min: 0, stepValue: 1, max: 5, fixedStepSize: 1


        },
        scaleLabel: {
          display: true,
          labelString: 'Overall Score',
          fontSize: 14
        }
      }],
      xAxes: [{

        scaleLabel: {
          display: true,
          labelString: 'Healthplans',
          fontSize: 14
        }
      }]
    }


  };

  private colors = [

    { backgroundColor: '#293b6e' },
    { backgroundColor: '#efb818' },
    { backgroundColor: '#b1bec5' }

  ];

  private colors2 = [

    { backgroundColor: '#b1bec5' },
    { backgroundColor: '#f68954' },
    { backgroundColor: '#63ae68' }

  ];

  public barChartLabels: string[] = ['Coventry', 'Freedom', 'Humana', 'Optimum', 'Ultimate', 'Wellcare'];
  public barChartLabels1: string[] = ['Access', 'Physicians', 'American', 'Primecare', 'Qualcare', 'Unity'];

  // public barChartLabels1: string[] = ['Access 2 Health Care Llc', 'Access 2 Health Care Physicians Llc', 'All American Ipa, Llc', 'Primecare, Llc', 'Qualcare Medical Llc', 'Unity Healthcare Llc'];

  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = this.cData_healthplan
}
