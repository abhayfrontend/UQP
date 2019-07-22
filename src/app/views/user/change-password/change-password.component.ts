import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordComponent implements OnInit {
  changePasswrd = { oldpassword: '', newpassword: '', email: '', userid: '' };
  passwordConfirmation: any;
  currentUser: any;
  error: boolean = false;
  accept: boolean = false;
  @ViewChild('staticModal') public modal: ModalDirective;
  constructor(private authS: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

  }

  ngOnInit() {
    this.changePasswrd.email = this.currentUser.email;
    // sidebar hide when opening new window
    $('div.sidebar').css('display', 'none');
    $('.sidebar-fixed .main, .sidebar-fixed .app-footer ').css('margin-left', '0px');
    // $('.header-fixed .app-body').css('margin-top','0px');
    console.log(this.currentUser)
  }
  showSidebar() {
    $('div.sidebar').css('display', 'block');
    $('.sidebar-fixed .main, .sidebar-fixed .app-footer ').css('margin-left', '200px');
  }
  //on password change function
  onChangePasswordSubmit(valid) {
    this.changePasswrd.userid = this.currentUser.userid;
    if (valid) {
      this.authS.changePassword(this.changePasswrd).subscribe(
        res => {
          if (res.status) {
            this.error = false;
            this.modal.show();
            //show sidebar
            this.showSidebar();
            this.currentUser.Isfirsttime = false;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            // this.router.navigate(['/dashboard']);
          } else {
            this.error = true;
          }
        },
        err => {
          // console.log('err:', err);
        }
      )
    }

  }
  canDeactivate() {
    // console.log('i am navigating away');

    // if the editName !== this.user.name
    if (this.currentUser.Isfirsttime) {
      return window.alert('You have not set your password or your password has been expired. Please change your password to continue.');
    }

    return true;
  }

  ngOnDestroy() {
    //show sidebar
    this.showSidebar();
  }
}
