// import { Component, OnInit, Input, ViewChild } from '@angular/core';
// import { UserService } from '../../services/user.service';
// import { CommonService } from '../../services/common.service';
// import { ToastrService } from 'ngx-toastr';
// import { AuthService } from '../../services/auth.service';
// import { ModalDirective } from 'ngx-bootstrap/modal';
// @Component({
//   selector: 'app-acm',
//   templateUrl: './acm.component.html',
//   styleUrls: ['./acm.component.scss']
// })
// export class AcmComponent implements OnInit {
//   user_role: any;
//   functions: any;
//   functionName: any;
//   functionColumns: any;
//   user_role_id: number;
//   currentACLid: number;
//   userRolePerm = {
//     func: '',
//     add: true,
//     edit: true,
//     view: true
//   }
//   passwordacl:any;
//   @ViewChild('aclModal') public modal: ModalDirective;
//  
//   constructor(public authS: AuthService, private commonService: CommonService, private userService: UserService
//     , private toastr: ToastrService) { }

//   ngOnInit() {
//     this.getUserRoles();
//     this.getFunctions(1)
//     // this.getFunctions();
//     //     let perm = this.authS.getPermission('Star');
//     //     if(perm){
//     //       this.userRolePerm =perm
//     // };
//   }
//   showSuccess(msg, title) {
//     this.toastr.success(title
//       , msg);
//   }
//   showDanger(msg, title) {
//     this.toastr.error(title, msg);
//   }
//   getUserRoles() {
//     this.userService.getUserRoles().subscribe(results => {

//       this.user_role = results;
//     }, err => {

//     });
//   }
//   toggleTickAdd(func, i, j) {
//     let fn = this.functions[i].customeraclfunction[j];
//     if (func.acladd == true) {
//       fn.aclview = false;
//       fn.acledit = false;
//     } else if (func.acladd == false) {
//       fn.aclview = true;
//       fn.acledit = true;
//     }
//   }

//   toggleTickEdit(func, i, j) {
//     let fn = this.functions[i].customeraclfunction[j];
//     if (func.acledit == true) {
//       fn.aclview = false;
//     } else if (func.acledit == false) {
//       fn.aclview = true;
//     }

//   }

//   getFunctions(id) {
//     this.user_role_id = id;
//     this.commonService.getFunctions(id).subscribe(results => {
//       this.functions = results;
//     }, err => {

//     });
//   }

//   updateFunctions() {
//     this.commonService.updateFunctions(this.user_role_id, this.functions).subscribe(results => {
//       this.showSuccess('ACL Update', 'ACL functions updated successfully')
//     }, err => {
//       this.showDanger('ACL Update', 'ACL functions update failed')
//     });
//   }

//   updateFunctionColumns() {
//     this.commonService.updateFunctionColumns(this.user_role_id,this.currentACLid, this.functionColumns).subscribe(results => {
//       // this.showSuccess('ACL Update', 'ACL functions updated successfully')
//       this.modal.hide();
//     }, err => {
//       // this.showDanger('ACL Update', 'ACL functions update failed')
//     });
//   }
//   showPwdModal()
//   {
//     this.pmodal.show();
//   }
//   verifypwd()
//   {
//     this.commonService.verifyAclPassword(this.passwordacl).subscribe(results=>{
//       this.updateFunctions();
//     },err=>{});
//   }

//   getColumns(acl){
//     this.commonService.getFunctionColumns(this.user_role_id, acl.aclid).subscribe(results => {
//       this.functionColumns = results;
//       this.currentACLid = acl.aclid;
//       this.functionName = acl.functionname;
//       this.modal.show()
//     }, err => {

//     });
//   }
// }





import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-acm',
  templateUrl: './acm.component.html',
  styleUrls: ['./acm.component.scss']
})
export class AcmComponent implements OnInit {
  user_role: any;
  param={
    'roleid':0,
    'userid':'',
    'emailid':'',
    'loginid':''
  } 
  aclarray=[];
    type:any;
  functions: any;
  functionName: any;
  functionColumns: any;
  user_role_id: number;
  currentACLid: number;
  userRolePerm = {
    func: '',
    add: true,
    edit: true,
    view: true
  }
  finalaclobj=[];
  aclobj=[];
  @ViewChild('aclModal') public modal: ModalDirective;
   @ViewChild('pwdModal') public pmodal:ModalDirective;
  constructor(public authS: AuthService, private commonService: CommonService, private userService: UserService
    , private toastr: ToastrService) { }

  ngOnInit() {
    this.getUserRoles();
    this.getFunctions(1)
   let currentUser = JSON.parse(localStorage.getItem('currentUser'));
   this.param.userid=currentUser.userid;
   this.param.loginid=currentUser.loginid;
   this.param.emailid=currentUser.email;
       // this.getFunctions();
    //     let perm = this.authS.getPermission('Star');
    //     if(perm){
    //       this.userRolePerm =perm
    // };
  }
  showSuccess(msg, title) {
    this.toastr.success(title
      , msg);
  }
  showDanger(msg, title) {
    this.toastr.error(title, msg);
  }
  getUserRoles() {
    this.userService.getUserRoles().subscribe(results => {

      this.user_role = results;
    }, err => {

    });
  }
  toggleTickAdd(func, i, j,aclid) {
    console.log(func)
    this.aclChange(aclid);
    let fn = this.functions[i].customeraclfunction[j];
    if (func.acladd == true) {
      fn.aclview = false;
      fn.acledit = false;
    } else if (func.acladd == false) {
      fn.aclview = true;
      fn.acledit = true;
    }
  }
  aclChange(aclid){
    
    this.aclarray.push(aclid.aclid);
    this.aclobj.push(aclid)
    console.log(this.aclarray)
  }

  toggleTickEdit(func, i, j,aclid) {
    this.aclChange(aclid);
    let fn = this.functions[i].customeraclfunction[j];
    if (func.acledit == true) {
      fn.aclview = false;
    } else if (func.acledit == false) {
      fn.aclview = true;
    }

  }

  getFunctions(id) {

    this.user_role_id = id;
    this.commonService.getFunctions(id).subscribe(results => {
      this.functions = results;
    }, err => {

    });
  }

  updateFunctions() {
    this.commonService.updateFunctions(this.user_role_id, this.functions).subscribe(results => {
      this.confirmacl();
      this.showSuccess('ACL Update', 'ACL functions updated successfully')
      this.pmodal.hide();
      this.modal.hide();
      this.type='';
     
    }, err => {
      this.showDanger('ACL Update', 'ACL functions update failed')
      this.pmodal.hide();
    });
  }

  updateFunctionColumns() {

    this.commonService.updateFunctionColumns(this.user_role_id,this.currentACLid, this.functionColumns).subscribe(results => {
        this.confirmacl();// this.showSuccess('ACL Update', 'ACL functions updated successfully')
      this.modal.hide();
      this.pmodal.hide();
      this.type='';
      
    }, err => {
      this.pmodal.hide();// this.showDanger('ACL Update', 'ACL functions update failed')
    });
  }
    showPwdModal(type)
     {
      
       this.type=type;
   
     this.modal.hide();
    this.pmodal.show();
    }

  getColumns(acl){
    this.commonService.getFunctionColumns(this.user_role_id, acl.aclid).subscribe(results => {
      this.functionColumns = results;
      this.currentACLid = acl.aclid;
      this.functionName = acl.functionname;
      this.modal.show()
    }, err => {

    });
  }

confirmacl()
{
  this.param.roleid=this.user_role_id;
  this.param['acllist']=this.finalaclobj
  this.commonService.cnfrmacl(this.param).subscribe(results=>{},err=>{});
   this.aclarray=[];
      this.finalaclobj=[];

}
close()
{
  this.pmodal.hide();
}
checkAclArray()
{
  
  this.aclarray = this.aclarray.filter((x, i, a) => a.indexOf(x) == i)
  var qstnarraylength=this.aclarray.length;
  console.log(qstnarraylength)
  for(var i=0;i<qstnarraylength;i++)
  {
  
   var idx = this.aclobj.slice().reverse().find( (o) => o.aclid == this.aclarray[i] );
   this.finalaclobj.push(idx);
  }
  
  console.log(this.finalaclobj)
 
}
  verifypwd()
  {
    this.checkAclArray();
    if(this.type=='savemain')
    {
     this.updateFunctions();
    }
    else if(this.type=='columns')
    {
      this.updateFunctionColumns();
    }
   
 }
}
