import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Http, Response,RequestOptions,URLSearchParams, Headers  }  from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VideoService {
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


	// --------- Videos --------- //
	getUserVideos(data: any): Observable<any>{
		let url = this.API_BASE + "/Guidelines/GuidelineslistByRole/";
		return this.http.post(url, data);
	}

	getVideos(terms: any): Observable<any>{
		let url = this.API_BASE + "/Guidelines/ListAll";
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;	
		// return this.http.get(url, this.options);
		return this.http.get(url, { params: terms, observe: 'response' });
	}

// getVideosReport(terms: any): Observable<any>{
// 		let url = this.API_BASE + "/Videos/Videolist";
// 		let params = new URLSearchParams();
// 		for(let key in terms) {
// 			params.set(key, terms[key]);
// 		}
// 		this.options.search =  params;	
// 		return this.http.get(url, {params: terms,responseType: 'blob' });	
// 	}


	getVideo(id: number): Observable<any>{
		let url = this.API_BASE + "/Guidelines/GuidelinesById/"+id;	
		return this.http.get(url);
	}

	// getVideoByRole(id: number): Observable<any>{
	// 		this.setHeader();
	// 	let url = this.API_BASE + "/Guidelines/VideolistByRole/"+id;	
	// 	return this.httpf.get(url,{
	// 		headers: this.headers
	// 	}).map(this.extractData).catch(this.handleError);
	// }

	addVideo(notif: any): Observable<any>{
		let url = this.API_BASE + "/Guidelines/Guidelines/";
		return this.http.post(url, notif);
	}

	updateVideo(id: number, Data: any): Observable<any>{
		let url = this.API_BASE + "/Guidelines/EditGuideline/"+id;
		return this.http.put(url, Data);	
	}

	// checkVideo(term: string): Observable<any>{
	// let url = this.API_BASE + "/Videos/IsVideoExist/"+term;
	// return this.http.get(url);
	// }

	removefile(id: number, Data: any, type: string): Observable<any>{
		let url = this.API_BASE + "/Guidelines/removefile/"+type+"/"+id+"/"+Data;
		// let url = this.API_BASE + "/Videos/removefile/"+id+"/"+Data;
		return this.http.get(url);	
	}
	// Guidelines/removefile/type/id/name

	updateVideoStatus(id: number, status: any): Observable<any>{
		let url = this.API_BASE + "/Guidelines/EditGuidelineStatus/"+id;
		let data = {
			"status" : status
		}
		return this.http.put(url, data);	
	}


	// search_Video(term: string): Observable<any>{
	// 	let url = this.API_BASE + "/Videos/SearchVideo/"+term;		
	// 	return this.http.get(url);
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
