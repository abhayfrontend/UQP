import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { MraService } from '../../../services/mra.service';
// converting html to canvas and then pdf
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

import * as $ from 'jquery';

declare var Gauge; declare var Donut;
@Component({
  selector: 'app-mra-dashboard',
  templateUrl: './mra-dashboard.component.html',
  styleUrls: ['../dashboard.component.scss']
})
export class MraDashboardComponent implements OnInit {

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
  showPiegraph: boolean = false;
  provider_showPiegraph: boolean = false;
  showIPAgraph: boolean = false;
  cData_healthplan: any;
  cData_ipa: any;

  chartLabels1: any = [];
  chartLabels2: any = [];
  total_gaps: any;
  total_nc: any;
  total_c: any;
  total_pending: any;
  prevMonthGaps: any;
  showGapCard: boolean = true;

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
    'year': 0
  };
  //IPA date
  IPAdate = {
    'startdate': '',
    'enddate': '',
    'month': '',
    'year': 0
  };

  userRolePerm_ACO:any;
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
  years: string[] = [];
  date: any;
  days: any;
  current_date = new Date();
  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month;
  previous_month_full = this.authS.getDates().previous_month_full;
  current_year = this.authS.getDates().current_year;
  totalpatients:any;
  missedhcc:any;
  deletions:any;
  hcc:any;

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
  ipa_list_by_month:any;
  tooltip_html:any;
 mraproductivityresults:any;
  // pie chart data
  MraMemberScores:any;
  pie_labels: string[] = [];
  pie_scores: number[] = [];
  piecharthpid: number = 0;

  //provider pie chart data
  MraProviderScores:any;
  provider_pie_labels: string[] = [];
  provider_pie_scores: number[] = [];
  provider_piecharthpid: number = 0;


  //top and bottom performers
  top_performers:any;
  bottom_performers:any;
  officestaff_providername:string;
  userRolePerm: any;
  userRolePerm_HEDIS:any;
  population_range:any = {
    "mintoppopulation":0,
    "maxtoppopulation":30,
    "minbottompopulation":0,
    "maxbottompopulation":30
  };
  constructor(private commonService: CommonService, private userService: UserService,
   public authS: AuthService, private router: Router, private mraService: MraService,private cdRef:ChangeDetectorRef) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let user = JSON.parse(localStorage.getItem('currentUser'));

    this.getCurrentId(user);
    this.currentRole = this.authS.getCurrentRole(user.roleid);
    if(this.currentUser.rolename == 'Office Staff'){
      this.officestaff_providername = this.currentUser.officestaff_providername;
    }
      if(this.currentRole == 'member'){
    this.router.navigate(['/dashboard/member']);
  }else if(this.currentRole == 'audit'){
    this.router.navigate(['/dashboard/quality-audit']);
  }
    if (this.currentRole == 'undefined') {
      this.router.navigate(['/user/401']);
    }





  }
  ngOnInit(): void {
    this.getAllIPA();
    this.userRolePerm = this.authS.getPermission('MRA Dashboard');
    this.userRolePerm_HEDIS = this.authS.getPermission('Hedis Dashboard');
    this.userRolePerm_ACO = this.authS.getPermission('ACO Dashboard');

    document.querySelector('body').classList.add('aside-menu-hidden');
    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }

    this.date = {
      'month': this.previous_month - 1,
      'year': this.current_year
    }
    // this.healthplandate.month = this.IPAdate.month = this.previous_month;
    this.healthplandate.year = this.IPAdate.year = this.current_year;
    this.provider.year = this.current_year;
    this.provider.month = this.previous_month;

    this.checkMonth(this.current_year, '');
    //customized check for provider December
    // this.checkMonth(this.provider.year, 'provider')


    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;
    this.dashboard.startdate = this.params.startdate;
    this.dashboard.enddate = this.params.enddate;


    if (this.currentRole == "provider") {
      this.provider.providerid = this.currentId;
      localStorage.setItem('provider_name', this.currentUser.name);
      this.commonService.getInsurance(this.currentId
      ).subscribe(results => {
        this.insurance_list = results;

      }, err => {

      });
    } else if(this.currentRole == "executive"){
      this.getAllHealthplans();
    }else if (this.currentRole == "ipa") {
      this.provider.ipaid = this.currentId;

      this.commonService.getInsuranceByIpa(this.provider.ipaid
      ).subscribe(results => {
        this.insurance_list = results;
      }, err => {

      });
    


    }else if (this.currentRole == "qa") {
      this.params['userid'] = this.currentUser.userid;
    }else if(this.currentRole == "healthplan"){
      this.provider_piecharthpid = this.currentUser.healthplanid;
    }
    if (this.currentRole !== "provider" && this.currentRole !== "ipa") {
      this.getAllHealthplans();
    }
    this.getIpaByDate();
    this.getDataCount();
    this.getMraHealthplanCount();
    this.getMraMemberScores();
    this.getMraProviderScores(); 
    if(this.currentRole=='qa'){
    this.mraproductivityqa();
  }
    // this.getGapsCount()
  }
  // getCurrentRole(role){

  //   let roleCase = role.toLowerCase();
  //   if(roleCase.includes("executive")){
  //     this.currentRole = "executive"
  //   }else if(roleCase.includes("provider")){
  //     this.currentRole = "provider";

  //   }else if(roleCase.includes("ipa")){
  //     this.currentRole = "ipa"
  //   }else if(roleCase.includes("healthplan")){
  //     this.currentRole = "healthplan"
  //   }else{
  //     this.currentRole = "executive"
  //   }
  // }
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
    // //When quality ssurance role comes then we have to fetch id from userid
    // if(user.roleid == 3){
    //   this.currentId = user.userid;
    // }
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

  getAllIPA() {
    this.commonService.getAllIPA().subscribe(results => {

      this.ipa_list = results;
    }, err => {

    });
  }

    getIpaByDate() {
      let current_date = {
        'startdate':this.dashboard.startdate ,
        'enddate':this.dashboard.enddate
      }
    this.commonService.getIpaByDate(current_date).subscribe(results => {
      this.ipa_list_by_month = results.body;
    }, err => {

    });
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

  storeMraHpScorecard(healthplan) {

    this.hpscorecard = { ...this.healthplandate }
    this.hpscorecard['id'] = healthplan.HealthplanId;
    this.hpscorecard['healthplanName'] = healthplan.HealthplanName;
    // this.selectedMonth = localStorage.getItem('selectedMonth');
    //   this.healthplanName =  localStorage.getItem('healthplanName');
    localStorage.setItem('MrahpScorecard', JSON.stringify(this.hpscorecard))
  }

  // storeIpaScorecard(ipa) {

  //   this.ipascorecard = { ...this.IPAdate }
  //   this.ipascorecard['id'] = ipa.plancard.hpid;
  //   this.ipascorecard['ipaName'] = ipa.plancard.healthplan;
  //   this.ipascorecard['hpid'] = 0;
  //   this.ipascorecard['healthplanName'] = 'ALL';
  //   localStorage.setItem('ipaScorecard', JSON.stringify(this.ipascorecard))
  // }

  // storeGapScorecard(gap) {
  //   this.gapscorecard = { ...this.provider }
  //   this.gapscorecard['mid'] = gap.measureid;
  //   this.gapscorecard['mname'] = gap.measname;
  //   this.gapscorecard['pname'] = this.provider_name;
  //   localStorage.setItem('gapScorecard', JSON.stringify(this.gapscorecard))
  // }
  storeDashboardDate(date) {
    localStorage.setItem('dashboard_date', JSON.stringify(date))
  }

  storeDashboardQAgaps(status){
    localStorage.setItem('qaStatus', status);

  }

  mraproductivityqa(){

   
      this.params['userid']=this.currentUser.userid;
    
      this.params['pageNumber'] = 1;
      this.params['pageSize'] = 15;
       this.commonService.getAssuranceProductivity(this.params,"MRA").subscribe(results =>{
         console.log(results.body);
       this.mraproductivityresults=results.body[0]
       },err=>{});
    

  }//this is for new mradashboard quality assuramnce

  //change in membership counts from last month clickable from dashboard to membership roster
  storeMemberAge(name){
    localStorage.setItem('memberagefilter', name);
    this.router.navigate(['/reports/membership-roster']);
  }

  storeGaugechanges(name, id){
    localStorage.setItem('memberchangevalue', name);
    localStorage.setItem('gaugeHpId', id);
    this.router.navigate(['/reports/membership-roster']);
  }
  getDataCount() {
    if(this.currentUser.officetype){
      let idArr = [];
      this.currentUser.officetype.map((staff) => {
        idArr.push(staff.User_ProviderId)
      })
      this.params['officetype'] = idArr;
      // this.provider['officetype'] = idArr;
    }

    if(this.currentUser.roleid == 3){
      this.commonService.getDataCount(this.params, this.currentRole, this.currentUser.userid).subscribe(results => {
      // alert($("[id*='thisIsAnId" + i+ "']"));

      this.data_count = results;
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



      this.membership_count = this.data_count.healthplan;
      //below line checks if the view is binded and after taht 
      // gauge options is called, this solves the problem of Cannot read property 'getContext' of null
      this.cdRef.detectChanges();
      this.gaugeOptions();
    }, err => {
    });
    }else{
      this.commonService.getDataCount(this.params, this.currentRole, this.currentId).subscribe(results => {
      // alert($("[id*='thisIsAnId" + i+ "']"));

      this.data_count = results;
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



      this.membership_count = this.data_count.healthplan;
      //below line checks if the view is binded and after taht 
      // gauge options is called, this solves the problem of Cannot read property 'getContext' of null
      this.cdRef.detectChanges();
      this.gaugeOptions();
    }, err => {
    });
    }
    
  }

  getMraHealthplanCount() {
    this.formatDate('healthplan');
    this.mraService.getMraHealthplanCount(this.healthplandate, this.currentRole, this.currentId).subscribe(results => {

      this.healthplan_data = results;
      this.chartLabels2.length = 0;
      this.data()

    }, err => {
    });
  }

  getMraMemberScores() {
    this.mraService.getMraMemberScores(this.currentRole, this.piecharthpid, this.currentId, this.population_range).subscribe(results => {

      this.MraMemberScores = results.piechartlist;
      this.top_performers = results.topperformerslist;
      this.bottom_performers = results.bottomperformerslist;
      this.datapie();
      // this.chartLabels2.length = 0;
      // this.data()

    }, err => {
    });
  }

    getMraProviderScores() {
    this.mraService.getMraProviderScores(this.provider_piecharthpid).subscribe(results => {

      this.MraProviderScores = results;
      this.provider_datapie();
      // this.chartLabels2.length = 0;
      // this.data()

    }, err => {
    });
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
    } else if (name == 'healthplan') {

      // this.months.map((month) => {
      //   if (this.healthplandate.month == month.value) {
      //     // this.selectedMonth = month.full;
      //     if (month.value == '02' && this.healthplandate.year % 4 == 0) {
      //       this.days = '29';
      //     } else {
      //       // console.log(month.value)
      //       this.days = month.days;
      //     }

      //   }
      // });
      // this.healthplandate.startdate = this.healthplandate.year + '-' + this.healthplandate.month + '-01';
      // this.healthplandate.enddate = this.healthplandate.year + '-' + this.healthplandate.month + '-' + this.days;
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

  
  data() {
    let m1 = [];
    let m2 = [];

    let m1Name; let m2Name;
    let hh = this.healthplan_data;
    m1Name = "Current Score";
    m2Name = "Projected Score";

    for (let i = 0; i < hh.length; i++) {

 m1.push(parseFloat(hh[i].CurrentScore).toFixed(2));
      m2.push(parseFloat(hh[i].ProjectedScore).toFixed(2));
      this.chartLabels2.push(hh[i].HealthplanName.toLowerCase()
        .replace(/ .*/, '').replace(/\b./g, function(a) { return a.toUpperCase(); }))
    }
    // this.chartLabels2 = m4;

    this.cData_healthplan = [
      { data: m1, label: m1Name },
      { data: m2, label: m2Name },
    
    ];
    // array.map(item => item.age)
    //  .filter((value, index, self) => self.indexOf(value) === index)
    this.showHealthplangraph = true;
  }

  datapie(){
    this.pie_labels = [];
    this.pie_scores = [];
  	for (let i = 0; i < this.MraMemberScores.length; i++) {
      this.pie_labels.push(this.MraMemberScores[i].interval)
      this.pie_scores.push(this.MraMemberScores[i].projectedcount)
    }
    this.showPiegraph = true;
  }

    provider_datapie(){
      this.provider_pie_labels = [];
      this.provider_pie_scores = [];
      console.log(this.MraProviderScores);
      for (let i = 0; i < this.MraProviderScores.length; i++) {
        this.provider_pie_labels.push(this.MraProviderScores[i].interval)
        this.provider_pie_scores.push(this.MraProviderScores[i].projectedcount)
      }
      this.provider_showPiegraph = true;
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

 providerperformancedata(item): void {


      let provider_performance_data = {
        "year": this.current_year,
        "type": "currentscore",
        "providerid": item.ProviderId,
        "hpid": this.piecharthpid,
        "providername":item.FirstName+" "+item.LastName

      }
      localStorage.setItem("providerperformancedata",JSON.stringify(provider_performance_data));
      this.router.navigate(['/reports/mra/members']);
    
  
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

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,

   

    scales: {
      yAxes: [{
        ticks: {
          min: 0, stepValue: 1, max: 5, fixedStepSize: 1


        },
        scaleLabel: {
          display: true,
          labelString: 'Score',
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
  public pieChartOptions:any={
    
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


  // Pie
  public pieChartLabels: string[] = this.pie_labels;
  public pieChartData: number[] = this.pie_scores;
  public pieChartType = 'pie';


  // events
public chartClicked(e: any, name): void {
  if (e.active.length > 0) {
    const chart = e.active[0]._chart;
    const activePoints = chart.getElementAtEvent(e.event);
    if ( activePoints.length > 0) {
      // get the internal index of slice in pie chart
      const clickedElementIndex = activePoints[0]._index;
      const label = chart.data.labels[clickedElementIndex];
      // get value by index
      const value = chart.data.datasets[0].data[clickedElementIndex];
      let piechartdata = {
        "year": this.current_year,
        "type": "currentscore",
        "range": label,
        "hpid": this.piecharthpid
      }
      localStorage.setItem("piechartdata",JSON.stringify(piechartdata));
      if(name == 'member'){
        localStorage.setItem("piechartdata",JSON.stringify(piechartdata));
        this.router.navigate(['/reports/mra/members']);
      }else{
        piechartdata.hpid = this.provider_piecharthpid;
        localStorage.setItem("piechartdata",JSON.stringify(piechartdata));
        this.router.navigate(['/reports/mra/providers']);
        // console.log("provider");
      }
      
    }
  }
}

  public chartHovered(e: any): void {
    console.log(e);
  }

  public barChartLabels: string[] = ['Coventry', 'Freedom', 'Humana', 'Optimum', 'Ultimate', 'Wellcare'];
  public barChartLabels1: string[] = ['Access', 'Physicians', 'American', 'Primecare', 'Qualcare', 'Unity'];

  // public barChartLabels1: string[] = ['Access 2 Health Care Llc', 'Access 2 Health Care Physicians Llc', 'All American Ipa, Llc', 'Primecare, Llc', 'Qualcare Medical Llc', 'Unity Healthcare Llc'];

  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = this.cData_healthplan
}
