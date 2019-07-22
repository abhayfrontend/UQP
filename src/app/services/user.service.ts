import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Response,RequestOptions,URLSearchParams, Headers }  from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
	API_BASE = environment.api_base.apiBase +"/"+ environment.api_base.apiPath;
	headers:any;
	// API_BASE = environment.api_base.apiBase;
	constructor(private http:HttpClient, private http_:Http){
		
	}
	private options = new RequestOptions();
	setHeader(){
		// token header for old http request spinner case
		this.headers = new Headers();
    	this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`); 
    	this.headers.append('IPA', `${localStorage.getItem('DBNAME')}`); 
	}

	// --------- User roles --------- //
	getUserRoles(): Observable<any>{
		let url = this.API_BASE + "/userrole/getroles";	
		return this.http.get(url);
	}
	getUserByRoles(array): Observable<any>{
		let url = this.API_BASE + "/multiplerolewiseusers";	
		return this.http.post(url,array);
	}

	getUserRole(id: number): Observable<any>{
		let url = this.API_BASE + "/userrole/getroles/"+id;	
		return this.http.get(url);
	}

	getRoleWiseUsers(id: number): Observable<any>{
		let url = this.API_BASE + "/userrole/rolewiseusers/"+id;	
		return this.http.get(url);
	}

	addUserRole(userRole: any): Observable<any>{
		let url = this.API_BASE + "/userrole/addroles/";
		return this.http.post(url, userRole);
	}

	updateUserRole(id: number, Data: any): Observable<any>{
		let url = this.API_BASE + "/userrole/updateroles/"+id;
		return this.http.put(url, Data);	
	}

	checkUserRoleName(name: any): Observable<any>{
		let url = this.API_BASE + "/userrole/verifyroles/"+name;
		// let data = {
		// 	"User_Role_Name" : name
		// }
		return this.http.get(url);
	}
	updateUserRoleStatus(id: number, status: any): Observable<any>{
		let url = this.API_BASE + "/userrole/status/"+id;
		let data = {
			"status" : status
		}
		return this.http.put(url, data);	
	}

  updateAcoroleStatus(id:number,status:any): Observable<any>{
		let url = this.API_BASE + "/ACO/UpdateGroupStatus/";
		let data = {
			"status" : status,
			"groupid": id
		}
		return this.http.post(url, data);	
	}
answerpost(param):Observable<any>{

	let url=this.API_BASE+'/postsurvey';
	return this.http.post(url,param);
}
	// --------- Users --------- //
	getUsers(terms:any): Observable<any>{
		let url = this.API_BASE + "/user_details";	
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;	
		if(terms.report){
			return this.http.get(url, {params: terms,responseType: 'blob' });	
		}else {
			return this.http.get(url, { params: terms, observe: 'response' });
		}
	}

	memberquestion(param):Observable<any>{
		let url=this.API_BASE+"/getmembershiprandom";
		return this.http.post(url,param);
	}

	getsummarybox(id)
	{
		let url=this.API_BASE+"/getsurveydetail/"+id;
		return this.http.get(url)
	}
	savecommenta(data){
		let url=this.API_BASE+'/survey/comment';
		return this.http.put(url,data)
	}

	getUser(id: number): Observable<any>{
		let url = this.API_BASE + "/user_details/"+id;	
		return this.http.get(url);
	}

	addUser(user: any): Observable<any>{
		let url = this.API_BASE + "/user_details/createuser";
		return this.http.post(url, user);
	}

	updateUser(id: number, Data: any): Observable<any>{
		let url = this.API_BASE + "/user_details/"+id;
		return this.http.put(url, Data);	
	}

	checkUserEmail(email: any): Observable<any>{
	let url = this.API_BASE + "/User_Details/PostUser_EmailVerify/";
	let data = {
		"EmailID" : email
	}
	return this.http.post(url, data);
	}

	updateUserStatus(id: number, status: any): Observable<any>{
		let url = this.API_BASE + "/User_Details/PutUserDetailStatus/"+id;
		let data = {
			"Status" : status
		}
		return this.http.put(url, data);	
	}

   updateCensususer( Data: any): Observable<any>{
let url = this.API_BASE + "/reports/UpdateCensusreport"; 
return this.http.post(url, Data);
}
    
editcensusreport(id:any){
    let url = this.API_BASE + "/reports/CensusMember/"+id;
     return this.http.get(url);
}
	getMember(id): Observable<any>{
		let url = this.API_BASE + "/User_Details/ProviderEmails";
		let data = {
			"providerid" : id
		}	
		return this.http.post(url, data);
	}


	getUserProfile(id: number): Observable<any>{
		let url = this.API_BASE + "/UserDetails/"+id;	
		return this.http.get(url);
	}


	// search service for Users GetUserRole
	search_role(term: string): Observable<any>{
		let url = this.API_BASE + "/userrole/searchroles/"+term;		
		return this.http.get(url);
	}

	search_user(term: string): Observable<any>{
		let url = this.API_BASE + "/User_Details/GetUserlist/"+term;		
		return this.http.get(url);
	}

	// search_provider(term: any): Observable<any>{
	// 	let url = this.API_BASE + "/Search/Provider/"+term;
	// 	return this.http_.get(url);
	// }
	search_provider(term: any): Observable<any>{
		this.setHeader();
		let url = this.API_BASE + "/Search/Provider/"+term;
		
		return this.http_.get(url,{
      headers: this.headers
    }).map(this.extractData).catch(this.handleError);
	}

	search_ACO_provider(term: any): Observable<any>{
		this.setHeader();
		let url = this.API_BASE + "/Search/ACOProvider/"+term;
		
		return this.http_.get(url,{
      headers: this.headers
    }).map(this.extractData).catch(this.handleError);
	}

	SearchProviderByHp(term: any, id): Observable<any>{
		this.setHeader();
		let url = this.API_BASE + "/SearchProviderByHp/"+id+"/"+term;
		
		return this.http_.get(url,{
      headers: this.headers
    }).map(this.extractData).catch(this.handleError);
	}


	//Bulk gap docs download
	sendOTP(email: any): Observable<any>{
		let url = this.API_BASE + "/User_Details/SendOTP";
		let data = {
			"email" : email
		}
		return this.http.post(url, data);
	}

	getAllGapDocs(otp_obj): Observable<any>{
		let url = this.API_BASE + "/fileupload/zipfile/";	
		// let data = {
		// 	"email" : email,
		// 	"otp": otp
		// }
		return this.http.post(url,otp_obj,{responseType: 'blob' });
	}

	supplementaldwnload(data): Observable<any>{
		let url = this.API_BASE + "/fileupload/supplementalfiles/";	
		// let data = {
		// 	"filename" : 'visit'
		// }
		return this.http.post(url,data,{responseType: 'blob' });
	}

	resetpasswordservice(id,password)//service for reset password
{
let url=this.API_BASE+"/User_Details/ResetPasswordByAdmin/"+id;
let obj = {
"password":password
}
return this.http.put(url,obj)
}

	private extractData(res: Response) {
		let body = res.json();
		return body || { };
	}

	private handleError (error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}
}
