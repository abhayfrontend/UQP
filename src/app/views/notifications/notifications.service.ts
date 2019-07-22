import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, Response,RequestOptions,URLSearchParams, Headers  }  from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NotificationService {
	API_BASE = environment.api_base.apiBase +"/"+ environment.api_base.apiPath;
	headers:any;
	constructor(private http:HttpClient, private httpf:Http){}
	private options = new RequestOptions();
setHeader(){
		// token header for old http request spinner case
		this.headers = new Headers();
    	this.headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`); 
    	this.headers.append('IPA', `${localStorage.getItem('DBNAME')}`); 
	}


	// --------- Notifications --------- //



	getNotifications(terms: any): Observable<any>{
		let url = this.API_BASE + "/Notifications/notificationlist";
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;	
		// return this.http.get(url, this.options);
		return this.http.get(url, { params: terms, observe: 'response' });
	}

getNotificationsReport(terms: any): Observable<any>{
		let url = this.API_BASE + "/Notifications/notificationlist";
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;	
		return this.http.get(url, {params: terms,responseType: 'blob' });	
	}


	getNotification(id: number): Observable<any>{
		let url = this.API_BASE + "/Notifications/notificationlistById/"+id;	
		return this.http.get(url);
	}

	getNotificationByRole(id: number,userid:number): Observable<any>{
			this.setHeader();
		let url = this.API_BASE + "/Notifications/notificationlistByRole/"+id+"/"+userid;	
		return this.httpf.get(url,{
			headers: this.headers
		}).map(this.extractData).catch(this.handleError);
	}

	addNotification(notif: any): Observable<any>{
		let url = this.API_BASE + "/Notifications/notification/";
		return this.http.post(url, notif);
	}

	updateNotification(id: number, Data: any): Observable<any>{
		let url = this.API_BASE + "/Notifications/EditNotification/"+id;
		return this.http.put(url, Data);	
	}

	checkNotification(term: string): Observable<any>{
	let url = this.API_BASE + "/Notifications/IsNotificationExist/"+term;
	return this.http.get(url);
	}

	removeNotifDoc(id: number, Data: any): Observable<any>{
		// let url = this.API_BASE + "/members/gapsubmission/"+id;
		let url = this.API_BASE + "/Notifications/removefile/"+id+"/"+Data;
		return this.http.get(url);	
	}

	updateNotifStatus(id: number, status: any): Observable<any>{
		let url = this.API_BASE + "/Notifications/EditNotificationStatus/"+id;
		let data = {
			"status" : status
		}
		return this.http.put(url, data);	
	}

	updateReadStatus(Data: any): Observable<any>{
		let url = this.API_BASE + "/Notifications/UpdateReadStatus/";
		
		return this.http.put(url, Data,{
			headers: this.headers
		}).map(this.extractData).catch(this.handleError);	
	}

	search_Notification(term: string): Observable<any>{
		let url = this.API_BASE + "/Notifications/SearchNotification/"+term;		
		return this.http.get(url);
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
