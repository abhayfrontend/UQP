import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { saveAs } from 'file-saver';



import { MraService } from '../../../services/mra.service';

import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
@Component({
  selector: 'app-custom-reports',
  templateUrl: './custom-reports.component.html',
  styleUrls: ['./custom-reports.component.scss']
})
export class CustomReportsComponent implements OnInit {

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
  @ViewChild('reviewModal') public reviewModal: ModalDirective;
  @ViewChild('childGapTemplate') childGapTemplate;
  @ViewChild('fileUpload') fileUpload : ElementRef;
  //upload requirements
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  videofiles: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  uploadInputVideo: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  //submitting gaps
  gapsEssentials: any;
  gapMember: any;
  gapSubmit: any = {};
  measureName: string;

  //multi select params
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  
  mra:boolean=false;
  aco:boolean=false;
  //provider search
  provider_name: string;
  provider_name_zip: string;
  provider_id: number;
  ipa_list: any;
  insurance_list: any;
  insurance_list_all: any;
  type: string = "projectedscore";
  searching: boolean = false;
  search_text: string;
  members: any;
  member_list: any
  showPanel: boolean = true;
  showPanel_zip: boolean = true;
  page: number = 1;
  pager: any = {};
  total_pages: number;
  showPagination: boolean = true;
  type_hcc: boolean = false;
  // search_category:string='';
  healthplanName: string;

  //otp gaps documents flow
  otp_msg:string;
  otp_error:boolean = false;
  char_left:any;
  review_comment_list:any;
  compliant_report:boolean = false;

  @ViewChild('gapDocsDownload') public otpModal: ModalDirective;
  @ViewChild('supplementalModal') public supplementalModal: ModalDirective;
  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'startdate': '',
    'enddate': '',
    'providerid': 0,
    'healthplanid': 0,
    'ipaid':0,
    'status': '',
    'subsId': '',
    'membername': '',
    'dob':'',
    'overallgaps':'',
    'reportcheck':'',
    'overallgapstype':null,
    'hcccategory':'',
    'demographic':null,
    'year':0,
    'month':'',
    'filtertype':''

  }
  reporttypeselected:boolean=false;

  reportype='hedis';
  show_hcc:boolean = false;
compliant:boolean=true;
  showtable:boolean=false;
    zip = {

    'month': '',
    'year': '',
    'providerid': 0,
    'healthplanid': 0,
    'ipaid':0,
    'otp':'',
    'status':'approved',
    'measureid': 0

  }

      supplemental = {

    'healthplanid': 0,
    'ipaid':0,
    'filename':''

  }
  mrabutton:boolean=false;

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

  hedis:boolean=false;
  years: string[] = [];
  date: any = {
    "month":"",
    "year":""
  };
  showMonth:boolean=false;
  days: any;
  measures: any;
  current_date = new Date();

current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month;
  current_year = this.authS.getDates().current_year;
  

hcc_list:any;
 
  checkCount = 0;
  errorFiles: any;
  checkBadRequest: boolean = true;
  letPass: boolean = false;
  showBrowseFilesBtn: boolean = false;
  showChildModalBtn: boolean = true;

  currentUser:any;
  qaStatus:string;
  showAllGaps: boolean = false;
temp_desc:string = "";
  review = {
    "ipaid":"",
    "measureid":"",
    "subscriberid":"",
    "reviewedname":"",
    "reviewedby":"",
    "comment":"",
    "gender":"",
    "dob":"",
    "Isgapssubmit":"",

  }  
  hcc_desc:string = "";
  ncrdash:any;
  reviewedBy:any = [];
  @ViewChild('term') input: ElementRef;
   @ViewChild('pgno') pgno: ElementRef;
     private search_change: Subject<string> = new Subject();
  constructor(public authS: AuthService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService,
    private pagerService: PagerService,
    private userService: UserService, private mraService:MraService,private cdr: ChangeDetectorRef) {
    this.getMeasures();
    this.files = []; // local uploading files array
    this.videofiles = [];
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.uploadInputVideo = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
   
    
  }

  ngOnInit() {
      //subscribing to search change subject and debouncing it
    this.search_change.debounceTime(500).distinctUntilChanged().subscribe(searchTextValue => {
      this.getAllMembers(true);
    });
    // this.countCheck();
    // this.test();
    this.getAllIPA();
    this.getHccCategory();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.qaStatus = localStorage.getItem('qaStatus');
    // this.selectedItems = [{itemName: "Adult BMI", id:1}]
    this.getAllHealthplans();
    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }
 
    this.userRolePerm = this.authS.getPermission('Overall Gap');
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
    }else if (this.rolename == 'qa') {
      this.params['assuranceid'] = this.currentUser.userid;
      if(this.qaStatus){
        this.showAllGaps = true;
        this.params.status = this.qaStatus;
        this.resetFilters();
      }
    }else if (this.rolename == 'ipa') {
      // this.params['ipaid'] = this.currentUser.ipaid;
      
    }else if(this.rolename == 'healthplan'){
      this.params.healthplanid = this.roleid;
    }
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


      this.params.healthplanid = gapScorecard.healthplanid;
      this.date.year = gapScorecard.year;
      this.date.month = gapScorecard.month;
      this.params.startdate = gapScorecard.startdate;
      this.params.enddate = gapScorecard.enddate;
      this.params.providerid = gapScorecard.providerid;
      this.params.ipaid = gapScorecard.ipaid;
      this.healthplanName = gapScorecard.healthplanName;
      this.provider_name = gapScorecard.pname;
      this.selectedItems = [{ itemName: gapScorecard.mname, id: gapScorecard.mid, Measure_ID: gapScorecard.mid }]
      if (this.date.year == this.current_year) {

        this.months.map((month) => {
          if (this.current_month == month.value) {
            this.months.splice(Number(month.value), 12);
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
      this.getAllMembers(true);
      this.getAllMember(false, this.type);
      // this.commonService.getInsurance(Number(this.params.providerid)
      // ).subscribe(results => {

      //   this.insurance_list = results;

      // }, err => {

      // });
    } else {

      // this.resetFilters();

    }

//check if provider is entering then get details a/c to that provider
    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    if (this.rolename == 'provider') {
      this.params.providerid = this.roleid;
      this.commonService.getInsurance(Number(this.roleid)
        ).subscribe(results => {

          this.insurance_list = results;
        }, err => {
        });
      }
    this.ncrdash=JSON.parse(localStorage.getItem('gotonc'));
    console.log(this.ncrdash)
 
    if(localStorage.getItem('gotonc'))
     {
       
       this.params['healthplanid']=this.ncrdash['healthplanid'];
       this.params['providerid']=this.ncrdash['providerid'];
       this.params['ipaid']=this.ncrdash['ipaid'];
       this.params['startdate']=this.ncrdash['startdate'];
       this.params['enddate']=this.ncrdash['enddate'];
       this.params['status']=this.ncrdash['status'];
       this.date.year=this.ncrdash['year'];
       this.date.month=this.ncrdash['month']
       this.provider_name=this.ncrdash['provider_name']

      this.commonService.getMeasures().subscribe(results => {
        this.measures=results;
         this.selectAllMeasures();
         this.getAllMembers(true);

        },err=>{});
    }
    else{

    }
    

    
  } 
  resetFilter() {
    this.show_hcc = false;
    this.showPanel = false;
    if(this.pgno){
        this.pgno.nativeElement.value = '';
      }
    this.provider_name = '';
    if (this.rolename != 'provider') {
      this.params.providerid = 0;
    }
    if (this.rolename != 'healthplan') {
      this.params.healthplanid = 0;
    }

    this.params.filtertype = '';
    this.params['membername'] = '';
    this.params['subsId'] = '';
    this.params.hcccategory = '';
    this.search_category = '';
    this.params.status = '';
    this.temp_desc= "";
    this.input.nativeElement.value = "";
    // this.params['membername'] = '';
    // this.params['subsId'] = '';
    this.getAllMember(true, this.type);
  }
  countCheck(){
//   $('#message').keyup(function () {
//     debugger;
//   let max = Number(this.getAttribute("maxlength"));
//   var len = $(this).val.length;
//   if (len >= max) {
//     $('#charNum').text(' you have reached the limit');
//   } else {
//     alert("Gtr")
//     var char = max - len;
//     // this.char_left = char;
//     $('#charNum').html(char + ' characters left');
//   }
// });
let len = this.review['comment'].length;
if (len > 150) {
  this.char_left = "  You have reached the maximum limit"
}else {
  this.char_left = 150 - len + " characters left"
}
  }
checkreporttype(){
  if(this.input){
    this.input.nativeElement.value = '';
  }
  
  if(this.params.overallgapstype=='compliant')
  {
    this.reporttypeselected=false;
    this.compliant=true;
    this.params['compliantreport'] = true;
    this.params.status = 'all';

    
  }
  else if(this.params.overallgapstype=='noncompliant'){
    this.reporttypeselected=false; 
    this.compliant=false;
    this.params['compliantreport'] = false;
    this.params.status = 'all';
    
  }
  if(this.selectedItems.length){
    this.getAllMembers(true);
  }
}

  ngOnDestroy(){
localStorage.removeItem('gotonc');
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
resetFilters(){
  this.search_category='';
  this.showPanel = false;
  if(this.pgno){
        this.pgno.nativeElement.value = '';
      }
this.params.filtertype = '';
   this.commonService.getMeasures().subscribe(results => {

      this.measures = results;
      // this.insurance_list = [];
      this.selectAllMeasures();
      this.input.nativeElement.value = "";
      this.date = {
      // 'month':this.current_month,
      'month': this.previous_month,
      'year': this.current_year
    }
    this.params['membername'] = '';
    this.params['subsId'] = '';
    
    if(this.rolename !== 'ipa'){
      this.params['ipaid'] = 0;
    }
    
    if (this.rolename !== 'provider') {
    this.params['providerid'] = 0;
  }
  if (this.rolename !== 'healthplan') {
    this.params['healthplanid'] = 0;
  }
    if(!this.qaStatus){
      this.params['status'] = 'all';
    }
    this.formatDate()
      this.getAllMembers(true);
      // for (let i = 0; i < this.measures.length; i++) {
      //   this.measures[i].id = this.measures[i]['Measure_ID'];
      //   this.measures[i].itemName = this.measures[i]['Measure_Name'];
      //   // delete arrayObj[i].key1;
      // }
      // this.dropdownList = this.measures;
    }, err => {

    }
    );



    //       setTimeout(() =>{
    // this.selectAllMeasures();
    // this.getAllMembers(true);
    //       },200)
    this.params['dob']='';
    this.provider_name = '';
    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;
 
    
    // if (this.rolename !== 'provider') {
    //   this.params.providerid = 0;
    // }
    
    // this.params.healthplanid = 0;
    
}

 
checkFilterType()
{
  console.log(this.params.filtertype)
  if(this.params.filtertype=='nohcc')
  {
    this.showMonth=true;
  }
  
}



checkreport()
{
  if(this.input){
    this.input.nativeElement.value = '';
  }
  this.showPanel = false;
  this.reporttypeselected=true;
  this.member_list='';
  this.showtable=false;
  this.params.providerid=0;
  this.provider_name='';
  if(this.params.reportcheck=='hedis')
  {
  	this.hedis=true;
  	
  	this.mra=false;
  	this.aco=false;
    this.params.status='all';

  }
  else if(this.params.reportcheck=='mra')
  {
   
  	this.mra=true;
  	this.hedis=false;
  	 this.date.year=2019;
  	this.aco=false;

    this.params.status='';

   
  }
  else if(this.params.reportcheck=='aco')
  {
  	this.aco=true;
  	this.hedis=false;
  	this.mra=false;
  	
  }
  // console.log(this.hedis)
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

  

  selectAllMeasures() {
    let arr = this.measures;

    for (let i = 0; i < arr.length; i++) {
      arr[i].id = arr[i]['Measure_ID'];
      arr[i].itemName = arr[i]['Measure_Name'];

      arr[i].Measure_ID = arr[i]['Measure_ID'];

      
    }
    

    this.selectedItems = arr;
    
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
      this.params.providerid = 0;
    }

  }
  statusdemo(){
    if(this.params.demographic=='male')
    {
      this.params['gender']='Male';
    }
    else if(this.params.demographic=='female')
    {
      this.params['gender']='Female'
    }
    else if(this.params.demographic=='below'){
      this.params['minage']=0;
      this.params['maxage']=64;
    }
    else if(this.params.demographic=='70')
      {
        this.params['minage']=65;
        this.params['maxage']=70;
      }
      else if(this.params.demographic=='75')
      {
        this.params['minage']=70;
        this.params['maxage']=75;
      }
      else if(this.params.demographic=='76')
      {
        this.params['minage']=76;
        this.params['maxage']=100;
      }
  }
   
    getHccCategory(){
    this.mraService.getHccCategory("").subscribe(results => {

      this.hcc_list = results;
    }, err => {

    });
  }
    getAllIPA() {
    this.commonService.getAllIPA().subscribe(results => {

      this.ipa_list = results;
    }, err => {

    });
  } 


  

  getAllHealthplans() {
    this.commonService.getAllHealthplans().subscribe(results => {

      this.insurance_list = results;
    }, err => {

    });
  }
  loadByPage(page_number: number) {
    page_number = Number(page_number);
    if (page_number < 1 || page_number > this.pager.total_pages) {
      return;
    }
    page_number = Number(page_number);
    this.page = page_number;
    // console.log("Page"+this.page)
    // console.log("Page numbe"+page_number)
    this.params['pageNumber'] = this.page;
    if(this.mra){
      this.getAllMember(false, this.type);
    }else {
      this.getAllMembers(false);
    }
    
    // window.scrollTo(0, 200);
  }


  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }







  getMeasures() {
    this.commonService.getMeasures().subscribe(results => {

      this.measures = results.filter((measure) => {
        return measure.Measure_ID != 19 && measure.Measure_ID != 18;
      });

      for (let i = 0; i < this.measures.length; i++) {
        this.measures[i].id = this.measures[i]['Measure_ID'];
        this.measures[i].itemName = this.measures[i]['Measure_Name'];
        // delete arrayObj[i].key1;
      }
      this.dropdownList = this.measures;
    }, err => {

    });
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
    this.disableBtn = false;
    this.letPass = false;
    this.disclaimer = false;
    this.showBrowseFilesBtn = false;
    this.showChildModalBtn = true;
    //To reset input type file previously attached uploaded file
    if(this.fileUpload){
      this.fileUpload.nativeElement.value = "";
    }
    
    // If User is adding gap details i.e it is not submitted yet
    if (member.Isgapssubmit == 'notsubmitted' || member.Isgapssubmit == 'rejected') {
      this.childGapTemplate.resetNDC();
      this.files = [];
      this.videofiles = [];
      this.checkCount = 0;
      this.errorFiles = [];
      this.gapSubmit = {}
      this.gapMember = member;
      this.gapSubmit.SubscriberID = member.subscriberid;
      this.gapSubmit.healthplanid = member.hpid;
      this.gapSubmit.measureid = member.measureid;
      this.gapSubmit.providerid = member.providerid;
      this.gapSubmit.startdate = this.params.startdate;
      this.gapSubmit.enddate = this.params.enddate;
      this.gapSubmit.ipaid = member.ipaid;
      this.measureName = member.measname;
      this.setMemberDetails(member);
      this.modal.show();
    } else {
      //Retreivng the submitted gaps details
      this.gapSubmit = {}
      this.files = [];
      this.checkCount = 0;
      this.errorFiles = [];
      this.videofiles = [];
      this.gapMember = member;
      this.gapSubmit.SubscriberID = member.subscriberid;
      this.gapSubmit.healthplanid = member.hpid;
      this.gapSubmit.measureid = member.measureid;
      this.gapSubmit.providerid = member.providerid;
      this.gapSubmit.ipaid = member.ipaid;
      this.commonService.getGapDetail(this.gapSubmit).subscribe(results => {
        //to update selected ndc code in child component for searchable
        this.childGapTemplate.retreiveNDCList(results);
        this.gapSubmit = results;
        this.setMemberDetails(member);
        this.measureName = member.measname;
        this.modal.show();
      }, err => {
      });
    }
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

  // upload requirements
  onUploadOutput(output: UploadOutput, type): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      // const event: UploadInput = {
      //   type: 'uploadAll',
      //   url: '/upload',
      //   method: 'POST',
      //   data: { foo: 'bar' }
      // };
      // this.uploadInput.emit(event);
      // console.log($('.upload-file'));
      this.checkCount = 0;
      this.checkBadRequest = true;
      this.errorFiles = [];
      this.disableBtn = false;
      this.letPass = false;

    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
      if (type == 'video') {
        this.videofiles.push(output.file);
      } else {
        this.files.push(output.file);
      }

    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      if (type == 'video') {
        const index = this.videofiles.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
        this.videofiles[index] = output.file;
      } else {
        const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
        this.files[index] = output.file;
      }


    } else if (output.type === 'done') {
      // remove file from array when removed
      this.checkCount++
      console.log("check " + this.checkCount);
      // console.log(output);
      // console.log(this.files);
      // console.log(this.videofiles);
      let fCount = this.videofiles.length;
      // let checkBadRequest = true;
      // let vCount = this.files.length;

      // console.log(output.file.fileIndex);
      let count = fCount;
      if (output.file.responseStatus === 400) { // Or whatever your return code status is
        this.checkBadRequest = false;
        this.disableBtn = false;
        this.errorFiles.push(output.file);
   
      }
      if (this.checkCount == count && output.file) {
        if (this.checkBadRequest) {

          this.modal.hide();
          this.getAllMembers(false);
        }

        // this.getVideos();
      }




    } else if (output.type === 'removed') {
      // remove file from array when removed
      if (type == 'video') {
        this.videofiles = this.videofiles.filter((file: UploadFile) => file !== output.file);
      } else {
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
      }


    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  // To upload docs and videos
  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      // url: this.API_BASE + '/members/fileupload/' + this.gapSubmit.gapsid,
      url: this.API_BASE + '/fileupload/GapsDocument/' + this.gapSubmit.gapsid,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'IPA': `${localStorage.getItem('DBNAME')}`},
      data: { 'providerid': this.gapSubmit.providerid, 
              'healthplanid': this.gapSubmit.healthplanid, 
              'ipaid': this.gapSubmit.ipaid
            }
    };

    this.uploadInput.emit(event);
  }

  // startUploadVideo(): void {
  //   const event: UploadInput = {
  //     type: 'uploadAll',
  //     url: this.API_BASE + '/Guidelines/videoupload/'+this.videoId,
  //     method: 'POST',
  //     headers:  { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  //   };

  //   this.uploadInputVideo.emit(event);

  // }
  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
    this.letPass = true;
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

  updateGapClosure(id, valid) {
    this.childGapTemplate.addDetails();
    var r = confirm("Are you sure, you want to submit this gap?");
    if (r == true) {
      this.commonService.updateGapClosure(this.gapSubmit.measureid, this.gapSubmit).subscribe(results => {
      this.gapSubmit.gapsid = results.gapsid;
      this.startUpload();
      if (this.videofiles.length == 0 || this.letPass) {
        setTimeout(() => {
          this.modal.hide();
          this.gapSubmit = {}
          this.getAllMembers(false);
        }, 1000)
      }
      // setTimeout(() => {
      //   this.modal.hide();
      //   this.gapSubmit = {}
      //   this.getAllMembers(true);
      // }, 2500)
      // setTimeout(() => {
      //   // this.modal.hide();
      //   // this.gapSubmit = {}
      //   // this.getAllMembers(true);
      // }, 1500)



      // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
    }, err => {
      this.disableBtn = false;
      // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
    });
    }else{
      this.disableBtn = false;
    }
    


  }
  modifyGapClosure(id, valid) {
    this.childGapTemplate.addDetails();
    // this.gapSubmit.SubscriberID = this.gapMember.SubscriberID;
    // this.gapSubmit = {...this.gapsEssentials,...this.gapSubmit}
var r = confirm("Are you sure, you want to submit this gap?");
    if (r == true) {
          this.commonService.modifyGapClosure(this.gapSubmit.gapsid, this.gapSubmit).subscribe(results => {
      this.startUpload()
      if (this.videofiles.length == 0 || this.letPass) {
        setTimeout(() => {
          this.modal.hide();
          this.gapSubmit = {}
          this.getAllMembers(false);
        }, 1000)
      }
      // setTimeout(() => {
      //   this.modal.hide();fdv
      //   this.gapSubmit = {}
      //   this.getAllMembers(true);
      // }, 2500)



      // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
    }, err => {
      this.disableBtn = false;
      // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
    });
        }else{
          this.disableBtn = false;
        }



  }
  removeGapDoc(file, valid) {
    this.commonService.removeGapDoc(this.gapSubmit.gapsid, file.filename).subscribe(results => {

      // this.gapSubmit = results;
      this.gapSubmit.gapdoc = results.gapdoc;
      // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
    }, err => {
      // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
    });


  }

  getReport(type) {
    // this.provider.type=type;
    //   this.provider.report = true;
    // debugger;
    let reportDetails = {
      'providername': this.provider_name,
      'healthplanname': this.healthplanName,
      'selectedmonth': this.date.month,
      'type': type,
      'report': true
    }
   
    if(this.compliant==true){
      this.params['compliantreport']=true;
    }
     
    // var obj = Object.assign(this.provider);
    var reportParams = { ...this.params, ...reportDetails };
    // console.log(obj)/
    this.commonService.getMasterReportGap(this.measureArray(), reportParams, 'OverallGapReport'
    ).subscribe(results => {

 if(this.compliant){
   if (type == 'pdf') {
        saveAs(results, `compliant-report.pdf`)
      } else {
        saveAs(results, `compliant-report.xlsx`)
      }
 }else{
 if (type == 'pdf') {
        saveAs(results, `non-compliant-report.pdf`)
      } else {

        saveAs(results, `non-compliant-report.xlsx`)
      }
 }
             

      
     

    }, err => {
    });
  }

 search_value(term)
  {
    
    if(term.length==0)
      {
         
        this.params['membername']='';
        this.params['subsId']='';
        this.params['dob']=''
                    
      }
      
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
  searchs(term) {
     if(term.trim()==''){}
       else{
          term=term.trim();
           this.checkCategory(term)

    if (term.length > 2) {
      this.page = 1;
      this.getAllMember(true, this.type);

    } else if (term.length == 0) {
      this.page = 1;
      // this.params.membername = '';
      this.getAllMember(true, this.type);
    }
  }}


  getAllMembers(resetPage) {
    this.showtable=true;
  this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;
    if (resetPage) {
      this.params['pageNumber'] = 1;
      this.page = 1;
    }

    //to send assurance id or not according to 'notsubmitted' status and 'showallgaps' checkbox
    if(this.rolename == 'qa'){
      if(this.params.status == 'notsubmitted'){
        this.params['assuranceid'] = '';
      }else{
        this.params['assuranceid'] = this.currentUser.userid;
      }
      if(!this.showAllGaps){
      this.params['assuranceid'] = ''
    }else{
      if(this.params.status !== 'notsubmitted'){
       this.params['assuranceid'] = this.currentUser.userid;
      }
    }
    }
    if(this.compliant_report==true){
      this.params['compliantreport']=true;
    }

    this.checkCategory(this.input.nativeElement.value);
    
    // this.page=1;
    this.commonService.getOverallGaps(this.measureArray(), this.params).subscribe(results => {
      this.showPagination = true;
      
      // localStorage.removeItem('gapScorecard')
      this.member_list = results.body;
      this.total_pages =JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      
  
      this.setPages();
if(this.pgno){
        this.pgno.nativeElement.value = '';
      }
    }, err => {

    });
  }

  getReporta(type) {
    
    let reportDetails = {

      'type': type,
      'report': true,
      'description': this.hcc_desc
    }
   
    var reportParams = { ...this.params, ...reportDetails };
   
    this.mraService.getMraMembers(reportParams, this.type
    ).subscribe(results => {

      if (type == 'pdf') {
        saveAs(results, `mra-member-list.pdf`)
      } else {
        saveAs(results, `mra-member-list.xlsx`)
      }

    }, err => {
    });
  }
getAllMember(resetPage, type) {
  this.statusdemo();
  this.params.startdate = this.date.year + '-' + this.date.month + '-01';
   this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;
  this.hedis=false;
  this.showtable=true;
  this.params.year=this.date.year;
  // this.params.reporttype='currentscore';
  if(this.params.filtertype == 'nohcc'){
    this.type_hcc = true;
  }else{
    this.type_hcc = false;
  }
    if (resetPage) {
      this.params['pageNumber'] = 1;
      this.page = 1;
    }
    // this.page=1;
    this.params['report'] = false;
    this.checkCategory(this.input.nativeElement.value);
    this.mraService.getMraMembers(this.params, type).subscribe(results => {
      this.showPagination = true;
      
      if(this.temp_desc){
        this.show_hcc = true;
        this.hcc_desc = this.temp_desc;
      }
      
      this.member_list = results.body;
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;

      this.setPages();
      if(this.pgno){
        this.pgno.nativeElement.value = '';
      }
    }, err => {
    });
  }
  addHccDesc(desc){
    this.temp_desc = desc;
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
  // selectFacility(id,i){
  //   let selectedItem = this.member_list[i].address.find((item)=> item.facilityid== id);
  //   this.member_list[i].phoneno = selectedItem.phoneno;
  //   this.member_list[i].fax = selectedItem.fax;
  //   this.member_list[i].county = selectedItem.county;
  // }
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

 

  



    // searching provider
  SearchProviderByHp() {
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



  SearchProviderByHpZip() {
    this.members = [];
    if (this.provider_name_zip.length > 2) {
      this.showPanel_zip = true;
      this.searching = true;
      this.userService.SearchProviderByHp(this.provider_name_zip, this.zip.healthplanid).subscribe(
        res => {
          this.members = res;
          this.searching = false;
        },
        err => {
          this.searching = false;
          //
        }
      )
    }
    if (this.provider_name_zip.length == 0) {
      this.members = [];
      this.showPanel_zip = false;
      this.zip.providerid = 0;
    }

  }


  getInsuranceByIpa(id) {
    this.commonService.getInsuranceByIpa(id).subscribe(results => {

      this.insurance_list = results;
    }, err => {

    });
  }


  getInsurance(member) {
    this.showPanel = false;
    this.provider_name = member.FirstName + ' ' + member.LastName;
    this.params.providerid = member.id;
    // this.showPanel = false;
    // this.provider.uniqeproviderno = member.id;
    // this.commonService.getInsurance(member.id
    // ).subscribe(results => {

    //   this.insurance_list = results;

    // }, err => {

    // });
  }

  getInsurance_zip(member) {
    this.showPanel_zip = false;
    this.provider_name_zip = member.FirstName + ' ' + member.LastName;
    this.zip.providerid = member.id;
    // this.showPanel = false;
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
       else{
          term=term.trim();
    this.checkCategory(term)
    this.page = 1;
    this.getAllMembers(true);
    // if (term.length > 2) {
    //   this.page = 1;
    //   this.search_change.next(term);
    //   // this.getAllMembers(true);

    // } else if (term.length == 0) {
    //   this.page = 1;
    //   // this.params.membername = '';
    //   this.getAllMembers(true);
    // }
  }}

  getAllGapDocs(zip) {
    // console.log(obj)/
    this.zip['email'] = this.currentUser.email;
    this.userService.getAllGapDocs(this.zip).subscribe(results => {
      saveAs(results, `Gaps-Documents.zip`);
      this.otpModal.hide();
    }, err => {
      this.otp_error = true;
    });
  }




  supplementaldwnload(type){
   // console.log(obj)/

    this.userService.supplementaldwnload(this.supplemental).subscribe(results => {
      if(type == 'txt'){
        saveAs(results, `supplement.txt`);
      }else{
        saveAs(results, `supplement.csv`);
      }
      
      this.supplementalModal.hide();
    }, err => {
      // this.otp_error = true;/
    });
  }


  sendOTP() {
           this.zip = {

    'month': '',
    'year': '',
    'providerid': 0,
    'healthplanid': 0,
    'ipaid':0,
    'otp':'',
    'status':'approved',
    'measureid':0

  }
    this.otp_error = false;
    this.otpModal.show();
    this.otp_msg = `OTP has been sent to you email id ${this.currentUser.email}, Please verify your OTP to download`;
    // console.log(obj)/
    this.userService.sendOTP(this.currentUser.email).subscribe(results => {
      
     
    }, err => {

    });
}


review_process(member)
{
  if(member.ReviewdBy)
  {
    this.reviewedBy = member.ReviewdBy.split(',')
  }else{
    this.reviewedBy = [];
  }
  this.char_left = "150 characters left";
  
  this.review = {
    ...member,
    "reviewedname":this.currentUser.name,
    "reviewedby":this.currentUser.userid,
    "comment":""

  }
  this.getReviewComments();
  this.reviewModal.show()
  }

  getReviewComments(){
    this.commonService.getReviewComments(this.review).subscribe(results => {
      this.review_comment_list = results;
      // this.showPagination = true;
      // // localStorage.removeItem('gapScorecard')
      // this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      // this.member_list = results.body

      // this.setPages();
    }, err => {

    });
  }

  submitReview(){
      this.commonService.submitReview(this.review).subscribe(results => {
        this.getAllMembers(false);
        this.reviewModal.hide();
      // this.showPagination = true;
      // // localStorage.removeItem('gapScorecard')
      // this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      // this.member_list = results.body

      // this.setPages();
    }, err => {

    });
    // console.log(this.review);
  }



}
