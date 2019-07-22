import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { saveAs } from 'file-saver';

import { MraService } from '../../../services/mra.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-census-report',
  templateUrl: './census-report.component.html',
  styleUrls: ['./census-report.component.scss']
})
export class CensusReportComponent implements OnInit {
API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
CONTENT_BASE = environment.content_api_base.api_base;
   search_category: string = '';
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;
  currentUser: any;

  responselist:any;
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
  membercensusid:any;
  // search_category:string='';
  healthplanName: string = 'All';

  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'startdate': '',
    'enddate': '',
    
    
    'member_id': '',
   
    
    'status':null,
    'report':false,
    'name':null
  }
 updateparam={
  'startdate':'',      
      'enddate': '',   
     'subscriberid': '',        
     'userid':'',   
     'comment':''
     } 
  editdate:any={
  admit:'',
  discharge:''
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

  // member report card params
 

// MRA review params
 // add_review : Array<[{type: any, dos: any, dc:any}]>
 // add_review: Array<{type: any, dos: any, dc:any}> = [];

  years: string[] = [];
  date: any= {
      // 'month':this.current_month,
      'month': "",
      'year': ""
    };
  days: any;
  current_date = new Date();
  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month;
  current_year = this.authS.getDates().current_year;
  currentRole:string;
  @ViewChild('term') input: ElementRef;
  @ViewChild('userModal') public modal: ModalDirective;
  @ViewChild('fileUpload') fileUpload : ElementRef;
mindate:Date;
  maxdate:Date;




       //upload requirements
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
checkCount = 0;
selectedItem:any;


 

 
  constructor(public authS: AuthService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService,  private mraService: MraService,
    private pagerService: PagerService,  private cdr: ChangeDetectorRef,
    private userService: UserService) { 


    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;


    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.currentRole = this.authS.getCurrentRole(user.roleid);
       
    if(this.currentRole == 'audit'){
      this.params['review'] = true;
    }
    // this.add_review.push(this.review_obj);
  }

  ngOnInit() {

  // CONTENT_BASE = environment.content_api_base.api_base;
    this.mindate=new Date();
 this.maxdate=new Date();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.updateparam.userid=this.currentUser.userid;
    this.getAllHealthplans();

  
    
    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }

    //check if provider is entering then get details a/c to that provider
    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    this.date = {
      // 'month':this.current_month,
      'month': this.previous_month,
      'year': this.current_year
    }
    this.checkMonth(this.current_year)


    if (this.rolename == 'provider') {
      this.params['providerid'] = this.roleid;
      this.commonService.getInsurance(this.roleid
        ).subscribe(results => {

          this.insurance_list = results;
        }, err => {
        });
      }else if (this.rolename == 'ipa') {
        // this.params['IPA_ID'] = this.currentUser.ipaid;
      }else if(this.rolename == 'healthplan'){
        this.params['healthplanid'] = this.currentUser.healthplanid;
        this.getAllMembers(false);
      }else if(this.rolename == 'audit'){

      this.params['review'] = true;
    this.getAllMembers(false);
      }

     this.getAllMembers(true);
    // this.checkMonth(this.current_year)

    // this.getAllMembers(false);
  }

  ngOnDestroy(){

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

   editRole(user) {
   this.updateparam.comment="";
    this.files = [];
    if(this.fileUpload){
      this.fileUpload.nativeElement.value = "";
    }
      this.updateparam.subscriberid=user.member_id;
   this.userService.editcensusreport(user.member_id).subscribe(results=>{
   
  this.responselist=results;
  this.editdate.admit=this.responselist.admitdate;
  this.editdate.discharge=this.responselist.dischargedate;
   },err=>{});
   
   // this.editdate.admit=Date.parse(this.editdate.admit)
   // console.log(this.editdate)
    this.modal.show()
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

  // search(term) {
  //   // this.checkCategory(term)
  //   this.params['providername'] = term;
  //   if (term.length > 2) {

  //     this.getAllMembers(true);

  //   } else if (term.length == 0) {

  //     this.getAllMembers(true);
  //   }
  // }

  // cc(){
  //   for(let i =0;i<5;i++){
  //     this.member_card1 = this.member_list[i];
  //     this.GeneratePDF();
  //   }
  // }
 


    getAllMembers(resetPage) {
      localStorage.removeItem('subplan');
      if (resetPage) {
        this.params['pageNumber'] = 1
        this.page = 1;
      }
    // this.page=1;
      
    this.commonService.getCensusReport(this.params).subscribe(results => {
      this.showPagination = true;
  console.log(results)
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.member_list = results.body

      this.setPages();
    }, err => {
    });
  }

   getReport(type) {
  
  
    this.params['report'] = true;
    this.commonService.getCensusReport(this.params
      ).subscribe(results => {

        if (type == 'pdf') {
          saveAs(results, `census-report.pdf`)
        } else {
          saveAs(results, `census-report.xlsx`)
        }

      }, err => {
      });
    }
  updateDate(){
         
   this.updateparam.startdate=this.editdate.admit;
   this.updateparam.enddate=this.editdate.discharge;
   console.log(this.updateparam)
   this.userService.updateCensususer(this.updateparam).subscribe(results=>{
    this.startUpload();
    setTimeout(() => {
      this.modal.hide()
    },1500)
   },err=>{});
    

      }

  resetFilters(){
    this.provider_name = '';
    this.params.status=null;
    if (this.rolename == 'provider') {
     this.params['providerid'] = this.roleid;
    }
    
    this.date = {
      // 'month':this.current_month,
      'month': this.previous_month,
      'year': this.current_year
    }
    this.checkMonth(this.current_year)
    this.input.nativeElement.value = "";
    this.params['membername'] = '';
    this.params['name'] = null;
    this.params['member_id'] = '';
    
    this.params.startdate = this.date.year + '-' + this.date.month + '-01';
    this.params.enddate = this.date.year + '-' + this.date.month + '-' + this.days;
    this.getAllMembers(true);
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

    
  search(term) {
   if (this.search_category == 'name') {

      this.params['membername'] = term;
      this.params['subsId'] = '';
      this.params['dob'] = '';
    } else if (this.search_category == 'id') {

      this.params['membername'] = '';
      this.params['subsId'] = term;
      this.params['dob'] = '';
    }else if (this.search_category == 'dob') {

      this.params['membername'] = '';
      this.params['subsId'] = '';
      this.params['dob'] = term;
    }
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


  


// upload requirements
    onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'done') {
      // remove file from array when removed
   

      
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

    startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',

      url: this.API_BASE + '/fileupload/CensusDocument/'+this.updateparam.subscriberid,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'IPA': `${localStorage.getItem('DBNAME')}`},

    };

    this.uploadInput.emit(event);
  }


  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }


 
  



}