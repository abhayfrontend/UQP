import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import * as html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import * as $ from 'jquery';
import { MraService } from '../../../services/mra.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { environment } from '../../../../environments/environment';
import * as  uniqid from 'uniqid';
@Component({
  selector: 'app-membership-roster',
  templateUrl: './membership-roster.component.html',
  styleUrls: ['./membership-roster.component.scss']
})
export class MembershipRosterComponent implements OnInit {
  search_category: string = '';
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;
  currentUser: any;


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

  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'startdate': '',
    'enddate': '',
    'providerid': '',
    'healthplan_id': 0,
    'subsId': '',
    'membername': '',
    'termedmembers':false,
    'newmembers':false,
    'IPA_ID':0
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

  // member report card params
  @ViewChild('healthcard') public healthmodal: ModalDirective;
  @ViewChild('staticModal') public staticModal: ModalDirective;

// MRA review params
 // add_review : Array<[{type: any, dos: any, dc:any}]>
 // add_review: Array<{type: any, dos: any, dc:any}> = [];
 add_review = [{
   "uniqueid":uniqid(),
  "type":"New Condition",
  "dos":"",
  "diagnosiscode":"",
  "hcccode":"",
  "hcccondition":"",
  "HCCDescription":"",
  "files": []
}];
 review_obj = {
  "type":"",
  "dos":"",
  "diagnosiscode":"",
  "hcccode":"",
  "hcccondition":"",
  "description":""
}
review_docs:any;
review:any={};
review_details
  // add_review:Array<object> =[];
  mra_review_count = [2];
  @ViewChild('MRAReviewModal') public MRAReviewModal: ModalDirective;
  @ViewChild('MRAReviewForm') public MRAReviewForm: NgForm;
  member_card:any;
  member_card1:any;
bp_systolic:number[] = [];
  years: string[] = [];
  date: any= {
      // 'month':this.current_month,
      'month': "",
      'year': ""
    };
    mrareviewproviderid:any;
  days: any;
  current_date = new Date();

  current_month = this.authS.getDates().last_month;

  previous_month = this.authS.getDates().last_month;
  // previous_month = this.months[new Date().getMonth() - 2]["value"];
  current_year = this.authS.getDates().current_year;
  currentRole:string;
  @ViewChild('term') input: ElementRef;

mindate:Date;
  maxdate:Date;
    ismra:boolean = false;
    isboth :boolean = false;
    ishedis:boolean = false;

    printing:boolean = false;

















     l=0;

      checkCount = 0;
  errorFiles: any;
  checkBadRequest: boolean = true;
  letPass: boolean = false;
  showBrowseFilesBtn: boolean = false;
  showChildModalBtn: boolean = true;

    //submitting gaps
  gapsEssentials: any;
  gapMember: any;
  gapSubmit: any = {};
  measureName: string;
  qaStatus:string;
  showAllGaps: boolean = false;

    @ViewChild('userModal') public modal: ModalDirective;
  @ViewChild('childGapTemplate') childGapTemplate;
  @ViewChild('fileUpload') fileUpload: ElementRef;
    @ViewChild('reminderModal') public reminderModal: ModalDirective;
    @ViewChild('followupModal') public followupModal: ModalDirective;
  // @ViewChild(GapModalComponent) child: GapModalComponent;
  //upload requirements
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  videofiles: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  uploadInputVideo: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

 CONTENT_BASE = environment.content_api_base.api_base;
  disableBtn: boolean = false;
  disclaimer: boolean = false;
  API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
  constructor(public authS: AuthService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService,  private mraService: MraService,
    private pagerService: PagerService,  private cdr: ChangeDetectorRef,
    private userService: UserService) { 
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.currentRole = this.authS.getCurrentRole(user.roleid);
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.uploadInputVideo = new EventEmitter<UploadInput>();
    if(this.currentRole == 'audit'){
      this.params['review'] = true;
    }
    // this.add_review.push(this.review_obj);
  }

  ngOnInit() {
    
    
    // console.log(uniqid()); 
    this.mindate=new Date();
 this.maxdate=new Date();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    this.getAllHealthplans();
    let name = localStorage.getItem('memberchangevalue');
    let ageFilter = localStorage.getItem('memberagefilter');
    let hpid = localStorage.getItem('gaugeHpId');
    if(ageFilter == 'above65'){
      this.params['above65'] = true;
    }else if(ageFilter == 'below65'){
      this.params['above65'] = false;
    }
    if(name == 'newmembers'){
      this.params.newmembers = true;
      if(hpid){
        this.params.healthplan_id = Number(hpid);
      }
    }else if(name == 'termedmembers'){
      this.params.termedmembers = true;
      if(hpid){
        this.params.healthplan_id = Number(hpid);
      }
    }
    for (let year = Number(this.current_year); year > 2018; year -= 1) {
      this.years.push(year.toString());
    }

    //check if provider is entering then get details a/c to that provider
    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    this.date = {
      // 'month':this.current_month,
      'month': this.current_month,
      'year': this.current_year
    }
    console.log(this.previous_month)
    this.checkMonth(this.current_year)
    if (this.rolename == 'provider') {
      this.params.providerid = this.roleid;
      this.commonService.getInsurance(this.roleid
        ).subscribe(results => {

          this.insurance_list = results;
        }, err => {
        });
      }else if (this.rolename == 'ipa') {
        // this.params['IPA_ID'] = this.currentUser.ipaid;
      }else if(this.rolename == 'healthplan'){
        this.params.healthplan_id =  this.roleid;
        this.getAllIPA();
        // this.getAllMembers(false);
      }else if(this.rolename == 'audit'){

      this.params['review'] = true;
    // this.getAllMembers(false);
      }

      
    // this.checkMonth(this.current_year)

    // this.getAllMembers(false);
  }

  ngOnDestroy(){
    localStorage.removeItem('memberchangevalue');
    localStorage.removeItem('gaugeHpId');
    localStorage.removeItem('memberagefilter');
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

getAllHealthplans() {
    this.commonService.getAllHealthplans().subscribe(results => {

      this.insurance_list = results;
    }, err => {

    });
  }

   getAllIPA() {
    this.commonService.getAllIPA().subscribe(results => {

      // this.ipa_list = results.filter((ipa) => ipa.IPA_ID != 5 && ipa.IPA_ID != 6);
      this.ipa_list = results;
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


  getReport(type) {
    // this.provider.type=type;
    //   this.provider.report = true;
html2pdf().set({
  pagebreak: { mode: 'avoid-all', before: '#page2el' }
});

    let reportDetails = {
      'providername': this.provider_name,
      'healthplanname': this.healthplanName,
      // 'selectedmonth':this.selectedMonth,
      'type': type,
      'report': true
    }
    // var obj = Object.assign(this.provider);
    var reportParams = { ...this.params, ...reportDetails };
    // console.log(obj)/
    this.commonService.getMasterReport(reportParams, 'GetMemberReport',[]
      ).subscribe(results => {

        if (type == 'pdf') {
          saveAs(results, `membership-roster-report.pdf`)
        } else {
          saveAs(results, `membership-roster-report.xlsx`)
        }

      }, err => {
      });
    }


    getAllMembers(resetPage) {
      localStorage.removeItem('subplan');
      if (resetPage) {
        this.params['pageNumber'] = 1
        this.page = 1;
      }
    // this.page=1;

    this.commonService.getMemberRosters(this.params).subscribe(results => {
      this.showPagination = true;

      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.member_list = results.body

      this.setPages();
    }, err => {
    });
  }

  resetFilters(){
    this.provider_name = '';
    if (this.rolename != 'provider') {
      this.params.providerid =  '';
    }
    if (this.rolename != 'healthplan') {
      this.params.healthplan_id =  0;
    }
    this.date = {
      // 'month':this.current_month,
      'month': this.previous_month,
      'year': this.current_year
    }
    this.search_category='';
    this.params['dob']='';
    this.input.nativeElement.value = "";
    this.params['membername'] = '';
    this.params['subsId'] = '';
    this.params.termedmembers = false;
    this.params.newmembers = false;
    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;
    this.getAllMembers(true);
  }

  calculateAge(birthday) {
    // console.log(birthday)
    let age = birthday.split('-')
    return this.current_year - age[0];

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
    page_number = Number(page_number);
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


handleReviews(status) {
    let count = this.add_review.length;
    if (status) {
      this.add_review.push({
        "uniqueid":uniqid(),
  "type":'New Condition',
  "dos":"",
  "diagnosiscode":"",
  "hcccode":"",
  "hcccondition":"",
  "HCCDescription":"",
  "files": []
})
    } else {
      if (count > 1) {
        this.add_review.pop()
      }

    }
  }

getHCCCondition(hcccode, i){
  if(this.add_review[i].diagnosiscode !== ''){
    this.mraService.getHccCategory(hcccode).subscribe(
        res => {
          this.add_review[i].hcccode = res[0].hccCategory;
          this.add_review[i].HCCDescription=res[0].Description;
        },
        err => {
          //
    })
  }
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
getmemberhealthcard(member){
  let data = {
    'subscriberid':member.subscriberid,
    'startdate':this.params.startdate,
    'enddate':this.params.enddate
  }
  // this.modal.show()
  this.commonService.getmemberhealthcard(data
        ).subscribe(results => {

          this.member_card = results;
          if(this.member_card.vital_sign){
            if(this.member_card.vital_sign.BpSystolic){
              this.bp_systolic = this.member_card.vital_sign.BpSystolic;
            }
            
          }
          
          this.healthmodal.show()
        }, err => {
        });
}

  getInsurance(member) {
    this.showPanel = false;
    this.provider_name = member.FirstName + ' ' + member.LastName;
    this.params.providerid = member.id;
    this.showPanel = false;
    // this.provider.uniqeproviderno = member.id;
    // this.commonService.getInsurance(member.id
    //   ).subscribe(results => {

    //     this.insurance_list = results;

    //   }, err => {

    //   });
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



  GeneratePDF(): void {
    this.printing = true;
    // $('#hedis').css('display','none');
    var element = document.getElementById('healthcard');
    var opt = {
       margin:3,
        filename:     `document.pdf`,
        image:        { type: 'jpg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'letter',pagesplit: true, orientation: 'portrait' }
    };

    // html2pdf().set({
    //   pagebreak: { before: '.beforeClass', after: ['#after1', '#after2'], avoid: 'img' }
    // });
    html2pdf().from(element).set(opt).save().then(() => {
      $("#hedis").css("display","block");
    $("#mra").css("display","block");
    this.printing = false;
    this.staticModal.hide();
    });
    
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
    //   this.getAllMembers(true);

    // } else if (term.length == 0) {
    //   this.page = 1;
    //   // this.params.membername = '';
    //   this.getAllMembers(true);
    // }
  }}
test(){
  this.staticModal.show();
  this.ismra=false;
  this.ishedis=false;
  this.isboth=false;

   $("#hedis").removeClass("html2pdf__page-break");
}

  groupingCriteria(id){
if(id==1){
   $("#hedis").removeClass("html2pdf__page-break");
    $("#hedis").css("display","none");
    $("#mra").css("display","block");
    this.isboth = false;
    this.ishedis = false;
}else if(id ==2){
   $("#hedis").removeClass("html2pdf__page-break");
    $("#mra").css("display","none");
    $("#hedis").css("display","block");
    this.isboth = false;
    this.ismra = false;
}else if(id ==3){
  $("#hedis").addClass("html2pdf__page-break");
      $("#hedis").css("display","block");
    $("#mra").css("display","block");
    this.ishedis = false;
    this.ismra = false;
}

}



 //Reset form
  resetForm() {
    // this.fSubmitted = false;
    // this.MRAReviewForm.submitted = false;
    if(this.MRAReviewForm){
      this.MRAReviewForm.form.markAsPristine();
    this.MRAReviewForm.form.markAsUntouched();
    this.MRAReviewForm.form.updateValueAndValidity();
    //to reset form to submiited = false
    this.MRAReviewForm.resetForm();
    }
    
  }

  createReview(member) {
    // this.mra_review_count = [2];
    // this.review = { ...member }
  this.mrareviewproviderid=member.providerid;
    this.files = [];
    this.review.lastofficevisit = '';
    this.review.nextofficevisit = '';
     this.add_review = [];
    this.setprop(member);
  //  this.resetForm();
        this.add_review = [{
          "uniqueid":uniqid(),
  "type":"New Condition",
  "dos":"",
  "diagnosiscode":"",
  "hcccode":"",
  "hcccondition":"",
  "HCCDescription":"",
  "files": []
}];this.folowupDate();
    this.MRAReviewModal.show()
  }

  setprop(member){
    this.review['subscriberid'] =member.subscriberid;
    this.review['providerid'] =member.providerid;
    this.review['healthplanName'] =member.hpname;
    this.review['healthplanid'] =member.healthplanid;
    this.review['providerfirstname'] =member.Provider_FirstName;
    this.review['providermidname'] =member.Provider_MidName;
    this.review['providerlastname'] =member.Provider_LastName;
    this.review['subscriberfirstname'] =member.firstname;
    this.review['subscribermidname'] =member.midname;
    this.review['subscriberlastname'] =member.lastname;
    this.review['gender'] =member.gender;
    this.review['dateofbirth'] =member.dateofbirth;
    this.review['createdbyfirstname'] =this.currentUser.name;
    this.review['createdby'] = this.currentUser.userid;

  }
  addMRAReview(valid) {
    

    if (valid) {

   this.startUploadVideo();
        this.review['conditions']=this.add_review;
        this.review['Team']= this.currentUser.MRATeamId;
        this.review['TeamName']= this.currentUser.MRATeam;
        this.review['providerid']=this.mrareviewproviderid; 
     
      this.commonService.addMRAReview(this.review).subscribe(results => {
        
          this.MRAReviewModal.hide();
        this.getAllMembers(false);
     
        

        // this.insurance_list = results;
      }, err => {

      });
    }
    this.mrareviewproviderid='';

  }
folowupDate()
  {
  

 for(let i=0;i<this.add_review.length;i++)
 {


    if((this.add_review[i].type == "New Condition")||(this.add_review[i].type == "New HCC")||(this.add_review[i].type =="Missed Condition")||(this.add_review[i].type =="Missed HCC")||(this.add_review[i].type =="Suggestion"))
      {
        
       var dateadder=Number(new Date())+5184000000
        var date=new Date(dateadder).toLocaleDateString()
        this.review.folowup=date;
        
        break;
    }

    else{
        
        
          this.review.folowup="";
       
         
    }
 }
    
 
  
  }

  getReviewDetails(member){

this.files = [];
this.review_docs = [];
let obj = {
  'subscriberid' : member.subscriberid,
  'currentrole': this.currentRole,
  'providerid':0,
  'healthplanid':0
}

  this.commonService.getReviewDetails(obj
        ).subscribe(results => {
          if(results){
            this.setprop(member);
          this.review_docs  = results.documents;
          this.add_review = results.conditions;
          this.add_review = this.add_review.map(p => {
           p['files'] = [];
           return p;
          })
          this.review.lastofficevisit = results.lastofficevisit;
          this.review.nextofficevisit = results.nextofficevisit; 

          this.review.folowup = results.folowup;
          
        }else{
          this.add_review = [];
        }

          this.MRAReviewModal.show()
        }, err => {
        });

}


// getfollowupDetails(member){

//   this.commonService.getReviewDetails(member.subscriberid, this.currentRole
//         ).subscribe(results => {

//           this.review_details = results;      
//           this.followupModal.show()
//         }, err => {
//         });
// }




auditReviewSubmission(){
  // let selected = this.review_details.conditions.filter((review) => {
  //   return review.auditstatus == true
  // })

  // let selected = this.review_details.conditions;

 //    let temp = [];

 //    for (let i = 0; i < selected.length; i++) {
 //      temp.push(selected[i].id)
 //    }

    let obj = {
      "uniqueids":this.member_card.mrasuspectedconditions,
      "firstname":this.currentUser.name,
      "userid":this.currentUser.userid
    }

    this.commonService.auditReviewSubmission(obj).subscribe(results => {

     // this.followupModal.hide();

      }, err => {
      });

}

// onChange(e){
//   let last_date = this.review.nextofficevisit;
//   console.log(last_date);
//   this.review.folowup =last_date.setDate(last_date.getDate() + 7);
//   // alert("tr")
// }





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
    // debugger;
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
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.API_BASE + '/fileupload/MRAReview/'+this.add_review[type].uniqueid+'/'+this.review.subscriberid,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'IPA': `${localStorage.getItem('DBNAME')}`} 
    };

    this.uploadInputVideo.emit(event);

    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
      if (type == 'video') {
        this.videofiles.push(output.file);
      } else {

        console.log(output.file);
      console.log(this.add_review);
        output.file["provid"] = Math.random()
        this.add_review[type].files.push(output.file);
      }

    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      if (type == 'video') {

        const index = this.videofiles.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
        this.videofiles[index] = output.file;
      } else {

        console.log(output.file);
      console.log(this.add_review);
        const index = this.add_review[type].files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
        this.add_review[type].files[index] = output.file;
      }


    } else if (output.type === 'done') {
      // remove file from array when removed
      this.checkCount++
      // console.log("check " + this.checkCount);
      console.log(output.file);
      console.log(this.add_review);
  



    } else if (output.type === 'removed') {
      alert("removing")
      // remove file from array when removed
      if (type == 'video') {
        this.videofiles = this.videofiles.filter((file: UploadFile) => file !== output.file);
      } else {
        this.add_review[type].files = this.add_review[type].files.filter((file: UploadFile) => file !== output.file);
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

  startUploadVideo(): void {
    // alert("fff")
    // const event: UploadInput = {
    //   type: 'uploadAll',
    //   url: this.API_BASE + '/fileupload/MRAReview/0/'+this.review.subscriberid,
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'IPA': `${localStorage.getItem('DBNAME')}`},
    //   data: { 'providerid': this.gapSubmit.providerid, 
    //           'healthplanid': this.gapSubmit.healthplanid, 
    //           'ipaid': this.gapSubmit.ipaid
    //         }
      
    // };

    // this.uploadInputVideo.emit(event);

  }
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
          this.healthmodal.hide();
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
          this.healthmodal.hide();
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
  removeGapDoc(file, name, i) {
    console.log("-----------------"+i);
    console.log(file);
    console.log(file.id);
    console.log(file.name);
    if(name !== 'review'){
      this.commonService.removeGapDoc(this.gapSubmit.gapsid, file.filename).subscribe(results => {

      // this.gapSubmit = results;
      this.gapSubmit.gapdoc = results.gapdoc;
      // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
    }, err => {
      // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
    });
    }else {

      if(file.MRAID){
        this.commonService.removeReviewDoc(file.MRAID, file.Filename).subscribe(results => {

      this.add_review = results.conditions;
          this.add_review = this.add_review.map(p => {
           p['files'] = [];
           return p;
          })
          this.review.lastofficevisit = results.lastofficevisit;
          this.review.nextofficevisit = results.nextofficevisit; 

          this.review.folowup = results.folowup;
      // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
    }, err => {
      // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
    });
      }else{
        this.commonService.removeReviewDoc(this.add_review[i].uniqueid, file.name).subscribe(results => {

          this.add_review[i].files = this.add_review[i].files.filter((file1: UploadFile) => file1.id !== file.id);

// this.removeFile(file.id)
      // this.add_review = results.conditions;
      //     this.add_review = this.add_review.map(p => {
      //      p['files'] = [];
      //      return p;
      //     })
      //     this.review.lastofficevisit = results.lastofficevisit;
      //     this.review.nextofficevisit = results.nextofficevisit; 

      //     this.review.folowup = results.folowup;
    }, err => {
      // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
    });
      }
      
    }
    




}
}