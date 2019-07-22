import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { saveAs } from 'file-saver';

import { MraService } from '../../../services/mra.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-follow-ups',
  templateUrl: './follow-ups.component.html',
  styleUrls: ['./follow-ups.component.scss']
})
export class FollowUpsComponent implements OnInit {
  search_category: string = '';
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;
  currentUser: any;


  provider_name: string;
  provider_id: number;
  ipa_list: any;
  insurance_list: any;

 provider = {
    providerid: 0,
    healthplanid: 0,
    month: '',
    year: '',
    startdate: '',
    enddate: '',
    status:null
  }
  search_text: string;
  members: any;
  member_list: any
  showPanel: boolean = true;
  page: number = 1;
  pager: any = {};
  total_pages: number;
  showPagination: boolean = true;

  // search_category:string='';
  healthplanName: string = 'All';

  params = {
     'condition':null,
     'providerid': 0,
    'healthplanid': 0,
    'pageNumber': 1,
    'pageSize': 15,
   'status':null,
    'docsubmittedby':null
  }

assuranceUsers:any;
  // member report card params
  @ViewChild('MRAReviewModal') public modal: ModalDirective;
  // @ViewChild('staticModal') public staticModal: ModalDirective;



  // @ViewChild('MRAReviewModal') public MRAReviewModal: ModalDirective;
  // @ViewChild('MRAReviewForm') public MRAReviewForm: NgForm;
//   member_card:any;
//   member_card1:any;
// bp_systolic:number[] = [];
//   years: string[] = [];
//   date: any= {
//       // 'month':this.current_month,
//       'month': "",
//       'year': ""
//     };
//   days: any;
//   current_date = new Date();
//   current_month = this.authS.getDates().current_month;
//   previous_month = this.authS.getDates().previous_month;
//   current_year = this.authS.getDates().current_year;
  currentRole:string;
  CONTENT_BASE = environment.content_api_base.api_base;
  // @ViewChild('term') input: ElementRef;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  review_details:any;
  check:boolean = true;
  constructor(public authS: AuthService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService,  private mraService: MraService,
    private pagerService: PagerService,
    private userService: UserService) { 
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.currentRole = this.authS.getCurrentRole(user.roleid);

    //     this.maxDate.setDate(this.maxDate.getDate());
    // this.bsValue.setDate(this.bsValue.getDate() -30);
    
    // this.add_review.push(this.review_obj);
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentRole == 'qa'){
    	// this.bsRangeValue = [this.bsValue, this.bsValue];
    	this.params.docsubmittedby = this.currentUser.userid
    }else{
    	this.getAssuranceUsers();
    	this.check = false;
    }
    
      
    // this.checkMonth(this.current_year)

    this.getAllMembers(false);
  }

  ngOnDestroy(){

  }

resetFilters(){
  this.params = {
     'condition':null,
     'providerid': 0,
    'healthplanid': 0,
    'pageNumber': 1,
    'pageSize': 15,
   'status':null,
    'docsubmittedby':null
  }
	
	 if(this.currentRole == 'qa'){
	 	this.bsRangeValue = [];
    	this.params.docsubmittedby = this.currentUser.userid
    }else{
    	this.check= false;
    	this.params.docsubmittedby =null;
    	this.bsRangeValue =[];
    }
	// this.bsRangeValue = [this.bsValue, this.bsValue];
this.getAllMembers(false);
}

  getReport(type) {
    // this.provider.type=type;
    //   this.provider.report = true;

    // let reportDetails = {
    //   'providername': this.provider_name,
    //   'healthplanname': this.healthplanName,
    //   // 'selectedmonth':this.selectedMonth,
    //   'type': type,
    //   'report': true
    // }
    // // var obj = Object.assign(this.provider);
    // var reportParams = { ...this.params, ...reportDetails };
    // console.log(obj)/
    this.params['report'] = true;
    this.commonService.getfollowups(this.params
      ).subscribe(results => {

        if (type == 'pdf') {
          saveAs(results, `follow-up-report.pdf`)
        } else {
          saveAs(results, `follow-up-report.xlsx`)
        }

      }, err => {
      });
    }


    getAllMembers(resetPage) {
      if(this.params.status=="null")
       {
         this.params.status=null;
       }
       else{
         console.log()
       }
    	this.params['report'] = false;
      if (resetPage) {
        this.params['pageNumber'] = 1
        this.page = 1;
      }
      if(this.check){
      	if(this.bsRangeValue){
      		this.params['startdate'] = this.bsRangeValue[0];
    this.params['enddate'] = this.bsRangeValue[1];
      	}
      	
}else{
this.params['startdate'] = "";
    this.params['enddate'] ="";
    this.check = true;
}

    this.commonService.getfollowups(this.params).subscribe(results => {
      this.showPagination = true;

      
      this.member_list = results.body;
      
      
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.setPages();
    }, err => {
    });
  }


auditReviewSubmission(){
	// let selected = this.review_details.conditions.filter((review) => {
	// 	return review.auditstatus == true
	// })

	// let selected = this.review_details.conditions;

 //    let temp = [];

 //    for (let i = 0; i < selected.length; i++) {
 //      temp.push(selected[i].id)
 //    }

    let obj = {
    	"uniqueids":this.review_details.conditions,
    	"firstname":this.currentUser.name,
    	"userid":this.currentUser.userid
    }

    this.commonService.auditReviewSubmission(obj).subscribe(results => {

     this.modal.hide();

      }, err => {
      });

}
// folowupDate()
//   {
//  // let tt = this.review_details.folowup;
//  //  
//     var date = new Date(Date.parse(this.review_details.folowup));
//    // // var dateadder=Number(this.review_details.folowup)+5184000000
//    // // var date=new Date(dateadder).toLocaleDateString()
//    // console.log(date);
//    // var tt = date.setDate(date.getDate() +5184000000)
   
//    // console.log(tt);
//    // // this.review_details.folowup=tt;


//    var result = new Date(date);
//   result.setDate(result.getDate() + 30);
//   this.review_details.folowup= result;

  
//   }

searchProvider() {
    if (this.provider_name.length > 2) {
      this.showPanel = true;
      this.userService.search_provider(this.provider_name).subscribe(
        res => {
          this.members = res;
        },
        err => {
          //
        }
        )
    }
    if (this.provider_name.length == 0) {
      this.members = [];
      this.showPanel = false;
    }

  }
    getInsurance(member) {
    this.showPanel = false;
    this.provider_name = member.FirstName + ' ' + member.LastName;
    this.params['providerid'] = member.id;
    this.showPanel = false;
    // this.provider.uniqeproviderno = member.id;
    // this.commonService.getInsurance(member.id
    //   ).subscribe(results => {

    //     this.insurance_list = results;

    //   }, err => {

    //
    }   
  getAssuranceUsers() {
    this.userService.getRoleWiseUsers(3).subscribe(results => {

      this.assuranceUsers = results;
    }, err => {

    });
  }
  loadByPage(page_number: number) {
    page_number = Number(page_number);
    if (page_number < 1 || page_number > this.pager.total_pages) {
      return;
    }
    page_number = Number(page_number);
    this.page = page_number;
    // console.log("Page"+this.page)
    // console.log("Page numbe"+page_number)
    this.params['pageNumber'] = this.page
    this.getAllMembers(false);
    // window.scrollTo(0, 200);
  }


  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }


getReviewDetails(member){
  this.params['subscriberid']=member.subscriberid;
  this.params['currentrole']=this.currentRole;

  this.commonService.getReviewDetails(this.params
        ).subscribe(results => {

          this.review_details = results;
          console.log(this.review_details)      
          this.modal.show()
        }, err => {
        });
}








}
