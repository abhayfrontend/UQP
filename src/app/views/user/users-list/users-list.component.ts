import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { PagerService } from '../../../services/pager.service';
import { saveAs } from 'file-saver';
import * as $ from 'jquery';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  //Multiselect
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};


  userRolePerm: any;
  search_category: string = '';
  params = {
    'pageNumber': 1,
    'pageSize': 15,
    'email': '',
    'name': '',
    'roleid': '',
    'status': '',
    'report': false
  }
  hideme: any = {};
  email_exist: boolean = false;
  search_text: string;
  provider_name: string;
  provider_exist: boolean = false;
  ipa_exist: boolean = false;
  healthplan_exist: boolean = false;
  pa_exist: boolean = false;
  assurance_exist: boolean = false;
  office_exist: boolean = false;
  members: any;
  // OfficeStaff_AssignedProvider=[];
  showPanel: boolean = true;
  duplicateAssigment: string = "";
  //   minDate = new Date(2017, 5, 10);
  // maxDate = new Date(2018, 9, 15);
  // @ViewChild('userModal') public user_modal: ModalDirective;
  save_add_form: boolean = false;
  bsValue: Date = new Date();
  // bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];
  @ViewChild('userModal') public modal: ModalDirective;
  @ViewChild("UserList") UserList: NgForm;
  @ViewChild('term') input: ElementRef;

  user_role: any;
  showUserRole: boolean = true;
  users: any;
  showError: boolean = false;
  // user:any;
  // add_user.User_DOB:Date;
  fSubmitted: boolean = false;
  add_user = {
    "User_Provider_ID": null,
    "User_Type_ID": "",
    "User_Role_ID": "",
    "User_Email": "",
    "User_FirstName": "",
    "User_MiddleName": "",
    "User_LastName": "",
    "User_MobileNumber": "",
    "User_WorkNumber": "",
    "User_DOB": "",
    "User_Gender": "",
    "customFacility": "",
    "User_Address": "",
    "level": "", "OrganisationType": "", "HedisTeam": "", "MRATeam": "", "HedisTeamId": "", "MRATeamId": "", "DefaultIPA": "",
    "PrimaryFacilityId": "",
    "title": '',
    "OfficeType": 'PCP',
    "OfficeStaff_AssignedProvider": [],
    "status": true,
    "User_IPA_ID": "",
    "User_HealthPlan_ID": ""
  }
  selectedItem: any;
  ipa_list: any;
  healthplan_list: any;

  page: number = 1;
  pager: any = {};
  total_pages: number;
  showPagination: boolean = true;
  passwordConfirmation: any;
  organisation: any = {};
  organisation_temp: any = [];
  changePasswrd: any = {};
  resetpasswordid: any;//in this new and confirm password are being bind
  @ViewChild('resetpasswordModal') public resetmodal: ModalDirective;//this is for bsmodal
  constructor(public authS: AuthService,
    private userService: UserService,
    private toastr: ToastrService, private pagerService: PagerService,
    private commonService: CommonService) {
  }

  showSuccess(msg, title) {
    this.toastr.success(title, msg);
  }
  showDanger(msg, title) {
    this.toastr.error(title, msg);
  }
  ngOnInit() {
    this.getUserRoles();
    this.getUsers(true);
    // this.getAllIPA();
    this.getParentIPA();
    this.getAllHealthplan();
    this.userRolePerm = this.authS.getPermission('User Management');
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select IPA",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',

      badgeShowLimit: 2,
      labelKey: 'IPA_Name',
      primaryKey: 'IPA_ID',
      classes: "myclass mb-sm-0 col-md-4",
    };
  }

  resetForm(form) {
    this.fSubmitted = false;
    this.UserList.form.markAsPristine();
    this.UserList.form.markAsUntouched();
    this.UserList.form.updateValueAndValidity();
    // this.UserList.reset();form.reset()
  }

  createUser(form) {
    //reset all user conditions
    this.selectedItems = [];
    this.email_exist = false;
    this.provider_exist = false;
    this.office_exist = false;
    this.ipa_exist = false;
    this.healthplan_exist = false;
    this.save_add_form = true;
    this.organisation_temp = [];
    this.organisation = {};
    this.provider_name = '';
    this.add_user = {

      "User_Provider_ID": null,
      "User_Type_ID": "",
      "User_Role_ID": "",
      "User_Email": "",
      "User_FirstName": "",
      "User_MiddleName": "",
      "User_LastName": "",
      "User_MobileNumber": "",
      "User_WorkNumber": "",
      "User_DOB": "",
      "User_Gender": "",
      "customFacility": "",
      "User_Address": "",
      "level": "", "OrganisationType": "", "HedisTeam": "", "MRATeam": "", "HedisTeamId": "", "MRATeamId": "", "DefaultIPA": "",
      "PrimaryFacilityId": "",
      "title": '',
      "OfficeType": 'PCP',
      "OfficeStaff_AssignedProvider": [],
      "status": true,
      "User_IPA_ID": "",
      "User_HealthPlan_ID": ""

    }
    this.resetForm(form)


    this.modal.show()
  }
  resetFilters() {
    this.params = {
      'pageNumber': 1,
      'pageSize': 15,
      'email': '',
      'name': '',
      'roleid': '',
      'status': '',
      'report': false

    }
    this.params['dob'] = '';
    this.input.nativeElement.value = "";
    this.getUsers(true);
  }

  editUser(id) {
    this.provider_name = '';
    this.save_add_form = false;
    this.getUser(id);
    this.office_exist = false;
    this.modal.show()
  }


  getUserRoles() {
    this.userService.getUserRoles().subscribe(results => {

      this.user_role = results;
    }, err => {

    });
  }

  //Check the role to load user add template dynamically
  checkRole(id) {

    if (id == 35) {
      //provider
      this.provider_name = '';
      this.add_user = {
        "User_Provider_ID": null,
        "User_Type_ID": this.add_user.User_Type_ID,
        "User_Role_ID": this.add_user.User_Role_ID,
        "User_Email": "",
        "User_FirstName": "",
        "User_MiddleName": "",
        "User_LastName": "",
        "User_MobileNumber": "",
        "User_WorkNumber": "",
        "User_DOB": "",
        "User_Gender": "",
        "customFacility": "",
        "User_Address": "",
        "level": "", "OrganisationType": "", "HedisTeam": "", "MRATeam": "", "HedisTeamId": "", "MRATeamId": "", "DefaultIPA": "",
        "PrimaryFacilityId": "",
        "title": '',
        "OfficeType": 'PCP',
        "OfficeStaff_AssignedProvider": [],
        "status": true,
        "User_IPA_ID": "",
        "User_HealthPlan_ID": ""
      }
      this.provider_exist = true;
      this.healthplan_exist = false;
      this.ipa_exist = false;
      this.assurance_exist = false;
      this.pa_exist = false;
    } else if (id == 5) {
      //'health plan'
      this.add_user = {
        "User_Provider_ID": null,
        "User_Type_ID": this.add_user.User_Type_ID,
        "User_Role_ID": this.add_user.User_Role_ID,
        "User_Email": "",
        "User_FirstName": "",
        "User_MiddleName": "",
        "User_LastName": "",
        "User_MobileNumber": "",
        "User_WorkNumber": "",
        "User_DOB": "",
        "User_Gender": "",
        "customFacility": "",
        "User_Address": "",
        "level": "", "OrganisationType": "", "HedisTeam": "", "MRATeam": "", "HedisTeamId": "", "MRATeamId": "", "DefaultIPA": "",
        "PrimaryFacilityId": "",
        "title": '',
        "OfficeType": 'PCP',
        "OfficeStaff_AssignedProvider": [],
        "status": true,
        "User_IPA_ID": "",
        "User_HealthPlan_ID": ""
      }
      this.healthplan_exist = true;
      this.ipa_exist = false;
      this.provider_exist = false;
      this.assurance_exist = false;
      this.pa_exist = false;
    } else if (id == 4) {
      //ipa
      this.add_user = {
        "User_Provider_ID": null,
        "User_Type_ID": this.add_user.User_Type_ID,
        "User_Role_ID": this.add_user.User_Role_ID,
        "User_Email": "",
        "User_FirstName": "",
        "User_MiddleName": "",
        "User_LastName": "",
        "User_MobileNumber": "",
        "User_WorkNumber": "",
        "User_DOB": "",
        "User_Gender": "",
        "customFacility": "",
        "User_Address": "",
        "level": "", "OrganisationType": "", "HedisTeam": "", "MRATeam": "", "HedisTeamId": "", "MRATeamId": "", "DefaultIPA": "",
        "PrimaryFacilityId": "",
        "title": '',
        "OfficeType": 'PCP',
        "OfficeStaff_AssignedProvider": [],
        "status": true,
        "User_IPA_ID": "",
        "User_HealthPlan_ID": ""
      }
      this.ipa_exist = true;
      this.provider_exist = false;
      this.healthplan_exist = false;
      this.assurance_exist = false;
      this.pa_exist = false;

    } else if (id == 1065) {
      //ipa
      this.add_user = {
        "User_Provider_ID": null,
        "User_Type_ID": this.add_user.User_Type_ID,
        "User_Role_ID": this.add_user.User_Role_ID,
        "User_Email": "",
        "User_FirstName": "",
        "User_MiddleName": "",
        "User_LastName": "",
        "User_MobileNumber": "",
        "User_WorkNumber": "",
        "User_DOB": "",
        "User_Gender": "",
        "customFacility": "",
        "User_Address": "",
        "level": "", "OrganisationType": "", "HedisTeam": "", "MRATeam": "", "HedisTeamId": "", "MRATeamId": "", "DefaultIPA": "",
        "PrimaryFacilityId": "",
        "title": '',
        "OfficeType": 'PCP',
        "OfficeStaff_AssignedProvider": [],
        "status": true,
        "User_IPA_ID": "",
        "User_HealthPlan_ID": ""
      }
      this.ipa_exist = false;
      this.provider_exist = false;
      this.healthplan_exist = false;
      this.assurance_exist = false;
      this.pa_exist = true;

    } else if (id == 3) {
      //ipa
      this.add_user = {
        "User_Provider_ID": null,
        "User_Type_ID": this.add_user.User_Type_ID,
        "User_Role_ID": this.add_user.User_Role_ID,
        "User_Email": "",
        "User_FirstName": "",
        "User_MiddleName": "",
        "User_LastName": "",
        "User_MobileNumber": "",
        "User_WorkNumber": "",
        "User_DOB": "",
        "User_Gender": "",
        "customFacility": "",
        "User_Address": "",
        "level": "", "OrganisationType": "", "HedisTeam": "", "MRATeam": "", "HedisTeamId": "", "MRATeamId": "", "DefaultIPA": "",
        "PrimaryFacilityId": "",
        "title": '',
        "OfficeType": 'PCP',
        "OfficeStaff_AssignedProvider": [],
        "status": true,
        "User_IPA_ID": "",
        "User_HealthPlan_ID": ""
      }
      this.assurance_exist = true;
      this.ipa_exist = false;
      this.provider_exist = false;
      this.healthplan_exist = false; this.pa_exist = false;

    } else {
      this.add_user = {
        "User_Provider_ID": null,
        "User_Type_ID": this.add_user.User_Type_ID,
        "User_Role_ID": this.add_user.User_Role_ID,
        "User_Email": "",
        "User_FirstName": "",
        "User_MiddleName": "",
        "User_LastName": "",
        "User_MobileNumber": "",
        "User_WorkNumber": "",
        "User_DOB": "",
        "User_Gender": "",
        "customFacility": "",
        "User_Address": "",
        "level": "", "OrganisationType": "", "HedisTeam": "", "MRATeam": "", "HedisTeamId": "", "MRATeamId": "", "DefaultIPA": "",
        "PrimaryFacilityId": "",
        "title": '',
        "OfficeType": 'PCP',
        "OfficeStaff_AssignedProvider": [],
        "status": true,
        "User_IPA_ID": "",
        "User_HealthPlan_ID": ""
      }
      this.assurance_exist = false;
      this.provider_exist = false;
      this.healthplan_exist = false;
      this.ipa_exist = false;
      this.pa_exist = false;
    }
  }

  //Check user type to handle office staff case
  checkType(name) {
    if (name.toLowerCase() == 'office staff') {
      this.add_user = {
        "User_Provider_ID": null,
        "User_Type_ID": this.add_user.User_Type_ID,
        "User_Role_ID": "",
        "User_Email": "",
        "User_FirstName": "",
        "User_MiddleName": "",
        "User_LastName": "",
        "User_MobileNumber": "",
        "User_WorkNumber": "",
        "User_DOB": "",
        "User_Gender": "",
        "customFacility": "",
        "User_Address": "",
        "level": "", "OrganisationType": "", "HedisTeam": "", "MRATeam": "", "HedisTeamId": "", "MRATeamId": "", "DefaultIPA": "",
        "PrimaryFacilityId": "",
        "title": '',
        "OfficeType": 'PCP',
        "OfficeStaff_AssignedProvider": [],
        "status": true,
        "User_IPA_ID": "",
        "User_HealthPlan_ID": ""
      }
      this.provider_name = ''
      $('.role-select').children('option[label="Office Staff"]').css('display', 'block');
      this.office_exist = true;
      this.ipa_exist = false;
      this.provider_exist = false;
      this.healthplan_exist = false;
      this.pa_exist = false;
      this.add_user.User_Role_ID = '36';
    } else {
      this.office_exist = false;
      if (!this.add_user.User_Role_ID) {
        this.add_user.User_Role_ID = '1';
      }
      // this.add_user.User_Role_ID = '1';
      $('.role-select').children('option[label="Office Staff"]').css('display', 'none');
    }
  }

  // getAllIPA() {
  //   this.commonService.getAllIPA().subscribe(results => {

  //     this.ipa_list = results;
  //   }, err => {

  //   });
  // }

  getParentIPA() {
    this.commonService.getParentIPA().subscribe(results => {

      this.ipa_list = results;
    }, err => {

    });
  }

  getAllHealthplan() {
    this.commonService.getAllHealthplan().subscribe(results => {

      this.healthplan_list = results;
    }, err => {

    });
  }

  updateUser(valid, id, user, form) {
    this.fSubmitted = true;
    if (valid) {
      this.organisation_temp = [];
      this.manageOrganisation();
      this.userService.updateUser(id, user).subscribe(results => {
        // this.hideme[id]=!this.hideme[id]
        // this.users = results.json();
        this.getUsers(false);
        this.modal.hide();
        // form.resetForm(); 
        this.showSuccess('Add user', `User - ${user.User_FirstName} ${user.User_LastName} updated successfully`)

      }, err => {
        this.showDanger('Add user', `User - ${user.User_FirstName} ${user.User_LastName}  creation failed`)

      });
    }

  }

  getUsers(resetPage) {
    if (resetPage) {
      this.params['pageNumber'] = 1;
      this.page = 1;
    }
    this.params['report'] = false;
    this.userService.getUsers(this.params).subscribe(results => {
      this.showPagination = true;
      this.total_pages = JSON.parse(results.headers.get('Paging-Headers')).totalCount;
      this.users = results.body;
      this.setPages();
    }, err => {

    });
  }
  search_value(term) {
    if (term.length == 0) {


      this.params['name'] = '';
      this.params['dob'] = '';

      this.params['email'] = '';

    }
    else {
      // console.log('termis')
    }
  }
  getUser(id) {
    this.userService.getUser(id).subscribe(results => {
      this.pa_exist = false;
      this.healthplan_exist = false;
      this.ipa_exist = false;
      this.provider_exist = false;
      this.assurance_exist = false;

      this.selectedItems = results.ipadetails;
      this.add_user = results;
      this.add_user.OfficeStaff_AssignedProvider = results.AssignedProviders;
      this.add_user.customFacility = results.addresslist;
      this.showUserRole = false;
      if (results.organisations) {
        this.organisation = results.organisations;
      }
      if (this.add_user.User_Type_ID == '3') {

        this.office_exist = true; this.provider_exist = false;
      }
      if (this.add_user.User_Role_ID == '3') {

        this.assurance_exist = true;
      }

      if (this.add_user.User_Role_ID == '35') {

        this.provider_exist = true;
      }
      if (this.add_user.User_Role_ID == '5') {
        this.healthplan_exist = true;
        this.ipa_exist = false;
        this.provider_exist = false;
        this.assurance_exist = false;
      }
      if (this.add_user.User_Role_ID == '1065') {
        this.pa_exist = true;
        this.healthplan_exist = false;
        this.ipa_exist = false;
        this.provider_exist = false;
        this.assurance_exist = false;
      }

      // if(this.add_user.User_Provider_ID != 0){
      //   this.provider_exist=true;this.office_exist=false;
      // }
    }, err => {

    });
  }

  manageOrganisation() {
    if (this.organisation.hedis) {
      this.organisation_temp.push(1)
    }
    if (this.organisation.mra) {
      this.organisation_temp.push(2)
    }
    if (this.organisation.aco) {
      this.organisation_temp.push(3)
    }
    this.add_user.OrganisationType = this.organisation_temp.toString();
  }

  addUser(valid, form) {
    this.fSubmitted = true;
    this.checkUserEmail(this.add_user.User_Email);
    this.organisation_temp = [];
    if (valid && !this.email_exist) {
      this.manageOrganisation();
      let ids = [];
      let names = [];
      if (this.selectedItems.length) {
        this.selectedItems.map((item) => {
          ids.push(item.IPA_ID);
          names.push(item.IPA_Name)
        });
      }

      if (this.selectedItems.length) {
        this.add_user.User_IPA_ID = ids.toString();
      }

      var r = confirm("Are you sure, you want to associate " + names.toString() + " with this user?");
      if (r == true) {
        this.userService.addUser(this.add_user).subscribe(
          res => {
            this.getUsers(false);
            this.modal.hide();
            // form.resetForm(); 
            this.showSuccess('Add user', `User - ${this.add_user.User_FirstName}  ${this.add_user.User_LastName} 
       created successfully`)
            if (res.status == 200) {
              //
            }
          },
          err => {
            this.showDanger('Add user', `User - ${this.add_user.User_FirstName}  ${this.add_user.User_LastName}  creation failed`)
          }
        )
      } else {
        this.fSubmitted = false;
      }

    }

  }

  checkUserEmail(email) {
    this.userService.checkUserEmail(email).subscribe(
      res => {
        this.email_exist = res;
      },
      err => {
        //
      }
    )
  }
  // search() {
  //   if (this.search_text.length > 2) {
  //     this.userService.search_user(this.search_text).subscribe(
  //       res => {
  //         this.users = res;
  //       },
  //       err => {
  //         //
  //       }
  //     )
  //   } else if((this.search_text.length == 0)) {
  //     this.getUsers(true);
  //   }


  // }

  searchProvider() {
    if (this.provider_name.length > 2) {
      this.showPanel = true;
      this.userService.search_provider(this.provider_name).subscribe(
        res => {
          this.members = res;
        },
        err => {
          this.members = []
          //
        }
      )
    }


  }

  updateUserStatus(id, status, name, index) {
    let fromStatus = status ? 'active' : 'inactive';
    let toStatus = !status ? 'active' : 'inactive';
    this.userService.updateUserStatus(id, !status).subscribe(results => {
      this.showSuccess('Update user status', 'You change status of  ' + name + ' changed from ' + fromStatus + ' to ' + toStatus)

    }, err => {
      if (err.status == 400) {
        this.showDanger('Update user status', err.error);
      } else {
        this.showDanger('Update user status', name + 'User status update failed');
      }

      this.users[index].Status = status;
    });
  }

  // Case when user is provider, autofill al form details
  getMember(member) {
    let email;
    if (!member.email) {
      email = member.providerno;
    } else {
      email = member.email;
    }
    this.userService.getMember(email).subscribe(results => {
      this.showPanel = false;
      let member = results[0];
      this.provider_name = member.FirstName + " " + member.LastName;
      this.add_user.User_FirstName = member.FirstName;
      this.add_user.User_MiddleName = member.MidName;
      this.add_user.User_LastName = member.LastName;
      this.add_user.User_Email = member.email;
      this.add_user.User_MobileNumber = member.mobNo;
      this.add_user.User_Provider_ID = member.providerno;
      this.add_user.customFacility = member.addresslist;
      this.add_user.level = member.level;
      this.add_user.title = member.title;
      let length = this.add_user.customFacility.length;
      setTimeout(() => {
        if (length % 2 == 1 || length == 1) {
          $('ul.facility-list > li:last-child').css('width', '100%')
        }
      }, 1)

    }, err => {

    });
  }

  // Case when user is provider, autofill al form details
  getMember_PA(member) {
    let email;
    if (!member.email) {
      email = member.providerno;
    } else {
      email = member.email;
    }
    this.userService.getMember(email).subscribe(results => {
      this.showPanel = false;
      let member = results[0];
      this.provider_name = member.FirstName + " " + member.LastName;

      this.add_user.User_Provider_ID = member.providerno;


    }, err => {

    });
  }
  selectFacility(address, e) {

    e.preventDefault();

    e.target.parentElement.querySelectorAll(".border-primary").forEach(e =>
      e.classList.remove("border-primary"));

    e.target.classList.add("border-primary");

    // event.target.classList.add('border-primary');
    // event.target.classList.add('border-primary');
    this.selectedItem = address.recordid;
    this.add_user.PrimaryFacilityId = address.recordid;
    this.add_user.User_MobileNumber = address.phone;
    this.add_user.User_WorkNumber = address.backline_phone_number;

  }

  //In case of officde staff assign unique providers
  assignProvider(member) {
    if (!this.checkDuplicate(member.id)) {
      this.duplicateAssigment = "";
      var key = "$id";
      delete member[key];
      this.add_user.OfficeStaff_AssignedProvider.push(member);
      // this.OfficeStaff_AssignedProvider.push(member);
      this.provider_name = '';
    }

    this.showPanel = false;

  }

  checkDuplicate(id) {
    var status = false;
    this.add_user.OfficeStaff_AssignedProvider.map(provider => {
      if (provider.id == id) {
        this.duplicateAssigment = "Selected provider already exists in the above list";
        status = true;
        // this.removeMessage()
      }
    })
    return status;
  }

  //Remove assigned providers
  removeAssignedProvider(num) {
    this.add_user.OfficeStaff_AssignedProvider.splice(num, 1);
    // this.OfficeStaff_AssignedProvider.splice(num,1);
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
    this.getUsers(false);
    // window.scrollTo(0, 200);
  }

  //Excel report configurations
  getReport(type) {

    this.params['report'] = true;
    // var obj = Object.assign(this.provider);
    // var reportParams = { ...this.params, ...reportDetails };
    // console.log(obj)/
    this.userService.getUsers(this.params).subscribe(results => {

      if (type == 'pdf') {
        saveAs(results, `User-List-report.pdf`)
      } else {
        saveAs(results, `User-List-report.xlsx`)
      }

    }, err => {
    });
  }

  setPages() {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.total_pages, this.page, 15);
  }

  checkCategory(val) {
    if (this.search_category == 'name') {

      this.params['name'] = val;
      this.params['email'] = '';
      this.params['dob'] = '';
    } else if (this.search_category == 'id') {

      this.params['name'] = '';
      this.params['email'] = val;
      this.params['dob'] = '';
    } else if (this.search_category == 'dob') {

      this.params['name'] = '';
      this.params['email'] = '';
      this.params['dob'] = val;
    }


  }
  search(term) {
    this.checkCategory(term)

    if (term.length > 2) {
      this.page = 1;
      this.getUsers(true);

    } else if (term.length == 0) {
      this.page = 1;
      // this.params.membername = '';
      this.getUsers(true);
    }
  }

  resetPassword(id)/* this function is for that if you clicked a reset password the modal will open  */ {

    this.resetmodal.show();
    this.resetpasswordid = id;

  }

  saveresetpassword(valid)//this function is for sending changed password in backend
  {

    if (valid) {
      this.userService.resetpasswordservice(this.resetpasswordid, this.changePasswrd.newpassword).subscribe(res => { this.resetmodal.hide(); }, err => { });
    }




  }
}
