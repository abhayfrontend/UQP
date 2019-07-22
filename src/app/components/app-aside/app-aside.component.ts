
import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-aside',
  templateUrl: './app-aside.component.html'
})
export class AppAsideComponent {
  user: any = { 'userid': '' };
  asideName: any;
  selectedColorIndex: number;
  themename: string;
  theme_update_status:boolean = false;
  theme_update_msg:string;
  currentUser:any;
  selectedIPA:string;
  selectedProvider:string;
	constructor(private router: Router, private authS: AuthService) {
    this.authS.asideNameCalc.subscribe(value => {
      this.asideName = value;
    });
  }
	ngOnInit() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = user;
    this.selectedIPA = localStorage.getItem('selectedIPA')
    this.selectedProvider = localStorage.getItem('provider_name')
    if (user) {
      this.user = user;
    }
    if(user){
      if(user.themeobj.colourcode){
      this.selectedColorIndex = user.themeobj.colourcode;
    }
    }
    

    setTimeout(() => {
      this.asideName = localStorage.getItem('asideName');
    }, 1000)

	}
  closeAside() {
    document.querySelector('body').classList.add('aside-menu-hidden');
  }

  logOut(): void {
    this.authS.logout(this.user.loginid,false).subscribe(
      res => {

      },
      err => {

      }

    )

    // clear token remove user from local storage to log user out
    // this.token = null;
    localStorage.removeItem('currentUser');
    localStorage.clear();
    this.router.navigate(['/']);
  }

  changeTheme(color, i) {
    this.selectedColorIndex = i;
    this.themename = color;
    $("body").removeClass(function(index, css) {
      return (css.match(/(^|\s)theme\S+/g) || []).join(' ');
    });
    $('body').addClass(color)
  }

  customizeTheme(){
    this.theme_update_status = false;
    this.authS.customizeTheme(this.themename, this.selectedColorIndex).subscribe(
      res => {
        this.theme_update_status = true;
        this.theme_update_msg = res;
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let themeobj = {
          'theme':this.themename,
          'colourcode':this.selectedColorIndex
        }
        user.themeobj = themeobj;
        localStorage.setItem('currentUser', JSON.stringify(user));
      },
      err => {

      }
      )

}
  selectIPADB(ipa){
    const url = this.router.url;
    localStorage.setItem('selectedIPA',ipa.IPA_Name);
    this.selectedIPA = ipa.IPA_Name;
    this.authS.selectIPADB(ipa.IPA_ID).subscribe(

        res => {
          localStorage.setItem('DBNAME',res.headers.get('IPA'));
          this.router.navigateByUrl(`/`).then(
      () => {
        this.router.navigateByUrl(url);
      });
          // this.router.navigate(['/dashboard']);
          
        },
        err => {
          // localStorage.clear();
          // this.router.navigate(['/']);
          // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        }
      )
  }

  selectAssociatedProvider(provider){
    const url = this.router.url;


        let user = JSON.parse(localStorage.getItem('currentUser'));
    user.providerid = provider.User_ProviderId;
    user.officestaff_providername = provider.ProviderName;
    localStorage.setItem('currentUser', JSON.stringify(user));
localStorage.setItem('provider_name', provider.ProviderName);

            

            this.router.navigateByUrl(`/`).then(
      () => {
        this.router.navigateByUrl(url);
      });
            
  }
}