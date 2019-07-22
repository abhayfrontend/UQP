import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
// import { MemberService } from '../../../services/member.service';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';
import * as jsPDF from 'jspdf';
// import { NotificationService } from '../../../views/notifications/notifications.service';
// import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

import * as $ from 'jquery';
@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.scss']
})
export class QualityComponent implements OnInit {

  API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
  CONTENT_BASE = environment.content_api_base.api_base;
  // Current user details
  currentUser: any;
  currentRole: string;
  currentId: any;





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
  auditstatusdate = {
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
  years: string[] = [];
  date: any;
  days: any;
  current_date = new Date();
  // current_month = this.authS.getDates().current_month;
  // previous_month = this.authS.getDates().previous_month;
  // previous_month_full = this.authS.getDates().previous_month_full;
  // current_year = this.authS.getDates().current_year;

  //temporary january implementation
  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().current_month;
  current_year = this.authS.getDates().current_year;
previous_month_full = this.authS.getDates().current_month_full;

  //provider
  provider_name: string;
  members: any;
  showPanel: boolean = true;
  insurance_list: any;
  searching: boolean = false;
  showDates: boolean = false;
  provider = {
    healthplanid: 0,
    providerid: 0,
    month: '',
    year: 0,
    startdate: '',
    enddate: '',
    docsubmittedby: ''
  }

data_count:any;
gaps_data:any;
  graph_data:any;
  auditGraph_data:any;
  showHealthplangraph: boolean = false;
assuranceUsers:any;

    total_submitted: any;
  total_pending: any;
  total_approved: any;
  total_rejected: any;
rejectedReasons:any;
total_reason_count:any = 0;
  loading: boolean = false;

    assurance_param = {

    'qaranking':true,
    'report':false,
    'pageNumber':1,
    'pageSize':15
  }
  userRolePerm: any;
  userRolePerm_HEDIS:any;
    //assurance top and bottm
assurance_list:any;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  constructor(private userService: UserService, public authS: AuthService,
    private router: Router,
    private commonService: CommonService) {

    this.userRolePerm = this.authS.getPermission('MRA Dashboard');
    this.userRolePerm_HEDIS = this.authS.getPermission('Hedis Dashboard');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let user = JSON.parse(localStorage.getItem('currentUser'));
      //assurance top and bottm
       this.maxDate.setDate(this.maxDate.getDate());
    this.bsValue.setDate(this.bsValue.getDate() -30);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    //get subscriber id of member
    this.currentId = user.subscriberid;


this.currentRole = this.authS.getCurrentRole(user.roleid);

if(!this.userRolePerm_HEDIS.view){
  this.router.navigate(['/dashboard/audit/mra']);
}






  }
  ngOnInit() {


// this.currentRole = this.authS.getCurrentRole(user.roleid);
    this.getAllAssurance();
    this.getSubmissionReasons(1);
    this.getAssuranceUsers();
    this.getAllHealthplans();

    // document.querySelector('body').classList.add('aside-menu-hidden');
    for (let year = Number(this.current_year); year > 2018; year -= 1) {
      this.years.push(year.toString());
    }

    this.date = {
      'month': this.previous_month,
      'year': this.current_year
    }
    this.auditstatusdate.month = this.IPAdate.month = this.previous_month;
    this.auditstatusdate.year = this.IPAdate.year = this.current_year;
    this.provider.year = this.current_year;
    this.provider.month = this.previous_month;

    this.checkMonth(this.current_year, '');
    //customized check for provider December
    // this.checkMonth(this.provider.year, 'provider')


    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;
    this.dashboard.startdate = this.params.startdate;
    this.dashboard.enddate = this.params.enddate;



    this.getAuditDataCount()
    this.getAuditStatusCount()
    // this.getIPACount()
    this.getGapsCount()

  }

  storeDashboardQAgaps(status){
    localStorage.setItem('qaStatus', status);
  }
  formatDate(name) {
    if (name == 'provider') {
      this.months.map((month) => {
        if (this.provider.month == month.value) {
          // this.selectedMonth = month.full;
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
    } else if (name == 'auditstatusgraph') {

      this.months.map((month) => {
        if (this.auditstatusdate.month == month.value) {
          // this.selectedMonth = month.full;
          if (month.value == '02' && this.auditstatusdate.year % 4 == 0) {
            this.days = '29';
          } else {
            // console.log(month.value)
            this.days = month.days;
          }

        }
      });
      this.auditstatusdate.startdate = this.auditstatusdate.year + '-' + this.auditstatusdate.month + '-01';
      this.auditstatusdate.enddate = this.auditstatusdate.year + '-' + this.auditstatusdate.month + '-' + this.days;
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
  checkMonth(selectedYear, name) {
    this.formatDate(name);

    if (selectedYear == this.authS.getDates().actual_year) {
      if (name == 'auditstatusgraph') {
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
      } else {
        this.months = lmonth;
      }
    }
  }

    //provider
  searchProvider() {
    if (this.provider_name.length > 2) {
      this.showPanel = true;
      // this.searching = true;
      this.userService.search_provider(this.provider_name).subscribe(
        res => {
          this.members = res;
          // this.searching = false;
        },
        err => {
          // this.searching = false;
        }
      )
    }
    if (this.provider_name.length == 0) {
      this.provider.providerid = 0;
      this.members = [];
      this.showPanel = false;
    }

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



  storeGapScorecard(gap) {
    let gapscorecard = { ...this.provider }
    gapscorecard['mid'] = gap.measureid;
    gapscorecard['mname'] = gap.measurename;
    if(this.provider_name){
      gapscorecard['providername'] = this.provider_name;
    }
    localStorage.setItem('gapScorecard', JSON.stringify(gapscorecard))
  }


  getAuditDataCount() {

    this.commonService.getAuditDataCount(this.params, this.currentUser.userid).subscribe(results => {
      // alert($("[id*='thisIsAnId" + i+ "']"));

      this.data_count = results;
      this.data_count.CountList.map((reason) => {
        this.total_reason_count += reason.count;
      })
      
      //    let length = this.data_count.healthplan.length;
      //    for(let i =1;i<=length;i++){
      //     this.createGaugeObj.push({  

      //    "name":'gauge'+i,
      //    "id":'g'+i,
      //    "option":'opts'+i,
      //    "target":'target'+i,


      // })
      //   }
      //      $('.gauge .row').find('.col').slice(length,6).remove()



      // this.membership_count = this.data_count.healthplan;
      // this.gaugeOptions();
    }, err => {
    });
  }

  getAuditStatusCount() {
    this.formatDate('auditstatusgraph');
    this.commonService.getAuditStatusCount(this.auditstatusdate).subscribe(results => {

      this.auditGraph_data = results;
      // this.chartLabels2.length = 0;
      this.data()

    }, err => {
    });
  }

  getSubmissionReasons(id) {
    // alert("frefref");
    // console.log("Feefr");
    this.commonService.getSubmissionReasons(id).subscribe(results => {
      this.rejectedReasons = results;
    }, err => {

    });
  }

  getAssuranceUsers() {
    //assurance id is 3
    this.userService.getRoleWiseUsers(3).subscribe(results => {

      this.assuranceUsers = results;
    }, err => {

    });
  }

  getGapsCount() {
    this.formatDate('provider');
    this.loading = true;
    this.commonService.getAuditGapsCount(this.provider).subscribe(results => {
      this.loading = false;
      this.gaps_data = results;

      if (this.gaps_data.length > 0) {
        this.total_submitted = this.gaps_data.map(item => item.submitted).reduce((prev, next) => prev + next);
        

        this.total_pending = this.gaps_data.map(item => item.pending).reduce((prev, next) => prev + next);
        this.total_approved = this.gaps_data.map(item => item.approved).reduce((prev, next) => prev + next);
        this.total_rejected = this.gaps_data.map(item => item.rejected).reduce((prev, next) => prev + next);
      } else {
        this.total_submitted = this.total_pending = this.total_approved = this.total_rejected = 0;
      }



    }, err => {
      this.loading = false;
    });
  }


  data() {
    let m1 = [];
    let m2 = [];
    let m3 = [];
    let m4 = [];
    let month1Name; let month2Name; let month3Name;
    let data_graph = this.auditGraph_data;
    month1Name = data_graph[0].plangraph[2].monthname;
    month2Name = data_graph[0].plangraph[1].monthname;
    month3Name = data_graph[0].plangraph[0].monthname;
    for (let i = 0; i < data_graph.length; i++) {

      m1.push(data_graph[i].plangraph[2].count)
      m2.push(data_graph[i].plangraph[1].count)
      m3.push(data_graph[i].plangraph[0].count)
      // this.chartLabels2.push(data_graph[i].plancard.healthplan.toLowerCase()
      //   .replace(/ .*/, '').replace(/\b./g, function(a) { return a.toUpperCase(); }))
    }
    // this.chartLabels2 = m4;

    this.graph_data = [
      { data: m1, label: month1Name },
      { data: m2, label: month2Name },
      { data: m3, label: month3Name }
    ];
    // array.map(item => item.age)
    //  .filter((value, index, self) => self.indexOf(value) === index)
    this.showHealthplangraph = true; 
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
        
        scaleLabel: {
          display: true,
          labelString: 'Count',
          fontSize: 14
        }
      }],
      xAxes: [{

        scaleLabel: {
          display: true,
          labelString: 'Status',
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

  public barChartLabels: string[] = ['Pending', 'Approved', 'Rejected', 'Submitted'];
  // public barChartLabels1: string[] = ['Access', 'Physicians', 'American', 'Primecare', 'Qualcare', 'Unity'];

  // public barChartLabels1: string[] = ['Access 2 Health Care Llc', 'Access 2 Health Care Physicians Llc', 'All American Ipa, Llc', 'Primecare, Llc', 'Qualcare Medical Llc', 'Unity Healthcare Llc'];

  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = this.graph_data


}

