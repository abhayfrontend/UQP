import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppAsideComponent } from '../app-aside/app-aside.component';
import { NotificationService } from '../../views/notifications/notifications.service';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery';
@Component({
  providers: [AppAsideComponent],
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {
  user: any;
  // notification prop
  notif: any;
  unreadCount:number;
  refresh_date:any;
  CONTENT_BASE = environment.content_api_base.api_base;
  roleid:any;
  userid:any;
  constructor(private router: Router, private authS: AuthService,
    private comp: AppAsideComponent, private route: ActivatedRoute,private ngZone: NgZone,
    private notificationService: NotificationService) { }
  ngOnInit() {
    this.showFullNotification();
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if(this.user){
      if(this.user.rolename == 'Office Staff'){
        this.roleid = 36;
         this.userid=this.user.userid;
      }else {
        this.roleid = this.user.roleid;
        this.userid=this.user.userid;
      }
    }
    this.refresh_date = localStorage.getItem('refreshdate');
    this.getNotification(true)

  }

  //GET ROLE WISE NOTIFICATIONS 
  getNotification(ftime) {
    let isNotifDropdownOpen = $("#dropdown-basic").hasClass("show");
if(ftime || isNotifDropdownOpen){
  if(this.user){

      this.notificationService.getNotificationByRole(this.roleid,this.userid).subscribe(results => {
      this.notif = results;
//       setTimeout(() => {
// this.showFullNotification();
//       },1)
this.ngZone.onMicrotaskEmpty.subscribe(() => {
        
          this.showFullNotification();
        
      })
      this.calcUnreadCount();
    }, err => {

    });
  }

}

    

  }

calcUnreadCount(){
  let count = 0;
  this.notif.map((n) => {
    if(n.Notification_Role.length>0){
       if(!n.Notification_Role[0].ReadStatus){
        count ++
         }
    }
    else
    {
      if(!n.Notification_UserSpecific[0].ReadStatus){
        count ++
         }
    }
   
    
  })
  this.unreadCount = count;
}

readStatus(n){
  let status =  n.ReadStatus;
  console.log(status);
  if(!status){
    n.ReadStatus = !status;
  } 
  console.log(n);
  this.calcUnreadCount();
  n['user_id']=this.userid;
  this.notificationService.updateReadStatus(n).subscribe(
        res => {
          // alert("bbbbb")
          // this.modal.hide();
          // alert("Fref")
          // this.getNotifications();
          // this.getUserRoles();
          // this.showSuccess('Add user role',this.add_user_role.User_Role_Name+' role created successfully')
          if (res.status == 200) {
          }
        },
        err => {
          // this.modal.hide();
          // this.showDanger('Add user role',this.add_user_role.User_Role_Name+' role creation failed') 
        })
}
  //Aside name calculation
  storeAsideName(name) {
    localStorage.setItem('asideName', name);
    // this.comp.ngOnInit();
    this.authS.asideNameCalc.next(name);
  }

  //logout function
  logOut(): void {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('permission');
    this.router.navigate(['/']);
  }

  // Help show and hide
  getRoutes() {

    $('app-help').removeClass('d-none');
    // $('.custom-container,.dashboard').addClass('d-none');
  }

  showFullNotification(){
    $('.dropdown-item').on('click',function(){
      // console.log("clicked");
      $('.dropdown-item .notif-desc').addClass('text-truncate');
      $('.extra-details').addClass('hide').removeClass('show');
      $(this).find('.notif-desc,.notif-title').removeClass('text-truncate');
$(this).find('.extra-details').addClass('show').removeClass('hide');
    })
  }
}

