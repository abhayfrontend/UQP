import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { MraService } from '../../../services/mra.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PagerService } from '../../../services/pager.service';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
@Component({
  selector: 'app-overall-provider',
  templateUrl: './overall-provider.component.html',
  styleUrls: ['./overall-provider.component.scss']
})
export class OverallProviderComponent implements OnInit {
  isMeridian = false;
  readonly = true;
  rolename: string;
  roleid: any;
  maxDate = new Date();
  openfollowupnote: boolean = false;
  showPanel: boolean = true;
  showPanela: boolean = true;
  provider_name: string;
  provider_label: string;
  members: any;
  membersa: any;
  searching: boolean = false;
  searchinga: boolean = false;
  selectedMonth: string;
  insurance_list: any;
  years: string[] = [];
  healthplan_data: any;
  current_date = new Date();
  providerida: any;
  response: any;
  ipa_data: any;
  mytime: Date = new Date();
  showDates: boolean = false;
  providerid: any;
  healthplandate = {



  };
  IPAdate = {
    'startdate': '',
    'enddate': '',
    'month': '',
    'year': 0
  };

  doe: boolean = false;
  pager: any = {};
  noteid: any;
  total_pages: number;
  params: any = {
    'pageNumber': 1,
    'pageSize': 15,

    'followupdays': null,
    'dateentered': null,
    'procedure_performed': null,
    'discussion_with': null,
    'notes': null,
    'followupdate': null,
    'responsible_party': null,
    'minutes': 0,
    'importance': null,
    'followuptime': 0,
    'assignedto': ''

  };
  hpscorecard: any = { 'id': '' };
  showevrything: boolean = false;
  notes_list: any;
  healthplans: any;
  currentUser: any;
  currentId: any;
  cid: any;
  page: number = 1;
  currentRole: string;
  provider = {
    providerid: 0,

    healthplanid: 0,
    month: '',
    year: '',
    startdate: '',
    enddate: ''
  }
  @ViewChild('healthcard') public healthmodal: ModalDirective;
  checkvalidity: boolean = false;
  days: any;
  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month;
  previous_month_full = this.authS.getDates().previous_month_full;
  current_year = this.authS.getDates().current_year;
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


  constructor(public authS: AuthService, private router: Router, private userService: UserService, private commonService: CommonService, private pagerService: PagerService, private mraService: MraService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.params.userid = user.userid;
    this.params.name = user.name;
    this.currentRole = this.authS.getCurrentRole(user.roleid);
    this.getCurrentId(user);
    this.params.firstname = this.params.name.split(' ').slice(0, -1).join(' ');
    this.params.lastName = this.params.name.split(' ').slice(-1).join(' ');
    console.log()
  }


  ngOnInit() {
    //year logic
    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }
    //check if provider is entering then get details a/c to that provider
    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    //checking user roles
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
    this.healthplandate['year'] = this.current_year;
    this.checkMonth(this.provider.year)
    //case when provider search is done on dashboard
    if (this.currentUser.root_exec) {
      this.provider_name = this.currentUser.officestaff_providername
    }

  }
  //search provider for outside block

  searchProvider() {

    if (this.provider_name.length > 2) {
      this.showPanel = true;
      this.searching = true;
      this.userService.search_provider(this.provider_name).subscribe(
        res => {
          this.members = res;
          this.searching = false;
          this.providerid = this.members[0].id;
          console.log(this.providerid)

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
  //search provider for modal
  searchProviders() {

    if (this.params.assignedto.length > 2) {
      this.showPanela = true;
      this.searchinga = true;
      this.userService.search_provider(this.params.assignedto).subscribe(
        res => {
          this.membersa = res;
          this.searchinga = false;
          this.providerida = this.membersa[0].id;


        },
        err => {
          this.searchinga = false;
        }
      )
    }
    if (this.params.assignedto.length == 0) {
      this.membersa = [];
      this.showPanela = false;
    }

  }
  //date logic
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
    this.IPAdate.startdate = this.IPAdate.year + '-' + this.IPAdate.month + '-01';
    this.IPAdate.enddate = this.IPAdate.year + '-' + this.IPAdate.month + '-' + this.days;
  }

  getMraHealthplanCount() {
    this.cid = this.currentId;
    this.healthplandate['year'] = this.provider.year;
    this.mraService.getMraHealthplanCount(this.healthplandate, 'provider', this.provider.providerid).subscribe(results => {

      this.healthplan_data = results;
      console.log(this.healthplan_data)


    }, err => {
    });
  }


  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }
  //pager service function
  loadByPage(page_number: number) {
    page_number = Number(page_number);
    if (page_number < 1 || page_number > this.pager.total_pages) {
      return;
    }
    page_number = Number(page_number);
    this.page = page_number;
    // console.log("Page"+this.page)
    // console.log("Page numbe"+page_number)
    this.params['pageNumber'] = this.page

    // window.scrollTo(0, 200);
  }
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
  getInsurancea(member) {
    this.showPanela = false;
    this.searchinga = true;
    this.params.assignedto = member.LastName + " " + member.FirstName;
    this.providerida = member.id;
    this.commonService.getInsurance(member.id
    ).subscribe(results => {

      this.insurance_list = results;
      if (this.insurance_list.length > 0) {
        this.checkvalidity = true;
      } else {
        this.checkvalidity = false;
      }
      this.searchinga = false;
    }, err => {
      this.searchinga = false;
    });
  }
  userida() {
    this.params.userid = this.currentUser.userid;
    this.params.name = this.currentUser.name;
    this.params.firstname = this.params.name.split(' ').slice(0, -1).join(' ');
    this.params.lastName = this.params.name.split(' ').slice(-1).join(' ');
    // minutes
    this.params.providerid = this.provider.providerid;
  }
  getScorecard() {
    this.provider_label = this.provider_name;
    this.params.dateentered = new Date();
    this.showevrything = true;
    this.getoveralldetails();

    this.getHealthplanCount();
    this.overallproscore();
    this.getMraHealthplanCount();
  }
  getoveralldetails() {
    this.commonService.getoverallprovidercarddetails(this.provider).subscribe(results => {
      this.response = results;
    }, err => { });
  }
  //opening note dialogue
  addnote(type) {
    this.openfollowupnote = false;
    console.log(this.maxDate)
    if (type == 'followup') {
      this.openfollowupnote = true;
    }


    this.params = {
      'pageNumber': 1,
      'pageSize': 15,
      'report': true,
      'followupdays': null,
      'dateentered': null,
      'procedure_performed': null,
      'discussion_with': null,
      'notes': null,
      'followupdate': null,
      'responsible_party': null,
      'importance': null,
      'followuptime': 0,
      'minutes': 0,

      'assignedto': ''
    };
    this.userida();

    this.healthmodal.show();
  }
  //checking for current id
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
  } hidePanel() {
    setTimeout(() => { this.showPanel = false }, 200)
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
  getHealthplanCount() {

    this.commonService.getHealthplanCount(this.provider, 'provider', this.provider.providerid).subscribe(results => {

      this.ipa_data = results;


    }, err => {
    });
  }
  //remove group
  removegroup(id) {
    console.log(id)
    this.commonService.removenote(id).subscribe(results => { }, err => { });
    this.overallproscore();
  }
  //date logic
  folowupDate() {
    var dateadder = Number(new Date()) + this.params.followupdays * 86400000
    var date = new Date(dateadder).toLocaleDateString()
    console.log(date)

    this.params.followupdate = date;




  }

  sendparam() {

    this.params.dateentered = new Date();
    this.params.providerid = this.provider.providerid;
    this.params.assignedto = this.provider_name;
    this.commonService.overallscorenote(this.params).subscribe(results => {
      this.healthmodal.hide();
      this.openfollowupnote = false;
      this.overallproscore();
    }, err => { });

  }
  storeMraHpScorecard(healthplan) {
    this.healthplandate['startdate'] = this.provider.year + '-' + this.provider.month + '-01';
    this.healthplandate['enddate'] = this.provider.year + '-' + this.provider.month + '-' + this.days;
    this.healthplandate['month'] = this.provider.month;
    this.healthplandate['year'] = this.provider.year;
    this.hpscorecard = { ...this.healthplandate }
    this.hpscorecard['id'] = healthplan.HealthplanId;
    this.hpscorecard['healthplanName'] = healthplan.HealthplanName;
    this.hpscorecard['providerid'] = this.provider.providerid;
    if (this.provider_name) {
      localStorage.setItem('provider_name', this.provider_name);
    } else {
      localStorage.removeItem('provider_name')
    }
    this.hpscorecard['type'] = 'overallproviderscorecard';
    localStorage.setItem('MrahpScorecard', JSON.stringify(this.hpscorecard))
  }


  //storing data in localstorage for clickables
  storeHpScorecard(healthplan) {
    this.healthplandate['startdate'] = this.provider.year + '-' + this.provider.month + '-01';
    this.healthplandate['enddate'] = this.provider.year + '-' + this.provider.month + '-' + this.days;
    this.hpscorecard = { ...this.healthplandate }
    this.hpscorecard['id'] = healthplan.plancard.hpid;
    this.hpscorecard['healthplanName'] = healthplan.plancard.healthplan;
    this.hpscorecard['providerid'] = this.provider.providerid;
    this.hpscorecard['name'] = this.provider_name;
    this.hpscorecard['month'] = this.provider.month;
    this.hpscorecard['year'] = this.provider.year;
    this.hpscorecard['type'] = 'overall';
    if (this.provider_name) {
      localStorage.setItem('provider_name', this.provider_name);
    } else {
      localStorage.removeItem('provider_name')
    }
    localStorage.setItem('hpScorecard', JSON.stringify(this.hpscorecard))
  }
  //getting overall provider score data
  overallproscore() {
    let data = {
      'providerid': this.provider.providerid,
      'pagenumber': 1,
      'pagesize': 15,
    }

    this.commonService.overallproviderscorecard(data).subscribe(results => {
      this.notes_list = results;

    }, err => { });
  }
  //opening modal
  openfollow(x) {
    this.openfollowupnote = true;
    this.params = x;

    this.params['noteid'] = x.id;

    this.healthmodal.show();
  }
  //submitting modal data
  addfolowup() {
    this.params.dateentered = new Date();
    this.params['followupminutes'] = this.params.followuptime;
    this.params['followupcomment'] = this.params.responsible_party;
    this.commonService.overallfollowup(this.params).subscribe(results => {
      this.overallproscore();
      this.healthmodal.hide();
    }, err => { });
  }

}
