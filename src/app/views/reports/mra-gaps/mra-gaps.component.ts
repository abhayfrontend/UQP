import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../services/user.service';

import { CommonService } from '../../../services/common.service';
import { MraService } from '../../../services/mra.service';
import { PagerService } from '../../../services/pager.service';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-mra-gaps',
  templateUrl: './mra-gaps.component.html',
  styleUrls: ['./mra-gaps.component.scss']
})
export class MraGapsComponent implements OnInit {
  search_category: string = '';
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;
  // To check acl add/edit/view
  userRolePerm: any;
  disableBtn: boolean = false;
  disclaimer: boolean = false;
  API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
  CONTENT_BASE = environment.content_api_base.api_base;



  //submitting gaps
  gapsEssentials: any;
  gapMember: any;
  gapSubmit: any = {};
  measureName: string;

  //multi select params
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};


  //provider search
  provider_name: string;
  provider_id: number;
  ipa_list: any;
  insurance_list: any;

  searching: boolean = false;
  search_text: string;
  members: any;
  member_list: any
  showPanel: boolean = true;
  page: number = 1;
  pager: any = {};
  total_pages: number;
  showPagination: boolean = true;

  // search_category:string='';
  healthplanName: string;

  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'year':0,
    'providerid': 0,
    'healthplanid': 0,
    'subsId': '',
    'membername': '',
    'conditiontype':'',
    'month':'',
    'gapstatus':true
  }

    months = [{ "full": "January", "value": "01", "days": "31" },
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
      ];

missing_conditions = {
	'HealthplanId':0,
	'type':'',
	'year':0
}
missing_conditions_list:any;

  years: string[] = [];
  date: any;
  days: any;
  measures: any;
  current_date = new Date();

  current_year = this.authS.getDates().current_year;



  currentUser:any;
 

  @ViewChild('term') input: ElementRef;
  constructor(public authS: AuthService, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService,
    private pagerService: PagerService, private mraService: MraService,
    private userService: UserService, private cdr: ChangeDetectorRef) {
    // this.getMissingConditions();

  }

  ngOnInit() {
    this.getAllIPA();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   
    
    this.getAllHealthplans();
    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }

    this.userRolePerm = this.authS.getPermission('Overall Gap');
    //check if provider is entering then get details a/c to that provider
    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    
    // if (this.rolename == 'qa') {
    //   this.params['assuranceid'] = this.currentUser.userid;
    //   if(this.qaStatus){
    //     this.params.status = this.qaStatus;
    //   }
    // }


    // this.getAllMembers(false);

    //Multiple measure dropdown settings
    

    this.dropdownSettings = {
      singleSelection: false,
      text: "Select missing conditions",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      labelKey: 'MissingConditions',
      primaryKey: 'MissingConditionID',
      classes: "myclass mb-sm-0 col-md-4",
    };
  



    // If it is coming from dashboard clickables
    let MraHpGaps = JSON.parse(localStorage.getItem('MraHpGaps'));
    if (MraHpGaps) {
      // this.showDates = true;

//missing conditions object
this.setMraClickables(MraHpGaps);

      // this.healthplanName = MraHpGaps.healthplanName;
      // this.provider_name = MraHpGaps.pname;
      // this.selectedItems = [{ MissingConditions: "HIV/AIDS", MissingConditionID: 7 }]

     this.mraService.getMissingConditions(this.missing_conditions).subscribe(results => {

        this.missing_conditions_list = results;
        this.dropdownList = this.missing_conditions_list;
        this.selectedItems = this.missing_conditions_list;
        
      }, err => {

  });

      // this.getAllMembers(true);
      // this.commonService.getInsurance(Number(this.params.providerid)
      // ).subscribe(results => {

      //   this.insurance_list = results;

      // }, err => {

      // });
    } else {

      this.resetFilters();

    }

//check if provider is entering then get details a/c to that provider
    if (this.rolename == 'provider') {
      this.params.providerid = this.roleid;
    }else if(this.rolename == 'healthplan'){
      this.params.healthplanid = this.roleid;
    }
  }
  // assuranceGaps(){
  //   if(this.showAllGaps){
  //     this.params['assuranceid'] = ''
  //   }else{
  //    this.params['assuranceid'] = this.currentUser.userid;
  //   }
  //   this.getAllMembers(true)
  // }
    onItemSelect(item: any) {
    // console.log(item);  
    // console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  onDeSelectAll(items: any) {
    // console.log(items);
  }
setMraClickables(MraHpGaps){
  this.missing_conditions.HealthplanId = MraHpGaps.healthplanid;
this.missing_conditions.year = MraHpGaps.year;
this.missing_conditions.type = MraHpGaps.type;
      this.params.healthplanid = MraHpGaps.healthplanid;
      this.params.year = MraHpGaps.year;
      this.params.conditiontype = MraHpGaps.type;
      this.params.providerid = MraHpGaps.providerid;
      this.params.gapstatus = true;
}

  resetFilters() {
this.params.subsId= '';
    this.params.membername= '';
      this.mraService.getMissingConditions(this.missing_conditions).subscribe(results => {

        this.missing_conditions_list = results;
        this.dropdownList = this.missing_conditions_list;
        this.selectedItems = this.missing_conditions_list;
    let MraHpGaps = JSON.parse(localStorage.getItem('MraHpGaps'));
    if (MraHpGaps) {
      // this.showDates = true;

//missing conditions object
this.setMraClickables(MraHpGaps);}
    // this.params['healthplanid'] = 0;
    // this.params['IPA_ID'] = 0;
    // this.params['providerid'] = undefined;
    // this.params['status'] = 'all';
    this.params['report'] = false;
        this.getAllMembers(true);
      }, err => {

  });





    //       setTimeout(() =>{
    // this.selectAllMeasures();
    // this.getAllMembers(true);
    //       },200)

    this.provider_name = '';

    if (this.rolename !== 'provider') {
      this.params.providerid = 0;
    }
    if (this.rolename !== 'healthplan') {
      this.params.healthplanid = 0;
    }
    
    

  }

  selectAllMeasures() {
    let arr = this.measures;

    for (let i = 0; i < arr.length; i++) {
      arr[i].id = arr[i]['Measure_ID'];
      arr[i].itemName = arr[i]['Measure_Name'];

      arr[i].Measure_ID = arr[i]['Measure_ID'];

      // delete arrayObj[i].key1;
    }
    // this.dropdownList = arr;


    this.selectedItems = arr;
  }

  getMissingConditions(){
	this.mraService.getMissingConditions(this.missing_conditions).subscribe(results => {

	      this.missing_conditions_list = results;
	      this.dropdownList = this.missing_conditions_list;
	      this.selectedItems = this.missing_conditions_list;
	      this.getAllMembers(true);
	    }, err => {

	});
  }

  getAllIPA() {
    this.commonService.getAllIPA().subscribe(results => {

      this.ipa_list = results;
    }, err => {

    });
  }

  ngOnDestroy() {
    //Removing dashboard clickable logic on destroy
    // localStorage.removeItem('MraHpGaps');
  }

  getMeasures() {
    this.commonService.getMeasures().subscribe(results => {

      this.measures = results;

      for (let i = 0; i < this.measures.length; i++) {
        this.measures[i].id = this.measures[i]['Measure_ID'];
        this.measures[i].itemName = this.measures[i]['Measure_Name'];
        // delete arrayObj[i].key1;
      }
      this.dropdownList = this.measures;
    }, err => {

    });
  }


    setMemberDetails(member){
        this.gapSubmit.pcpfirstname = member.pcpfirstname;
    this.gapSubmit.pcpmidname = member.pcpmidname;
    this.gapSubmit.pcplastname = member.pcplastname;
    this.gapSubmit.subscriberFirstname = member.subscriberFirstname;
    this.gapSubmit.subscribermidname = member.subscribermidname;
    this.gapSubmit.subscribelastname = member.subscribelastname;
    this.gapSubmit.measname = member.measname;
    this.gapSubmit.gender = member.gender;
    this.gapSubmit.dob = member.dob;
    this.gapSubmit.hpname = member.hpname;
  }



  

  getReport(type) {
    // this.provider.type=type;
    //   this.provider.report = true;

    let reportDetails = {
      'type': type,
      'report': true
    }
    // var obj = Object.assign(this.provider);
    var reportParams = { ...this.params, ...reportDetails };
    // console.log(obj)/

        this.mraService.getMraGaps(this.measureArray(), reportParams).subscribe(results => {
      if (type == 'pdf') {
        saveAs(results, `mra-gaps.pdf`)
      } else {
        saveAs(results, `mra-gaps.xlsx`)
      }
    }, err => {

    });

}


  // search(term) {
  //   // this.checkCategory(term)
  //   this.params['providername'] = term;
  //   if (term.length > 2) {

  //     this.getAllMembers(true);

  //   } else if (term.length == 0) {

  //     this.getAllMembers(true);
  //   }
  // }

  getAllMembers(resetPage) {

    if (resetPage) {
      this.params['pageNumber'] = 1;
      this.page = 1;
    }
this.params['report'] = false;
    
    // this.page=1;
    this.mraService.getMraGaps(this.measureArray(), this.params).subscribe(results => {
      this.showPagination = true;
      // localStorage.removeItem('MraHpGaps')
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.member_list = results.body

      this.setPages();
    }, err => {

    });
  }

  measureArray() {
    let temp = [];

    for (let i = 0; i < this.selectedItems.length; i++) {
      temp.push(this.selectedItems[i].MissingConditionID)
    }


    return temp;
  }
  // measureArray(){

  //   console.log(this.measures)

  //     var temp = [];
  //     if(this.selectedItems.length == this.measures.length){
  //     console.log("All")
  //     temp = [0];
  //   }else{
  //     console.log("indi")
  //     for(let i =0;i<this.selectedItems.length;i++){
  //     temp.push(this.selectedItems[i].Measure_ID)
  //     }
  //   }


  //   console.log(temp)
  //   return temp;
  // }

  searchMembers() {
    if (this.search_text.length > 2) {
      this.showPagination = false;
      this.page = 1;

      this.userService.search_provider(this.search_text).subscribe(
        res => {

          this.member_list = res;
        },
        err => {
          //
        }
      )
    } else if (this.search_text.length == 0) {
      this.getAllMembers(true)
    }


  }

  loadByPage(page_number: number) {
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

	searchProvider() {
		if (this.provider_name.length > 2) {
			// this.showPanel = true;
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
			this.members = [];this.params.providerid = 0;
			// this.showPanel = false;
		}

	}


  getAllHealthplans() {
    this.commonService.getAllHealthplans().subscribe(results => {

      this.insurance_list = results;
    }, err => {

    });
  }


	  getInsurance(member) {
	    this.showPanel = false;
	    this.provider_name = member.FirstName + ' ' + member.LastName;
	    this.params.providerid = member.id;
	   
	    // this.provider.uniqeproviderno = member.id;
	    // this.commonService.getInsurance(member.id
	    // ).subscribe(results => {

	    //   this.insurance_list = results;
	    //   this.params.healthplanid = 0;
	    // }, err => {

	    // });
  }

  checkCategory(val) {
    // console.log(val)
    if (this.search_category == 'name') {

      this.params['membername'] = val;
      this.params['subsId'] = ''
      this.params['dob'] = ''
    } else if (this.search_category == 'id') {

      this.params['membername'] = '';
      this.params['subsId'] = val;
      this.params['dob'] = ''
    } else if (this.search_category == 'dob') {

      this.params['membername'] = '';
      this.params['dob'] = val;
      this.params['subsId'] = ''
    }

  }
  search(term) {
    this.checkCategory(term)

    if (term.length > 2) {
      this.page = 1;
      this.getAllMembers(true);

    } else if (term.length == 0) {
      this.page = 1;
      // this.params.membername = '';
      this.getAllMembers(true);
    }
  }

}
