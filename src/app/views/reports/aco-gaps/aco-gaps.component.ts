import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  ViewEncapsulation
} from "@angular/core";
import { UserService } from "../../../services/user.service";
import { CommonService } from "../../../services/common.service";
import { PagerService } from "../../../services/pager.service";
import { AcoService } from "../../../services/aco.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AuthService } from "../../../services/auth.service";
import { saveAs } from "file-saver";

import { TabsetComponent } from 'ngx-bootstrap';
import { TabDirective } from 'ngx-bootstrap/tabs';
import * as $ from 'jquery';
import { environment } from "../../../../environments/environment";
import {
  UploadOutput,
  UploadInput,
  UploadFile,
  humanizeBytes,
  UploaderOptions
} from "ngx-uploader";

@Component({
  selector: "app-aco-gaps",
  templateUrl: "./aco-gaps.component.html",
  styleUrls: ["./aco-gaps.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AcoGapsComponent implements OnInit {
  search_category: string = "";
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;
  reason: any = "";
  modalmember: any;
  API_BASE = environment.api_base.apiBase + "/" + environment.api_base.apiPath;
  CONTENT_BASE = environment.content_api_base.api_base;
  @ViewChild("reviewModal") public reviewModal: ModalDirective;
  @ViewChild("gapModal") public gapModal: ModalDirective;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  provider_name: string;
  provider_id: number;
  ipa_list: any;
  measures: any;
  insurance_list: any;
  search_text: string;
  members: any;
  member_list: any;
  reasondropdown: any = "";
  showPanel: boolean = true;
  page: number = 1;
  pager: any = {};
  qualified: any;
  qualifieddropdown: any;
  measuredropdown: any;
  measuredropdowntwo: any;
  total_pages: number;
  showPagination: boolean = true;

  // search_category:string='';
  healthplanName: string = "All";

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  gapSubmit: any = {};
  currentUser: any;

  months = [
    { full: "January", value: "01", days: "31" },
    { full: "February", value: "02", days: "28" },
    { full: "March", value: "03", days: "31" },
    { full: "April", value: "04", days: "30" },
    { full: "May", value: "05", days: "31" },
    { full: "June", value: "06", days: "30" },
    { full: "July", value: "07", days: "31" },
    { full: "August", value: "08", days: "31" },
    { full: "September", value: "09", days: "30" },
    { full: "October", value: "10", days: "31" },
    { full: "November", value: "11", days: "30" },
    { full: "December", value: "12", days: "31" }
  ];

  params = {
    pageNumber: 1,
    pageSize: 15,
    npi: null,
    groupid: "",
    startdate: "",
    enddate: ""
  };
  type: any = "";

  date: any;
  days: any;
  years: string[] = [];
  current_date = new Date();
  current_month = this.authS.getDates().current_month;
  previous_month = '06';
  current_year = this.authS.getDates().current_year;
  selectedItem: any;
  address_list: any;
  tooltip_data: any;

  hcc_list: any;
  hcc_desc: string = "";
  temp_desc: string = "";
  show_hcc: boolean = false;
  @ViewChild("term") input: ElementRef;

  @ViewChild("fileUpload") fileUpload: ElementRef;
  //upload requirements
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  videofiles: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  uploadInputVideo: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  ACO_groups: any;
  GroupName:string;
  checkCount = 0;
  errorFiles: any;
  checkBadRequest: boolean = true;
  letPass: boolean = false;
  showTabs: boolean = false;
  tabResults:any;
  aco_audit_route:boolean = false;
  tab_id:any;
  constructor(
    public authS: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private pagerService: PagerService,
    private userService: UserService,
    private acoService: AcoService
  ) {
    if(route.snapshot.data['title'] == "acoaudit"){
      this.aco_audit_route = true;
    }else{
      this.aco_audit_route = false;
    }
    this.files = []; // local uploading files array
    this.videofiles = [];
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.uploadInputVideo = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;

    
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Measures",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      classes: "myclass mb-sm-0 col-md-4",
      badgeShowLimit: 1
    };

    for (let year = Number(this.current_year); year > 2017; year -= 1) {
      this.years.push(year.toString());
    }
    this.getacogaps();
    //if user is coming from ACO scorecard then clickable logic
    let ACO_Gap_Details = JSON.parse(localStorage.getItem("ACO_Gap_Details"));
    if (ACO_Gap_Details) {
      
      this.date = {
        month: ACO_Gap_Details.month,
        year: ACO_Gap_Details.year
      };

      this.params = {
        pageNumber: 1,
        pageSize: 15,
        npi: ACO_Gap_Details.npi,
        groupid: ACO_Gap_Details.groupid,
        startdate: ACO_Gap_Details.startdate,
        enddate: ACO_Gap_Details.enddate
      };
         
      this.checkMonth(this.date.year);
      this.getACOGroups(ACO_Gap_Details.npi);
      if (ACO_Gap_Details.provider_name) {
        this.provider_name = ACO_Gap_Details.provider_name;
      }
      if(ACO_Gap_Details.mname=='all'){
        this.type = ACO_Gap_Details.type;  
        this.acoService.getAcomeasure().subscribe(
          results => {
            this.measures = results;
          this.selectAllMeasures();
          this.getACOMeasures(true);
          
        },err=>{});
    }else{

      this.type = ACO_Gap_Details.type; 
      this.acoService.getAcomeasure().subscribe(
        results => { 
          this.measures = results;
          this.selectedItems = [
            {
              itemName: ACO_Gap_Details.mname,
              measureid: ACO_Gap_Details.mid,
              measurename: ACO_Gap_Details.mname,
              id: ACO_Gap_Details.mid
            }
          ];
          this.getACOMeasures(true);
        },err=>{});
    }      

      
      
     
      
    } else {
      this.date = {
        month: this.previous_month,
        year: this.current_year
      };
      this.checkMonth(this.current_year);
      this.getACOGroups(null);
      // this.getacogaps();
    }
  }

  ngOnDestroy() {
    localStorage.removeItem("ACO_Gap_Details");
  }

  calculateAge(birthday) {
    if (birthday) {
      let age = birthday.split("-");
      return this.current_year - age[0];
    }
  }
  formatDate() {
    this.months.map(month => {
      if (this.date.month == month.value) {
        // this.selectedMonth = month.full;
        if (month.value == "02" && this.date.year % 4 == 0) {
          this.days = "29";
        } else {
          // console.log(month.value)
          this.days = month.days;
        }
      }
    });
    this.params.startdate = this.date.year + "-" + this.date.month + "-01";
    this.params.enddate =
      this.date.year + "-" + this.date.month + "-" + this.days;
  }

  measureArray() {
    console.log(this.selectedItems);
    let temp = [];

    for (let i = 0; i < this.selectedItems.length; i++) {
      temp.push(this.selectedItems[i].measureid);
    }

    return temp;
  }

  checkMonth(selectedYear) {
    this.formatDate();
    if (selectedYear == this.authS.getDates().actual_year) {
      this.months.map(month => {
        if (this.current_month == month.value) {
          // this.months.splice(Number(month.value), 12);
        }
      });
    } else {
      this.months = [
        { full: "January", value: "01", days: "31" },
        { full: "February", value: "02", days: "28" },
        { full: "March", value: "03", days: "31" },
        { full: "April", value: "04", days: "30" },
        { full: "May", value: "05", days: "31" },
        { full: "June", value: "06", days: "30" },
        { full: "July", value: "07", days: "31" },
        { full: "August", value: "08", days: "31" },
        { full: "September", value: "09", days: "30" },
        { full: "October", value: "10", days: "31" },
        { full: "November", value: "11", days: "30" },
        { full: "December", value: "12", days: "31" }
      ];
    }
  }

  //Excel report configurations
  getReport(type) {
    
   
    var reportParams = { ...this.params, report: true };

    this.acoService.getACOMeasures(reportParams,this.type).subscribe(
      results => {
   if(this.type=='Numerator')
   {
     saveAs(results, `numerator.xlsx`);
    }
   else if(this.type=='Denominator'){
     saveAs(results, `Denominator.xlsx`);
    }
   else if(this.type=='Gaps'){
     saveAs(results, `Gaps.xlsx`);
    }
   else if(this.type=='Exclusion'){
     saveAs(results, `Exclusion.xlsx`);
    }
       
      },
      err => {}
    );
  }
  getReportAudit(type) {
    
   this.params['report']=true;
    var reportParams = { ...this.params, report: true };

    this.acoService.getACOAuditList(reportParams).subscribe(
      results => {
  
     saveAs(results, `aco-audit.xlsx`);
   
       
      },
      err => {}
    );
  }

  //Getting all members
  getACOMeasures(resetPage) {
    // localStorage.removeItem('subplan');
    console.log(this.GroupName)
    this.params['groupname']=this.GroupName;
    this.params['providername']=this.provider_name;
    if (resetPage) {
      this.params["pageNumber"] = 1;
      this.page = 1;
    }
    // this.page=1;
    this.params["report"] = false;
    
    if(this.aco_audit_route){
      this.params['documentstatus'] = this.type;
      this.params["ids"] = this.measureArray().toString();
      console.log(this.params['ids'])
      this.acoService.getACOAuditList(this.params).subscribe(
        results => {
          this.showPagination = true;
          this.member_list = results.body;
          this.total_pages = JSON.parse(
            results.headers.get("Paging-Headers")
          ).totalCount;
          this.setPages();
        },
        err => {}
      );
    }else{
      this.params["ids"] = this.measureArray();
      this.acoService.getACOMeasures(this.params, this.type).subscribe(
        results => {
          this.showPagination = true;
          this.member_list = results.body;
          this.total_pages = JSON.parse(
            results.headers.get("Paging-Headers")
          ).totalCount;
          this.setPages();
        },
        err => {}
      );
    }
    
  }

  resetFilters() {
    this.params = {
      pageNumber: 1,
      pageSize: 15,
      npi: null,
      groupid: "",
      startdate: "",
      enddate: ""
    };
    this.type = "";
    this.date = {
      month: this.previous_month,
      year: this.current_year
    };
    this.checkMonth(this.current_year)
    this.selectedItems = [];
    this.provider_name = "";
    
    this.getACOGroups(null);
    this.selectAllMeasures();
    
    this.member_list = [];
    this.total_pages = 0;
    this.search_category='';
    this.input.nativeElement.value = "";
this.params['name']='';
this.params['mbi']='';
this.params['dob']='';
  }

  getacogaps() {
    
    this.acoService.getAcomeasure().subscribe(
      results => {
        this.measures = results;
        console.log(this.measures)
        for (let i = 0; i < this.measures.length; i++) {
          this.measures[i].id = this.measures[i]["measureid"];
          this.measures[i].itemName = this.measures[i]["measurename"];
          // delete arrayObj[i].key1;
        }
        this.dropdownList = this.measures;
      },
      err => {}
    );
  }

  selectAllMeasures() {
    let arr = this.measures;

    for (let i = 0; i < arr.length; i++) {
      // arr[i].id = arr[i]['Measure_ID'];
      arr[i].itemName = arr[i]["measurename"];

      arr[i].Measure_ID = arr[i]["measureid"];

      // delete arrayObj[i].key1;
    }
    // this.dropdownList = arr;

    this.selectedItems = arr;
  }

  getInsurance(member) {
    this.showPanel = false;
    this.provider_name = member.FirstName + " " + member.LastName;
    this.params.npi = member.uniqeproviderno;
    this.provider_id = member.uniqeproviderno;
    this.getACOGroups(this.provider_id);
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  loadByPage(page_number: number) {
    if (page_number < 1 || page_number > this.pager.total_pages) {
      return;
    }
    page_number = Number(page_number);
    this.page = page_number;
    // console.log("Page"+this.page)
    // console.log("Page numbe"+page_number)
    this.params["pageNumber"] = this.page;
    this.getACOMeasures(false);
    // window.scrollTo(0, 200);
  }

  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }

  searchProvider() {
    if (this.provider_name.length > 2) {
      this.showPanel = true;
      this.userService.search_ACO_provider(this.provider_name).subscribe(
        res => {
          this.members = res;
        },
        err => {
          //
        }
      );
    }
    if (this.provider_name.length == 0) {
      this.members = [];
      this.params.npi = null;
      this.showPanel = false;
    }
  }

  getACOGroups(id) {
    this.acoService.getACOGroups(id).subscribe(
      results => {
        this.ACO_groups = results;
      },
      err => {}
    );
  }

  checkCategory(val) {
    // console.log(val)
    if (this.search_category == "subscribername") {
      this.params["subscribername"] = val;
      this.params["hicn"] = "";
      this.params["dob"] = "";
    } else if (this.search_category == "hicn") {
      this.params["subscribername"] = "";
      this.params["hicn"] = val;
      this.params["dob"] = "";
    } else if (this.search_category == "dob") {
      this.params["subscribername"] = "";
      this.params["hicn"] = "";
      this.params["dob"] = val;
    }
  }
  search(term) {
    if (term.trim() == "") {
    } else {
      term = term.trim();
      this.checkCategory(term);

      if (term.length > 2) {
        this.page = 1;
        this.getACOMeasures(true);
      } else if (term.length == 0) {
        this.page = 1;
        // this.params.membername = '';
        this.getACOMeasures(true);
      }
    }
  }
  showpopup() {
    if (this.reason == "yes") {
      this.gapSubmit = {};
      this.reviewModal.hide();
      
      this.getACOGapDetails();
      // console.log(this.modalmember.measureid)
      // this.measureIdentificationData();
      
    } else {
      this.reviewModal.hide();
    }
    this.reason = "";
    this.reasondropdown = "";
    this.qualified = "";
    this.qualifieddropdown = "";
    this.measuredropdown = "";
    this.measuredropdowntwo = "";
  }

  search_value(term) {
    if (term.length == 0) {
      this.params["subscribername"] = "";
      this.params["hicn"] = "";
      this.params["dob"] = "";
    } else {
    }
  }

  //resetting form data
  resetGapData(){
    this.gapSubmit = {};
    if(this.fileUpload){
      this.fileUpload.nativeElement.value = "";
    };
    this.videofiles = [];
  }

//   convertDate(){
//     if(this.gapSubmit.dm2_hba1cdate){
//         this.gapSubmit.dm2_hba1cdate = this.gapSubmit.dm2_hba1cdate.toLocaleString().replace(/\s\d{2}:\d{2}:\d{2,4}$/, ''));    
//     }
//     if(this.gapSubmit.htn_bpdate){
//       this.gapSubmit.htn_bpdate = this.gapSubmit.htn_bpdate.toLocaleString().replace(/\s\d{2}:\d{2}:\d{2,4}$/, ''));    
//   }
//   if(this.gapSubmit.mh1_phq9greaterdate){
//     this.gapSubmit.mh1_phq9greaterdate = this.gapSubmit.mh1_phq9greaterdate.toLocaleString().replace(/\s\d{2}:\d{2}:\d{2,4}$/, ''));    
// }
// if(this.gapSubmit.mh1_phq9measurementperiodcompleteddate){
//   this.gapSubmit.mh1_phq9measurementperiodcompleteddate = this.gapSubmit.mh1_phq9measurementperiodcompleteddate.toLocaleString().replace(/\s\d{2}:\d{2}:\d{2,4}$/, ''));    
// }
// if(this.gapSubmit.mh1_phq9lessdate){
//   this.gapSubmit.mh1_phq9lessdate = this.gapSubmit.mh1_phq9lessdate.toLocaleString().replace(/\s\d{2}:\d{2}:\d{2,4}$/, ''));    
// }
//  }
  //submission of the form data
  ACOGapSubmit() {
    let aco_gap_essentials = {};
    // this.convertDate();
    if(this.tab_id){
      aco_gap_essentials = {...this.gapSubmit,...this.modalmember, measureid:this.tab_id,
        submittedby:this.currentUser.userid,submittedfirstname:this.currentUser.name, rolename:this.currentUser.rolename}
    }else{
      aco_gap_essentials = {...this.gapSubmit,...this.modalmember,
        submittedby:this.currentUser.userid,submittedfirstname:this.currentUser.name, rolename:this.currentUser.rolename}
    }
    
    
    this.acoService.ACOGapSubmit(aco_gap_essentials).subscribe(
      results => {
        console.log(results)
        this.gapSubmit.gapsid = results.gapsid;
        this.startUpload();
          if (this.videofiles.length == 0 || this.letPass) {
            $('.gap_submit_msg').remove();
            $('.tab-content').prepend('<li class="gap_submit_msg msg_box bg-i-green">Form details have been updated successfully</li>');
            this.getACOGapDetails();
          }
      },
      err => {}
    );
  }

    //submission of the audit approve/reject
    ACOAuditUpdate(documentstatus) {
      let aco_audit_essentials = {
        gapsid:this.gapSubmit.gapsid,
        measureid:this.gapSubmit.measureid,
        hicn: this.gapSubmit.hicn,
        comment:this.gapSubmit.comment,
        submittedby:this.currentUser.userid,
        submittedfirstname:this.currentUser.name,
        rolename:this.currentUser.rolename,
        documentstatus
      }
      this.acoService.updategapstatus(aco_audit_essentials).subscribe(
        results => {
              $('.gap_submit_msg').remove();
              if(documentstatus == 'approved'){
                $('.tab-content').prepend('<li class="gap_submit_msg msg_box bg-i-green">You successfully approved this submission</li>');
              }else{
                $('.tab-content').prepend('<li class="gap_submit_msg msg_box bg-i-orange">You successfully rejected this submission</li>');
              }
              this.getACOGapDetails();
              this.getACOMeasures(true);
          // this.gapSubmit.gapsid = results.gapsid;
          // this.startUpload();
          //   if (this.videofiles.length == 0 || this.letPass) {
         
          //   }
        },
        err => {}
      );
    }

  onSelectMeasure(data: TabDirective): void{
    
      if (!data.tabset){
        return;
      } else{
        this.tab_id = data.id;
        // this.modalmember.measureid = data.id;
    $('.gap_submit_msg').remove();
    this.getACOGapDetails();
      }

    
  }

  // measureIdentificationData(){
  //   let data = {
  //     hicn:this.modalmember.hicn,
  //     measureid:this.modalmember.measureid,
  //     firsttransition: true
  //   }
  //   this.acoService.getACOGapDetails(data).subscribe(
  //     results => {  
  //       this.showTabs = true;
  //       this.tabResults = results;
  //      setTimeout(() => {
  //       this.staticTabs.tabs[Number(this.modalmember.measureid) - 1].active = true;
  //       this.gapModal.show();
  //      },500)
        
        
  //     },
  //     err => {}
  //   );
  // }

  tabClass(id){
    //numerators
    //pending
    //exclusion
    //denominators
    if(!this.aco_audit_route){
      if(this.tabResults.numerators.includes(id)){
        return "bg-i-green";
      }else if(this.tabResults.pending.includes(id)){
        return "bg-i-yellow";
      }else if(this.tabResults.exclusion.includes(id)){
        return "bg-i-orange";
      }else if(this.tabResults.denominators.includes(id)){
        return "den_tab";
      }else{
        return "den_gap_tab";
      }
    }
  }
  openAuditFlowModal(member){
    $('.gap_submit_msg').remove();
    this.gapSubmit={};
    this.modalmember=member;
    this.getACOGapDetails();
  }
  comment_data(c_data){
    let data = {
      hicn:c_data.Subscriberid,
      measureid:c_data.Measureid,
      firsttransition: true,
      gapsid: c_data.gapid
    }

    this.acoService.getACOGapDetails(data).subscribe(
      results => {  
        this.gapSubmit = results;   
      },
      err => {}
    );
  }

  getACOGapDetails(){

    let data = {
      hicn:this.modalmember.hicn,
      measureid:this.modalmember.measureid,
      firsttransition: true,
      gapsid: this.modalmember.gapsid
    }
    if(this.tab_id){
      data.measureid = this.tab_id;
    }
    //remove msg only in case of aco gaps submission
    if(!this.aco_audit_route){
      $('.gap_submit_msg').remove();
    }
    
    this.resetGapData();
    // this.showTabs = false;
    this.acoService.getACOGapDetails(data).subscribe(
      results => {  
        this.showTabs = true;
        
        this.tabResults = results;
       setTimeout(() => {
         if(this.tab_id){
          this.staticTabs.tabs[Number(this.tab_id) - 1].active = true;
         }else{
          
          this.staticTabs.tabs[Number(this.modalmember.measureid) - 1].active = true;
         }
        
        this.gapModal.show();
       },500)
       
       if(this.aco_audit_route){
         
        //ACO Audit listing
        setTimeout(() => {
          for(let i = 0; i< this.staticTabs.tabs.length; i++){
            //disabled all the tabs
            
            this.staticTabs.tabs[i].disabled = true;
            //enabling the tab with measure selected
        this.staticTabs.tabs[Number(this.modalmember.measureid) - 1].disabled = false;
        this.staticTabs.tabs[Number(this.modalmember.measureid) - 1].active = true;
          }
        }, 600);
        
        console.log(this.staticTabs.tabs)
        console.log(this.modalmember.measureid)

        console.log(this.staticTabs.tabs[Number(this.modalmember.measureid) - 1])

        // //enabling the tab with measure selected
        // this.staticTabs.tabs[Number(this.modalmember.measureid) - 1].disabled = false;
        // this.staticTabs.tabs[Number(this.modalmember.measureid) - 1].active = true;

        $('.nav-item').removeClass('bg-i-yellow, bg-i-green, bg-i-orange');


        //disabling form fields clicks
        $('.tab-pane').addClass('restrict_pointer');
        $('.tab-pane').addClass('restrict_cursor'); 
       }else{
        $('.source').remove();
        if(results.sourcetype == 'byclaim'){
          $('.tab-content').prepend(`<span class="source">Source: By Claim</span>`);
        }else if(results.sourcetype == 'byupload'){
          $('.tab-content').prepend(`<span class="source">Source: By Upload</span>`);
        }
      
         //ACO gap listing
        if(results.type == 'numerator' || results.type == 'exclusion' || results.type == 'pending'){
          
          if(results.type == 'numerator'){
            $('.gap_submit_msg').remove();
            $('.tab-content').prepend('<li class="gap_submit_msg msg_box bg-i-yellow">It is already a Numerator and you cannot work on it. </li>');
          }else if(results.type == 'exclusion'){
            $('.gap_submit_msg').remove();
            $('.tab-content').prepend('<li class="gap_submit_msg msg_box bg-i-yellow">It is already an Exclusion and you cannot work on it.</li>');
          }else{
            $('.gap_submit_msg').remove();
            $('.tab-content').prepend('<li class="gap_submit_msg msg_box bg-i-yellow">It is pending for Numerator compliant and you cannot work on it.</li>');
          }
          setTimeout(() => {
            $('.tab-pane, .ACO_docs').addClass('restrict_pointer');
          $('.tab-content').addClass('restrict_cursor'); 
          }, 100);
          
        }else{
          
          $('.tab-pane, .ACO_docs').removeClass('restrict_pointer');
          $('.tab-content').removeClass('restrict_cursor')
        }
       }
        
        this.gapSubmit = results;   
      },
      err => {}
    );
  }

  removeACOGapDoc(file){
    let data = {
      hicn:this.modalmember.hicn,
      measureid:this.modalmember.measureid
    }
    this.acoService.removeACOGapDoc(file, data).subscribe(results => {

      // this.gapSubmit = results;
      this.gapSubmit.docs = results;
      // this.showSuccess('Update Measure',measure.Measure_Name+' updated successfully')
    }, err => {
      // this.showDanger('Update Measure',measure.Measure_Name+' update failed')  
    });
  }
  // upload requirements
  onUploadOutput(output: UploadOutput, type): void {
    if (output.type === "allAddedToQueue") {
      // when all files added in queue

      this.checkCount = 0;
      this.checkBadRequest = true;
      this.errorFiles = [];
      // this.disableBtn = false;
      this.letPass = false;
    } else if (
      output.type === "addedToQueue" &&
      typeof output.file !== "undefined"
    ) {
      // add file to array when added
      this.videofiles.push(output.file);
    } else if (
      output.type === "uploading" &&
      typeof output.file !== "undefined"
    ) {
      // update current data in files array for uploading file
      const index = this.videofiles.findIndex(
        file => typeof output.file !== "undefined" && file.id === output.file.id
      );
      this.videofiles[index] = output.file;
    } else if (output.type === "done") {

      // remove file from array when removed
      this.checkCount++
      console.log("check " + this.checkCount);
      // console.log(output);
      // console.log(this.files);
      // console.log(this.videofiles);
      let fCount = this.videofiles.length;
      // let checkBadRequest = true;
      // let vCount = this.files.length;

      // console.log(output.file.fileIndex);
      let count = fCount;
      if (output.file.responseStatus === 400) { // Or whatever your return code status is
        this.checkBadRequest = false;
        
        this.errorFiles.push(output.file);
   
      }
      if (this.checkCount == count && output.file) {
        if (this.checkBadRequest) {
          $('.gap_submit_msg').remove();
          $('.tab-content').prepend('<li class="gap_submit_msg  msg_box bg-i-green">Form details have been updated successfully</li>');
          
            // this.resetGapData();
            this.getACOGapDetails();
            // this.staticTabs.tabs[2].active = true;
          
          
          
        }

        // this.getVideos();
      }

    } else if (output.type === "removed") {
      this.videofiles = this.videofiles.filter(
        (file: UploadFile) => file !== output.file
      );
    } else if (output.type === "dragOver") {
      this.dragOver = true;
    } else if (output.type === "dragOut") {
      this.dragOver = false;
    } else if (output.type === "drop") {
      this.dragOver = false;
    }
  }

  // To upload docs and videos
  startUpload(): void {
    const event: UploadInput = {
      type: "uploadAll",
      // url: this.API_BASE + '/members/fileupload/' + this.gapSubmit.gapsid,
      url: this.API_BASE + "/fileupload/ACOGapsDocument/" + this.gapSubmit.gapsid,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        IPA: `${localStorage.getItem("DBNAME")}`
      }
      // data: {
      //   providerid: this.gapSubmit.providerid,
      //   healthplanid: this.gapSubmit.healthplanid,
      //   ipaid: this.gapSubmit.ipaid
      // }
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: "cancel", id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: "remove", id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: "removeAll" });
  }
}
