import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Response,RequestOptions,URLSearchParams, Headers  }  from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommonService {
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
	getMraHealthplanScorecard(Data: any): Observable<any>{
		let url = this.API_BASE + "/mra/HealthplanScorecard/";
		return this.http.post(url, Data);	
	}
	// --------- Dashboard --------- //


	

	getDataCount(date: any,role,id): Observable<any>{
		let url;
		if(role == 'ipa'){
			url = this.API_BASE + "/dashboard/executive/datacard/";
		}else{
			url = this.API_BASE + "/dashboard/"+role+"/datacard/"+id;
		}
		
		return this.http.post(url, date);
	}

	getHealthplanCount(date: any,role,id): Observable<any>{
		let url;
		if(role == 'ipa'){
			url = this.API_BASE + "/dashboard/executive/healthplancard/";
		}else{
			url = this.API_BASE + "/dashboard/"+role+"/healthplancard/"+id;
		}
	
		//for qa we don't need id to pass
		// if(role == 'qa'){
		// 	url = this.API_BASE + "/dashboard/"+role+"/healthplancard/";
		// }
		return this.http.post(url, date);
	}
	verifyAclPassword(password):Observable<any>
	{
		let url=this.API_BASE+"/verifyPassword";
		return this.http.post(url,password)
	}
	getMailDomains():Observable<any>{
		let url=this.API_BASE+"/emaildomain";
		return this.http.get(url);
	}

	getCensusGraph(date: any): Observable<any>{
		let url = this.API_BASE + "/dashboard/CensusGraph/";
		return this.http.post(url, date);
	}

	getIPACount(date: any,role,id): Observable<any>{
		let url;
		if(role == 'ipa'){
			url = this.API_BASE + "/dashboard/executive/ipacard/";
		}else{
			 url = this.API_BASE + "/dashboard/"+role+"/ipacard/"+id;
		}
		
		//for qa we don't need id to pass
		// if(role == 'qa'){
		// 	url = this.API_BASE + "/dashboard/"+role+"/ipacard/";
		// }
		return this.http.post(url, date);
	}
	questioncaphs(name,number):Observable<any>{
		
		
		let url=this.API_BASE+'/getsurvey/'+number+'/'+name;
	
		
	
		return this.http.get(url)
	

	}
	overallscorenote(param):Observable<any>{
		let url=this.API_BASE +"/providerscorecard/addnote";
		return this.http.post(url,param);
	}
overallfollowup(param):Observable<any>{
	let url=this.API_BASE +"/addfollowupnote";
		return this.http.post(url,param);
}
	

	getGapsCount(date: any,role,id): Observable<any>{
		this.setHeader();
		let url = this.API_BASE + "/dashboard/gapcard/";
		return this.httpf.post(url,date,{
			headers: this.headers
		}).map(this.extractData).catch(this.handleError);
	}
	

cnfrmacl(param:any):Observable<any>{
	let url=this.API_BASE +"/aclrole/confirm";
	return this.http.post(url,param);
}
	// --------- Audit Dashboard --------- //
	getAuditDataCount(date: any, id): Observable<any>{
		let url = this.API_BASE + "/dashboard/Audit/GetAuditGapCount/"+id;
		return this.http.post(url, date);
	}

	getAuditStatusCount(date: any): Observable<any>{
		let url = this.API_BASE + "/dashboard/Audit/GetAuditGraph";
		return this.http.post(url, date);
	}


	getAuditGapsCount(date: any): Observable<any>{
		this.setHeader();
		let url = this.API_BASE + "/dashboard/Audit/AuditMeasure/";
		return this.httpf.post(url,date,{
			headers: this.headers
		}).map(this.extractData).catch(this.handleError);
	}

   getoverallprovidercarddetails(data:any):Observable<any>
   {
   	let url= this.API_BASE+"/provider/overallproviderscorecard";
   	return this.http.post(url,data)
   }


    overallproviderscorecard(param):Observable<any>{
    	let url=this.API_BASE+"/providerscorecardlist";
       return this.http.post(url,param)
    	
		
		
    }
	// --------- Measures --------- //
	getMeasures(): Observable<any>{
		let url = this.API_BASE + "/Measures/";	
		return this.http.get(url);
	}

	getMeasure(id: number): Observable<any>{
		let url = this.API_BASE + "/Measures/"+id;	
		return this.http.get(url);
	}
	addMeasure(user: any): Observable<any>{
		let url = this.API_BASE + "/Measures/";
		return this.http.post(url, user);
	}

	updateMeasure(id: number, Data: any): Observable<any>{
		let url = this.API_BASE + "/Measures/EditMeasure/"+id;
		return this.http.put(url, Data);	
	}

	checkMeasure(term: string): Observable<any>{
		let url = this.API_BASE + "/Measures/IsMeasureExist/"+term;
		return this.http.get(url);
	}

	updateMeasureStatus(id: number, status: any): Observable<any>{
		let url = this.API_BASE + "/Measures/EditMeasureStatus/"+id;
		let data = {
			"Status" : status
		}
		return this.http.put(url, data);	
	}

	search_measure(term: string): Observable<any>{
		let url = this.API_BASE + "/Measures/SearchMeasure/"+term;		
		return this.http.get(url);
	}



	// --------- Star management --------- //

	getStars(): Observable<any>{
		let url = this.API_BASE + "/starscore/";	
		return this.http.get(url);
	}

	getStar(id: number): Observable<any>{
		let url = this.API_BASE + "/starscore/"+id;	
		return this.http.get(url);
	}
	addStar(star: any): Observable<any>{
		let url = this.API_BASE + "/starscore/";
		return this.http.post(url, star);
	}

	updateStar(id: number, Data: any): Observable<any>{
		let url = this.API_BASE + "/starscore/"+id;
		return this.http.put(url, Data);	
	}


		// --------- ACM --------- //

		getFunctions(id): Observable<any>{
			let url = this.API_BASE + "/aclrole/"+id;
			return this.http.get(url);
		}

		updateFunctions(id: number, Data: any): Observable<any>{
			
			let url = this.API_BASE + "/aclrole/"+id;
			
			return this.http.put(url, Data);	
		}

		getFunctionColumns(roleid, fnid): Observable<any>{
			let url = this.API_BASE + "/aclcolumns/"+roleid+"/"+fnid;	
			return this.http.get(url);
		}

		updateFunctionColumns(roleid: number,fnid: number, Data: any): Observable<any>{

			let url = this.API_BASE + "/aclcolumns/"+roleid+"/"+fnid;	
			
						return this.http.put(url, Data);	
		}

		

	// --------- Scorecard --------- //

	getInsurance(id: number): Observable<any>{
		this.setHeader();
		let url = this.API_BASE + "/insurancebyproviders/"+id;	
		return this.httpf.get(url,{
			headers: this.headers
		}).map(this.extractData).catch(this.handleError);
	}

	getScorecard(Data: any): Observable<any>{
		let url = this.API_BASE + "/report/providerscorecard/";
		return this.http.put(url, Data);	
	}

	getScorecardReport(Data: any, name): Observable<any>{
		let url = this.API_BASE + "/report/"+name;
		return this.http.put(url, Data, {responseType: 'blob' });	
	}

	getMasterReport(Data: any, name, arr): Observable<any>{
		let url = this.API_BASE + "/reports/"+name;
		let params = new URLSearchParams();
		for(let key in Data) {
			params.set(key, Data[key]);
		}
		this.options.search =  params;
		return this.http.post(url, arr, {params: Data,responseType: 'blob' });	
	}

	getMasterReportGap(term, Data: any, name): Observable<any>{
		let url = this.API_BASE + "/reports/"+name;
		let params = new URLSearchParams();
		for(let key in Data) {
			params.set(key, Data[key]);
		}
		this.options.search =  params;
		return this.http.post(url, term, {params: Data,responseType: 'blob' });	
	}

	getHealthplanScorecard(Data: any): Observable<any>{
		let url = this.API_BASE + "/report/HealthplanScorecard/";
		return this.http.put(url, Data);	
	}

	getSurveyScorecard(Data: any, type): Observable<any>{
		let url;
		if(type == 'CAHPS'){
			url = this.API_BASE + "/GetCAHPSScorecard/";
		}else {
			url = this.API_BASE + "/GetHOSScorecard/";
		}
		
		return this.http.post(url, Data);	
	}

	getIpaScorecard(Data: any): Observable<any>{
		let url = this.API_BASE + "/report/ipascorecard/";
		return this.http.put(url, Data);	
	}

	getInsuranceByIpa(id: number): Observable<any>{
		let url = this.API_BASE + "/report/insurancebyipa/"+id;	
		return this.http.get(url);
	}

	// --------- Listing --------- //
	
	// getAllInsurance(): Observable<any>{
	// 	let url = this.API_BASE + "/insuranceplan/";	
	// 	return this.http.get(url);
	// }

	getAllInsurance(date: any): Observable<any>{
		let url = this.API_BASE + "/insuranceplan";
		return this.http.post(url, date);
	}

	//get all ipa
	getAllIPA(): Observable<any>{
		let url = this.API_BASE + "/IPA";	
		return this.http.get(url);
	}

	getParentIPA(): Observable<any>{
		let url = this.API_BASE + "/parentipa";	
		return this.http.get(url);
	}
	

	//get month wise ipa
	getIpaByDate(date): Observable<any>{
		let url = this.API_BASE + "/IPA";	
		let params = new URLSearchParams();
		for(let key in date) {
			params.set(key, date[key]);
		}
		this.options.search =  params;
		return this.http.get(url, { params: date, observe: 'response' });
	}
	//get healthplan of provider
	getAllHealthplan(): Observable<any>{
		let url = this.API_BASE + "/providers/healthplans/";	
		return this.http.get(url);
	}

	// get all healthplan
	getAllHealthplans(): Observable<any>{
		let url = this.API_BASE + "/healthplans";	
		return this.http.get(url);
	}

	getGaps(gapsData: any, terms:any): Observable<any>{
		let url = this.API_BASE + "/reports/GetGapReport";
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;	
		// return this.http.put(url, gapsData, this.options);
		return this.http.put(url, gapsData, { params: terms, observe: 'response' });
	}

	getListingGapReport(Data: any, terms:any, name): Observable<any>{
		let url = this.API_BASE + "/reports/GetGapReport";
		let params = new URLSearchParams();
		for(let key in Data) {
			params.set(key, Data[key]);
		}
		this.options.search =  params;
		return this.http.put(url, Data, {params: terms,responseType: 'blob' });	
	}
	
	getScorecardMembers(Data: any, terms:any, name): Observable<any>{
		let url = this.API_BASE + "/reports/GetMemberCount/"+name;
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;	
		// return this.http.put(url, Data, this.options);
		return this.http.put(url, Data, { params: terms, observe: 'response' });
	}
	
	getListingReport(Data: any, terms:any, name): Observable<any>{
		let url = this.API_BASE + "/reports/GetMemberCount/"+name;
		let params = new URLSearchParams();
		for(let key in Data) {
			params.set(key, Data[key]);
		}
		this.options.search =  params;
		return this.http.put(url, Data, {params: terms,responseType: 'blob' });	
	}


	getAllProviders(terms: any): Observable<any>{
		let url = this.API_BASE + "/providerlist";
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;	
		// return this.http.get(url, this.options);
		return this.http.get(url, { params: terms, observe: 'response' });
	}

	getAllProvidersReport(terms: any): Observable<any>{
		let url = this.API_BASE + "/providerlist";
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;
		return this.http.get(url, {params: terms,responseType: 'blob' });	
	}


	updateProviderStatus(id: number, obj: any): Observable<any>{
		let url = this.API_BASE + "/PutProviderStatus/"+id;
		// let data = {
		// 	"Status" : status
		// }
		return this.http.put(url, obj);	
	}

	addProvider(provider: any): Observable<any>{
		let url = this.API_BASE + "/postprovider/";
		return this.http.post(url, provider);
	}
//Members

getAllMembers(terms: any): Observable<any>{
	let url = this.API_BASE + "/memberlist";
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

getProviderMembers(terms: any): Observable<any>{
	let url = this.API_BASE + "/providerlist";
	let params = new URLSearchParams();
	for(let key in terms) {
		params.set(key, terms[key]);
	}
	this.options.search =  params;	
		// return this.http.get(url, this.options);
		return this.http.get(url, { params: terms, observe: 'response' });
	}



	getmemberhealthcard(Data: any): Observable<any>{
		// let url = this.API_BASE + "/members/gapsubmission/"+id;
		let url = this.API_BASE + "/reports/memberhealthcard/";
		return this.http.post(url, Data);	
	}

// Reports

getMemberRosters(terms: any): Observable<any>{
	let url = this.API_BASE + "/reports/GetMemberReport";
	let params = new URLSearchParams();
	for(let key in terms) {
		params.set(key, terms[key]);
	}
	this.options.params =  params;	
		// return this.http.get(url, this.options.params);
		return this.http.post(url,{}, { params: terms, observe: 'response' });
	}

	getSingleMeasureGaps(terms: any): Observable<any>{
		let url = this.API_BASE + "/reports/SingleMeasureGapReport";
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;	
		// return this.http.get(url, this.options);
		return this.http.get(url, { params: terms, observe: 'response' });
	}


	getOverallGaps(gapsData: any, terms:any): Observable<any>{
		let url = this.API_BASE + "/reports/OverallGapReport";
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;	
		// return this.http.put(url, gapsData, this.options);
		return this.http.post(url, gapsData, { params: terms, observe: 'response' });
	}
	getLastVisit(terms: any, provider_ids): Observable<any>{
		console.log(provider_ids)
		let url = this.API_BASE + "/reports/LastVisitReport";
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;		
		return this.http.post(url,provider_ids, { params: terms, observe: 'response' });
	}

getfollowups(terms: any): Observable<any>{
	let url = this.API_BASE + "/mra/MRAfollowup";
	let params = new URLSearchParams();
	for(let key in terms) {
		params.set(key, terms[key]);
	}
	this.options.params =  params;	
	if(terms.report){
		return this.http.post(url,terms, { params: terms, responseType: 'blob' });
		
		}else {
			return this.http.post(url,terms, { params: terms, observe: 'response' });
		}
		
	}


	// getReviewDetails(id: number, role): Observable<any>{
	// 	// let url = this.API_BASE + "/members/gapsubmission/"+id;
	// 	let url = this.API_BASE + "/mra/MRASuspected/"+id+"/"+role;
	// 	return this.http.get(url);	
	// }
	getReviewDetails(data): Observable<any>{
		// let url = this.API_BASE + "/members/gapsubmission/"+id;
		let url = this.API_BASE + "/mra/MRASuspected";
		return this.http.post(url,data);	
	}


	auditReviewSubmission(Data: any): Observable<any>{
		// let url = this.API_BASE + "/members/gapsubmission/"+id;
		let url = this.API_BASE + "/audit/MRAAudit/";
		return this.http.post(url, Data);	
	}

	getUserActivity(terms: any): Observable<any>{
		let url = this.API_BASE + "/User_Details/loginlist";
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

	//add mra review 
	addMRAReview(Data: any): Observable<any>{
		// let url = this.API_BASE + "/members/gapsubmission/"+id;
		let url = this.API_BASE + "/mra/MRAReview/";
		return this.http.post(url, Data);	
	}

	//gap closure 
	updateGapClosure(id: number, Data: any): Observable<any>{
		// let url = this.API_BASE + "/members/gapsubmission/"+id;
		let url = this.API_BASE + "/members/gapsubmission/";
		return this.http.post(url, Data);	
	}


	modifyGapClosure(id: number, Data: any): Observable<any>{
		// let url = this.API_BASE + "/members/gapsubmission/"+id;
		let url = this.API_BASE + "/members/gapsmodification/"+id;
		return this.http.post(url, Data);	
	}

	removeGapDoc(id: number, Data: any): Observable<any>{
		// let url = this.API_BASE + "/members/gapsubmission/"+id;
		let url = this.API_BASE + "/members/removefile/"+id+"/"+Data;
		
		return this.http.get(url);	
	}

	removeReviewDoc(id: number, Data: any): Observable<any>{
		
		let url = this.API_BASE + "/MRA/removefile/"+id+"/"+Data;
		return this.http.get(url);	
	}
	getGapDetail(Data: any): Observable<any>{
		// let url = this.API_BASE + "/members/gapsubmission/"+id;
		let url = this.API_BASE + "/members/membergap/";
		return this.http.post(url, Data);	
	}

	getSubmissionReasons(id: number): Observable<any>{
		// let url = this.API_BASE + "/members/gapsubmission/"+id;
		let url = this.API_BASE + "/audit/submissionreasons/"+id;
		return this.http.get(url);	
	}
	
	submitReview(reviewData: any): Observable<any>{
		let url = this.API_BASE + "/members/gapreview/";
		return this.http.post(url, reviewData);	
	}

	getReviewComments(reviewData: any): Observable<any>{
		let url = this.API_BASE + "/members/reviewcomments/";
		return this.http.post(url, reviewData);	
	}


//gap audit 
	getSubmittedGaps(gapsData: any, terms:any): Observable<any>{
		let url = this.API_BASE + "/members/gapdetailsaudit";
		let params = new URLSearchParams();
		for(let key in terms) {
			params.set(key, terms[key]);
		}
		this.options.search =  params;	
		// return this.http.put(url, gapsData, this.options);
		return this.http.post(url, gapsData, { params: terms, observe: 'response' });
	}

	getSubmittedGapsReport(term, Data: any): Observable<any>{
		let url = this.API_BASE + "/members/gapdetailsaudit";
		let params = new URLSearchParams();
		for(let key in Data) {
			params.set(key, Data[key]);
		}
		this.options.search =  params;
		return this.http.post(url, term, {params: Data,responseType: 'blob' });	
	}

	updateAuditStatus(Data: any, status): Observable<any>{
		// let url = this.API_BASE + "/members/gapsubmission/"+id;
		let obj = {
			"status":status,
			"comment":Data.comment,
			"userid":Data.userid,
			"username":Data.username,
			"reasonid": Data.reasonid,
			"rolename": Data.rolename
		}
		let url = this.API_BASE + "/members/updateauditstatus/"+Data.gapsid;
		return this.http.post(url, obj);	
	}


// get videos by role
// --------- Videos --------- //
	getUserVideos(data: any): Observable<any>{
		let url = this.API_BASE + "/Guidelines/GuidelineslistByRole/";
		return this.http.post(url, data);
	}


	//Messages 
	getMessages(id, type): Observable<any>{
		let url = this.API_BASE + "/MemberProvConvo/conversation/"+type+"/"+id;
		return this.http.get(url);
	}
	
	getSingleConvo(id, type): Observable<any>{
		let url = this.API_BASE + "/MemberProvConvo/MemberProvConvoByRootID/"+type+"/"+id;
		return this.http.get(url);
	}




	// --------- Bulk mail ---------

	// get providers by hp or ipa
	getProviders(id, type): Observable<any>{
		let url = this.API_BASE +"/providers/"+ type +"/"+id;
		return this.http.get(url);
	}

	//post bulkmail required fields for member or provider
	postBulkmailDetails(type, data: any): Observable<any>{
		let url = this.MAIL_BASE + "/Notification/"+type;
		return this.http.post(url, data);
	}
	emaildata(data:any): Observable<any>{
		let url= this.API_BASE+"/suspectedemail";
		return this.http.post(url,data);
	}
    getname(data:any):Observable<any>
    {
    	 
    	let url=this.API_BASE+"/reports/grouplisting";
    	let params = new URLSearchParams();
		for(let key in data) {
			params.set(key, data[key]);
		}
		
		return this.http.get(url, { params: data, observe: 'response' });

    }
    emailmangmt(data:any):Observable<any>
    {
    	let url=this.API_BASE+"/reports/editgroup";
    	return this.http.put(url,data);

    }
    deleteGroup(id):Observable<any>
    {
    	let url=this.API_BASE+"/reports/deletegroup";
    	return this.http.put(url,id);
    }
    removenote(id):Observable<any>    
    {
    	let url=this.API_BASE+"/providerscorecard/deletenote/"+id;
    	return this.http.delete(url)
    }
    openeditemail(id):Observable<any>
     {
     	let url=this.API_BASE+"/reports/getgroupdetail/"+id;
     	return this.http.get(url);
     }

	// gaps template data
	getNdcCodes(id): Observable<any>{
		let url = this.API_BASE  + "/members/getndccode/"+ id;	
		return this.http.get(url);
	}

	getBrandNames(id): Observable<any>{
		let url = this.API_BASE  + "/members/getbrandname/"+ id;	
		return this.http.get(url);
	}

	getValueNdc(id): Observable<any>{
		let url = this.API_BASE  + "/members/getvaluendc/"+ id;	
		return this.http.get(url);
	}

	getGraphProducticityMraAudit(data):Observable<any>{
let url=this.API_BASE+"/dashboard/MRAAudit/teamcard";
return this.http.post(url,data)
}
getCensusReport(terms: any): Observable<any>{

let url = this.API_BASE + "/reports/Censusreport";
let params = new URLSearchParams();
for(let key in terms) {
params.set(key, terms[key]);
}
this.options.params =  params;
if(terms.report){
return this.http.post(url,terms, { params: terms, responseType: 'blob' });
}else {
return this.http.post(url,terms, { params: terms, observe: 'response' });
}
// return this.http.get(url, this.options.params);
// return this.http.post(url,terms, { params: terms, observe: 'response' });
}
	//productivity
	getAssuranceProductivity(data, type): Observable<any>{
		let url;
		if(type=="MRA"){
			url = this.API_BASE  + "/reports/MRAreviewreport";	
		}else{
			url = this.API_BASE  + "/reports/reviewreport/"+ type;	
		}
		// let url = this.API_BASE  + "/reports/reviewreport/"+ type;	
		let params = new URLSearchParams();
		let paging = {
			"pageNumber":data.pageNumber,
			"pageSize":data.pageSize
		}
		for(let key in paging) {
			params.set(key, paging[key]);
		}
		this.options.search =  params;
		if(data.report){
			return this.http.post(url, data, {params: paging,responseType: 'blob' });	
		}else {
			return this.http.post(url, data, { params: paging, observe: 'response' });
		}
	
	}

getAuditMraProductivity(data, type): Observable<any>{
		let url;
		if(type=="HEDIS"){
			url = this.API_BASE  + "/reports/Hedisqualityauditreport";	
		}else{
			url = this.API_BASE  + "/reports/Hedisqualityauditreport";	
		}
		// let url = this.API_BASE  + "/reports/reviewreport/"+ type;	
		let params = new URLSearchParams();
		let paging = {
			"pageNumber":data.pageNumber,
			"pageSize":data.pageSize
		}
		for(let key in paging) {
			params.set(key, paging[key]);
		}
		this.options.search =  params;
		if(data.report){
			return this.http.post(url, data, {params: paging,responseType: 'blob' });	
		}else {
			return this.http.post(url, data, { params: paging, observe: 'response' });
		}
	
	}

	//Surveyer List
	getSurveyerProductivity(data): Observable<any>{
		let url = this.API_BASE  + "/survey/productivity";
		
		// let url = this.API_BASE  + "/reports/reviewreport/"+ type;	
		let params = new URLSearchParams();
		let paging = {
			"pageNumber":data.pageNumber,
			"pageSize":data.pageSize
		}
		for(let key in paging) {
			params.set(key, paging[key]);
		}
		this.options.search =  params;
		if(data.report){
			return this.http.post(url, data, {params: paging,responseType: 'blob' });	
		}else {
			return this.http.post(url, data, { params: paging, observe: 'response' });
		}
	
	}

	//Trends API
	getMemberTrends(param): Observable<any>{
		
		let url = this.API_BASE + "/trending/GetMemberGraph";
		return this.http.post(url, param);
	}

	getMRATrend(param): Observable<any>{
		
		let url = this.API_BASE + "/trending/GetMRAGraph";
		return this.http.post(url, param);
	}


	getIPATrend(param): Observable<any>{
		
		let url = this.API_BASE + "/trending/GetIPAGraph";
		return this.http.post(url, param);
	}

	getMeasureTrend(param): Observable<any>{
		
		let url = this.API_BASE + "/trending/GetMeasureGraph";
		return this.http.post(url, param);
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
