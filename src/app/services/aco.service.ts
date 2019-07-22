import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Response,RequestOptions,URLSearchParams, Headers  }  from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AcoService {
	API_BASE = environment.api_base.apiBase +"/"+ environment.api_base.apiPath;
	MAIL_BASE = environment.api_base.mailBase +"/"+ environment.api_base.apiPath;
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

	getACOMembership(data: any): Observable<any>{
		let url = this.API_BASE + "/ACO/membership";
		if(!data.report){
			return this.http.post(url, data,{observe: 'response' });
		}else{
			return this.http.post(url, data,{responseType: 'blob' });
		}
	}

	getACOGaps(data: any): Observable<any>{
		let url = this.API_BASE + "/ACO/gaps";
		if(!data.report){
			return this.http.post(url, data,{observe: 'response' });
		}else{
			return this.http.post(url, data,{responseType: 'blob' });
		}
	}

	getacoscorecard(data: any): Observable<any>{
		let url = this.API_BASE + "/ACO/scorecard";
		if(!data.report){
			return this.http.post(url, data,{observe: 'response' });
		}else{
			return this.http.post(url, data,{responseType: 'blob' });
		}
	}


	getACOProviders(data: any): Observable<any>{
		let url = this.API_BASE + "/ACO/GetACOProviders";

		if(!data.report){
			return this.http.post(url, data,{observe: 'response' });
		}else{
			return this.http.post(url, data,{responseType: 'blob' });
		}
		
	}
	getACOGroup(data:any):Observable<any>{
		let url = this.API_BASE + "/ACO/GroupMgmt/";
		
		if(!data.report){
			return this.http.post(url, data,{observe: 'response' });
		}else{
			return this.http.post(url, data,{responseType: 'blob' });
		}
	}

	getACOMeasures(data:any,type):Observable<any>{
		let url = this.API_BASE + "/ACO/GetMembers/"+ type;
		
		if(!data.report){
			return this.http.post(url, data,{observe: 'response' });
		}else{
			return this.http.post(url, data,{responseType: 'blob' });
		}
			
		
	}

	getACOAuditList(data:any):Observable<any>{
		let url = this.API_BASE + "/ACO/auditlisting/";
		
		debugger;
		if(!data.report){
			return this.http.post(url, data,{observe: 'response' });
		}else{
			return this.http.post(url, data,{responseType: 'blob' });
		}
			
		
	}

	updategapstatus(data:any):Observable<any>{
		let url = this.API_BASE + "/ACO/updategapstatus/";
		return this.http.post(url, data,{observe: 'response' });	
	}

	getAcomeasure():Observable<any>{
		let url = this.API_BASE + "/ACO/measures";
		
		
			return this.http.get(url);
		
	}
	getAcoLowestCompliance(data):Observable<any>{
		let url = this.API_BASE + "/ACO/scorecard";
		
		
			return this.http.post(url,data);
		
	}
	getAcoSummaryData(data):Observable<any>{
		let url = this.API_BASE + "/ACO/scorecard";
		
		
			return this.http.post(url,data);
		
	}

	getACOGroups(id): Observable<any>{
		console.log(id)
		let url = this.API_BASE + "/ACO/getgroups/"+id;
		
		return this.http.get(url);
	}
	getAcoPieData(params): Observable<any>{
		let url= this.API_BASE +"/ACO/dashboard/membershipbycounty";
		let data={
			'quarter':params.quarter
		}
		
		return this.http.post(url,data);
	}
	getAcoTotalGapsByGroup(type,data): Observable<any>{
		let url=this.API_BASE +"/ACO/dashboard/gapcount/"+type;
        return this.http.post(url,data) 
	}
	getAcoDashboardCardData(params): Observable<any>{
		let url=this.API_BASE +"/ACO/dashboard/datacard";
        return this.http.post(url,params) 
	}

	ACOGapSubmit(data:any):Observable<any>{
		let url = this.API_BASE + "/ACO/gapsubmission/";
		return this.http.post(url, data);	
	}

	getACOGapDetails(data:any):Observable<any>{
		let url = this.API_BASE + "/ACO/getmembergap/";
		return this.http.post(url, data);	
	}

	removeACOGapDoc(file, data): Observable<any>{
		let url = this.API_BASE + "/ACO/deletegapdocument/"+file.gapsid+"/"+file.documentid;
		return this.http.post(url, data);
	}
	


	// getUserActivity(terms: any): Observable<any>{
	// 	let url = this.API_BASE + "/User_Details/loginlist";
	// 	let params = new URLSearchParams();
	// 	for(let key in terms) {
	// 		params.set(key, terms[key]);
	// 	}
	// 	this.options.search =  params;	
	// 	if(terms.report){
	// 		return this.http.get(url, {params: terms,responseType: 'blob' });	
	// 	}else {
	// 		return this.http.get(url, { params: terms, observe: 'response' });
	// 	}
		
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



// getMemberRosters(terms: any): Observable<any>{
// 	let url = this.API_BASE + "/reports/GetMemberReport";
// 	let params = new URLSearchParams();
// 	for(let key in terms) {
// 		params.set(key, terms[key]);
// 	}
// 	this.options.params =  params;	
// 		// return this.http.get(url, this.options.params);
// 		return this.http.post(url,{}, { params: terms, observe: 'response' });
// 	}