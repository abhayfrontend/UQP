import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Subject } from "rxjs/Subject";
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
@Injectable()

export class AuthService {
	API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
    current_user:any = JSON.parse(localStorage.getItem('currentUser'));

  public months = [{ "full": "January", "value": "01", "days": "31" },
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
  ]

  current_date = new Date();
  current_year = this.current_date.getFullYear();
   current_month:any;
   previous_month:any;
   headers:any;
   last_month:any;
   previous_month_full:any;
   current_month_full:any;
	// API_BASE = environment.api_base.apiBase;
	// private userSignedIn:Subject<boolean> = new Subject();
	// userSignedIn$ = this.userSignedIn.asObservable();
    public asideNameCalc: Subject<boolean> = new Subject<boolean>();
	constructor(private http: HttpClient, private _http: Http) {
        
        //		this.authService.validateToken().subscribe(
        //			res => res.status == 200 ? this.userSignedIn.next(res.json().success) : this.userSignedIn.next(false)
        //		)
	}
private options = new RequestOptions();
setHeader(){
    // token header for old http request spinner case
    this.headers = new Headers();
      this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
      this.headers.append('IPA', `${localStorage.getItem('DBNAME')}`);  
  }
	public getPermission(name) {
        let perm = JSON.parse(localStorage.getItem('permission'));
		for (let i = 0; i < perm.length; i++) {
            if (name == perm[i].func) {
                return perm[i]
			}
		}
    }



     getDates(){
          let months = [{ "full": "January", "value": "01", "days": "31" },
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
  ]
let date = new Date(localStorage.getItem('refreshdate')); // Sun Mar 19 2017 23:00:06 GMT+0100 (CET)
// console.log(date);
// console.log(date.getMonth());
        if(this.current_date.getMonth() == 0){
          this.current_month = months[0]["value"];
          this.previous_month = months[11]["value"];
          this.previous_month_full = months[11]["full"];
          this.current_year = this.current_date.getFullYear() - 1;
        }else{
          this.current_month = months[date.getMonth()]["value"];
          this.previous_month = months[date.getMonth()]["value"];
          this.last_month = months[date.getMonth() - 1]["value"];
          this.previous_month_full =months[date.getMonth()]["full"];
        }
        this.current_month_full =months[date.getMonth()]["full"];
        
        return {
            "current_month":this.current_month,
            "previous_month":this.previous_month,
            "previous_month_full":this.previous_month_full,
            "current_year":this.current_year,
            "actual_year":this.current_date.getFullYear(),
            "current_month_full":this.current_month_full,
            "last_month":this.last_month
        }
    }

    getUserId() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        return this.getCurrentId(user)
    }
    getUserRole() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        return this.getCurrentRole(user.roleid)
    }

    getUserDetails() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    //get short rolename
    getCurrentRole(role) {
        switch (role) {
            case 1:
                return "administrator"

            case 2:
                return "executive"

            case 3:
                return "qa"

            case 4:
                return "ipa"

            case 5:
                return "healthplan"

            case 35:
                return "provider"

            case 36:
                return "officestaff"

            case 48:
                return "member"

            case 51:
                return "audit"
            default:
                return "undefined"
        }
    }

    //get id of any role if present
    getCurrentId(user) {

        if (user.healthplanid) {
            return user.healthplanid
        } else if (user.ipaid) {
            return user.ipaid
        } else if (user.providerid) {
            return user.providerid;
        } else {
            return ""
        }
    }



	public getToken(): string {
		return localStorage.getItem('token');
	}


    public isAuthenticated(): boolean {

        if (localStorage.getItem('token')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
        // this.router.navigate(['user/change-password']);
        return false;

    }


	logInUser(signInData): Observable<any> {
		let url = this.API_BASE + "/token";
		// let ss = "grant_type=password&username=sandeep.kumar@mamsys.com&password=123321";
		// let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		// console.log(headers)
		// let header=new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
		// var obj = { userName: signInData.email, password: signInData.password, grant_type: 'password' };

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });

        // let body = "grant_type=password&username=sandeep.kumar@mamsys.com&password=123321";
        let body = `grant_type=password&username=${signInData.email}&password=${signInData.password}`;

        return this._http.post(url, body, options)

		// return this.http.post(url, ss, {headers: headers});
	}


    getUserProfile(): Observable<any> {
        let url = this.API_BASE + "/userdetails/profile";
        return this.http.get(url)
    }

    //common function for setting user theme dynamically
    setUserTheme() {
        if(this.current_user){
           let themename = JSON.parse(localStorage.getItem('currentUser')).themeobj.theme;
        $("body").removeClass(function(index, css) {
            return (css.match(/(^|\s)theme\S+/g) || []).join(' ');
        });
        if (themename) {
            $('body').addClass(themename);
        } else {
            $('body').addClass('theme-blue');
        } 
        }
        
    }


    private serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

        return result.join("&");
    }


	forgotPassword(forgotData:any): Observable<any> {
		let url = this.API_BASE + "/User_Details/ResetPasswordToken/";
		return this._http.post(url, forgotData);
	}

    logout(id, inactive): Observable<any> {
        let url = this.API_BASE + "/User_Details/logout/" + id;
        if(inactive){
          this.setHeader()
 let Data = {
       "logoutreason":true
     }
    let params = new URLSearchParams();
    for(let key in Data) {
      params.set(key, Data[key]);
    }
    this.options.search =  params;
    return this._http.put(url, {}, {params: Data, headers: this.headers}); 
        }else{
           return this.http.put(url, {});
        }
       

     
    }

	passwordUpdate(data: any): Observable<any> {
		let url = this.API_BASE + "/User_Details/ModifyCredentials";
		return this.http.post(url, data);
	}

	changePassword(data: any): Observable<any> {
		let url = this.API_BASE + "/User_Details/ChangePassword";
		return this.http.post(url, data);
	}


	validateToken(token): Observable<any> {
		let url = this.API_BASE + "/User_Details/ResetPassword/" + token;
		return this.http.get(url);
	}

    //Theme selection functionality
    customizeTheme(themename, code): Observable<any> {
        let userid = this.getUserDetails().userid;
        let theme_setting = {
            'theme': themename,
            'user_id': userid,
            'colourcode': code
        }
        let url = this.API_BASE + "/User_Details/theme/";
        return this.http.put(url, theme_setting);
    }

    //UQP support chat bot
    chatBot(msg): Observable<any> {
        // let userid = this.getUserDetails().userid;
        let chat = {
            'text': msg
        }
        let url = "https://uqp.mirrahealthcare.com:8090/api/messages";
        return this._http.post(url, chat);
    }

    //ipa segregation and selection
    selectIPADB(id): Observable<any> {
        
        let url = this.API_BASE + "/IPASession/"+id;
        return this.http.get(url, {observe: 'response'});
    }
}