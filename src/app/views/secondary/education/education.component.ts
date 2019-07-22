import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {
CONTENT_BASE = environment.content_api_base.api_base;
	currentUser: any;
  currentId: any;

	memberVideos = {
  	'measureid':[],
  	'roleid':''
  }
  videoList:any;
  constructor(private commonService: CommonService) { 
  	this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.currentId = user.subscriberid;
    this.memberVideos.measureid = user.gaps;
    this.memberVideos.roleid = user.roleid;
}

  ngOnInit() {
  	this.getUserVideos();
  }

  	getUserVideos(){
this.commonService.getUserVideos(this.memberVideos).subscribe(results => {
this.videoList = results;

	})



}

 lightbox_open(video,id,e) {
 	// console.log(e);
 	
 	// let lightBoxVideo: HTMLVideoElement = document.getElementById("VisaChipCardVideo");  
  // var lightBoxVideo = document.getElementById("VisaChipCardVideo");
  window.scrollTo(0, 0);
  e.target.nextElementSibling.innerHTML  = "<div class='light'><video id='VisaChipCardVideo"+id +"' width='600' controls><source src='"+this.CONTENT_BASE+video.videopath+"/"+video.videoname +"' | safe: 'url' type='video/mp4'> </video></div>";
  document.getElementById('fade-video').style.display = 'block';
  let lightBoxVideo: HTMLVideoElement = <HTMLVideoElement> document.getElementById("VisaChipCardVideo"+id);
  // lightBoxVideo.play();
}

 lightbox_close() {
 	// console.log("close");
  // let lightBoxVideo: HTMLVideoElement = <HTMLVideoElement> document.getElementById("VisaChipCardVideo");
 $('.light').remove();
  document.getElementById('fade-video').style.display = 'none';
  // lightBoxVideo.pause();
}
}
