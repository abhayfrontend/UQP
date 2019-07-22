import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-last-visit',
  templateUrl: './last-visit.component.html',
  styleUrls: ['./last-visit.component.scss']
})
export class LastVisitComponent implements OnInit {
  search_category: string = '';
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;

  provider_name: string;
  provider_id: number;
  ipa_list: any;
  insurance_list: any;



	search_text: string;
  members: any;
  member_list: any
  showPanel: boolean = true;
  page: number = 1;
	pager: any = {};
	total_pages: number;
	showPagination: boolean = true;

  // search_category:string='';
  healthplanName: string = 'All';
  notvisit:boolean = false;
  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'startdate': '',
    'enddate': '',
    'providerid': 0,
    'healthplanid': 0,
    'subsId': '',
    'membername': '',
    'lastvisit':true,
    'sort_name':'',
    'sort_date':''
  }

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
  date: any;
  days: any;
  current_date = new Date();
  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month;
  current_year = this.authS.getDates().current_year;
  selectedItem: any;
  address_list: any;
  healthplan_list:any;
currentRole:any;
     itemList = [];
  selectedItems = [];
  settings = {};
  @ViewChild('term') input: ElementRef;
  constructor(public authS: AuthService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService,
    private pagerService: PagerService,
    private userService: UserService) {
let user = JSON.parse(localStorage.getItem('currentUser'));
    this.currentRole = this.authS.getCurrentRole(user.roleid);
     }

  ngOnInit() {
    this.getProviders("healthplan");
    this.getAllHealthplans();
      this.settings = {
      singleSelection: false,
      text: "Select Providers",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      labelKey: 'providername',
      primaryKey: 'providerid',
      classes: "mb-sm-0 col-md-3"
    };

    for (let year = Number(this.current_year); year > 2018; year -= 1) {
      this.years.push(year.toString());
    }

    //check if provider is entering then get details a/c to that provider
    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    if (this.rolename == 'provider') {
      this.params.providerid = this.roleid;
      this.commonService.getInsurance(this.roleid
      ).subscribe(results => {

        this.insurance_list = results;
      }, err => {
      });
    }

    this.date = {
      // 'month':this.current_month,
      'month': this.previous_month,
      'year': this.current_year
    }
    this.checkMonth(this.current_year)
    // get all members on init
   
  }


  // selectFacility(id, i) {
  //   let selectedItem = this.member_list[i].address.find((item) => item.facilityid == id);
  //   this.member_list[i].phoneno = selectedItem.phoneno;
  //   this.member_list[i].fax = selectedItem.fax;
  //   this.member_list[i].county = selectedItem.county;
  // }
    onItemSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedItems);
    // this.params.measureid.push(item.id)
  }
  OnItemDeSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  onDeSelectAll(items: any) {
    // console.log(items);
  }
  // Format and check date and year
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
    });
    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;

  }

  resetFilters(){
    this.selectedItems = [];
    this.provider_name = '';
    if (this.rolename != 'provider') {
      this.params.providerid =  0;
    }
    this.params['dob']='';
    this.params.healthplanid =  0;
    this.input.nativeElement.value = "";
    this.params['membername'] = '';
    this.params['subsId'] = '';
    this.params.sort_name == '';
    this.params.sort_date == '';
    this.search_category='';
    this.date = {
      // 'month':this.current_month,
      'month': this.previous_month,
      'year': this.current_year
    }
    this.formatDate();
    this.getAllMembers(true);
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

  sorting(type){
  if(type == 'name'){
    if(this.params.sort_name == ''){
      this.params.sort_name = "asc";
    }else if(this.params.sort_name == 'asc'){
      this.params.sort_name = 'Desc';
    }else if(this.params.sort_name == 'Desc'){
      this.params.sort_name = 'asc';
    }
    this.params.sort_date = '';
  }else{
    if(this.params.sort_date == ''){
      this.params.sort_date = "asc";
    }else if(this.params.sort_date == 'asc'){
      this.params.sort_date = 'Desc';
    }else if(this.params.sort_date == 'Desc'){
      this.params.sort_date = 'asc';
    }
    this.params.sort_name = '';
  }
  this.getAllMembers(true);
}

  // search(term) {
  //   // this.checkCategory(term)
  //   this.params['providername'] = term;
  //   if (term.length > 2) {

  //     this.getAllMembers(true);

  //   } else if (term.length == 0) {

  //     this.getAllMembers(true);
  //   }
  // }

  //Excel report configurations
  getReport(type) {
    // this.provider.type=type;
    //   this.provider.report = true;
    let reportDetails = {
      'providername': this.provider_name,
      'healthplanname': this.healthplanName,
      //   'selectedmonth':this.selectedMonth,
      'type': type,
      'report': true
    }
    // var obj = Object.assign(this.provider);
    var reportParams = { ...this.params, ...reportDetails };
    let arr = [];
     this.selectedItems.map((i) => {
      arr.push(i.providerid)
    })
     if (this.rolename == 'provider') {
      arr = [ this.roleid]
    }
    // console.log(obj)/
    this.commonService.getMasterReport(reportParams, 'LastVisitReport',arr
    ).subscribe(results => {

      if (type == 'pdf') {
        saveAs(results, `last-visit-report.pdf`)
      } else {
        saveAs(results, `last-visit-report.xlsx`)
      }

    }, err => {
    });
  }



  //Getting all members
  getAllMembers(resetPage) {
    localStorage.removeItem('subplan');
    if (resetPage) {
      this.params['pageNumber'] = 1;
      this.page = 1;
    }
    // this.page=1;
    let arr = [];
     this.selectedItems.map((i) => {
      arr.push(i.providerid)
    })
     if (this.rolename == 'provider') {
      arr = [ this.roleid]
    }
    this.commonService.getLastVisit(this.params,arr).subscribe(results => {
      this.showPagination = true;

      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.member_list = results.body;
      this.setPages();
    }, err => {
    });
  }

  // Function to calculate age
  calculateAge(birthday) {
    if (birthday) {
      let age = birthday.split('-')
      return this.current_year - age[0];
    }


  }

  searchMembers() {
    if (this.search_text.length > 2) {
      this.showPagination = false;
      this.page = 1;

      this.userService.search_provider(this.search_text).subscribe(
        res => {

          this.member_list = res;
        },
        err => {
          //
        }
      )
    } else if (this.search_text.length == 0) {
      this.getAllMembers(true)
    }


  }
  
  search_value(term)
  {
    
    if(term.length==0)
      {
         
          
            this.params['membername']='';
          this.params['dob']='';
          
             this.params['subsId']='';
                
      }
      else{
         console.log('termis')
          }
    }


  loadByPage(page_number: number) {
    if (page_number < 1 || page_number > this.pager.total_pages) {
      return;
    }
    page_number = Number(page_number);
    this.page = page_number;
    // console.log("Page"+this.page)
    // console.log("Page numbe"+page_number)
    this.params['pageNumber'] = this.page
    this.getAllMembers(false);
    // window.scrollTo(0, 200);
  }


  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }

  searchProvider() {
    if (this.provider_name.length > 2) {
      this.showPanel = true;
      this.userService.search_provider(this.provider_name).subscribe(
        res => {
          this.members = res;
        },
        err => {
          //
        }
      )
    }
    if (this.provider_name.length == 0) {
      this.members = [];
      this.showPanel = false;
    }

  }


  getInsurance(member) {
    this.showPanel = false;
    this.provider_name = member.FirstName + ' ' + member.LastName;
    this.params.providerid = member.id;
    this.showPanel = false;
    // this.provider.uniqeproviderno = member.id;
    this.commonService.getInsurance(member.id
    ).subscribe(results => {

      this.insurance_list = results;
      this.params.healthplanid = 0;
    }, err => {

    });
  }

 search(term) {
   if(term.trim()==''){ }
 else{
 term=term.trim();
   this.checkCategory(term)
this.page = 1;

      this.getAllMembers(true);
    // if (term.length > 2) {
    //   this.page = 1;
    //   this.getAllMembers(true);

    // } else if (term.length == 0) {
    //   this.page = 1;
    //   // this.params.membername = '';
    //   this.getAllMembers(true);
    // }
  }}
    checkCategory(val) {
    // console.log(val)
   if (this.search_category == 'name') {

      this.params['membername'] = val;
      this.params['subsId'] = '';
      this.params['dob'] = '';
    } else if (this.search_category == 'id') {

      this.params['membername'] = '';
      this.params['subsId'] = val;
      this.params['dob'] = '';
    }else if (this.search_category == 'dob') {

      this.params['membername'] = '';
      this.params['subsId'] = '';
      this.params['dob'] = val;
    }


  }
  
  getAllHealthplans() {
    this.commonService.getAllHealthplans().subscribe(results => {

      this.healthplan_list = results;
    }, err => {

    });
  }

  //get all messages of that member
getProviders(type){
  let id;
  this.itemList = [];
  this.selectedItems = [];

this.commonService.getProviders(0,type).subscribe(results => {
this.itemList = results;

// this.getSingleConvo(id);


  })



}

}
