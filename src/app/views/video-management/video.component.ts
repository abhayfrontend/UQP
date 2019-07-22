import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { VideoService } from './video.service';
import { UserService } from '../../services/user.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { PagerService } from '../../services/pager.service';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';
@Component({
	selector: 'app-videos',
	templateUrl: './video.component.html',
	styleUrls: ['./video.component.scss'],
	providers: [VideoService]
})
export class VideoComponent implements OnInit {

	userRolePerm: any;
	API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
	CONTENT_BASE = environment.content_api_base.api_base;
	user: any;
	measures: any;
	mock = {
		'measureid': 2,
		'roleid': 1
	}
	video: any = {};
	videoId: number;
	params = {
		'pageNumber': 1,
		'pageSize': 15,
		'status': '',
		'measureid': '',
		'roleid': ''
	}
	videoList: any;
	save_add_form: boolean = false;
	user_role: any;
	// userRolePerm:any;
	// fSubmitted:boolean =false;
	// tempName:string;

	//multi select params
	dropdownList = [];
	selectedItems = [];
	dropdownSettings = {};

	//upload requirements
	options: UploaderOptions;
	formData: FormData;
	files: UploadFile[];
	videofiles: UploadFile[];
	uploadInput: EventEmitter<UploadInput>;
	uploadInputVideo: EventEmitter<UploadInput>;
	humanizeBytes: Function;
	dragOver: boolean;


	checkCountVideo = 0;
	checkCountFile = 0;
	// pagination
	page: number = 1;
	pager: any = {};
	total_pages: number;
	showPagination: boolean = true;
	//decorator
	@ViewChild('videoModal') public modal: ModalDirective;
	@ViewChild("videoForm")
	videoForm: NgForm;
	@ViewChild('fileUpload') fileUpload: ElementRef;
	@ViewChild('videoUpload') videoUpload: ElementRef;
	// @ViewChild("UserRole")
	// UserRole: NgForm;
	constructor(public authS: AuthService, private userService: UserService, private pagerService: PagerService,
		private videoService: VideoService, private commonService: CommonService, ) {

		this.files = []; // local uploading files array
		this.videofiles = [];
		this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
		this.uploadInputVideo = new EventEmitter<UploadInput>();
		this.humanizeBytes = humanizeBytes;
	}
	//     check(name){
	// getPermission
	//     // return false;
	//     let perm = JSON.parse(localStorage.getItem('permission'));
	//     console.log(perm);
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
		this.getMeasures();
		this.getUserRoles();
		// this.getVideo(11)
		this.getVideos();
		// this.getUserVideos();
		this.dropdownSettings = {
			singleSelection: false,
			text: "Assign Videos",
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			classes: "myclass mb-sm-0 col-md-4",
			badgeShowLimit: 3
		};
		// this.getUserRoles();
		// this.check('User role')
		// this.userRolePerm = this.authS.getPermission('Role Management');
		// console.log(this.userRolePerm)

		// this.selectedItems = [{itemName: gapScorecard.mname, id:gapScorecard.mid, Measure_ID:gapScorecard.mid}]
		let perm = this.authS.getPermission('Video Management');
		if (perm) {
			this.userRolePerm = perm
		};

	}

	// 	getUserVideos(){
	// this.videoService.getUserVideos(this.mock).subscribe(results => {
	// console.log(results);

	// 	})

	// }
	getMeasures() {
		this.commonService.getMeasures().subscribe(results => {

			this.measures = results;

			// for (let i = 0; i < this.measures.length; i++) {
			//   this.measures[i].id = this.measures[i]['Measure_ID'];
			//   this.measures[i].itemName = this.measures[i]['Measure_Name'];
			//   // delete arrayObj[i].key1;
			// }
			// this.dropdownList = this.measures;
		}, err => {

		});
	}


	resetFilters() {
		this.params = {
			'pageNumber': 1,
			'pageSize': 15,
			'status': '',

			'roleid': '',
			'measureid': ''
		}
		this.getVideos();
	}


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
			//     console.log(output);
			//     console.log(this.files);
			//     console.log(this.videofiles);
			//     let fCount = this.videofiles.length;
			//     let vCount = this.files.length;
			//     let count = fCount ? fCount > vCount : vCount;
			//     if(output.file.fileIndex == count && output.file){
			//     	this.modal.hide();
			// this.getVideos();
			//     }



			// console.log(output);
			if (output.file.type.includes("video")) {
				this.checkCountVideo++
			}
			if (output.file.type.includes("application")) {
				this.checkCountFile++
			}

			// console.log("check " + this.checkCountVideo);
			// console.log(output);
			// console.log(this.files);
			// console.log(this.videofiles);
			let fCount = this.videofiles.length;
			let vCount = this.files.length;
			// let checkBadRequest = true;
			// // let vCount = this.files.length;
			// console.log("total files " + fCount);
			// console.log("total videos " + vCount);
			// console.log(output.file.fileIndex);
			// // let count = fCount;
			// if (output.file.responseStatus === 400) { // Or whatever your return code status is
			//   this.checkBadRequest = false;
			//   this.disableBtn = false;
			//   this.errorFiles.push(output.file);
			//   console.log(output)
			//   console.log(output.file.response); // This is where you can find your returned object
			// }
			if (this.checkCountVideo == vCount && output.file) {
				this.modal.hide();
				this.getVideos();
			}
			if (this.checkCountFile == fCount && output.file) {

				this.getVideos();

			}
			if (vCount == 0) {
				if (this.checkCountFile == fCount && output.file) {


					this.modal.hide();
					this.getVideos();


					// this.getVideos();
				}
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



	startUpload(): void {
		const event: UploadInput = {
			type: 'uploadAll',
			// url: this.API_BASE + '/Guidelines/documentupload/'+this.videoId,
			url: this.API_BASE + '/fileupload/GuideLine/' + this.videoId,
			method: 'POST',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'IPA': `${localStorage.getItem('DBNAME')}` }
		};

		this.uploadInput.emit(event);
	}

	startUploadVideo(): void {
		const event: UploadInput = {
			type: 'uploadAll',
			url: this.API_BASE + '/Guidelines/videoupload/' + this.videoId,
			method: 'POST',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'IPA': `${localStorage.getItem('DBNAME')}` }
		};

		this.uploadInputVideo.emit(event);

	}


	cancelUpload(id: string): void {
		this.uploadInput.emit({ type: 'cancel', id: id });
	}

	removeVideo(id: string): void {
		this.uploadInputVideo.emit({ type: 'remove', id: id });
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

	ff() {
		let observable = Observable.create(observer => {
			setTimeout(() => {
				let users = [{ username: "balwant.padwal", city: "pune" },
				{ username: "test", city: "mumbai" }]
				observer.next(users); // This method same as resolve() method from Angular 1
				console.log("am done");
				observer.complete();//to show we are done with our processing
				// observer.error(new Error("error message"));
			}, 2000);

		})
		// to subscribe to it is very easy

		observable.subscribe((data) => {
			alert(data); // users array display
		});
	}






	getVideos() {
		//     this.params.reporttype='';
		//   this.params.report = false;
		// this.params.startdate = this.params.startdate.toLocaleString()
		// this.params.enddate = this.params.enddate.toLocaleString()


		this.videoService.getVideos(this.params).subscribe(results => {
			this.showPagination = true;

			// console.log(JSON.parse(results.headers.get('Paging-Headers')).totalCount)
			// console.log(results.headers.get('Content-Type'))
			this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;

			this.setPages();
			this.videoList = results.body;


		}, err => {

		});
	}


	measureArray() {
		let temp = [];

		for (let i = 0; i < this.selectedItems.length; i++) {
			temp.push({ 'roleid': this.selectedItems[i].User_Role_ID, 'rolename': this.selectedItems[i].User_Role_Name })
		}


		this.video.guidelinerole = temp;
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
	resetUploadFilename() {
		if (this.fileUpload) {
			this.fileUpload.nativeElement.value = "";
		}
		if (this.videoUpload) {
			this.videoUpload.nativeElement.value = "";
		}
	}
	editVideo(id) {
		this.videoForm.resetForm();
		this.resetUploadFilename();
		this.checkCountVideo = 0;
		this.checkCountFile = 0;
		this.save_add_form = false;

		this.video = {}
		this.files = [];
		this.videofiles = [];
		this.selectedItems = [];
		this.getVideo(id);
		this.modal.show()
	}

	createVideo() {
		this.videoForm.resetForm();
		this.resetUploadFilename();
		this.checkCountVideo = 0;
		this.checkCountFile = 0;
		this.video = {};
		this.selectedItems = [];
		this.files = [];
		this.videofiles = [];
		this.save_add_form = true;
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
	updateVideo(valid, id, video) {
		// this.fSubmitted = true;
		if (valid) {
			this.measureArray()
			this.videoService.updateVideo(id, video).subscribe(results => {
				this.startUpload();
				this.startUploadVideo();
				if (this.videofiles.length == 0 && this.files.length == 0) {
					this.modal.hide();
					this.getVideos();
				}


				// this.showSuccess('Update user role',role.User_Role_Name+' role updated successfully')
			}, err => {
				// this.showDanger('Update user role',role.User_Role_Name+' role update failed')  
			});
		}

	}
	lightbox_open(video, id, e) {
		// console.log(e);

		// let lightBoxVideo: HTMLVideoElement = document.getElementById("VisaChipCardVideo");  
		// var lightBoxVideo = document.getElementById("VisaChipCardVideo");
		window.scrollTo(0, 0);
		e.target.nextElementSibling.innerHTML = "<div class='light'><video id='VisaChipCardVideo" + id + "' width='600' controls><source src='" + this.CONTENT_BASE + video.videopath + "/" + video.videoname + "' | safe: 'url' type='video/mp4'> </video></div>";
		document.getElementById('fade-video').style.display = 'block';
		let lightBoxVideo: HTMLVideoElement = <HTMLVideoElement>document.getElementById("VisaChipCardVideo" + id);
		lightBoxVideo.play();
	}

	lightbox_close() {
		// console.log("close");
		// let lightBoxVideo: HTMLVideoElement = <HTMLVideoElement> document.getElementById("VisaChipCardVideo");
		$('.light').remove();
		document.getElementById('fade-video').style.display = 'none';
		// lightBoxVideo.pause();
	}

	removefile(file, type) {
		// this.gapSubmit.SubscriberID = this.gapMember.SubscriberID;
		// this.gapSubmit = {...this.gapsEssentials,...this.gapSubmit}
		let filename;
		if (type == 'video') {
			filename = file.videoname
		} else {
			filename = file.documentname
		}
		this.videoService.removefile(this.video.assignid, filename, type).subscribe(results => {

			this.video = results;




			// this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
		}, err => {
			// this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
		});


	}

	getVideo(id) {
		this.videoService.getVideo(id).subscribe(results => {
			this.videoId = results.assignid;
			this.video = results;
			let arr = results.guidelinerole;

			for (let i = 0; i < arr.length; i++) {
				arr[i].id = arr[i]['roleid'];
				arr[i].itemName = arr[i]['rolename'];

				arr[i].User_Role_ID = arr[i]['roleid'];
				arr[i].User_Role_Name = arr[i]['rolename'];
				// delete arrayObj[i].key1;
			}
			// this.dropdownList = arr;


			this.selectedItems = arr;
			// console.log(this.selectedItems);
			// this.measureArray();
		}, err => {

		});
	}
	//upload video
	addVideo(valid) {
		// this.fSubmitted = true;
		if (valid) {
			this.video.createdDepartment = this.user.rolename;
			this.video.creatorEmail = this.user.email;
			this.video.creatorName = this.user.name;
			this.measureArray();
			// this.startUpload();
			// this.startUploadVideo();
			this.videoService.addVideo(this.video).subscribe(
				res => {
					this.videoId = res.assignid;
					this.startUpload();
					this.startUploadVideo();
					if (this.videofiles.length == 0 && this.files.length == 0) {
						this.modal.hide();
						this.getVideos();
					}
					// this.getUserRoles();
					// this.showSuccess('Add user role',this.add_user_role.User_Role_Name+' role created successfully')
					if (res.status == 200) {
					}
				},
				err => {
					this.modal.hide();
					// this.showDanger('Add user role',this.add_user_role.User_Role_Name+' role creation failed') 
				})
		}
	}
	//update video status
	updateVideoStatus(id, status, name) {
		let fromStatus = status ? 'Active' : 'Inactive';
		let toStatus = !status ? 'Active' : 'Inactive';
		this.videoService.updateVideoStatus(id, !status).subscribe(results => {
			// this.showSuccess('Update role status',name+' changed from '+fromStatus+' to '+toStatus)
		}, err => {
			// this.showDanger('Update role status',name+ ' User role status update failed') 
		});
	}
	//pager functionality
	loadByPage(page_number: number) {
		if (page_number < 1 || page_number > this.pager.total_pages) {
			return;
		}
		this.page = page_number;
		// console.log("Page"+this.page)
		// console.log("Page numbe"+page_number)
		this.params['pageNumber'] = this.page
		this.getVideos();
		// window.scrollTo(0, 200);
	}


	setPages() {
		// get pager object from service
		this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
	}

}
