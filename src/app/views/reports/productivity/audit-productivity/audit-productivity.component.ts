import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { PagerService } from '../../../../services/pager.service';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../services/auth.service';
import { saveAs } from 'file-saver';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-audit-productivity',
  templateUrl: './audit-productivity.component.html',
  styleUrls: ['./audit-productivity.component.scss']
})
export class AuditProductivityComponent implements OnInit {
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;
  currentUser: any;
  provider: any = {};
  address: any = [];
  address_list_count = [0];
  userRolePerm: any;
  assurance_list: any;
  insurance_list: any;
  page: number = 1;
	pager: any = {};
	total_pages: number;
	showPagination: boolean = true;
 
	provider_name: string;
  IPA_Name: string;
  month: any;
  year: any;


  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'name':'',
    'reporttype': '',
    'report': false,
    'qaranking':false
  }


  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
assurance_type:string;

custom: boolean = false;

category:any="";
@ViewChild('date_val') date_val: ElementRef;
  constructor(public authS: AuthService, private commonService: CommonService, private pagerService: PagerService,
    private userService: UserService, private toastr: ToastrService,  private router: Router, private route: ActivatedRoute) { 

    this.maxDate.setDate(this.maxDate.getDate());
    this.bsValue.setDate(this.bsValue.getDate() -30);
    
  }
  // showSuccess(msg, title) {
  //   this.toastr.success(title, msg);
  // }
  // showDanger(msg, title) {
  //   this.toastr.error(title, msg);
  // }
  ngOnInit() {

	this.route.params.subscribe(params => {
      this.assurance_type = params['type'];
      
    });
    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

this.bsRangeValue = [this.bsValue, this.maxDate];
this.getAllAssurance(true);
    // this.getAllAssurance(true);
    // this.getAllHealthplans();
  }



  getAllAssurance(resetPage) {

  	// console.log(this.bsRangeValue);
    if(!this.custom){
      this.params['startdate'] = this.bsRangeValue[0];
    this.params['enddate'] = this.bsRangeValue[1];
    }else{

      this.bsRangeValue = [this.params['startdate'], this.params['enddate']];
    }
  	
  	// console.log(this.params)
    // this.page=1;
    if (resetPage) {
      this.params['pageNumber'] = 1
      this.page = 1;
    }
    this.params.reporttype = '';
    this.params.report = false;
    this.commonService.getAuditMraProductivity(this.params,"HEDIS").subscribe(results => {
    	console.log(results)
      this.showPagination = true;
      //  console.log(results.headers.get('Content-Type'))
      // console.log(JSON.parse(results.headers.get('Paging-Headers')).totalCount)
     
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.assurance_list = results.body;

      this.setPages();
      // localStorage.removeItem('dashboard_date')
    }, err => {

    });
  }


   // Searching provider
  searchAssurance() {
    this.params.reporttype = '';
    this.params.report = false;
    if (this.params.name.length > 2) {
      // this.showPanel = true;

      this.page = 1;
      this.params['pageNumber'] = 1;
      this.params['pageSize'] = 15;
      this.commonService.getAuditMraProductivity(this.params, "HEDIS").subscribe(
        res => {
			this.getAllAssurance(true)
        },
        err => {
          //
        }
      )
    } else if (this.params.name.length == 0) {
      this.getAllAssurance(true)
    }
  }

  // getAllHealthplans() {
  //   this.commonService.getAllHealthplans().subscribe(results => {

  //     this.insurance_list = results;
  //   }, err => {

  //   });
  // }

  getReport(type) {
    // this.provider.type=type;
    //   this.provider.report = true;

    // let reportDetails = {
    //   // 'providername': this.provider_name,
    //   // 'healthplanname': this.healthplanName,
    //   // 'selectedmonth':this.selectedMonth,
    //   'reporttype': type,
    //   'report': true
    // }
    this.params.reporttype = type;
    this.params.report = true;
    // var obj = Object.assign(this.provider);
    // var reportParams = { ...this.params, ...reportDetails };
    // console.log(obj)/
    this.commonService.getAuditMraProductivity(this.params,"HEDIS"
    ).subscribe(results => {

      if (type == 'pdf') {
        saveAs(results, `audit-productivity-report.pdf`)
      } else {
        saveAs(results, `audit-productivity-report.xlsx`)
      }

    }, err => {
    });
  }

customDate(range){
  range = Number(range)
  this.custom = true;



var date = new Date();
        switch (range) {
            case 1:
              
                this.params['startdate'] = date;
                this.params['enddate'] = date;
break;
            case 2:
                date.setDate(date.getDate() - 1)
    this.params['startdate'] = date;
    this.params['enddate'] = date;
break;
            case 3:
     
           date.setDate(date.getDate() - 7)
    this.params['startdate'] = date;
    this.params['enddate'] = new Date();
break;
            case 4:
         
           date.setDate(date.getDate() - 30)
    this.params['startdate'] = date;
    this.params['enddate'] = new Date();
break;
            case 5:
     date.setDate(date.getDate() - 90)
    this.params['startdate'] = date;
    this.params['enddate'] = new Date();
    break;
        case 6:
     date.setDate(date.getDate() - 180)
    this.params['startdate'] = date;
    this.params['enddate'] = new Date();
    break;
            case 7:
     date.setDate(date.getDate() - 365)
    this.params['startdate'] = date;
    this.params['enddate'] = new Date();
    break;
default:

               
                    this.params['startdate'] = date;
    this.params['enddate'] = date;
        }
    
  this.getAllAssurance(true);
  this.custom = false;
}


  loadByPage(page_number: number) {
    if (page_number < 1 || page_number > this.pager.total_pages) {
      return;
    }
    this.page = page_number;
    this.params['pageNumber'] = this.page
    this.getAllAssurance(false);
  }


  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }
}
