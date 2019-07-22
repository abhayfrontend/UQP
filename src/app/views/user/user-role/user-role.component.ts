import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
  role_name_exist: boolean = false;
  search_text: string;
  add_user_role = {
    User_Role_Name: '',
    User_Role_Description: '',
    CreatedBy: 2,
    CreatedDate: "1905-06-15T00:00:00",
    ModifiedBy: 2,
    ModifiedDate: "1905-06-15T00:00:00",
    Status: true
  };
  hideme: any = {};
  user_role: any;
  save_add_form: boolean = false;
  userRolePerm: any;
  fSubmitted: boolean = false;
  tempName: string;
  @ViewChild('userModal') public modal: ModalDirective;
  @ViewChild("UserRole")
  UserRole: NgForm;
  constructor(private userService: UserService, private toastr: ToastrService,
    public authS: AuthService) { }

  showSuccess(msg, title) {
    this.toastr.success(title, msg);
  }
  showDanger(msg, title) {
    this.toastr.error(title, msg);
  }
  ngOnInit() {
    this.getUserRoles();
    // Getting permissions of the route
    this.userRolePerm = this.authS.getPermission('Role Management');
  }
  // configuring and opening modal for edit action
  editRole(id) {
    this.save_add_form = false;
    this.getUserRole(id);
    this.modal.show()
  }
  // configuring and opening modal for add action
  createRole() {
    this.save_add_form = true;
    this.add_user_role = {
      User_Role_Name: '',
      User_Role_Description: '',
      CreatedBy: 2,
      CreatedDate: "1905-06-15T00:00:00",
      ModifiedBy: 2,
      ModifiedDate: "1905-06-15T00:00:00",
      Status: true
    };
    this.resetForm();
    this.modal.show()
  }

  //Updating user role service
  updateUserRole(valid, id, role) {
    this.fSubmitted = true;
    if (valid) {
      this.userService.updateUserRole(id, role).subscribe(results => {
        this.modal.hide();
        this.getUserRoles();
        this.showSuccess('Update user role', role.User_Role_Name + ' role updated successfully')
      }, err => {
        this.showDanger('Update user role', role.User_Role_Name + ' role update failed')
      });
    }

  }

  //Reset form
  resetForm() {
    this.fSubmitted = false;
    this.UserRole.form.markAsPristine();
    this.UserRole.form.markAsUntouched();
    this.UserRole.form.updateValueAndValidity();
    // this.UserList.reset();form.reset()
  }

  //Get all user roles for listing
  getUserRoles() {
    this.userService.getUserRoles().subscribe(results => {

      this.user_role = results;
    }, err => {

    });
  }

  //Get a particular user role with id
  getUserRole(id) {
    this.userService.getUserRole(id).subscribe(results => {
      this.tempName = results[0].User_Role_Name;
      this.add_user_role = results[0];
    }, err => {

    });
  }

  //Add user role service
  addUserRole(valid) {
    this.fSubmitted = true;
    if (valid) {
      this.userService.addUserRole(this.add_user_role).subscribe(
        res => {
          this.modal.hide();
          this.getUserRoles();
          this.showSuccess('Add user role', this.add_user_role.User_Role_Name + ' role created successfully')
          if (res.status == 200) {
          }
        },
        err => {
          this.showDanger('Add user role', this.add_user_role.User_Role_Name + ' role creation failed')
        })
    }
  }

  // Check if user role already exists
  checkUserRoleName(name) {
    if (!this.save_add_form) {
      this.role_name_exist = false;
      if (this.tempName !== name) {
        this.userService.checkUserRoleName(name).subscribe(
          res => {
            this.role_name_exist = res;
          },
          err => {
            //
          })
      }
    } else {
      this.userService.checkUserRoleName(name).subscribe(
        res => {
          this.role_name_exist = res;
        },
        err => {
          //
        })
    }


  }
  //Search user roles
  search() {
    if (this.search_text.length > 0) {
      this.userService.search_role(this.search_text).subscribe(
        res => {
          this.user_role = res;
        },
        err => {
        })
    } else {
      this.getUserRoles();
    }
  }
  //Update user roles
  updateUserRoleStatus(id, status, name) {
    let fromStatus = status ? 'Active' : 'Inactive';
    let toStatus = !status ? 'Active' : 'Inactive';
    this.userService.updateUserRoleStatus(id, !status).subscribe(results => {
      this.showSuccess('Update role status', name + ' changed from ' + fromStatus + ' to ' + toStatus)
    }, err => {
      this.showDanger('Update role status', name + ' User role status update failed')
    });
  }


}
