import { Component, OnInit } from '@angular/core';
import { AcoService } from '../../../services/aco.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-aco-dashboard',
  templateUrl: './aco-dashboard.component.html',
  styleUrls: ['./aco-dashboard.component.scss']
})
export class AcoDashboardComponent implements OnInit {
aco_pie_scores: number[] = [];
aco_pie_labels: string[] = [];
AcoPieScore:any;
acogapdata:any;
acoproviderdata:any;
acodatacard:any; 
 provider_name: string;
measurecompliance:any;
currentUser: any;
members: any;
days:any;
lowestcompliancedata:any;
provider = {
 
  providerid: 0,
  npi:null
  
}
date: any= {
  // 'month':this.current_month,
  'month': "",
  'year': ""
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
years: string[] = [];
aco_showPiegraph:boolean=true;
total_gaps:any;
searching: boolean = false;
showPanel: boolean = true;
total_numerator:any;
current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month;
total_denominator:any;
total_pending:any;
userRolePerm_ACO:any;
userRolePerm:any;
userRolePerm_HEDIS:any;
params={
	'startdate':''
 
}


 
        current_year = this.authS.getDates().current_year;
        
  constructor(private acoService: AcoService,private userService: UserService,public authS: AuthService) {
   this.currentUser = JSON.parse(localStorage.getItem('currentUser')); }

  ngOnInit() {
    this.userRolePerm = this.authS.getPermission('MRA Dashboard');
    this.userRolePerm_HEDIS = this.authS.getPermission('Hedis Dashboard');
    this.userRolePerm_ACO = this.authS.getPermission('ACO Dashboard');
  	this.params.startdate = this.current_year + '-' + this.current_month + '-01';
    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }
    this.date = {
      'month': this.previous_month,
      'year': this.current_year
    }
    this.checkMonth(this.current_year)
  	this.getDataCard()
  	this.getPieData();
  	this.getTotalgaps();
  	this.getTotalprovidergaps();
    this.getLowestCompliance();
     this.getAcoSummary();
  }
  //pie chart data
  getPieData()
  {
    let paramfordatacard={
  'quarter':'2018 04 Q',
  'name':'executive'
}
  	this.acoService.getAcoPieData(paramfordatacard).subscribe(results=>{
  this.AcoPieScore=results;
  setTimeout(() => {
    this.aco_datapie();
  }, 500);
   
  	},err=>{});
  }
   public pieChartOptions:any={
    
  };
  public pieChartType = 'pie';
    public chartHovered(e: any): void {
    console.log(e);
  }
  //aco pie chart data
   aco_datapie(){
  
      this.aco_pie_labels = [];
      this.aco_pie_scores = [];
      let a = [];
      let b = [];
      for (let i = 0; i < this.AcoPieScore.length; i++) {
        a.push(this.AcoPieScore[i].countyname)
        b.push(this.AcoPieScore[i].count)
      }
      console.log(this.aco_pie_labels);
      console.log(this.aco_pie_scores);
      setTimeout(() => {
        this.aco_pie_labels = a;
        this.aco_showPiegraph = true;
      });
      this.aco_pie_scores = b;
      
    }
    getTotalgaps()
    {
    	this.acoService.getAcoTotalGapsByGroup('GroupID',this.params).subscribe(results=>{
   this.acogapdata=results;
    	},err=>{});
    }
    //provider search
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
        this.provider.npi=null;
      
        this.members = [];
        this.showPanel = false;
      }
  
    }
    //storing data in local storage
    storeDataCardGroup()
    {
     
      localStorage.setItem('acogroup','data')
    }
    getInsurance(member) {
      this.showPanel = false;
      // this.searching = true;
      this.provider_name = member.FirstName + " " + member.LastName;
      this.provider.providerid = member.id;
      this.provider.npi=member.providerno;
      // this.commonService.getInsurance(member.id
      // ).subscribe(results => {
  
      //   this.insurance_list = results;
      //   this.searching = false;
      // }, err => {
      //   this.searching = false;
      // });
    }
    //month functionality
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
    getTotalprovidergaps()
    {
    	this.acoService.getAcoTotalGapsByGroup('ProviderNPI',this.params).subscribe(results=>{
   this.acoproviderdata=results;
    	},err=>{});
    }

    getDataCard()
    {
      let paramfordatacard={
  'quarter':'2018 04 Q',
  'name':'executive'
}
    	this.acoService.getAcoDashboardCardData(paramfordatacard).subscribe(results=>{
       this.acodatacard=results;
    	},err=>{});
    }

    getLowestCompliance()
    {
      let data={
        'name':'lowestcompliance',
        'startdate':this.params.startdate
      }
      this.acoService.getAcoLowestCompliance(data).subscribe(results=>{
        this.lowestcompliancedata=results;
      },err=>{});
    }
    getAcoSummary()
    {
      this.checkMonth(this.current_year);

      let data={
       'startdate': this.date.year + '-' + this.date.month + '-01',
       'providerid':this.provider.providerid,
       'npi':this.provider.npi,
  
    'enddate':this.date.year + '-' + this.date.month + '-' + this.days
       
      };
      this.acoService.getAcoSummaryData(data).subscribe(results=>{
        this.measurecompliance=results;
         this.total_gaps = this.measurecompliance.map(item => item.gaps).reduce((prev, next) => prev + next);
        this.total_numerator = this.measurecompliance.map(item => item.num).reduce((prev, next) => prev + next);
        this.total_denominator = this.measurecompliance.map(item => item.den).reduce((prev, next) => prev + next);
        this.total_pending = this.measurecompliance.map(item => item.totalpending).reduce((prev, next) => prev + next);
      },err=>{});
    }
    storeACODetails(mid, mname, type){
      console.log(mid, mname, type);
      
      let temp = {
         mid, mname, type
      }
      let ACO_Gap_Details = {...this.date, ...this.provider, ...temp, 'provider_name':this.provider_name, 'groupid': ""}
      localStorage.setItem('ACO_Gap_Details', JSON.stringify(ACO_Gap_Details));
     
      
  
    }
    groupDash(){
      let paramfordatacard={
        'quarter':'2018 04 Q',
        'name':'dashboardprovider'
      }
      localStorage.setItem('ACO_Gap_Details', JSON.stringify(paramfordatacard));
    }
    providerDash(){
      let paramfordatacard={
        'quarter':'2018 04 Q',
        'name':'dashboardprovider'
      }
      localStorage.setItem('ACO_Provider_Details', JSON.stringify(paramfordatacard));
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
      });}


      

}
