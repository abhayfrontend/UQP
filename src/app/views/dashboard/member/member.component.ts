import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MemberService } from '../../../services/member.service';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../views/notifications/notifications.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
  CONTENT_BASE = environment.content_api_base.api_base;
  // Current user details
  currentUser: any;
  currentRole: string;
  currentId: any;
  //global date
  params = {
    'startdate': '',
    'enddate': '',
    'month': '',
    'year': '',
    'subscriberid': ''
  }

  //object for getting videos by role
  memberVideos = {
    'measureid': [],
    'roleid': ''
  }
  videoList: any;
  // Date manipulations
  @ViewChild('userModal') public modal: ModalDirective;

  provider_name: string;
  members: any;
  member_details: any;
  provider_details: any;
  notification_list: any;
  message = {
    'MsgFrom': '',
    'MsgTo': '',
    'MsgBody': '',
    'Subject': '',
    'MsgSender': 'm',
    'SubscriberID': '',
    'ProviderID': '',
    'ReferenceID': 0,
    'RootId': 0,
    'MemberName': '',
    'ProviderName': ''

  };
  showPanel: boolean = true;
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


  days: any;
  date: any;
  current_date = new Date();
  current_month = this.authS.getDates().current_month;
  previous_month = this.authS.getDates().previous_month;
  previous_month_full = this.authS.getDates().previous_month_full;
  current_year = this.authS.getDates().current_year;



  //upload requirements
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;


  //for getting message - provider id or subscriber id - it is provider or member login
  messageid: any;
  userType: string;
  messageList: any;
  vital_signs: any;

  arr1 = [];
  arr2 = [];
  arr3 = [];
  num: number = 0;
  ccda_data: boolean = false;
  member_data: boolean = true;

  medication_list: any;
  problem_list: any;
  procedure_list: any;
  encounterdiagnosis: any;
  constructor(private userService: UserService, public authS: AuthService,
    private router: Router, private memberService: MemberService,
    private commonService: CommonService, private notificationService: NotificationService) {


    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;


    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let user = JSON.parse(localStorage.getItem('currentUser'));

    //get subscriber id of member
    this.currentId = user.subscriberid;
    this.memberVideos.measureid = user.gaps;
    this.memberVideos.roleid = user.roleid;

    this.params.subscriberid = this.currentId;
    this.currentRole = this.authS.getCurrentRole(user.roleid);
    // If it is not a member and other role then redirect it to /dashboard route
    if (this.currentRole != 'member' && this.currentRole != 'undefined') {
      this.router.navigate(['/dashboard']);
    }
    // If user role is undefined then unauthorized
    if (this.currentRole == 'undefined') {
      this.router.navigate(['/user/401']);
    }

    this.currentId = user.subscriberid;

    this.messageid = user.subscriberid;
    this.userType = 'member';
    // this.message.MsgSender = 'm';



  }

  ngOnInit() {

    this.date = {
      'month': this.previous_month,
      'year': this.current_year
    }
    this.formatDate();
    // ominit get memberdetails
    this.getmemberdetails();
    this.getUserVideos();
    this.getNotification();
    this.getMessages();
    this.getvitalsigns();
    this.getmedication();
    this.getproblem();
    this.getprocedure();
    this.getencounterdiagnosis();
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
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }
  //start uploading
  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.API_BASE + '/fileupload/Conversation/' + this.message.RootId,//+'/'+this.message.ReferenceID,//+this.notifId,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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








  //Formatting startdate and enddate
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

  getmemberdetails() {
    this.memberService.getmemberdetails(this.params).subscribe(results => {
      this.member_details = results;
      this.provider_details = results.member_provider[0];
      localStorage.setItem('membersProviderDetail', JSON.stringify(results.member_provider[0]));
      console.log(results);

    }, err => {
    });
  }





  getvitalsigns() {
    this.memberService.getccdadata(this.currentId, 'vitalsign').subscribe(results => {
      this.vital_signs = results;


    }, err => {
    });
  }
  getmedication() {
    this.memberService.getccdadata(this.currentId, 'medication').subscribe(results => {
      this.medication_list = results;


    }, err => {
    });
  }
  getproblem() {
    this.memberService.getccdadata(this.currentId, 'problem').subscribe(results => {
      this.problem_list = results;


    }, err => {
    });
  }
  getprocedure() {
    this.memberService.getccdadata(this.currentId, 'procedure').subscribe(results => {
      this.procedure_list = results;


    }, err => {
    });
  } getencounterdiagnosis() {
    this.memberService.getccdadata(this.currentId, 'encounterdiagnosis').subscribe(results => {
      this.encounterdiagnosis = results;


    }, err => {
    });
  }
  getUserVideos() {
    this.commonService.getUserVideos(this.memberVideos).subscribe(results => {
      this.videoList = results;

    })

  }
  lightbox_open(video, id, e) {
    // console.log(e);

    // let lightBoxVideo: HTMLVideoElement = document.getElementById("VisaChipCardVideo");  
    // var lightBoxVideo = document.getElementById("VisaChipCardVideo");
    // window.scrollTo(0, 0);
    e.target.nextElementSibling.innerHTML = "<div class='light'><video id='VisaChipCardVideo" + id + "' width='600' controls><source src='" + this.CONTENT_BASE + video.videopath + "/" + video.videoname + "' | safe: 'url' type='video/mp4'> </video></div>";
    document.getElementById('fade-video').style.display = 'block';
    let lightBoxVideo: HTMLVideoElement = <HTMLVideoElement>document.getElementById("VisaChipCardVideo" + id);
    // lightBoxVideo.play();
  }

  lightbox_close() {
    // console.log("close");
    // let lightBoxVideo: HTMLVideoElement = <HTMLVideoElement> document.getElementById("VisaChipCardVideo");
    $('.light').remove();
    document.getElementById('fade-video').style.display = 'none';
    // lightBoxVideo.pause();
  }

  createMessage() {
    this.modal.show();
  }

  postMessage() {
    this.message.SubscriberID = this.currentId;
    this.message.ProviderID = this.provider_details.providerid;
    this.message.MsgFrom = this.currentUser.email;
    this.message.MsgTo = this.provider_details.provideremail;

    this.message.MemberName = this.currentUser.name;
    this.message.ProviderName = this.provider_details.providername;

    this.memberService.postMessage(this.message).subscribe(
      res => {
        this.message = res;
        this.startUpload();
        setTimeout(() => {

          this.modal.hide();
          this.files = [];
        }, 1500)

      },
      err => {
        //
      }
    )
  }
  // searchProvider() {
  //   if (this.provider_name.length > 2) {
  //     this.showPanel = true;
  //     this.userService.search_provider(this.provider_name).subscribe(
  //       res => {
  //         this.members = res;
  //       },
  //       err => {
  //         //
  //       }
  //     )
  //   }


  // }

  //     getMember(email) {
  //     this.userService.getMember(email).subscribe(results => {
  //       this.showPanel = false;
  //       let member = results[0];
  //       this.provider_name = member.FirstName + " " + member.MidName + " " + member.LastName;
  //       // this.add_user.User_FirstName = member.FirstName;
  //       // this.add_user.User_MiddleName = member.MidName;
  //       // this.add_user.User_LastName = member.LastName;
  //       // this.add_user.User_Email = member.email;
  //       // this.add_user.User_MobileNumber = member.mobNo;
  //       // this.add_user.User_Provider_ID = member.providerno;
  //       // this.add_user.customFacility = member.customFacility;
  //       // this.add_user.level = member.level;
  //       // this.add_user.title = member.title;


  //   })
  // }

  //GET ROLE WISE NOTIFICATIONS 
  getNotification() {


    this.notificationService.getNotificationByRole(this.currentUser.roleid, this.currentUser.userid).subscribe(results => {
      this.notification_list = results;


    }, err => {

    });
  }


  getMessages() {
    this.commonService.getMessages(this.messageid, this.userType).subscribe(results => {
      this.messageList = results;
      // let arr1 = [];
      // let arr2 = [];
      // let arr3 = [];
      this.messageList.map((msg, i) => {
        msg.mpMessages.map((t) => {
          // console.log(i);
          if (t.MsgSender == 'p') {
            if (i == 0) {
              this.arr1.push(t);
            } else if (i == 1) {
              this.arr2.push(t);
            } else if (i == 2) {
              this.arr3.push(t);
            }

          }
        })
        // this.total_Weight_C += measure.weight;
        // this.total_Score_C += (measure.starscore * measure.weight);
        // this.part_C_Overall = this.total_Score_C / this.total_Weight_C;
        // this.combined_Overall=this.part_C_Overall;

      })
      if (this.arr1.length > 0) {
        this.num = 1;
        if (this.arr2.length > 0) {
          this.num = 2;
        }
        if (this.arr3.length > 0) {
          this.num = 3;
        }

      }
      console.log(this.arr1);
      console.log(this.arr2);
      console.log(this.arr3);
    })



  }

}