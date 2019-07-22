import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  updatePass = { password: '', email: '', tokenstatus: '' }
  passwordConfirmation: any;
  constructor(private authS: AuthService, private router: Router,
    private route: ActivatedRoute) { }
  token: any;
  status: boolean = false;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      $('div.sidebar').css('display', 'none');
      $('.sidebar-fixed .main, .sidebar-fixed .app-footer ').css('margin-left', '0px');
    });

    this.checktoken();

  }
  //checking password from auths file (validate function)
  checktoken() {
    this.authS.validateToken(this.token).subscribe(
      res => {
        this.status = res.tokenstatus;
        this.updatePass.email = res.email;
        this.updatePass.tokenstatus = this.token;
        if (res.status == 200) {
          // alert("password updated successfully!!");
          // this.router.navigate(['/my/feeds']);
        }
      },
      err => {
        console.log('err:', err);
      }
    )
  }
  showSidebar() {
    $('div.sidebar').css('display', 'block');
    $('.sidebar-fixed .main, .sidebar-fixed .app-footer ').css('margin-left', '200px');
  }
  onUpdatePasswordSubmit(valid) {
    if (valid) {
      this.authS.passwordUpdate(this.updatePass).subscribe(
        res => {
          this.showSidebar();
          // alert("password updated successfully!!");
          this.router.navigate(['/']);

        },
        err => {
          // console.log('err:', err);
        }
      )
    }

  }

  ngOnDestroy() {
    //show sidebar
    this.showSidebar();
  }
}
