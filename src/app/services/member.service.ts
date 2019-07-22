import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Response,RequestOptions,URLSearchParams, Headers  }  from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MemberService {
	API_BASE = environment.api_base.apiBase +"/"+ environment.api_base.apiPath;
	headers:any;
	constructor(private http:HttpClient, private httpf:Http){
	}
	private options = new RequestOptions();
	setHeader(){
		// token header for old http request spinner case
		this.headers = new Headers();
    	this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`); 
    	this.headers.append('IPA', `${localStorage.getItem('DBNAME')}`); 
	}

	// --------- Dashboard --------- //

	getmemberdetails(params): Observable<any>{
		let url = this.API_BASE + "/dashboard/member/getmemberdetails";//api/dashboard/member/getmemberdetails : subscriberid
		return this.http.post(url, params);
	}

	postMessage(msg): Observable<any>{
		let url = this.API_BASE + "/MemberProvConvo/MemberProvConvo";
		return this.http.post(url, msg);
	}
	
	//ccda apis
	getccdadata(id, name): Observable<any>{
		let url = this.API_BASE + "/ccda/"+name+"/"+id;//api/dashboard/member/getmemberdetails : subscriberid
		return this.http.get(url);
	}

	// getHealthplanCount(date: any,role,id): Observable<any>{
	// 	let url = this.API_BASE + "/dashboard/"+role+"/healthplancard/"+id;
	// 	return this.http.post(url, date);
	// }

	// getIPACount(date: any,role,id): Observable<any>{
	// 	let url = this.API_BASE + "/dashboard/"+role+"/ipacard/"+id;
	// 	return this.http.post(url, date);
	// }

	// getGapsCount(date: any,role,id): Observable<any>{
	// 	this.setHeader();
	// 	let url = this.API_BASE + "/dashboard/"+role+"/gapcard/"+id;
	// 	return this.httpf.post(url,date,{
	// 		headers: this.headers
	// 	}).map(this.extractData).catch(this.handleError);
	// }
	

	
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
