import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { environment } from "../../../environments/environment";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import {
  Router,
  ActivatedRoute,
  Params,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy
} from "@angular/router";
// import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { CarouselConfig } from "ngx-bootstrap/carousel";
import * as $ from "jquery";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [
    {
      provide: CarouselConfig,
      useValue: { interval: 3500, noPause: true, showIndicators: true }
    }
  ]
})
export class HomeComponent implements OnInit {
  private handlers: { [key: string]: DetachedRouteHandle } = {};
  permission = [
    {
      name: "User list",
      add: false,
      edit: false,
      view: false
    },
    {
      name: "User role",
      add: false,
      edit: false,
      view: true
    }
  ];
  API_BASE = environment.api_base.stagingprojectBase;
  forgotPass = { email: "", url: "" };
  loginUser = { email: "", password: "", grant_type: "password" };
  email_success: boolean = false;
  email_failure: boolean = false;
  email_msg: string;
  login_status: boolean = false;
  login_error: boolean = false;
  searching: boolean = false;
  currentUser: any;
  associated_ipa: any;
  associated_provider: any;
  // check: boolean = false;
  error_msg: string;
  //to restrict navigating without selecting ipa
  isIPASelected: boolean = true;
  firstTimeUser: boolean = false;
  public token: string;

  test: boolean = false;
  @ViewChild("forgotPassword") public modal: ModalDirective;
  @ViewChild("ipaSelection") public ipaSelection: ModalDirective;
  constructor(
    private authS: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // this.token = currentUser && currentUser.token;
    if (localStorage.getItem("token")) {
      this.authS.getUserProfile().subscribe(
        res => {
          // this.router.navigate(['/user/change-password']);
          this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
        },
        err => {
          localStorage.clear();
          this.router.navigate(["/"]);
          this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
        }
      );
    }
  }

  ngOnInit() {
    this.forgotPass.url = this.API_BASE + "/user/reset-password/";
    this.test = true;
  }
  // ngOndestroy(){
  // 	alert("out")
  // 	$('#slider').css('display','block');
  // }
  public ngAfterViewInit(): void {}
  showDanger(msg, title) {
    this.toastr.error(title, msg);
  }

  selectIPADB(ipa) {
    this.authS.selectIPADB(ipa.IPA_ID).subscribe(
      (res: Response) => {
        let refresh_date = res.body;
        localStorage.setItem("refreshdate", refresh_date.toString());
        localStorage.setItem("DBNAME", res.headers.get("IPA"));
        this.isIPASelected = true;
        localStorage.setItem("selectedIPA", ipa.IPA_Name);
        if (this.firstTimeUser) {
          this.router.navigate(["/user/change-password"]);
        } else {
          this.router.navigate(["/dashboard"]);
        }
      },
      err => {
        // localStorage.clear();
        // this.router.navigate(['/']);
        // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      }
    );
  }

  onLoginUser() {
    this.searching = true;
    this.authS.logInUser(this.loginUser).subscribe(
      res => {
        if (res.status == 200) {
          this.searching = false;
          // this.router.navigate(['/dashboard']);
          // let token = res.json() && res.json().access_token;
          // console.log(res.json())
          let token = res.json().access_token;
          // localStorage.setItem('currentUser', JSON.stringify(res.json()));
          localStorage.setItem("token", token);
          localStorage.setItem("DBNAME", "");
          this.getUserProfile();
        }
      },
      err => {
        this.searching = false;
        this.login_error = true;
        let err_desc = err.json().error_description;
        if (err_desc) {
          this.error_msg = err_desc;
        } else {
          this.error_msg = "Server error, please contact administrator";
        }
      }
    );
  }

  validateToken() {
    this.authS.getUserProfile().subscribe(
      res => {
        // this.router.navigate(['/user/change-password']);
      },
      err => {
        localStorage.clear();
        this.router.navigate(["/"]);
      }
    );
  }
  getUserProfile() {
    this.isIPASelected = false;
    this.authS.getUserProfile().subscribe(
      res => {
        this.login_status = res.isuservalid;

        if (this.login_status) {
          let firstTimeUser = res.Isfirsttime;
          this.firstTimeUser = res.Isfirsttime;
          //insert ipaid field from object if role is ipa to identify it as IPA
          if (res.roleid == 4) {
            let user = res;
            user.ipaid = user.ipadetails[0].IPA_ID;
            localStorage.setItem("currentUser", JSON.stringify(res));
          } else {
            localStorage.setItem("currentUser", JSON.stringify(res));
          }

          // localStorage.setItem('permission',JSON.stringify(this.permission));
          localStorage.setItem("permission", JSON.stringify(res.acl));
          // if (firstTimeUser) {
          this.associated_ipa = res.ipadetails;
          //office staff enter point
          if (res.roleid == 35 && res.rolename == "Office Staff") {
			this.associated_provider = res.officetype;
			if(this.associated_provider.length == 1){
				this.selectAssociatedProvider(this.associated_provider[0]);
			}else{
				this.ipaSelection.show();
			}
            
          } else {
            if (this.associated_ipa.length == 1) {
              this.selectIPADB(this.associated_ipa[0]);
            } else {
              let access_ipa = this.associated_ipa.filter(ipa => {
                return ipa.IPA_ID == 2;
              });

              // this.selectIPADB(access_ipa[0])
              this.selectIPADB(res.defaultIPAobj);
              // this.ipaSelection.show();
            }
          }

          // this.router.navigate(['/user/change-password']);
          // } else {

          //store ipa's associated with user
          // localStorage.setItem('usersIPAList', JSON.stringify(res.ipadetails));
          // this.associated_ipa = res.ipadetails;
          // this.ipaSelection.show()
          // this.router.navigate(['/dashboard']);
          // }
          //set user theme on getting profile
          this.authS.setUserTheme();
        } else {
          this.login_error = true;
        }
        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
        let msg = this.currentUser.passwordmessage;
        if (msg) {
          setTimeout(() => {
            this.showDanger("Change Password", msg);
          }, 12000);
        }
      },
      err => {
        this.login_error = true;
        this.error_msg = err.json().error_description;
      }
    );
  }

  selectAssociatedProvider(provider) {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    user.providerid = provider.User_ProviderId;
    user.officestaff_providername = provider.ProviderName;
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("provider_name", provider.ProviderName);
    if (this.associated_ipa.length == 1) {
      this.selectIPADB(this.associated_ipa[0]);
    } else {
      let access_ipa = this.associated_ipa.filter(ipa => {
        return ipa.IPA_ID == 2;
      });

      // this.selectIPADB(access_ipa[0])
      this.selectIPADB(user.defaultIPAobj);
      // this.ipaSelection.show();
    }
  }
  onForgotPassword() {
    this.authS.forgotPassword(this.forgotPass).subscribe(
      res => {
        // console.log(res);
        this.email_success = true;
        this.email_failure = false;
        this.email_msg = res.json();
        setTimeout(() => {
          this.modal.hide();
        }, 2000);

        if (res.status == 200) {
          // this.show_notification = true;
        }
      },
      err => {
        setTimeout(() => {
          this.modal.hide();
        }, 2000);
        // console.log(err.json());
        this.email_success = false;
        this.email_failure = true;
        this.email_msg = err.json();
      }
    );
  }

  logout(): void {
    this.authS.logout(this.currentUser.loginid, false).subscribe(
      res => {
        this.handlers = {};
      },
      err => {}
    );
    localStorage.removeItem("currentUser");
    localStorage.clear();
    this.router.navigate(["/"]);
  }

  canDeactivate() {
    return this.isIPASelected;
  }
}
