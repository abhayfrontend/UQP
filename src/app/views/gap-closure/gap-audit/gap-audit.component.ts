import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-gap-audit',
  templateUrl: './gap-audit.component.html',
  styleUrls: ['./gap-audit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GapAuditComponent implements OnInit {
  search_category: string = '';
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;
  // To check acl add/edit/view
  userRolePerm: any;
  disableBtn: boolean = false;
  disclaimer: boolean = false;
  API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
  CONTENT_BASE = environment.content_api_base.api_base;
  @ViewChild('userModal') public modal: ModalDirective;
  @ViewChild('childGapTemplate') childGapTemplate;


  //submitting gaps
  gapsEssentials: any;
  gapMember: any;
  gapSubmit: any = {
    gapsid:''
  };
  measureName: string;

  //multi select params
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};


  //provider search
  provider_name: string;
  provider_id: number;
  ipa_list: any;
  insurance_list: any;

  searching: boolean = false;
  search_text: string;
  members: any;
  member_list: any
  showPanel: boolean = true;
  page: number = 1;
  pager: any = {};
  total_pages: number;
  showPagination: boolean = true;
  displaymessage:any;
  // search_category:string='';
  healthplanName: string;
  currentRole: string;
  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'startdate': '',
    'enddate': '',
    'status': 'all',
    'subsId': '',
    'membername': '',
    'docsubmittedby':'',
    'providerid':0,
    'healthplanid':0,
    'auditorid':0
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
  currentuser:any;
  measures: any;
  current_date = new Date();
  // current_month = this.authS.getDates().current_month;
  // previous_month = this.authS.getDates().previous_month;
  // current_year = this.authS.getDates().current_year;

  //temporary january implementation
 current_month = this.authS.getDates().current_month;
   previous_month = this.authS.getDates().previous_month;
  current_year = this.authS.getDates().current_year;
  // previous_month_full = "April";

  checkCount = 0;
  errorFiles: any;
  checkBadRequest: boolean = true;
  letPass: boolean = false;
  showBrowseFilesBtn: boolean = false;
  showChildModalBtn: boolean = true;
  user_role:any;
  //audit coming from dashboard click
  qaStatus:any;
  assuranceUsers:any;
  fSubmitted: boolean = false;
  submitted_gap: boolean = false;
  colouridentifier:boolean=false;
  @ViewChild('term') input: ElementRef;
  constructor(public authS: AuthService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService,
    private pagerService: PagerService,
    private userService: UserService, private cdr: ChangeDetectorRef) {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.currentRole = this.authS.getCurrentRole(user.roleid);
    this.params.auditorid = user.userid;
    this.getMeasures();
    this.currentuser = JSON.parse(localStorage.getItem('currentUser'));
    

  }

  ngOnInit() {
    this.roleid=3;
    this.getAssuranceUsers();
    this.getAllHealthplans();
    // this.selectedItems = [{itemName: "Adult BMI", id:1}]
    this.qaStatus = localStorage.getItem('qaStatus');

   
    this.getAllHealthplans();
    for (let year = Number(this.current_year); year > 2018; year -= 1) {
      this.years.push(year.toString());
    }

    this.userRolePerm = this.authS.getPermission('Overall Gap');
    //check if provider is entering then get details a/c to that provider
    this.rolename = this.authS.getUserRole();
    
    //if assurance is logged in 
    if(this.currentuser.roleid == 3){
      this.params.docsubmittedby = this.currentuser.userid;
      this.params.auditorid = 0;
    }
    // if (this.rolename == 'provider') {
    //   // this.params.providerid = this.roleid;
    //   this.commonService.getInsurance(this.roleid
    //   ).subscribe(results => {

    //     this.insurance_list = results;
    //   }, err => {
    //   });
    // }

    this.date = {
      // 'month':this.current_month,
      'month': this.previous_month,
      'year': this.current_year
    }
    this.checkMonth(this.current_year)

    // this.getAllMembers(false);

    //Multiple measure dropdown settings
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Measures",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass mb-sm-0 col-md-3",
      badgeShowLimit: 1
    };

    // If it is coming from dashboard clickables
    let gapScorecard = JSON.parse(localStorage.getItem('gapScorecard'));
    if (gapScorecard) {
      // this.showDates = true;


      // this.params.healthplanid = gapScorecard.healthplanid;
      this.date.year = gapScorecard.year;
      this.date.month = gapScorecard.month;
      this.params.startdate = gapScorecard.startdate;
      this.params.enddate = gapScorecard.enddate;
      this.params.docsubmittedby = gapScorecard.docsubmittedby;
      this.params.providerid = gapScorecard.providerid;
      this.params.healthplanid = gapScorecard.healthplanid;
      // this.params.providerid = gapScorecard.providerid;
      this.healthplanName = gapScorecard.healthplanName;
      this.provider_name = gapScorecard.providername;
      this.selectedItems = [{ itemName: gapScorecard.mname, id: gapScorecard.mid, Measure_ID: gapScorecard.mid }]
      if (this.date.year == this.current_year) {

        // this.months.map((month) => {
        //   if (this.current_month == month.value) {
        //     this.months.splice(Number(month.value), 12);
        //   }
        // })
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
      this.getAllMembers(true);
      // this.commonService.getInsurance(Number(this.params.providerid)
      // ).subscribe(results => {

      //   this.insurance_list = results;

      // }, err => {

      // });
    } else {

      this.resetFilters();

    }
    
    this.getUserRoles();
    
  }

  resetFilters() {
    this.commonService.getMeasures().subscribe(results => {

      this.measures = results;
      // this.insurance_list = [];
      this.selectAllMeasures();
      this.input.nativeElement.value = "";
    this.params['membername'] = '';
    this.params['subsId'] = '';
    this.params.status='all';
    this.params['docsubmittedby'] = '';
    this.params.healthplanid = 0;
    this.params.providerid = 0;
    if(this.currentuser.roleid == 3){
      this.params.docsubmittedby = this.currentuser.userid;
      this.params.auditorid = 0;
    }
this.date = {
      // 'month':this.current_month,
      'month': this.previous_month,
      'year': this.current_year
    }
    this.checkMonth(this.current_year);
    if(this.qaStatus){
        this.params.status = this.qaStatus;
      }
      this.getAllMembers(true);
      // for (let i = 0; i < this.measures.length; i++) {
      //   this.measures[i].id = this.measures[i]['Measure_ID'];
      //   this.measures[i].itemName = this.measures[i]['Measure_Name'];
      //   // delete arrayObj[i].key1;
      // }
      // this.dropdownList = this.measures;
    }, err => {

    });



    //       setTimeout(() =>{
    // this.selectAllMeasures();
    // this.getAllMembers(true);
    //       },200)
     this.params['dob']='';
    this.provider_name = '';
    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;
    // this.params.providerid = 0;
    // this.params.healthplanid = 0;

  }
  getAssuranceUsers() {
    this.params.docsubmittedby='';
    this.userService.getRoleWiseUsers(this.roleid).subscribe(results => {
      
      this.assuranceUsers = results;

    }, err => {

    });
  }
    getAllHealthplans() {
    this.commonService.getAllHealthplans().subscribe(results => {

      this.insurance_list = results;
    }, err => {

    });
  }
  selectAllMeasures() {
    let arr = this.measures;

    for (let i = 0; i < arr.length; i++) {
      arr[i].id = arr[i]['Measure_ID'];
      arr[i].itemName = arr[i]['Measure_Name'];

      arr[i].Measure_ID = arr[i]['Measure_ID'];

      // delete arrayObj[i].key1;
    }
    // this.dropdownList = arr;


    this.selectedItems = arr;
  }

  ngOnDestroy() {
    //Removing dashboard clickable logic on destroy
    localStorage.removeItem('gapScorecard');
    localStorage.removeItem('qaStatus');
  }
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


    // new Date("2015-03-25");
  }

  getMeasures() {
    this.commonService.getMeasures().subscribe(results => {

      this.measures = results;

      for (let i = 0; i < this.measures.length; i++) {
        this.measures[i].id = this.measures[i]['Measure_ID'];
        this.measures[i].itemName = this.measures[i]['Measure_Name'];
        // delete arrayObj[i].key1;
      }
      this.dropdownList = this.measures;
    }, err => {

    });
  }
  getUserRoles() {
    this.userService.getUserRoles().subscribe(results => {
       
      this.user_role = results;
    }, err => {

    });
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



  search_value(term)
  {
    
    if(term.length==0)
      {
        this.params['membername']='';
        this.params['subsId']='';
        this.params['dob']='';      
      }
      else{
         
          }
    }

    setMemberDetails(member){
        this.gapSubmit.pcpfirstname = member.pcpfirstname;
    this.gapSubmit.pcpmidname = member.pcpmidname;
    this.gapSubmit.pcplastname = member.pcplastname;
    this.gapSubmit.subscriberFirstname = member.subscriberFirstname;
    this.gapSubmit.subscribermidname = member.subscribermidname;
    this.gapSubmit.subscribelastname = member.subscribelastname;
    this.gapSubmit.measname = member.measname;
    this.gapSubmit.gender = member.gender;
    this.gapSubmit.dob = member.dob;
    this.gapSubmit.hpname = member.hpname;
  }


  openGapModal(member) {

    
  this.displaymessage = "";
  this.submitted_gap = false;
    // // If User is adding gap details i.e it is not submitted yet
    // if (member.Isgapssubmit == 'notsubmitted') {
    //   this.childGapTemplate.resetNDC();
   
    //   this.checkCount = 0;
    //   this.errorFiles = [];
    //   this.gapSubmit = {}
    //   this.gapMember = member;
    //   this.gapSubmit.SubscriberID = member.subscriberid;
    //   this.gapSubmit.healthplanid = member.hpid;
    //   this.gapSubmit.measureid = member.measureid;
    //   this.gapSubmit.providerid = member.providerid;
    //   this.gapSubmit.startdate = this.params.startdate;
    //   this.gapSubmit.enddate = this.params.enddate;
    //   this.measureName = member.measname;
    //   this.setMemberDetails(member);
    //   this.modal.show();
    // } else {
      //Retreivng the submitted gaps details
      this.gapSubmit = {}

      this.gapMember = member;
      this.gapSubmit.SubscriberID = member.SubscriberID;
      this.gapSubmit.healthplanid = member.HealthPlanID;
      this.gapSubmit.measureid = member.MeasureID;
      this.gapSubmit.providerid = member.ProviderID;
      this.gapSubmit.gapsid=member.Gapsid
      console.log(this.gapSubmit.gapsid)
      this.commonService.getGapDetail(this.gapSubmit).subscribe(results => {
        //to update selected ndc code in child component for searchable
        this.childGapTemplate.retreiveNDCList(results);
        this.gapSubmit = results;
        this.setMemberDetails(member);
        this.measureName = member.Measure_Name;
        this.modal.show();
      }, err => {
      });
    // }
    // To resolve child/shared component values communication
    // ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'undefined'. Current value: 'null'.
    if (this.gapSubmit.measureid == 7) {
      this.childGapTemplate.getBrandNames(this.gapSubmit.measureid)
    }

    this.cdr.detectChanges();
  }
  removeDoc(file) {
    //     this.commonService.getGapDetail(this.gapSubmit).subscribe(results => {


    // this.gapSubmit = results;
    // this.measureName = member.measname;
    // this.modal.show()



    // // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
    //       },err => {
    //          // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
    //       });
  }
bsValue: Date = new Date();
  bsValue1: Date = new Date();
  bsValue2: Date = new Date();

  
 


  getReport(type) {
    // this.provider.type=type;
    //   this.provider.report = true;

    let reportDetails = {
      'providername': this.provider_name,
      'healthplanname': this.healthplanName,
      'selectedmonth': this.date.month,
      'type': type,
      'report': true
    }
    // var obj = Object.assign(this.provider);
    var reportParams = { ...this.params, ...reportDetails };
    // console.log(obj)/
    this.commonService.getSubmittedGapsReport(this.measureArray(), reportParams
    ).subscribe(results => {

      if (type == 'pdf') {
        saveAs(results, `Gap-Audit-report.pdf`)
      } else {
        saveAs(results, `Gap-Audit-report.xlsx`)
      }

    }, err => {
    });
  }


  getAllMembers(resetPage) {

    if (resetPage) {
      this.params['pageNumber'] = 1;
      this.page = 1;
    }
    if(this.params.status == 'all' || this.params.status == 'pending' || this.params.status == 'reviewed'){
       this.params.auditorid = 0;
    }
    console.log(this.params)
    // this.page=1;
    this.commonService.getSubmittedGaps(this.measureArray(), this.params).subscribe(results => {
      this.showPagination = true;
      // localStorage.removeItem('gapScorecard')
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.member_list = results.body

      this.setPages();
    }, err => {

    });
  }

  measureArray() {
    let temp = [];

    for (let i = 0; i < this.selectedItems.length; i++) {
      temp.push(this.selectedItems[i].Measure_ID)
    }


    return temp;
  }
  // measureArray(){

  //   console.log(this.measures)

  //     var temp = [];
  //     if(this.selectedItems.length == this.measures.length){
  //     console.log("All")
  //     temp = [0];
  //   }else{
  //     console.log("indi")
  //     for(let i =0;i<this.selectedItems.length;i++){
  //     temp.push(this.selectedItems[i].Measure_ID)
  //     }
  //   }


  //   console.log(temp)
  //   return temp;
  // }
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
      this.params.providerid = 0;
      this.members = [];
      this.showPanel = false;
    }

  }


  // getAllHealthplans() {
  //   this.commonService.getAllHealthplans().subscribe(results => {

  //     this.insurance_list = results;
  //   }, err => {

  //   });
  // }


  getInsurance(member) {
    this.showPanel = false;
    this.provider_name = member.FirstName + ' ' + member.LastName;
    this.params.providerid = member.id;
    this.showPanel = false;
    // this.provider.uniqeproviderno = member.id;
    // this.commonService.getInsurance(member.id
    // ).subscribe(results => {

    //   this.insurance_list = results;

    // }, err => {

    // });
  }

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



  search(term) {
    if(term.trim()==''){}
      else{term=term.trim();
    this.checkCategory(term)

    if (term.length > 2) {
      this.page = 1;
      this.getAllMembers(true);

    } else if (term.length == 0) {
      this.page = 1;
      // this.params.membername = '';
      this.getAllMembers(true);
    }}
  }

  updateAuditStatus(status, valid){
    this.fSubmitted = true;
    this.submitted_gap = true;
    if (valid) {
        this.childGapTemplate.addDetails();
        if(status=='approved'){
         var r = confirm(`Are you sure, you want to approve this submission?`); 
        }
        else if(status=='rejected'){
               var r = confirm(`Are you sure, you want to reject this submission?`);
        }

    if (r == true) {

          this.commonService.updateAuditStatus(this.gapSubmit, status).subscribe(results => {

         this.displaymessage=results;
        this.colouridentifier=true;
  
      setTimeout(() => {
        this.modal.hide();
        this.gapSubmit = {}
        this.getAllMembers(false);
      }, 2500)



      // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
    }, err => {
       this.displaymessage=err.error;
       this.colouridentifier=false;
      // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
    });
        }
    }
  
  }



}
