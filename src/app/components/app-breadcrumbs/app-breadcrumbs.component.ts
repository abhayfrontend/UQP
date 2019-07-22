import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NotificationService } from '../../views/notifications/notifications.service';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-breadcrumbs',
  template: `<p class="marquee">
<span *ngFor="let n of notif">{{n.Notification_Name}}</span>
</p>
  `
})

export class AppBreadcrumbsComponent {
  breadcrumbs: Array<Object>;
    user: any;
  // notification prop
  notif: any;
  roleid:any;
  userid:any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    // this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event) => {
    //   this.breadcrumbs = [];
    //   let currentRoute = this.route.root,
    //   url = '';
    //   do {
    //     const childrenRoutes = currentRoute.children;
    //     currentRoute = null;
    //     // tslint:disable-next-line:no-shadowed-variable
    //     childrenRoutes.forEach(route => {
    //       if (route.outlet === 'primary') {
    //         const routeSnapshot = route.snapshot;
    //         url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
    //         this.breadcrumbs.push({
    //           label: route.snapshot.data,
    //           url:   url
    //         });
    //         currentRoute = route;
    //       }
    //     });
    //   } while (currentRoute);
    // });
  }
ngOnInit() {
    // this.showFullNotification();
    
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
    this.getNotification()

  }
    //GET ROLE WISE NOTIFICATIONS 
  getNotification() {
    if(this.user){
      this.notificationService.getNotificationByRole(this.roleid,this.userid).subscribe(results => {
      this.notif = results;
    }, err => {

    });
    }
    
  }
}


// `
//   <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last = last>
//     <li class="breadcrumb-item"
//         *ngIf="breadcrumb.label.title&&breadcrumb.url.substring(breadcrumb.url.length-1) == '/'||breadcrumb.label.title&&last"
//         [ngClass]="{active: last}">
//       <a *ngIf="!last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</a>
//       <span *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</span>
//     </li>
//   </ng-template>`