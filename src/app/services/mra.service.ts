import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Response,RequestOptions,URLSearchParams, Headers  }  from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MraService {
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

    // --------- Dashboard --------- //

    getDataCount(date: any,role,id): Observable<any>{
        let url = this.API_BASE + "/dashboard/"+role+"/datacard/"+id;
        return this.http.post(url, date);
    }

    // getMraHealthplanCount(date: any,role,id): Observable<any>{
    //  let url = this.API_BASE + "/dashboard/"+role+"/MRAhealthplancard/"+id;
    //  return this.http.post(url, date);
    // }

    getMraHealthplanCount(terms: any,role,id): Observable<any>{
        let url;
        if(id){
            // url = this.API_BASE + "/dashboard/"+role+"/MRAhealthplancard/"+id+"/"+terms.year;
            url = this.API_BASE + "/dashboard/MRAhealthplancard/"+role+"/"+terms.year+"/"+id;
        }else{
            url = this.API_BASE + "/dashboard/MRAhealthplancard/"+role+"/"+terms.year+"/0";
            
        }
        
        return this.http.get(url);
    }

    getMraMemberScores(role, hpid, roleid, range): Observable<any>{
        let url;
        if(role == 'healthplan'){
            url = this.API_BASE + "/dashboard/MRApiechart/"+role+"/"+roleid+"/0";
        }else{
            if(roleid){
            // url = this.API_BASE + "/dashboard/"+role+"/MRApiechart/"+roleid+"/"+hpid;
            url = this.API_BASE + "/dashboard/MRApiechart/"+role+"/"+hpid+"/"+roleid;
        }else{
            url = this.API_BASE + "/dashboard/MRApiechart/"+role+"/"+hpid+"/0";
        }
        }
        
        
        return this.http.post(url,range);
    }

    getMraProviderScores(hpid): Observable<any>{
        let url = this.API_BASE + "/dashboard/MRAProviderpiechart/"+hpid;   
        return this.http.get(url);
    }
    
    getMraPrevalence(data: any): Observable<any>{
        let url = this.API_BASE +  "/mra/prevelance";
                
        return this.http.post(url, data,{observe: 'response' });
    }
    
    

    getGapsCount(date: any,role,id): Observable<any>{
        this.setHeader();
        let url = this.API_BASE + "/dashboard/gapcard/";
        return this.httpf.post(url,date,{
            headers: this.headers
        }).map(this.extractData).catch(this.handleError);
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



//Members

getAllMembers(terms: any): Observable<any>{
    let url = this.API_BASE + "/memberlist";
    let params = new URLSearchParams();
    for(let key in terms) {
        params.set(key, terms[key]);
    }
    this.options.search =  params;  
    return this.http.get(url, { params: terms, observe: 'response' });
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


    getMraGaps(gapsData: any, terms:any): Observable<any>{
        let url = this.API_BASE + "/mra/GetMRAGaps";
        let params = new URLSearchParams();
        for(let key in terms) {
            params.set(key, terms[key]);
        }
        this.options.search =  params;  

        if(terms.report){
            return this.http.post(url,gapsData, {params: terms,responseType: 'blob' }); 
        }else {
            return this.http.post(url, gapsData, { params: terms, observe: 'response' });
        }
    }


    // getUserActivity(terms: any): Observable<any>{
    //  let url = this.API_BASE + "/User_Details/loginlist";
    //  let params = new URLSearchParams();
    //  for(let key in terms) {
    //      params.set(key, terms[key]);
    //  }
    //  this.options.search =  params;  
    //  if(terms.report){
    //      return this.http.get(url, {params: terms,responseType: 'blob' });   
    //  }else {
    //      return this.http.get(url, { params: terms, observe: 'response' });
    //  }
        
    // }

    //scorecard
    getMraHealthplanScorecard(Data: any): Observable<any>{
        let url = this.API_BASE + "/mra/HealthplanScorecard/";
        return this.http.post(url, Data);
    }
    
    getMraMembers(terms: any, type:string): Observable<any>{

        let url = this.API_BASE + "/mra/members/"+type;

        let params = new URLSearchParams();
        for(let key in terms) {
            params.set(key, terms[key]);
        }
        this.options.search =  params;
        // return this.http.post(url,data);     
        // return this.http.get(url, { params: terms, observe: 'response' });

        if(terms.report){
            return this.http.get(url, {params: terms,responseType: 'blob' });   
        }else {
            return this.http.get(url, { params: terms, observe: 'response' });
        }
    }

    getMraProviders(terms: any): Observable<any>{

        let url = this.API_BASE + "/mra/providers";

        let params = new URLSearchParams();
        for(let key in terms) {
            params.set(key, terms[key]);
        }
        this.options.search =  params;
        // return this.http.post(url,data);     
        // return this.http.get(url, { params: terms, observe: 'response' });

        if(terms.report){
            return this.http.get(url, {params: terms,responseType: 'blob' });   
        }else {
            return this.http.get(url, { params: terms, observe: 'response' });
        }
    }



    getMissingConditions(data){
        let url = this.API_BASE + "/mra/MissingConditions/"+data.type;
        return this.http.post(url, data);
    }

    getHccCategory(hcccode): Observable<any>{
        let url;
        if(hcccode){
            url = this.API_BASE + "/mra/hccCategory/"+hcccode;
        }else{
            url = this.API_BASE + "/mra/hccCategory/null";
        }
            
        return this.http.get(url);
        }
    
    // getUserActivity(terms: any): Observable<any>{
    //  let url = this.API_BASE + "/User_Details/loginlist";
    //  let params = new URLSearchParams();
    //  for(let key in terms) {
    //      params.set(key, terms[key]);
    //  }
    //  this.options.search =  params;  
    //  if(terms.report){
    //      return this.http.get(url, {params: terms,responseType: 'blob' });   
    //  }else {
    //      return this.http.get(url, { params: terms, observe: 'response' });
    //  }
        
    // }

      getMraAuditDataCount(date): Observable<any>
      {
let url = this.API_BASE + "/dashboard/MRAAudit/GetMRAAudiGapCount";
return this.http.post(url,date);
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