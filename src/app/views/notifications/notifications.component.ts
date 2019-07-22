import { Component, OnInit, Input, ViewChild,  ElementRef, EventEmitter } from '@angular/core';
import { NotificationService } from './notifications.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { PagerService }  from '../../services/pager.service';
import { environment } from '../../../environments/environment';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss'],
	providers: [NotificationService]
})
export class NotificationsComponent implements OnInit {
	userRolePerm :any;
  API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
  CONTENT_BASE = environment.content_api_base.api_base;
  user:any;
   @ViewChild('fileUpload') fileUpload : ElementRef;
	notif: any = {};
	notifId: number;
	params = {
		'pageNumber': 1,
		'pageSize': 15,
		'status': '',
		'startdate': '',
		'enddate': '',
		'roleid': '',
		'reporttype': '',
      'report': false
	}
	userrolearray
	notifList: any;
	userroleids=[];
	save_add_form: boolean = false;
	user_role: any;
	// userRolePerm:any;
	// fSubmitted:boolean =false;
	// tempName:string;

	//multi select params
	dropdownList = [];
	dropdownData=[];
	selectedusers=[];
	selectedItems = [];
	dropdownSettings = {};
	dropdownSettingsuser = {};

	  //upload requirements
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  // pagination
  page:number=1;
	pager: any = {};
	total_pages:number;
	showPagination:boolean = true;

	@ViewChild('notifModal') public modal: ModalDirective;
	@ViewChild("notificationForm")
	notificationForm: NgForm;
	// @ViewChild("UserRole")
	// UserRole: NgForm;
	constructor(public authS: AuthService, private userService: UserService,
	 private pagerService: PagerService, private notificationService: NotificationService) { 
	this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
}
	//     check(name){
	// getPermission
	//     // return false;
	//     let perm = JSON.parse(localStorage.getItem('permission'));
	//     
	//     let status = false;

	// for(let i=0;i<perm.length;i++){
	//       if(name == perm[i].name){
	//         this.userRolePerm = perm[i]

	//       }

	//     }
	//     return status;
	//   }
	// showSuccess(msg, title) {
	//     this.toastr.success(title, msg);
	//   }
	//   showDanger(msg, title) {
	//     this.toastr.error(title, msg);
	//   }


	ngOnInit() {
		this.user = JSON.parse(localStorage.getItem('currentUser'));
		this.getUserRoles();
		this.getNotifications();
		this.dropdownSettings = {
			singleSelection: false,
			text: "Assign notifications",
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			classes: "myclass mb-sm-0 col-md-4",
			badgeShowLimit: 3
		};
		this.dropdownSettingsuser = {
			singleSelection: false,
			text: "Assign users",
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			classes: "myclass mb-sm-0 col-md-4",
			badgeShowLimit: 3,
			enableSearchFilter: true,
		};
		// this.getUserRoles();
		// this.check('User role')
		// this.userRolePerm = this.authS.getPermission('Role Management');
		
		

		// this.selectedItems = [{itemName: gapScorecard.mname, id:gapScorecard.mid, Measure_ID:gapScorecard.mid}]
let perm = this.authS.getPermission('Notification Management');
    if (perm) {
      this.userRolePerm = perm
    };

	}

	resetFilters() {
		this.params = {
			'pageNumber': 1,
			'pageSize': 15,
			'status': '',
			'startdate': '',
			'enddate': '',
			'roleid': '',
			'reporttype': '',
      'report': false
		}
		this.getNotifications();
	}


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

    startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.API_BASE + '/fileupload/Notifications/'+this.notifId,
      method: 'POST',
      headers:  { 'Authorization': `Bearer ${localStorage.getItem('token')}`,'IPA': `${localStorage.getItem('DBNAME')}` }
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


	getUserRoles() {
		this.userService.getUserRoles().subscribe(results => {

			this.user_role = results;

			for (let i = 0; i < this.user_role.length; i++) {
				this.user_role[i].id = this.user_role[i]['User_Role_ID'];
				this.user_role[i].itemName = this.user_role[i]['User_Role_Name'];
				
				// delete arrayObj[i].key1;
			}
			
			this.dropdownList = this.user_role;
		}, err => {

		});
	}

	getNotifications() {
		    this.params.reporttype='';
    this.params.report = false;
		this.params.startdate = this.params.startdate.toLocaleString()
		this.params.enddate = this.params.enddate.toLocaleString()


		this.notificationService.getNotifications(this.params).subscribe(results => {
			   this.showPagination = true;
   
	 
			   
      	this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;

        this.setPages();
				this.notifList = results.body;
			
			
		}, err => {

		});
	}


  getReport(reporttype) {
    // this.provider.reporttype=reporttype;
    //   this.provider.report = true;

    // let reportDetails = {
    //   //   // 'providername':this.provider_name,
    //   //   'healthplanname':this.healthplanName,
    //   // 'selectedmonth': this.date.month,
    //   'reporttype': reporttype,
    //   'report': true
    // }
    this.params.startdate = this.params.startdate.toLocaleString()
		this.params.enddate = this.params.enddate.toLocaleString()
    this.params.reporttype=reporttype;
    this.params.report = true;

   
	
    this.notificationService.getNotificationsReport(this.params
    ).subscribe(results => {

      if (reporttype == 'pdf') {
        saveAs(results, `notifications-report.pdf`)
      } else {
        saveAs(results, `notifications-report.xlsx`)
      }

    }, err => {
    });
  }


	// updateNotification(id, data) {
	// 	this.notificationService.getNotifications().subscribe(results => {

	// 		this.notifList = results;
	// 	}, err => {

	// 	});
	// }

	measureArray() {
		let temp = [];
   
		for (let i = 0; i < this.selectedItems.length; i++) {
		
			console.log(this.selectedItems)
			temp.push({ 'Role_Id': this.selectedItems[i].User_Role_ID, 'Role_Name':this.selectedItems[i].User_Role_Name  })
			this.userroleids.push(this.selectedItems[i].User_Role_ID);
		}

     
		this.notif.Notification_Role = temp;
		
	}
	measureUsers()
	{
		
		let temp=[];
		for(let i=0;i<this.selectedusers.length;i++){
			temp.push(this.selectedusers[i]);
		}
		
		this.notif.Notification_UserSpecific=temp;
	}



	onItemSelectuser(item: any) {
		
		// console.log(item);
		// console.log(this.selectedItems);
		// this.params.measureid.push(item.id)
	}
	OnItemDeSelectuser(item: any) {
		// console.log(item);
		// console.log(this.selectedItems);
	}
	onSelectAlluser(items: any) {
		// console.log(items);
	}
	onDeSelectAlluser(items: any) {
	
	}
	onItemSelect(item: any) {
		
		
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
	editNotif(id) {
		
		
		
		if(this.fileUpload){
        this.fileUpload.nativeElement.value = "";
      }
		this.notificationForm.resetForm();
		this.save_add_form = false;
		this.notif = {};
		this.notifId = id;
      this.files = [];
	  this.selectedItems = [];
	  this.selectedusers=[];
	  
		this.getNotification(id);
		this.modal.show()
	}

	createNotif() {
		
		this.notificationForm.resetForm();
this.notif={};
this.files = [];
this.selectedItems = [];
this.selectedusers=[];
		this.save_add_form = true;
		if(this.fileUpload){
        this.fileUpload.nativeElement.value = "";
      }
		//   this.add_user_role = {
		//   User_Role_Name: '',
		//   User_Role_Description:'',
		//   CreatedBy:2,
		//   CreatedDate:"1905-06-15T00:00:00",
		//   ModifiedBy:2,
		//   ModifiedDate:"1905-06-15T00:00:00",
		//   Status:true
		// };
		// this.resetForm();
		this.modal.show()
	}
	updateNotif(valid, id, notif) {
		
		if(this.fileUpload){
        this.fileUpload.nativeElement.value = "";
      }
		if (valid && this.selectedItems.length) {
			this.measureArray()
			this.notificationService.updateNotification(id, notif).subscribe(results => {
				this.modal.hide();
				this.startUpload();
				this.getNotifications();
				// this.showSuccess('Update user role',role.User_Role_Name+' role updated successfully')
			}, err => {
				// this.showDanger('Update user role',role.User_Role_Name+' role update failed')  
			});
		}

	}
getUserFromRoles()
{
	// debugger;
	// this.selectedusers = [];
	this.userroleids = [];
	console.log(this.selectedusers)
	this.measureArray();
	this.userService.getUserByRoles(this.userroleids).subscribe(results=>{
		
            this.userrolearray=results;
			for (let i = 0; i < this.userrolearray.length; i++) {
				this.userrolearray[i].id = this.userrolearray[i]['user_id'];
				this.userrolearray[i].itemName = this.userrolearray[i]['lastname']+','+this.userrolearray[i]['firstname']+"  "+'('+this.userrolearray[i]['emailid']+')';
				
				// delete arrayObj[i].key1;
			}
			this.dropdownData = this.userrolearray;
	},err=>{});
	
}

  removeNotifDoc(file, valid) {
    // this.gapSubmit.SubscriberID = this.gapMember.SubscriberID;
    // this.gapSubmit = {...this.gapsEssentials,...this.gapSubmit}

    this.notificationService.removeNotifDoc(this.notif.Id, file.Filename).subscribe(results => {

      this.notif = results;




      // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
    }, err => {
      // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
    });


  }
	// cancelUpdate(id){
	//   this.hideme[id]=!this.hideme[id];
	//   this.getUserRoles();
	// }
	// resetForm(){
	//   this.fSubmitted = false;
	//  this.UserRole.form.markAsPristine();
	//       this.UserRole.form.markAsUntouched();
	//       this.UserRole.form.updateValueAndValidity();
	//       // this.UserList.reset();form.reset()
	// }

	// getUserRoles(){

	//   this.userService.getUserRoles().subscribe(results => {

	//     this.user_role = results;
	//   },err => {

	//   });
	// }
	clear()
	{
		this.selectedusers=[];
		this.notif.Notification_UserSpecific=[];
	}
	getNotification(id) {
		this.notificationService.getNotification(id).subscribe(results => {

			this.notif = results;
			this.getUserNotification(results);
			let arr = results.Notification_Role;
			

			for (let i = 0; i < arr.length; i++) {
				arr[i].id = arr[i]['Role_Id'];
				arr[i].itemName = arr[i]['Role_Name'];

				arr[i].User_Role_ID = arr[i]['Role_Id'];
				arr[i].User_Role_Name = arr[i]['Role_Name'];
				// delete arrayObj[i].key1;
			}
			// this.dropdownList = arr;


			this.selectedItems = arr;
		  
   console.log(this.selectedItems)
		
			// this.measureArray();
		}, err => {

		});
	}
getUserNotification(results)
{
	
	let temp = [];
	this.userroleids=[];
	let arrmember=results.Notification_Role;

		for (let i = 0; i <arrmember.length; i++) {
			
			this.userroleids.push(arrmember[i].Role_Id);
		}
		this.userService.getUserByRoles(this.userroleids).subscribe(results=>{
		
			this.userrolearray=results;
			for (let i = 0; i < this.userrolearray.length; i++) {
				this.userrolearray[i].id = this.userrolearray[i]['user_id'];
				this.userrolearray[i].itemName = this.userrolearray[i]['lastname']+','+this.userrolearray[i]['firstname']+"  "+'('+this.userrolearray[i]['emailid']+')';
				
				// delete arrayObj[i].key1;
			}
			this.dropdownData=this.userrolearray;
			
			
	},err=>{});


	let arrofuser=results.Notification_UserSpecific;
	for (let i = 0; i < arrofuser.length; i++) {
		arrofuser[i].id = arrofuser[i]['user_id'];
		arrofuser[i].itemName = arrofuser[i]['lastname']+','+arrofuser[i]['firstname']+"  "+'('+arrofuser[i]['emailid']+')';
	 }
	 this.selectedusers=arrofuser;
	 
}
	

	addNotif(valid) {
	
		// this.fSubmitted = true;
		if (valid && this.selectedItems.length) {
			this.notif.creatordepartment = this.user.rolename;
			this.notif.creatoremail = this.user.email;
			this.notif.creatorname = this.user.name;
			this.measureArray()
			this.measureUsers()
			
			this.notificationService.addNotification(this.notif).subscribe(
				res => {
					this.notifId = res.Id;
					this.startUpload()
					
					setTimeout(() => {
						this.modal.hide();
						this.getNotifications();
					},2000)
					
					// this.getUserRoles();
					// this.showSuccess('Add user role',this.add_user_role.User_Role_Name+' role created successfully')
					if (res.status == 200) {
					}
				},
				err => {this.modal.hide();
					// this.showDanger('Add user role',this.add_user_role.User_Role_Name+' role creation failed') 
				})
		}
	}

	//   checkUserRoleName(name){
	//     if(!this.save_add_form){
	//       this.role_name_exist = false;
	// if(this.tempName !== name){
	//       this.userService.checkUserRoleName(name).subscribe(
	//         res => {
	//           this.role_name_exist = res;
	//         },
	//         err => {
	//       //
	//         })
	//     }
	//     }else{
	//       this.userService.checkUserRoleName(name).subscribe(
	//         res => {
	//           this.role_name_exist = res;
	//         },
	//         err => {
	//       //
	//         })
	//     }


	//   }

	// search() {
	//   if(this.search_text.length>0){
	//     this.userService.search_role(this.search_text).subscribe(
	//       res => {
	//         this.user_role = res;
	//       },
	//       err => {
	//     })
	//   }else {
	//     this.getUserRoles();
	//   }
	// }

	updateNotifStatus(id, status, name){
	  let fromStatus = status?'Active':'Inactive';
	      let toStatus = !status?'Active':'Inactive';
	  this.notificationService.updateNotifStatus(id, !status).subscribe(results => {
	  // this.showSuccess('Update role status',name+' changed from '+fromStatus+' to '+toStatus)
	  },err => {
	    // this.showDanger('Update role status',name+ ' User role status update failed') 
	  });
	}

		loadByPage(page_number: number) {
			if (page_number < 1 || page_number > this.pager.total_pages) {
        return;
      }
			this.page = page_number;
			
			this.params['pageNumber'] = this.page
			this.getNotifications();
			// window.scrollTo(0, 200);
		}


		setPages() {
      // get pager object from service
      this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);	
		}

}
