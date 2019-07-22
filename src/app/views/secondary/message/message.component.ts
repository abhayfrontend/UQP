
import { Component, OnInit, ElementRef, EventEmitter, ViewChild  } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import { MemberService } from '../../../services/member.service';
// import { ModalDirective } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
  CONTENT_BASE = environment.content_api_base.api_base;
	currentUser: any;
  membersProviderDetail:any;
  currentId: any;

	memberVideos = {
  	'measureid':[],
  	'roleid':''
  }
  messageList:any;
  singleConvo:any;
  replyMsg:string;

     message = {
     'MsgFrom':'',
     'MsgTo':'',
     'MsgBody':'',
     'Subject':'',
     'MsgSender':'',
     'SubscriberID':'',
     'ProviderID':'',
     'ReferenceID':'',
     'RootId':'',
     'MemberName':'',
     'ProviderName':''

   };

   ProviderID:any;
   provideremail:any;
   memberemail:any;

   //for getting message - provider id or subscriber id - it is provider or member login
   messageid:any;
   userType:string;


       //upload requirements
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
checkCount = 0;
selectedItem:any;
 // @ViewChild('userModal') public modal: ModalDirective;
  constructor(private commonService: CommonService, private memberService: MemberService) { 





    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;




this.membersProviderDetail = JSON.parse(localStorage.getItem('membersProviderDetail'));
  	this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.currentId = user.subscriberid;
    if(user.subscriberid){
      this.messageid = user.subscriberid;
      this.userType = 'member';
      this.message.MsgSender = 'm';
      this.message.MemberName = user.name;
      this.message.ProviderName = this.membersProviderDetail.providername;
    }else if(user.providerid){
      this.messageid = user.providerid;
      this.userType = 'provider';
      this.message.MsgSender = 'p';
      this.message.ProviderName = user.name;
      // this.message.membername = user.name;
      
    }
}

  ngOnInit() {
  	this.getMessages();
  }

//get all messages of that member
getMessages(){
this.commonService.getMessages(this.messageid,this.userType).subscribe(results => {
this.messageList = results;
this.selectedItem = this.messageList[0];
let id = results[0].RootId;
this.ProviderID = results[0].ProviderID;
this.provideremail = results[0].mpMessages[0].MsgTo;
this.memberemail = results[0].mpMessages[0].MsgFrom;
this.getSingleConvo(id);


	})



}

scrollSmoothToBottom () {
   var div = document.getElementById('chat-container');
   // $('#chat-container').animate({
   //    scrollTop: div.scrollHeight - div.clientHeight
   // }, 500);
   setTimeout(() => {
     $("#chat-container").scrollTop($("#chat-container")[0].scrollHeight);
   },200)
   

//    $('#chat-container').stop().animate({
//   scrollTop: $('#chat-container')[0].scrollHeight
// }, 800);
}

//Get single message on click on left panel
getSingleConvo(id){
this.commonService.getSingleConvo(id, this.userType).subscribe(results => {
this.singleConvo = results;
this.scrollSmoothToBottom()
  })
}


listClick(event, newValue) {
    console.log(newValue);
    this.selectedItem = newValue;  // don't forget to update the model here
    // ... do other stuff here ...
}

postMessage(convo){
  if(this.userType == 'provider'){
    this.message.SubscriberID = convo.SubscriberID;
  this.message.ProviderID = convo.ProviderID;
  this.message.MsgFrom = this.provideremail;
  this.message.MsgTo = this.memberemail;

  }else{
    this.message.SubscriberID = this.currentId;
  this.message.ProviderID = this.ProviderID;
  this.message.MsgFrom = this.currentUser.email;
  this.message.MsgTo = this.provideremail;

  }
    this.message.MsgBody = this.replyMsg;
  this.message.RootId = convo.RootId;
  this.message.Subject = convo.Subject;
  this.message.MemberName = convo.MemberName;
  this.message.ProviderName = convo.ProviderName;
  
  this.memberService.postMessage(this.message).subscribe(
        res => {
          // this.getSingleConvo(convo.RootId);
          this.replyMsg = '';
          this.message = res;
          this.startUpload();
          if(this.files.length == 0){
            this.getSingleConvo(convo.RootId);
            this.files = [];
          }
//           setTimeout(() => {
// this.getSingleConvo(convo.RootId);
//             // this.modal.hide();
//             this.files = [];
//           },1500)
        },
        err => {
          //
        }
      )
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
      this.checkCount++
      console.log("check "+this.checkCount);
      // console.log(output);
      // console.log(this.files);
      // console.log(this.videofiles);
      let fCount = this.files.length;
      // let checkBadRequest = true;
      // let vCount = this.files.length;
      console.log("total videos "+fCount);
      // console.log(output.file.fileIndex);
      let count = fCount;
      // if (output.file.responseStatus === 400) { // Or whatever your return code status is
      //   this.checkBadRequest = false;
      //   this.disableBtn = false;
      //   this.errorFiles.push(output.file);
      //   console.log(output)
      //   console.log(output.file.response); // This is where you can find your returned object
      // }
      if(this.checkCount == count && output.file){
        
          
      
        this.getSingleConvo(this.message.RootId);
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

    startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.API_BASE + '/fileupload/Conversation/'+this.message.RootId,//+'/'+this.message.ReferenceID,//+this.notifId,
      method: 'POST',
      headers:  { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      data: { ReferenceID: this.message.ReferenceID.toString() }
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
