import { Component, OnInit, ElementRef, EventEmitter, ViewChild } from '@angular/core';

import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
@Component({
  selector: 'app-bulk-mail',
  templateUrl: './bulk-mail.component.html',
  styleUrls: ['./bulk-mail.component.scss']
})
export class BulkMailComponent implements OnInit {
  API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
  MAIL_BASE = environment.api_base.mailBase + "/" + environment.api_base.apiPath;
  CONTENT_BASE = environment.content_api_base.api_base;
  isProvider: any = null;
  ishealthplan: boolean = false;
  isIPA: boolean = false;
  isMeasure: boolean = false;

  providerAll: boolean = false;
  memberAll: boolean = false;
  show: boolean = false;
  healthplanid: number;
  healthplanList: any;
  measures: any;
  ipaid: number;
  ipa_list: any;
  healthplan_list: any;
  providerList: any;

  itemList = [];
  selectedItems = [];
  settings = {};
  measuresettings = {};
  emailbody: any;
  emailsubject: any;
  mailid: number;

  //upload requirements
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  checkCount = 0;
  constructor(private commonService: CommonService) {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }
  ngOnInit() {
    this.getAllIPA();
    this.getAllHealthplans();
    this.getMeasures();
    
    this.settings = {
      singleSelection: false,
      text: "Select Providers",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 12,
      labelKey: 'providername',
      primaryKey: 'providerid'
    };
 
    this.measuresettings = {
      singleSelection: false,
      text: "Select Measures",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 12,
      labelKey: 'Measure_Name',
      primaryKey: 'Measure_ID'
    };
  }
  onItemSelect(item: any) {
    // console.log(item);  
    // console.log(this.selectedItems);
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

  getAllIPA() {
    this.commonService.getAllIPA().subscribe(results => {

      this.ipa_list = results;
    }, err => {

    });
  }

  getMeasures() {
    this.commonService.getMeasures().subscribe(results => {

      this.measures = results;
    }, err => {

    });
  }
  getAllHealthplans() {
    this.commonService.getAllHealthplans().subscribe(results => {

      this.healthplan_list = results;
    }, err => {

    });
  }

  //get all messages of that member
  getProviders(type) {
    let id;
    this.itemList = [];
    this.selectedItems = [];
    if (type == "healthplan") {
      id = this.healthplanid;
    } else {
      id = this.ipaid;
    }
    this.commonService.getProviders(id, type).subscribe(results => {
      this.itemList = results;

      // this.getSingleConvo(id);


    })



  }

//posting data
  postBulkmailDetails(type) {
    let arr = [];
    let measurearr = [];
    if (this.isMeasure) {
      this.selectedItems.map((i) => {
        measurearr.push(i.Measure_ID)
      })
    } else {
      this.selectedItems.map((i) => {
        arr.push(i.providerid)
      })
    }

    let data = {
      'allproviders': this.providerAll,
      'allmembers': this.memberAll,
      'providerid': arr,
      'measureid': measurearr,
      'emailbody': this.emailbody,
      'emailsubject': this.emailsubject,
      'attachment': this.files.length > 0 ? true : false

    }
    this.commonService.postBulkmailDetails(type, data).subscribe(
      res => {
        // this.getSingleConvo(convo.RootId);
        this.mailid = res;
        this.startUpload();
      },
      err => {
        //
      }
    )
  }


  groupingCriteria() {
    this.itemList = [];
    this.selectedItems = [];
    this.healthplanid = undefined;
    this.ipaid = undefined;
    if (!this.ishealthplan) {
      this.isIPA = false;
      this.isMeasure = false;
    } else if (!this.isIPA) {
      this.ishealthplan = false;
      this.isMeasure = false;
    } else if (!this.isMeasure) {
      this.ishealthplan = false;
      this.isIPA = false;
    }
  }

  offCategoryMail() {
    this.ishealthplan = false; this.isIPA = false; this.isMeasure = false;
    this.itemList = [];
    this.selectedItems = [];
    this.healthplanid = undefined;
    this.ipaid = undefined;
  }

  resetState(type) {
    if (type == 'member') {
      this.isProvider = false;
      this.providerAll = false;
    } else {
      this.isProvider = true;
      this.memberAll = false;
    }
    this.itemList = [];
    this.selectedItems = [];
    this.ishealthplan = false;
    this.isIPA = false;
    this.isIPA = false; this.isMeasure = false;
    this.healthplanid = undefined;
    this.ipaid = undefined;
  }


  // upload requirements
  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      // const event: UploadInput = {
      //   type: 'uploadAll',
      //   url: '/upload',
      //   method: 'POST',
      //   data: { foo: 'bar' }
      // };
      // this.uploadInput.emit(event);
      this.checkCount = 0;
      console.log($('.upload-file'));
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
      if (this.files.length == 0) {
        if (output.file.size > 20971520) {
          alert('size limit exceeded')
        } else {
          this.files.push(output.file);
        }

        // this.files.push(output.file);
      } else {
        alert("can upload only one file")
      }

    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'done') {
      // remove file from array when removed
      this.checkCount++
      console.log("check " + this.checkCount);
      // console.log(output);
      // console.log(this.files);
      // console.log(this.videofiles);
      let fCount = this.files.length;
      // let checkBadRequest = true;
      // let vCount = this.files.length;
      // console.log("total videos "+fCount);
      // console.log(output.file.fileIndex);
      let count = fCount;
      // if (output.file.responseStatus === 400) { // Or whatever your return code status is
      //   this.checkBadRequest = false;
      //   this.disableBtn = false;
      //   this.errorFiles.push(output.file);
      //   console.log(output)
      //   console.log(output.file.response); // This is where you can find your returned object
      // }
      if (this.checkCount == count && output.file) {



        // this.getSingleConvo(this.message.RootId);
        this.files = [];

        // this.getVideos();
      }




    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }
  //upload file logic
  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.MAIL_BASE + '/fileupload/mail/' + this.mailid,//+'/'+this.message.ReferenceID,//+this.notifId,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // data: { ReferenceID: this.message.ReferenceID.toString() }
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
