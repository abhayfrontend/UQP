import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MraService } from '../../../services/mra.service';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
@Component({
  selector: 'app-mra-audit-dashboard',
  templateUrl: './mra-audit-dashboard.component.html',
  styleUrls: ['./mra-audit-dashboard.component.scss']
})
export class MraAuditDashboardComponent implements OnInit {
 currentUser: any;
  currentRole: string;
  currentId: any;
 officestaff_providername:string;
  data_count: any;
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
      provider = {
    healthplanid: 0,
    providerid: 0,
    ipaid: 0,
    month: '',
    year: 0,
    startdate: '',
    enddate: ''
  }
  clicked_patients:boolean=false;
  cData_healthplan: any;
  cData_ipa: any;
  graphmraproductivity:any;
  chartLabels1: any = [];
  chartLabels2: any = [];
  body:any;
  pager: any = {};
   assurance_list: any;
  total_pages: number;
  custom: boolean = false;
 show_graph:boolean=false;
  // paramgraph={
  // 'startdate':'',
  // 'enddate':''

  // }
  showPagination: boolean = true;
 
  param = {
    'pageNumber': 1,
    'pageSize': 15,
    'name': 'team',
    'reporttype': '',
   'teamid':'',
    
    'report': false,
    'qaranking':false
  }
page: number = 1;
   IPAdate = {
    'startdate': '',
    'enddate': '',
    'month': '',
    'year': 0
  };
 bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  months2 = this.months;
  months3 = this.months;
  years: string[] = [];
  date: any;
  days: any;
 
  current_date = new Date();
  // current_month = this.authS.getDates().current_month;
  // previous_month = this.authS.getDates().previous_month;

    current_month = this.authS.getDates().current_month;
  previous_month = '02';
  current_year = this.authS.getDates().current_year;
// previous_month_full = 'February'
  previous_month_full = this.authS.getDates().previous_month_full;
  // current_year = this.authS.getDates().current_year;
  constructor(private router: Router,private mraService: MraService, public authS: AuthService,private commonService: CommonService,private pagerService: PagerService) {
   this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let user = JSON.parse(localStorage.getItem('currentUser'));
     this.maxDate.setDate(this.maxDate.getDate());
    this.bsValue.setDate(this.bsValue.getDate() -30);
    


}
 

  ngOnInit():void {
   this.date = {
      'month': this.previous_month,
      'year': this.current_year
    }
  this.checkMonth(this.current_year, '');
  this.getMraAuditDataCount() ;
  this.bsRangeValue = [this.bsValue, this.maxDate];
  this.maxDate.setDate(this.maxDate.getDate());
  this.bsValue.setDate(this.bsValue.getDate() -30);
  this.param['startdate'] = this.bsRangeValue[0];
    this.param['enddate'] = this.bsRangeValue[1];
    this.initializationtable();
    this.initializationgraph();
  }

 
  formatDate(name) {
    
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
    

    
    

    // new Date("2015-03-25");
  }
  checkMonth(selectedYear, name) {
    this.formatDate(name);

    if (selectedYear == this.authS.getDates().actual_year) {
      
        this.months.map((month) => {
          if (this.current_month == month.value) {
            this.months.splice(Number(month.value), 12)
          }
        })
      



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
    }
  }
   
       
  

   getMraAuditDataCount() 
   {
   
    this.mraService.getMraAuditDataCount(this.param).subscribe(results => {

    this.data_count=results;
    console.log(this.data_count)

    }, err => {});
  }

  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }
  getAllAssurance(resetPage) {
  // console.log(this.bsRangeValue);
  
   
    // console.log(this.bsRangeValue);
    // console.log(this.bsRangeValue);
    if(!this.custom){
      this.param['startdate'] = this.bsRangeValue[0];
    this.param['enddate'] = this.bsRangeValue[1];
    }
    // else{

    //   // this.bsRangeValue = [this.params['startdate'], this.params['enddate']];
    // }
 
  // console.log(this.params)
    // this.page=1;
    if (resetPage) {
      this.param['pageNumber'] = 1
      this.page = 1;
    }
    this.commonService.getAssuranceProductivity(this.param,"MRA").subscribe(results => {
      this.showPagination = true;
      this.body=results.body;
      console.log(this.body)
      //  console.log(results.headers.get('Content-Type'))
      // console.log(JSON.parse(results.headers.get('Paging-Headers')).totalCount)
     
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.assurance_list = results.body;

      this.setPages();
      // localStorage.removeItem('dashboard_date')
    }, err => {

    });
    this.graphproductivity();
  }
  initializationtable(){
  this.param['startdate'] = this.bsRangeValue[0];
    this.param['enddate'] = this.bsRangeValue[1];
    this.param.name="";
    this.param['teamid']=null;
     this.commonService.getAssuranceProductivity(this.param,"MRA").subscribe(results => {
      this.showPagination = true;
      this.body=results.body;
      console.log(this.body)
      //  console.log(results.headers.get('Content-Type'))
      // console.log(JSON.parse(results.headers.get('Paging-Headers')).totalCount)
     
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.assurance_list = results.body;
     
      this.setPages();
      // localStorage.removeItem('dashboard_date')
    }, err => {

    });
  }
patients(){
this.clicked_patients=true;
this.cData_healthplan
  let obj = {
  "startdate":this.param['startdate'],
  "enddate":this.param['enddate'],
  "teamid":this.param['teamid'],
  "name":"patients"
  }
  // this.barChartOptions.scaleLable.labelString="Total Patients"
  this.commonService.getGraphProducticityMraAudit(obj).subscribe(results=>{
   this.graphmraproductivity=results;
   this.data();
  },err=>{});console.log(this.clicked_patients)


}
  initializationgraph(){
  this.cData_healthplan
  let obj = {
  "startdate":this.param['startdate'],
  "enddate":this.param['enddate'],
  "teamid":null,
  "name":""
  }
  this.commonService.getGraphProducticityMraAudit(obj).subscribe(results=>{
   this.graphmraproductivity=results;
   this.data();},err=>{});

}
 
  graphproductivity()
  {
  this.clicked_patients=false;
this.show_graph= false;
    
  let obj = {
  "startdate":this.param['startdate'],
  "enddate":this.param['enddate'],
  "teamid":this.param['teamid'],
  "name":""
  }

  this.commonService.getGraphProducticityMraAudit(obj).subscribe(results=>{
   this.graphmraproductivity=results;
   console.log("gp"+JSON.stringify(this.graphmraproductivity));
   this.data();
  },err=>{});
  }
   data() {

    this.cData_healthplan = [];
    this.chartLabels2 =[];
    let m1 = [];
    let m2 = [];
    let m3 = [];
    let m4 = [];
    let m1Name; let m2Name; let m3Name;
    let hh = this.graphmraproductivity;
    m1Name = hh[0].teamgraph[2].monthname;
    m2Name = hh[0].teamgraph[1].monthname;
    m3Name = hh[0].teamgraph[0].monthname;
    for (let i = 0; i < hh.length; i++) {

    m1.push(parseFloat(hh[i].teamgraph[2].totalcount).toFixed(2))
      m2.push(parseFloat(hh[i].teamgraph[1].totalcount).toFixed(2))
      m3.push(parseFloat(hh[i].teamgraph[0].totalcount).toFixed(2))
      this.chartLabels2.push(hh[i].teamgraph[i].teamname)
    }
    // this.chartLabels2 = m4;
console.log(this.chartLabels2);
    this.cData_healthplan = [
      { data: m1, label: m1Name },
      { data: m2, label: m2Name },
      { data: m3, label: m3Name }
    ];
    // array.map(item => item.age)
    //  .filter((value, index, self) => self.indexOf(value) === index)
    console.log("fsfsf"+this.cData_healthplan)
   this.show_graph = true;
  }
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
          labelString: 'Total Conditions',
          fontSize: 14
        }
      }],
      xAxes: [{

        scaleLabel: {
          display: true,
          labelString: 'Team Name',
          fontSize: 14
        }
      }]
    }


  };
   public barChartOptions1: any = {
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
          labelString: 'Total Patients',
          fontSize: 14
        }
      }],
      xAxes: [{

        scaleLabel: {
          display: true,
          labelString: 'Team Name',
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
  public barChartType = 'bar';
  public barChartLegend = true;
    public barChartData: any[] = this.cData_healthplan;
}
