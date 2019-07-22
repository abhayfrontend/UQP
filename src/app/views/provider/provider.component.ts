import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { PagerService } from '../../services/pager.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { saveAs } from 'file-saver';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {
  // global variables to identify user role entered/logged in
  rolename: string;
  roleid: any;
  currentUser: any;
  provider: any = {};
  address: any = [];
  address_list_count = [0];
  userRolePerm: any;
  provider_list: any;
  insurance_list: any;
  page: number = 1;
	pager: any = {};
	total_pages: number;
	showPagination: boolean = true;
	provider_name: string;
  IPA_Name: string;
  month: any;
  year: any;

  checkhp = {
    coventry: false,
    freedom: false,
    humana: false,
    optimum: false,
    ultimate: false,
    wellcare: false
  }
  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'status': 'all',
    'startdate': '',
    'enddate': '',
    'name': '',
    'ipaid': 0,
    'reporttype': '',
    'report': false
  }


  selectedItems = [];
  settings = {};
  @ViewChild('providerModal') public modal: ModalDirective;

  @ViewChild("providerForm")
  providerForm: NgForm;
  constructor(public authS: AuthService, private commonService: CommonService, private pagerService: PagerService,
    private userService: UserService, private toastr: ToastrService) { }
  showSuccess(msg, title) {
    this.toastr.success(title, msg);
  }
  showDanger(msg, title) {
    this.toastr.error(title, msg);
  }
  ngOnInit() {
    this.settings = {
      singleSelection: false,
      text: "Select Healthplans",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      badgeShowLimit: 12,
      labelKey: 'health_Name',
      primaryKey: 'healthplan_id'
    };
    let date = JSON.parse(localStorage.getItem('dashboard_date'));
    let ipastore = JSON.parse(localStorage.getItem('ipastore'));

    this.rolename = this.authS.getUserRole();
    this.roleid = this.authS.getUserId();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (ipastore) {
      this.params.ipaid = ipastore.ipaid;
      this.params.startdate = ipastore.startdate;
      this.params.enddate = ipastore.enddate;
      this.IPA_Name = ipastore.IPA_Name;
    }

    if (date) {
      this.params.startdate = date.startdate;
      this.params.enddate = date.enddate;
    }

    
    let perm = this.authS.getPermission('Provider Management');
    if (perm) {
      this.userRolePerm = perm
    };
    if (this.rolename == 'ipa') {
      // this.params['ipaid'] = this.currentUser.ipaid;
      
    }else if(this.rolename == 'healthplan'){
      this.params['healthplanid'] = this.currentUser.healthplanid;
    }
    this.getAllProviders(true);
    this.getAllHealthplans();
  }
  onItemSelect(item: any) {
    this.checkHealthplanIds(this.selectedItems)
    // console.log(item);  
    // console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    this.checkHealthplanIds(this.selectedItems)
    // console.log(item);
    // console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    this.checkHealthplanIds(this.selectedItems)
    // console.log(items);
  }
  onDeSelectAll(items: any) {
    this.checkHealthplanIds(this.selectedItems)
    // console.log(items);
  }
  handleAddress(status) {
    let count = this.address_list_count.length;
    if (status) {
      this.address_list_count.push(count + 1)
    } else {
      if (count > 1) {
        this.address_list_count.pop()
      }

    }
  }
  checkHealthplanIds(items) {
    let arr = [];
    this.checkhp = {
      coventry: false,
      freedom: false,
      humana: false,
      optimum: false,
      ultimate: false,
      wellcare: false
    }
    items.map((item) => {
      arr.push(item.healthplan_id)
    })
    console.log("arr" + arr);
    if (arr.includes(1)) {
      this.checkhp.coventry = true;
    }
    if (arr.includes(2)) {
      this.checkhp.freedom = true;
    }
    if (arr.includes(3)) {
      this.checkhp.humana = true;
    }
    if (arr.includes(4)) {
      this.checkhp.optimum = true;
    }
    if (arr.includes(5)) {
      this.checkhp.ultimate = true;
    }
    if (arr.includes(6)) {
      this.checkhp.wellcare = true;
    }
  }
  ngOnDestroy() {
    localStorage.removeItem('dashboard_date');
    localStorage.removeItem('ipastore');
  }

  checkColumnValue(name) {
    let bool;
    if (this.userRolePerm.Columnlist.length > 0) {
      this.userRolePerm.Columnlist.map((col) => {
        if (name == col.column_name) {
          bool = col.viewstatus;
        }
      })
    }
    return bool;
  }
  getAllProviders(resetPage) {
    // this.page=1;
    if (resetPage) {
      this.params['pageNumber'] = 1
      this.page = 1;
    }
    this.params.reporttype = '';
    this.params.report = false;
    this.commonService.getAllProviders(this.params).subscribe(results => {
      this.showPagination = true;

      // console.log(JSON.parse(results.headers.get('Paging-Headers')).totalCount)
      // console.log(results.headers.get('Content-Type'))
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.provider_list = results.body

      this.setPages();
      // localStorage.removeItem('dashboard_date')
    }, err => {

    });
  }

  //Reset form
  resetForm() {
    // this.fSubmitted = false;
    // this.providerForm.submitted = false;
    this.providerForm.form.markAsPristine();
    this.providerForm.form.markAsUntouched();
    this.providerForm.form.updateValueAndValidity();
    //to reset form to submiited = false
    this.providerForm.resetForm();
  }

  createProvider() {
    this.selectedItems = [];
    this.address_list_count = [0];
    this.address = [];
    this.checkHealthplanIds(this.selectedItems);
    this.resetForm();
    this.modal.show()
  }

  addProvider(valid) {
    if (valid) {
      let arr = []
      this.selectedItems.map((item) => {
        arr.push(item.healthplan_id);
      });
      //check value of temp address length and assign it to original address array "Address_1"
      let address_length = this.address_list_count.length;
      this.address = this.address.slice(0, address_length);
      this.provider['Address_1'] = this.address.toString();
      this.provider['HealthplanID'] = arr.toString();
      this.commonService.addProvider(this.provider).subscribe(results => {
        this.modal.hide();
        this.getAllProviders(true);
        // this.insurance_list = results;
      }, err => {

      });
    }

  }

  getAllHealthplans() {
    this.commonService.getAllHealthplans().subscribe(results => {

      this.insurance_list = results;
    }, err => {

    });
  }

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
    this.commonService.getAllProvidersReport(this.params
    ).subscribe(results => {

      if (type == 'pdf') {
        saveAs(results, `provider-list.pdf`)
      } else {
        saveAs(results, `provider-list.xlsx`)
      }

    }, err => {
    });
  }
  // Resetting filters
  resetFilters() {
    this.params = {
      'pageNumber': 1,
      'pageSize': 15,
      'status': 'active',
      'startdate': '',
      'enddate': '',
      'name': '',
      'ipaid': this.params.ipaid,
      'reporttype': '',
      'report': false

    }
    this.getAllProviders(true);
  }

  // Searching provider
  searchProvider() {

    if(this.params.name.trim()==''){}
      else{this.params.name=this.params.name.trim();
   

    if (this.params.name.length > 2) {
    
     this.getAllProviders(true);

    } 
  }
 
      
    
  }

  //Update provider Status
  updateProviderStatus(provider, changedStatus, type) {
    let fromStatus = changedStatus ? 'active' : 'inactive';
    let toStatus = !changedStatus ? 'active' : 'inactive';
    let notification = provider.notification;
    let message = provider.message;
    let status = provider.status;
    if (type == 'notification') {
      notification = !notification;
    } else if (type == 'message') {
      message = !message;
    } else {
      status = !status;
    }
    let obj = {
      "notification": notification,
      "message": message,
      "status": status
    }
    this.commonService.updateProviderStatus(provider.id, obj).subscribe(results => {

      this.getAllProviders(false);
      if (provider.Firstname) {
        this.showSuccess('Update Provider status', '' + provider.Firstname.toUpperCase() + type + ' status changed from ' + fromStatus + ' to ' + toStatus);
      }
    }, err => {
      if (provider.Firstname) {
        this.showDanger('Update Provider status', provider.Firstname.toUpperCase() + ' status update failed')
      }

    });
  }
  loadByPage(page_number: number) {
    if (page_number < 1 || page_number > this.pager.total_pages) {
      return;
    }
    page_number = Number(page_number);
    this.page = page_number;
    this.params['pageNumber'] = this.page
    this.getAllProviders(false);
  }


  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }
}
