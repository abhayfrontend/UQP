import { Component, OnInit, EventEmitter, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { PagerService } from '../../services/pager.service';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { saveAs } from 'file-saver';
import * as $ from 'jquery';
// import { GapModalComponent } from '../../base/components/gap-modal/gap-modal.component';
@Component({
  selector: 'app-gaps',
  templateUrl: './gaps.component.html',
  styleUrls: ['./gaps.component.scss']
})
export class GapsComponent implements OnInit {
  search_category: string = '';
  API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
  CONTENT_BASE = environment.content_api_base.api_base;
  @ViewChild('userModal') public modal: ModalDirective;
  @ViewChild('childGapTemplate') childGapTemplate;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  // @ViewChild(GapModalComponent) child: GapModalComponent;
  //upload requirements
  @ViewChild('term') input: ElementRef;
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  videofiles: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  uploadInputVideo: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  // To check acl add/edit/view
  userRolePerm: any;

  measures: any;
  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'subsId': '',
    'membername': '',
    'type': '',
    'report': false
  }
  gapsEssentials: any;
  gapMeasures: any;
  pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  // members:any;
  member_list: any;
  provider_name: any;
  selectedMonth: string;
  healthplanName: string;
  fromDashboard: boolean = false;
  ipaName: string;
  page: number = 1;
  pager: any = {};
  total_pages: number;
  gaps: any;
  memberCategory: string;
  // current_date = new Date(); 
  //   current_year = this.authS.getDates().current_year;
  bsValue: Date = new Date();
  bsValue1: Date = new Date();
  bsValue2: Date = new Date();
  gapMember: any;
  gapSubmit: any = {};
  numanalysis:any;
  checkCount = 0;
  errorFiles: any;
  checkBadRequest: boolean = true;
  letPass: boolean = false;
  disableBtn: boolean = false;
  disclaimer: boolean = false;

  showBrowseFilesBtn: boolean = false;
  showChildModalBtn: boolean = true;

  constructor(public authS: AuthService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService,
    private pagerService: PagerService, private toastr: ToastrService, private cdr: ChangeDetectorRef) {
    this.files = []; // local uploading files array
    this.videofiles = [];
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.uploadInputVideo = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }
  showSuccess(msg, title) {
    this.toastr.success(title, msg);
  }
  showDanger(msg, title) {
    this.toastr.error(title, msg);
  }
  ngOnInit() {

    this.getMeasures();

    this.userRolePerm = this.authS.getPermission('Overall Gap');

    // sidebar and header hide when opening new window
    $('div.sidebar, header').css('display', 'none');
    $('.sidebar-fixed .main, .sidebar-fixed .app-footer ').css('margin-left', '0px');
    $('.header-fixed .app-body').css('margin-top', '0px');

    this.route.params.subscribe(params => {
      this.memberCategory = params['term'];
    });

    let providerScorecard = JSON.parse(localStorage.getItem('providerScorecard'));
    let gapMeasures = JSON.parse(localStorage.getItem('gapMeasures'));
    let measureid = localStorage.getItem('measureid');
    let measurename = localStorage.getItem('measurename');
    this.selectedMonth = localStorage.getItem('selectedMonth');
    this.healthplanName = localStorage.getItem('healthplanName');
    this.ipaName = localStorage.getItem('ipaName');
    this.fromDashboard = JSON.parse(localStorage.getItem('fromDashboard'));
    localStorage.removeItem('fromDashboard');
    this.gapsEssentials = providerScorecard;
    this.gapsEssentials.measureid = measureid;
    this.gapsEssentials.measurename = measurename;
    this.gapMeasures = gapMeasures;
    this.gaps = localStorage.getItem('gaps');
    this.provider_name = localStorage.getItem('provider_name');
    // this.getMeasures();
    // this.getGaps(false);

    //If we need to show gaps then hit gap api
    if (this.memberCategory == 'gaps') {
      this.getGaps(false);
    } else {
      // All other den, num, total members have same api
      this.getScorecardMembers();
    }
   // this.numanalysis=JSON.parse(localStorage.getItem('numeratoranalysis'));
   //      if(localStorage.getItem('numeratoranalysis'))

   //        {
   //         this.params['report']=false;
   //         this.params['enddate']=this.numanalysis['enddate'];
   //         this.params['startdate']=this.numanalysis['startdate'];
   //         this.params['healthplanid']=this.numanalysis['healthplanid'];
   //         this.params['measureid']=0;
   //         this.params['month']=this.numanalysis['month'];
   //         this.params['year']=this.numanalysis['year'];
   //         this.getScorecardMembers();
   //        }

  }
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
      console.log("total videos " + fCount);
      // console.log(output.file.fileIndex);
      let count = fCount;
      if (output.file.responseStatus === 400) { // Or whatever your return code status is
        this.checkBadRequest = false;
        this.disableBtn = false;
        this.errorFiles.push(output.file);
        console.log(output)
        console.log(output.file.response); // This is where you can find your returned object
      }
      if (this.checkCount == count && output.file) {
        if (this.checkBadRequest) {

          this.modal.hide();
          this.getGaps(false);
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
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'IPA': `${localStorage.getItem('DBNAME')}` }
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

 ngOnDestroy() {
    localStorage.removeItem('numeratornalysis');
    
  }

  getMeasures() {
    this.commonService.getMeasures().subscribe(results => {

      this.measures = results;
    }, err => {

    });
  }

  getMeasureName(id) {
    let mName;
    for (let i = 0; i < this.measures.length; i++) {
      if (id == this.measures[i].Measure_ID) {
        mName = this.measures[i].Measure_Name;
        break;
      }

    }
    return mName;
  }
resetFilters()
{

 this.input.nativeElement.value='';
  this.search_category='';
  this.params['membername'] = '';
      this.params['subsId'] = '';
      this.params['dob'] = '';
   if (this.memberCategory == 'gaps') {
      this.getGaps(false);
    } else {
      // All other den, num, total members have same api
      this.getScorecardMembers();
    }
}
  getScorecardMembers() {


    //        this.params = {
    //   'pageNumber': 1,
    //   'pageSize': 15
    // }
    this.params.report = false;
    this.params.type = '';
    this.commonService.getScorecardMembers(this.gapsEssentials, this.params, this.memberCategory).subscribe(results => {
      // console.log(results.json());
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.member_list = results.body
      this.setPages();
      // this.setPages();
    }, err => {
      // this.spinner = false;
    });
  }

  //Report downloading excel and pdf logic
  getReport(type) {

    //extra params to add for report
    let reportDetails = {
      'providername': this.provider_name,
      'healthplanname': this.healthplanName,
      'ipaname': this.ipaName,
      // 'selectedmonth':this.selectedMonth,
      // 'type': type,
      // 'report': true
    }
    this.params.type = type;
    this.params.report = true;
    // var obj = Object.assign(this.provider);
    var reportParams = { ...this.params, ...reportDetails };
    // console.log(reportParams)
    if (this.memberCategory == 'gaps') {

      this.commonService.getListingGapReport(this.gapsEssentials, reportParams, this.memberCategory
      ).subscribe(results => {

        if (type == 'pdf') {
          saveAs(results, `gap-analysis.pdf`)
        } else {
          saveAs(results, `gap-analysis.xlsx`)
        }

      }, err => {
      });

    } else {
      this.commonService.getListingReport(this.gapsEssentials, reportParams, this.memberCategory
      ).subscribe(results => {

        if (type == 'pdf') {
          saveAs(results, `${this.memberCategory}.pdf`)
        } else {
          saveAs(results, `${this.memberCategory}.xlsx`)
        }

      }, err => {
      });
    }

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
            this.getGaps(false);
          }, 1000)
        }
        // setTimeout(() => {
        //   this.modal.hide();
        //   this.gapSubmit = {}
        //   this.getGaps(true);
        // }, 2500)
        // setTimeout(() => {
        //   // this.modal.hide();
        //   // this.gapSubmit = {}
        //   // this.getGaps(true);
        // }, 1500)



        // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
      }, err => {
        this.disableBtn = false;
        // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
      });
      // txt = "You pressed OK!";
    } else {
      this.disableBtn = false;
      // txt = "You pressed Cancel!";
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
            this.getGaps(false);
          }, 1000)
        }
        // setTimeout(() => {
        //   this.modal.hide();
        //   this.gapSubmit = {}
        //   this.getGaps(true);
        // }, 2500)



        // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
      }, err => {
        this.disableBtn = false;
        // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
      });
    } else {
      this.disableBtn = false;
    }



  }
  removeGapDoc(file, valid) {
    this.commonService.removeGapDoc(this.gapSubmit.gapsid, file.filename).subscribe(results => {

      this.gapSubmit.gapdoc = results.gapdoc;
      // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
    }, err => {
      // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
    });


  }

  // calculateAge(birthday) {
  //   if(birthday){
  //       let age = birthday.split('-')
  //     return this.current_year - age[0];
  //   }


  // }

  getGaps(setpage) {
    if (setpage) {
      this.page = 1;
      this.params['pageNumber'] = 1;
      this.params['pageSize'] = 15

    }

    this.params.report = false;
    this.params.type = '';
    this.commonService.getGaps(this.gapsEssentials, this.params).subscribe(results => {
      // console.log(results.json());
      
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.member_list = results.body;
      this.healthplanName = this.member_list[0].hpname;
      if(this.member_list.length){
        this.gapsEssentials.measurename=results.body[0].measname;
      }
      
      this.setPages();
      // this.setPages();
    }, err => {
      // this.spinner = false;
    });
  }

  setMemberDetails(member) {
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

    // $('#upload-file').remove();
    // $('.upload-button').html(`<input type="file" id="upload-file" ngFileSelect [options]="options" (uploadOutput)="onUploadOutput($event,'video')" [uploadInput]="uploadInput" multiple>`)
    // alert("Gtrg")
    // this.child.getNdcCodes(this.gapSubmit.measureid)
    // if(!member.submitted){
    this.disableBtn = false;
    this.letPass = false;
    this.disclaimer = false;
    this.showBrowseFilesBtn = false;
    this.showChildModalBtn = true;
    //To reset input type file previously attached uploaded file
    if (this.fileUpload) {
      this.fileUpload.nativeElement.value = "";
    }
    if (member.Isgapssubmit == 'notsubmitted') {

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
      this.gapSubmit.startdate = this.gapsEssentials.startdate;
      this.gapSubmit.enddate = this.gapsEssentials.enddate;
      this.setMemberDetails(member);
      // this.measureName = member.measname;
      this.modal.show();
      // console.log($('#upload-file').prop('files'))
    } else {
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
      this.commonService.getGapDetail(this.gapSubmit).subscribe(results => {
        //to update selected ndc code in child component for searchable
        this.childGapTemplate.retreiveNDCList(results);
        this.gapSubmit = results;
        this.setMemberDetails(member);
        // this.measureName = member.measname;
        this.modal.show();
        // if($('#upload-file').prop('files')[0]){
        //   $('#upload-file').prop('files')[0].name = "No file chosen"
        // }

        // handleChange(event: Event) {
        //     console.log((<HTMLInputElement>event.target).files[0].name);
        // }
        // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
      }, err => {
        // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
      });
    }
    if (this.gapSubmit.measureid == 7) {
      // this.gapSubmit.nd

      this.childGapTemplate.getBrandNames(this.gapSubmit.measureid)

    }
    this.cdr.detectChanges();
  }


  loadByPage(page_number: number) {
    if (page_number < 1 || page_number > this.pager.total_pages) {
      return;
    }
    this.page = page_number;
    // console.log("Page"+this.page)
    // console.log("Page numbe"+page_number)
    this.params['pageNumber'] = this.page
    // this.getGaps(false);
    if (this.memberCategory == 'gaps') {
      this.getGaps(false);
    } else {
      this.getScorecardMembers();
    }
    // window.scrollTo(0, 200);
  }


  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
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
  search(term) {
    this.params.report = false;
    this.params.type = '';
    this.checkCategory(term)

    if (term.length > 2) {
      this.params.pageNumber = 1;
      this.page = 1;

      if (this.memberCategory == 'gaps') {
        this.getGaps(true);
      } else {
        this.getScorecardMembers();
      }


    } else if (term.length == 0) {
      this.params.pageNumber = 1;
      this.page = 1;
      // this.params.membername = '';
      if (this.memberCategory == 'gaps') {
        this.getGaps(true);
      } else {
        this.getScorecardMembers();
      }
    }
  }
}
//getGaps(true)